import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Plus, Eye } from 'lucide-react';
import { useAuth } from '../../lib/auth';

interface ChatMessage {
  id: string;
  role: 'user' | 'grace';
  text: string;
}

interface Suggestion {
  label: string;
  response: string;
}

interface ChatWidgetProps {
  context?: 'auth' | 'dashboard';
}

const AUTH_SUGGESTIONS: Suggestion[] = [
  {
    label: 'What is Agentic AI digital assistants?',
    response: "Agentic AI digital assistants is a pastoral care platform that helps churches follow up with first-time visitors through AI-powered conversations, a 6-week outreach sequence, and smart escalation to pastors when someone needs support.",
  },
  {
    label: 'How do I get access?',
    response: "Access is granted by your church administrator. If you're on staff at a partnering church, reach out to your lead pastor or ministry director to request an account. You can also use the demo account to explore the platform.",
  },
  {
    label: 'What does this system do?',
    response: "The platform ingests visitor data from connection cards and check-ins, then automatically begins a caring outreach sequence. An AI named Grace handles initial conversations, detects concerns, and escalates to your pastoral team when needed.",
  },
  {
    label: "Is my church's data secure?",
    response: "Yes. All visitor data is encrypted at rest and in transit. The system is built on Supabase with row-level security, meaning each church only ever sees their own data. No data is shared across churches.",
  },
];

const DASHBOARD_SUGGESTIONS: Suggestion[] = [
  { label: 'Why is Sarah first?', response: "Sarah is Priority 1 because the assistant detected language suggesting she's feeling unseen and disconnected. The system paused the AI response and flagged her for a personal pastoral reply." },
  { label: 'Draft a reply to James', response: "Here's a draft for James:\n\nHi James! Great question. Kids' check-in opens 15 minutes before each service, and your 4-year-old would join Little Lambs (ages 3–5). Would it help if someone met you at the kids' desk on Sunday?" },
  { label: 'How did Sunday go?', response: "Last Sunday 11 guests visited the first service and 8 visited the second. 4 have already replied to their welcome text. 2 connection cards are still missing a phone number — those guests will need a manual follow-up." },
  { label: 'Who needs a call this week?', response: "Two guests would benefit from a personal call this week. Neither has replied to their first text: Maria Torres (visited Sep 22, 3 days ago) and Michael Bennett (2nd service, no reply in 5 days)." },
  { label: 'Change quiet hours to 8:30 PM', response: "Done! Quiet hours are now set to 8:30 PM–8:00 AM. Guests in your timezone won't receive messages outside that window." },
];

const GRACE_GREETING_AUTH = "Hi! I'm Grace, your 1Stayz assistant. How can I help you today?";
const GRACE_GREETING_DASHBOARD = "Hi! I'm Grace. I know your Today list and can help you draft replies, answer questions about your guests, or update settings.";

const FALLBACK_RESPONSE = "That's a great question. For anything not covered here, please reach out to your church administrator or contact our support team. I'm here to help with platform navigation and general questions.";
const AI_CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

function pickResponse(input: string, context: 'auth' | 'dashboard'): string {
  const lower = input.toLowerCase();
  if (context === 'dashboard') {
    if (lower.includes('sarah') || lower.includes('first') || lower.includes('priority')) return DASHBOARD_SUGGESTIONS[0].response;
    if (lower.includes('james') || lower.includes('draft') || lower.includes('reply')) return DASHBOARD_SUGGESTIONS[1].response;
    if (lower.includes('sunday') || lower.includes('service') || lower.includes('how did')) return DASHBOARD_SUGGESTIONS[2].response;
    if (lower.includes('call') || lower.includes('who needs') || lower.includes('follow')) return DASHBOARD_SUGGESTIONS[3].response;
    if (lower.includes('quiet') || lower.includes('hour') || lower.includes('8:30')) return DASHBOARD_SUGGESTIONS[4].response;
  }
  const suggestions = context === 'auth' ? AUTH_SUGGESTIONS : DASHBOARD_SUGGESTIONS;
  for (const s of suggestions) {
    if (lower.includes(s.label.toLowerCase().split(' ')[1] ?? '')) return s.response;
  }
  if (lower.includes('access') || lower.includes('login') || lower.includes('sign')) return AUTH_SUGGESTIONS[1].response;
  if (lower.includes('secure') || lower.includes('data') || lower.includes('safe')) return AUTH_SUGGESTIONS[3].response;
  if (lower.includes('what') || lower.includes('kingdom')) return AUTH_SUGGESTIONS[0].response;
  return FALLBACK_RESPONSE;
}

const CONTEXT_PILL_DASHBOARD = 'Looking at: Today (4 people)';
const CONTEXT_PILL_AUTH = 'Looking at: Login page';

