import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const providers = new Set(["openai", "anthropic", "google"]);

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return response({ error: "Sign in required." }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) return response({ error: "Sign in required." }, 401);

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("ai_provider_settings")
        .select("provider, model, key_last4, enabled")
        .eq("user_id", user.id)
        .order("provider");
      if (error) return response({ error: "Could not load provider settings." }, 500);
      return response(data ?? []);
    }

    const body = await req.json();
    const provider = String(body.provider ?? "");
    if (!providers.has(provider)) return response({ error: "Choose a supported provider." }, 400);

    if (req.method === "DELETE") {
      const { error } = await supabase
        .from("ai_provider_settings")
        .delete()
        .eq("user_id", user.id)
        .eq("provider", provider);
      if (error) return response({ error: "Could not remove provider." }, 500);
      return response({ ok: true });
    }

    if (req.method !== "POST") return response({ error: "Method not allowed." }, 405);

    const apiKey = String(body.apiKey ?? "").trim();
    const model = String(body.model ?? "").trim();
    if (apiKey.length < 12 || apiKey.length > 500) return response({ error: "Enter a valid API key." }, 400);
    if (!model || model.length > 120) return response({ error: "Choose a model." }, 400);

    const { error } = await supabase.from("ai_provider_settings").upsert({
      user_id: user.id,
      provider,
      model,
      api_key: apiKey,
      key_last4: apiKey.slice(-4),
      enabled: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,provider" });
    if (error) return response({ error: "Could not save provider settings." }, 500);
    return response({ ok: true, provider, model, keyLast4: apiKey.slice(-4) });
  } catch {
    return response({ error: "Could not update provider settings." }, 500);
  }
});
