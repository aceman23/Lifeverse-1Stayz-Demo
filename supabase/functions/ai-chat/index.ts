import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizeMessages(messages: unknown) {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) return null;
  const normalized = messages.map((message) => {
    const item = message as { role?: string; content?: string };
    return {
      role: item.role === "assistant" ? "assistant" : "user",
      content: String(item.content ?? "").slice(0, 8000),
    };
  }).filter((message) => message.content.trim());
  return normalized.length ? normalized : null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    if (req.method !== "POST") return response({ error: "Method not allowed." }, 405);
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return response({ error: "Sign in required." }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) return response({ error: "Sign in required." }, 401);

    const body = await req.json();
    const messages = normalizeMessages(body.messages);
    if (!messages) return response({ error: "Add a message before sending." }, 400);

    const provider = typeof body.provider === "string" ? body.provider : null;
    let query = supabase.from("ai_provider_settings").select("provider, model, api_key").eq("user_id", user.id).eq("enabled", true);
    if (provider) query = query.eq("provider", provider);
    const { data: setting, error: settingError } = await query.maybeSingle();
    if (settingError || !setting) return response({ error: "Connect an AI provider in Settings first." }, 400);

    let text = "";
    if (setting.provider === "openai") {
      const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${setting.api_key}` },
        body: JSON.stringify({ model: setting.model, messages }),
      });
      const json = await upstream.json();
      if (!upstream.ok) return response({ error: "The AI provider rejected the request." }, 502);
      text = String(json.choices?.[0]?.message?.content ?? "");
    } else if (setting.provider === "anthropic") {
      const upstream = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": setting.api_key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({ model: setting.model, max_tokens: 1024, messages }),
      });
      const json = await upstream.json();
      if (!upstream.ok) return response({ error: "The AI provider rejected the request." }, 502);
      text = String(json.content?.[0]?.text ?? "");
    } else {
      const contents = messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      }));
      const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(setting.model)}:generateContent?key=${encodeURIComponent(setting.api_key)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      });
      const json = await upstream.json();
      if (!upstream.ok) return response({ error: "The AI provider rejected the request." }, 502);
      text = String(json.candidates?.[0]?.content?.parts?.[0]?.text ?? "");
    }

    if (!text.trim()) return response({ error: "The AI provider returned an empty response." }, 502);
    return response({ text, provider: setting.provider, model: setting.model });
  } catch {
    return response({ error: "The AI assistant is temporarily unavailable." }, 500);
  }
});