export function ChatWidget({ context = 'auth' }: ChatWidgetProps) {
  const { session, demoMode } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'grace', text: context === 'auth' ? GRACE_GREETING_AUTH : GRACE_GREETING_DASHBOARD },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chips = context === 'auth' ? AUTH_SUGGESTIONS.slice(0, 3) : DASHBOARD_SUGGESTIONS;

  useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    function onOpenReq() { setOpen(true); }
    window.addEventListener('open-chat-widget', onOpenReq);
    return () => window.removeEventListener('open-chat-widget', onOpenReq);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput('');
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: msg };
    setMessages((p) => [...p, userMsg]);
    setLoading(true);
    try {
      let reply = pickResponse(msg, context);
      if (session && !demoMode) {
        const res = await fetch(AI_CHAT_URL, {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role === 'grace' ? 'assistant' : 'user',
              content: m.text,
            })),
          }),
        });
        const data = await res.json();
        if (!res.ok || typeof data.text !== 'string') throw new Error(typeof data.error === 'string' ? data.error : 'The AI assistant is unavailable.');
        reply = data.text;
      } else {
        await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));
      }
      setMessages((p) => [...p, { id: (Date.now() + 1).toString(), role: 'grace', text: reply }]);
    } catch (cause) {
      setMessages((p) => [...p, { id: (Date.now() + 1).toString(), role: 'grace', text: cause instanceof Error ? cause.message : 'The AI assistant is temporarily unavailable.' }]);
    } finally {
      setLoading(false);
    }
    if (!open) setUnread(true);
  }

  return (
    <>
      {/* Full-height side panel */}
      {open && (
        <div className="fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-white border-l border-stone-200 shadow-2xl"
          style={{ width: 340 }}>

          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-stone-100 bg-white shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#0a2e2a] flex items-center justify-center shrink-0">
              <Bot className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-900 leading-tight">Ask 1Stayz</p>
              <p className="text-[11px] text-stone-400 leading-tight mt-0.5 truncate">
                {context === 'dashboard' ? 'Ready · knows your Today list' : 'Ready · answering...'}
              </p>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-amber-300 text-amber-700 bg-amber-50 shrink-0">
              Shadow
            </span>
            <button className="text-stone-400 hover:text-stone-600 transition-colors p-1 ml-0.5" aria-label="New conversation" onClick={() => { setMessages([{ id: Date.now().toString(), role: 'grace', text: context === 'auth' ? GRACE_GREETING_AUTH : GRACE_GREETING_DASHBOARD }]); }}>
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={() => setOpen(false)} className="text-stone-400 hover:text-stone-700 transition-colors p-1" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context pill */}
          <div className="px-4 py-2.5 shrink-0 border-b border-stone-50">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-500 bg-stone-50 border border-stone-100 rounded-full px-3 py-1">
              <Eye className="w-3 h-3 text-stone-400" />
              {context === 'dashboard' ? CONTEXT_PILL_DASHBOARD : CONTEXT_PILL_AUTH}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2.5`}>
                {msg.role === 'grace' && (
                  <div className="w-7 h-7 rounded-lg bg-[#0a2e2a] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                  </div>
                )}
                <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-white rounded-tr-md'
                    : 'bg-stone-50 border border-stone-100 text-stone-800 rounded-tl-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#0a2e2a] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                </div>
                <div className="bg-stone-50 border border-stone-100 rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '120ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '240ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick-action chips */}
          <div className="px-4 pb-3 pt-2 bg-white shrink-0">
            <div className="flex flex-wrap gap-2">
              {chips.slice(0, context === 'dashboard' ? 4 : 3).map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleSend(chip.label)}
                  className="text-xs text-stone-600 bg-stone-50 border border-stone-200 hover:border-stone-400 hover:bg-stone-100 rounded-full px-3 py-1.5 transition-colors whitespace-nowrap"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input bar */}
          <div className="px-4 pb-4 pt-1 border-t border-stone-100 bg-white shrink-0">
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2 focus-within:border-[#008f83] focus-within:ring-2 focus-within:ring-[#008f83]/10 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask anything about your guests, tasks or settings…"
                className="flex-1 text-sm bg-transparent outline-none text-stone-700 placeholder:text-stone-400"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-xl bg-[#008f83] hover:bg-[#00796f] disabled:bg-stone-200 disabled:text-stone-400 text-white flex items-center justify-center transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-stone-400 text-center mt-2">
              1Stayz can make mistakes. It never messages guests without your OK.
            </p>
          </div>
        </div>
      )}

      {/* Launcher button */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setOpen((p) => !p)}
          aria-label={open ? 'Close Ask 1Stayz' : 'Open Ask 1Stayz'}
          className={`rounded-full shadow-lg flex items-center justify-center gap-2 transition-all duration-200 relative ${
            open
              ? 'bg-stone-800 hover:bg-stone-700 w-11 h-11'
              : 'bg-[#008f83] hover:bg-[#00796f] px-4 h-14 hover:scale-[1.02]'
          }`}
        >
          {open ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <>
              <div className="w-9 h-9 rounded-full border-2 border-white/70 bg-white/15 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-white whitespace-nowrap">Ask 1Stayz</span>
            </>
          )}
          {!open && unread && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white" />
          )}
        </button>
      </div>
    </>
  );
}
