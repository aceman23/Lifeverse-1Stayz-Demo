import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageCircle, ChevronRight } from 'lucide-react';

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
    label: 'What is agentic AI digital assistants?',
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
    label: 'Is my church\'s data secure?',
    response: "Yes. All visitor data is encrypted at rest and in transit. The system is built on Supabase with row-level security, meaning each church only ever sees their own data. No data is shared across churches.",
  },
];

const DASHBOARD_SUGGESTIONS: Suggestion[] = [
  {
    label: 'How do I escalate a concern?',
    response: "When Grace detects a concern in a conversation, it automatically creates a concern record and alerts the assigned pastor. You can also manually raise a concern from any visitor profile page by reviewing the engagement timeline.",
  },
  {
    label: 'What does the 6-week sequence do?',
    response: "The sequence sends warm, timed touchpoints to new visitors over 6 weeks via SMS, email, and WhatsApp. Each week has a specific goal — from welcoming to deeper community connection. View the full sequence in the Communications section.",
  },
  {
    label: 'How does concern detection work?',
    response: "Grace monitors conversation sentiment and listens for specific language patterns. When a visitor shares something that sounds like grief, struggle, or crisis, it flags the conversation, creates a summary, and notifies the assigned pastor within minutes.",
  },
  {
    label: 'How do I add a new visitor?',
    response: "Visitors are added automatically through the ingestion pipeline — connection cards, online forms, check-in kiosks, and QR walk-up forms all feed into the system. You can also add them manually from the Ingestion page.",
  },
];

const GRACE_GREETING_AUTH = "Hi! I'm Grace, your agentic AI digital assistants assistant. How can I help you today?";
const GRACE_GREETING_DASHBOARD = "Hi! I'm Grace. Need help navigating the platform or understanding a feature?";

const FALLBACK_RESPONSE = "That's a great question. For anything not covered here, please reach out to your church administrator or contact our support team. I'm here to help with platform navigation and general questions.";

function pickResponse(input: string, context: 'auth' | 'dashboard'): string {
  const lower = input.toLowerCase();
  const suggestions = context === 'auth' ? AUTH_SUGGESTIONS : DASHBOARD_SUGGESTIONS;
  for (const s of suggestions) {
    if (lower.includes(s.label.toLowerCase().split(' ')[1] ?? '')) {
      return s.response;
    }
  }
  if (lower.includes('access') || lower.includes('login') || lower.includes('sign')) return AUTH_SUGGESTIONS[1].response;
  if (lower.includes('sequence') || lower.includes('week')) return DASHBOARD_SUGGESTIONS[1].response;
  if (lower.includes('concern') || lower.includes('escalat')) return DASHBOARD_SUGGESTIONS[0].response;
  if (lower.includes('visitor') || lower.includes('add')) return DASHBOARD_SUGGESTIONS[3].response;
  if (lower.includes('secure') || lower.includes('data') || lower.includes('safe')) return AUTH_SUGGESTIONS[3].response;
  if (lower.includes('what') || lower.includes('how') || lower.includes('kingdom')) return AUTH_SUGGESTIONS[0].response;
  return FALLBACK_RESPONSE;
}

export function ChatWidget({ context = 'auth' }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'grace',
      text: context === 'auth' ? GRACE_GREETING_AUTH : GRACE_GREETING_DASHBOARD,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestions = context === 'auth' ? AUTH_SUGGESTIONS : DASHBOARD_SUGGESTIONS;

  useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

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
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 500));
    const reply = pickResponse(msg, context);
    setMessages((p) => [...p, { id: (Date.now() + 1).toString(), role: 'grace', text: reply }]);
    setLoading(false);
    if (!open) setUnread(true);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-stone-100 flex flex-col overflow-hidden"
          style={{ height: '440px' }}>
          <div className="flex items-center gap-3 px-4 py-3 bg-stone-900 text-white">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-none">Grace</p>
              <p className="text-[11px] text-stone-400 mt-0.5">agentic AI digital assistants Assistant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-stone-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-stone-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                {msg.role === 'grace' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-white" strokeWidth={2} />
                  </div>
                )}
                <div className={`max-w-[82%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-stone-800 text-white rounded-tr-sm'
                    : 'bg-white border border-stone-100 text-stone-700 rounded-tl-sm shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3 h-3 text-white" strokeWidth={2} />
                </div>
                <div className="bg-white border border-stone-100 rounded-xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '120ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '240ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-2 bg-stone-50 space-y-1.5">
              {suggestions.slice(0, 3).map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSend(s.label)}
                  className="w-full flex items-center gap-2 text-left text-xs text-stone-600 bg-white border border-stone-100 hover:border-amber-200 hover:bg-amber-50 rounded-xl px-3 py-2 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500 shrink-0" />
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div className="px-3 py-2.5 border-t border-stone-100 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 text-sm border border-stone-200 rounded-xl px-3 py-2 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition placeholder:text-stone-400"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-stone-100 disabled:text-stone-400 text-white flex items-center justify-center transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((p) => !p)}
        className={`w-13 h-13 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
          open
            ? 'bg-stone-800 hover:bg-stone-700 w-11 h-11'
            : 'bg-amber-500 hover:bg-amber-600 w-14 h-14 hover:scale-105'
        }`}
        style={{ width: open ? 44 : 56, height: open ? 44 : 56 }}
      >
        {open ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        {!open && unread && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white" />
        )}
      </button>
    </div>
  );
}
