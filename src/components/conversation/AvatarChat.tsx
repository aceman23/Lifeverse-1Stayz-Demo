import { useState, useRef, useEffect } from 'react';
import { Send, Bot, RefreshCw } from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'visitor' | 'grace';
  text: string;
  timestamp: string;
  sentiment?: string;
}

const SENTIMENT_COLORS: Record<string, string> = {
  warm: 'bg-amber-50 border-amber-100',
  empathetic: 'bg-sky-50 border-sky-100',
  inviting: 'bg-emerald-50 border-emerald-100',
  supportive: 'bg-violet-50 border-violet-100',
};

const DEMO_RESPONSES: Record<string, { text: string; sentiment: string }> = {
  default: {
    text: "I'm so glad you reached out! At My Sanctuary, every person matters and we'd love to know more about what's on your heart. Is there anything specific you'd like to share or ask?",
    sentiment: 'warm',
  },
  lonely: {
    text: "I hear you, and I want you to know — you're not alone in feeling that way. Many people come through our doors carrying that same weight. Would it be okay if I connected you with one of our pastors for a conversation over coffee? There's no pressure at all.",
    sentiment: 'empathetic',
  },
  prayer: {
    text: "Thank you so much for trusting us with that. We'd be honored to pray for you. I'm going to make sure Pastor James sees this personally. In the meantime, is there anything else you'd like us to know about your situation?",
    sentiment: 'supportive',
  },
  groups: {
    text: "That's wonderful — community is everything! Based on what you've shared, I think you'd love our Young Adults group. They meet Thursday evenings and are a warm, welcoming bunch. Want me to send you the details and introduce you to the group leader?",
    sentiment: 'inviting',
  },
};

function pickResponse(input: string): { text: string; sentiment: string } {
  const lower = input.toLowerCase();
  if (lower.includes('lone') || lower.includes('lost') || lower.includes('hard') || lower.includes('difficult') || lower.includes('struggle')) return DEMO_RESPONSES.lonely;
  if (lower.includes('pray') || lower.includes('prayer') || lower.includes('need help') || lower.includes('going through')) return DEMO_RESPONSES.prayer;
  if (lower.includes('group') || lower.includes('friend') || lower.includes('community') || lower.includes('connect') || lower.includes('people')) return DEMO_RESPONSES.groups;
  return DEMO_RESPONSES.default;
}

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'grace',
    text: "Hi there! I'm Grace, a pastoral care assistant at My Sanctuary. It was wonderful having you join us on Sunday — how are you feeling about your visit?",
    timestamp: '2 min ago',
    sentiment: 'warm',
  },
];

export function AvatarChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleReset() {
    setMessages(initialMessages);
    setInput('');
  }

  async function handleSend() {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'visitor',
      text: input,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1100 + Math.random() * 600));
    const response = pickResponse(input);
    const graceMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'grace',
      text: response.text,
      timestamp: 'Just now',
      sentiment: response.sentiment,
    };
    setMessages((prev) => [...prev, graceMsg]);
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm flex flex-col h-[520px] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-stone-50">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
          <Bot className="w-4.5 h-4.5 text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-900">Grace</p>
          <p className="text-xs text-stone-400">AI Pastoral Care Assistant</p>
        </div>
        <button
          onClick={handleReset}
          className="ml-auto text-stone-400 hover:text-stone-700 transition-colors p-1.5 rounded-lg hover:bg-stone-50"
          title="Reset conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'visitor' ? 'justify-end' : 'justify-start'} gap-2`}>
            {msg.role === 'grace' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              </div>
            )}
            <div className={`max-w-[78%] ${
              msg.role === 'visitor'
                ? 'bg-stone-800 text-white rounded-2xl rounded-tr-sm'
                : `border ${SENTIMENT_COLORS[msg.sentiment ?? ''] ?? 'bg-stone-50 border-stone-100'} text-stone-800 rounded-2xl rounded-tl-sm`
            } px-4 py-2.5`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.role === 'visitor' ? 'text-stone-400' : 'text-stone-400'}`}>{msg.timestamp}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-white" strokeWidth={2} />
            </div>
            <div className="bg-stone-50 border border-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-stone-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message as a visitor..."
            className="flex-1 text-sm border border-stone-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition placeholder:text-stone-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-stone-100 disabled:text-stone-400 text-white flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-stone-400 mt-2 text-center">Try: "I've been feeling lonely lately" or "I'd love to join a group"</p>
      </div>
    </div>
  );
}
