import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Bot,
  Send,
  Search,
  AlertTriangle,
  Pause,
  Play,
  UserCheck,
  Mail,
  Smartphone,
  Globe,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { useChatSessions, useChatMessages } from '../lib/hooks';
import { supabase } from '../lib/supabase';
import { timeAgo } from '../lib/utils';
import type { ChatSession, ChatMessage, ChatSessionStatus, ChatChannel } from '../lib/types';
import { SpecMarker } from '../components/ui/SpecMarker';

const CHANNEL_ICONS: Record<ChatChannel, typeof Globe> = {
  web_chat: Globe,
  sms: Smartphone,
  whatsapp: MessageSquare,
  email: Mail,
};

const STATUS_CONFIG: Record<ChatSessionStatus, { label: string; dot: string; badge: string }> = {
  active: { label: 'Active', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  paused: { label: 'Paused', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-100' },
  ended: { label: 'Ended', dot: 'bg-stone-300', badge: 'bg-stone-50 text-stone-500 border-stone-100' },
  taken_over: { label: 'Taken Over', dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-100' },
};

const SENTIMENT_COLORS: Record<string, string> = {
  warm: 'bg-amber-50 border-amber-100',
  empathetic: 'bg-sky-50 border-sky-100',
  inviting: 'bg-emerald-50 border-emerald-100',
  supportive: 'bg-teal-50 border-teal-100',
  positive: 'bg-emerald-50 border-emerald-100',
  negative: 'bg-rose-50 border-rose-100',
  critical: 'bg-rose-50 border-rose-200',
  neutral: 'bg-stone-50 border-stone-100',
};

const OUTCOME_CONFIG: Record<string, { label: string; icon: typeof CheckCircle2; color: string }> = {
  resolved: { label: 'Resolved', icon: CheckCircle2, color: 'text-emerald-600' },
  escalated: { label: 'Escalated', icon: AlertTriangle, color: 'text-rose-600' },
  no_action: { label: 'No Action Needed', icon: XCircle, color: 'text-stone-400' },
  follow_up: { label: 'Follow-Up Needed', icon: Clock, color: 'text-amber-600' },
};

function fullName(v: { first_name: string; last_name: string } | undefined): string {
  if (!v) return 'Unknown';
  return `${v.first_name} ${v.last_name}`.trim();
}

function initials(v: { first_name: string; last_name: string } | undefined): string {
  if (!v) return '?';
  return `${v.first_name[0] ?? ''}${v.last_name[0] ?? ''}`.toUpperCase();
}

export function ConversationsPage() {
  const navigate = useNavigate();
  const { sessions, loading } = useChatSessions();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const selected = sessions.find((s) => s.id === selectedId) ?? null;

  const filtered = sessions.filter((s) => {
    const name = fullName(s.visitor).toLowerCase();
    const matchesSearch = search === '' || name.includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = sessions.filter((s) => s.status === 'active').length;
  const pausedCount = sessions.filter((s) => s.status === 'paused').length;
  const takenOverCount = sessions.filter((s) => s.status === 'taken_over').length;
  const escalatedCount = sessions.filter((s) => s.outcome === 'escalated').length;

  return (
    <div className="min-h-screen bg-[#f5f6f8] pt-20 pb-10">
      <div className="px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-900">Conversations</h1>
          <p className="text-sm text-stone-400 mt-1">
            AI-powered conversations with your visitors across every digital channel.
          </p>
        </div>

        {/* Stats bar */}
        <SpecMarker id="conversations.list">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatChip label="Active" value={activeCount} dot="bg-emerald-500" />
          <StatChip label="Paused" value={pausedCount} dot="bg-amber-500" />
          <StatChip label="Taken Over" value={takenOverCount} dot="bg-blue-500" />
          <StatChip label="Escalated" value={escalatedCount} dot="bg-rose-500" />
        </div>
        </SpecMarker>
      </div>

      {/* Inbox layout */}
      <div className="mx-6 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
        {/* Left: Session list */}
        <div className={`w-full md:w-[340px] shrink-0 border-r border-stone-100 flex flex-col ${selected ? 'hidden md:flex' : 'flex'}`}>
          <SpecMarker id="conversations.list.search">
          {/* Search + filters */}
          <div className="p-3 border-b border-stone-50 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search conversations…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-100 rounded-lg text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2ec27e]/30 focus:border-[#2ec27e] transition-colors"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {['all', 'active', 'paused', 'taken_over', 'ended'].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors capitalize ${
                    statusFilter === f
                      ? 'bg-[#1a2e2a] text-white border-[#1a2e2a]'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {f === 'all' ? 'All' : f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          </SpecMarker>

          {/* Session list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="space-y-2 p-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-stone-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <MessageSquare className="w-8 h-8 text-stone-200" />
                <p className="text-stone-400 text-sm">No conversations found.</p>
              </div>
            ) : (
              filtered.map((session) => (
                <SessionListItem
                  key={session.id}
                  session={session}
                  isSelected={session.id === selectedId}
                  onClick={() => setSelectedId(session.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: Thread view */}
        {selected ? (
          <ConversationThread
            session={selected}
            onBack={() => setSelectedId(null)}
            onVisitProfile={() => navigate(`/people/${selected.visitor_id}`)}
          />
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center gap-4 bg-stone-50/50">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-blue-400" strokeWidth={1.5} />
            </div>
            <p className="text-stone-500 font-medium">Select a conversation to view</p>
            <p className="text-sm text-stone-400 max-w-xs text-center">
              Click any conversation on the left to see the full chat history, AI status, and intervention controls.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatChip({ label, value, dot }: { label: string; value: number; dot: string }) {
  return (
    <div className="bg-white rounded-xl border border-stone-100 px-4 py-3 flex items-center gap-3">
      <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
      <div>
        <p className="text-lg font-bold text-stone-900">{value}</p>
        <p className="text-xs text-stone-400">{label}</p>
      </div>
    </div>
  );
}

function SessionListItem({
  session,
  isSelected,
  onClick,
}: {
  session: ChatSession;
  isSelected: boolean;
  onClick: () => void;
}) {
  const status = STATUS_CONFIG[session.status];
  const ChannelIcon = CHANNEL_ICONS[session.channel] ?? Globe;
  const hasFlag = session.outcome === 'escalated';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-b border-stone-50 transition-colors flex gap-3 ${
        isSelected ? 'bg-[#2ec27e]/5 border-l-2 border-l-[#2ec27e]' : 'hover:bg-stone-50'
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0 relative">
        {session.visitor?.avatar_url ? (
          <img
            src={session.visitor.avatar_url}
            alt={fullName(session.visitor)}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a2e2a] to-[#2ec27e] flex items-center justify-center text-white text-xs font-semibold">
            {initials(session.visitor)}
          </div>
        )}
        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white border border-stone-100 flex items-center justify-center">
          <ChannelIcon className="w-2.5 h-2.5 text-stone-500" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-stone-800 truncate">{fullName(session.visitor)}</span>
          <span className="text-[10px] text-stone-400 shrink-0">{timeAgo(session.last_message_at)}</span>
        </div>
        <p className="text-xs text-stone-400 truncate mt-0.5">
          {session.summary ?? 'No summary available'}
        </p>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
          {session.ai_active && session.status === 'active' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
              <Bot className="w-2.5 h-2.5" />
              AI
            </span>
          )}
          {hasFlag && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="w-2.5 h-2.5" />
              Escalated
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function ConversationThread({
  session,
  onBack,
  onVisitProfile,
}: {
  session: ChatSession;
  onBack: () => void;
  onVisitProfile: () => void;
}) {
  const { messages, loading } = useChatMessages(session.id);
  const [interventionText, setInterventionText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [localSession, setLocalSession] = useState<ChatSession>(session);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalSession(session);
  }, [session]);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [localMessages]);

  const allMessages = [...localMessages];
  const status = STATUS_CONFIG[localSession.status];
  const ChannelIcon = CHANNEL_ICONS[localSession.channel] ?? Globe;

  async function updateSessionState(updates: Partial<ChatSession>) {
    setLocalSession((prev) => ({ ...prev, ...updates }));
  }

  async function handleTakeOver() {
    setActionLoading(true);
    const { error } = await supabase
      .from('chat_sessions')
      .update({
        status: 'taken_over',
        ai_active: false,
        taken_over_at: new Date().toISOString(),
      })
      .eq('id', localSession.id);

    if (error) {
      console.error('[takeOver]', error);
    } else {
      updateSessionState({ status: 'taken_over', ai_active: false, taken_over_at: new Date().toISOString() });
    }
    setActionLoading(false);
  }

  async function handlePauseAI() {
    setActionLoading(true);
    const newPaused = localSession.status === 'paused';
    const { error } = await supabase
      .from('chat_sessions')
      .update({
        status: newPaused ? 'active' : 'paused',
        ai_active: newPaused,
      })
      .eq('id', localSession.id);

    if (error) {
      console.error('[pauseAI]', error);
    } else {
      updateSessionState({
        status: newPaused ? 'active' : 'paused',
        ai_active: newPaused,
      });
    }
    setActionLoading(false);
  }

  async function handleResumeAI() {
    setActionLoading(true);
    const { error } = await supabase
      .from('chat_sessions')
      .update({
        status: 'active',
        ai_active: true,
      })
      .eq('id', localSession.id);

    if (error) {
      console.error('[resumeAI]', error);
    } else {
      updateSessionState({ status: 'active', ai_active: true });
    }
    setActionLoading(false);
  }

  async function handleEndSession() {
    setActionLoading(true);
    const { error } = await supabase
      .from('chat_sessions')
      .update({ status: 'ended', ai_active: false })
      .eq('id', localSession.id);

    if (error) {
      console.error('[endSession]', error);
    } else {
      updateSessionState({ status: 'ended', ai_active: false });
    }
    setActionLoading(false);
  }

  async function handleSendIntervention() {
    if (!interventionText.trim()) return;
    const msg: ChatMessage = {
      id: `temp-${Date.now()}`,
      session_id: localSession.id,
      sender_type: 'pastor',
      sender_pastor_id: localSession.taken_over_by,
      content: interventionText,
      sentiment: 'neutral',
      metadata: {},
      created_at: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, msg]);
    setInterventionText('');

    await supabase.from('chat_messages').insert({
      session_id: localSession.id,
      sender_type: 'pastor',
      content: msg.content,
      sentiment: 'neutral',
      metadata: {},
    });

    await supabase
      .from('chat_sessions')
      .update({
        last_message_at: msg.created_at,
        message_count: (localSession.message_count ?? 0) + 1,
      })
      .eq('id', localSession.id);
  }

  const canIntervene = localSession.status !== 'ended';
  const hasTakenOver = localSession.status === 'taken_over';

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Thread header */}
      <div className="px-5 py-3.5 border-b border-stone-100 flex items-center gap-3">
        <button
          onClick={onBack}
          className="md:hidden text-stone-400 hover:text-stone-700 transition-colors p-1 rounded-lg hover:bg-stone-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="shrink-0 relative">
          {localSession.visitor?.avatar_url ? (
            <img
              src={localSession.visitor.avatar_url}
              alt={fullName(localSession.visitor)}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a2e2a] to-[#2ec27e] flex items-center justify-center text-white text-xs font-semibold">
              {initials(localSession.visitor)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-stone-900 truncate">{fullName(localSession.visitor)}</span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <ChannelIcon className="w-3 h-3 text-stone-400" />
            <span className="text-xs text-stone-400 capitalize">{localSession.channel.replace('_', ' ')}</span>
            <span className="text-stone-200">·</span>
            <span className="text-xs text-stone-400">{localSession.message_count} messages</span>
            {localSession.ai_active && (
              <>
                <span className="text-stone-200">·</span>
                <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <Bot className="w-3 h-3" />
                  AI Active
                </span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={onVisitProfile}
          className="text-xs font-medium text-[#2ec27e] hover:text-[#1a2e2a] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#2ec27e]/5"
        >
          View Profile
        </button>
      </div>

      {/* Summary / outcome banner */}
      {localSession.summary && (
        <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-100">
          <div className="flex items-start gap-2">
            <Zap className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-stone-500 leading-relaxed">{localSession.summary}</p>
              {localSession.outcome && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  {(() => {
                    const oc = OUTCOME_CONFIG[localSession.outcome];
                    const Icon = oc?.icon ?? Clock;
                    return (
                      <>
                        <Icon className={`w-3 h-3 ${oc?.color}`} />
                        <span className={`text-[11px] font-medium ${oc?.color}`}>{oc?.label}</span>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-stone-50/30">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-white rounded-2xl animate-pulse" style={{ width: `${60 + i * 10}%` }} />
            ))}
          </div>
        ) : allMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <MessageSquare className="w-8 h-8 text-stone-200" />
            <p className="text-stone-400 text-sm">No messages in this conversation.</p>
          </div>
        ) : (
          allMessages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
      </div>

      {/* Intervention controls */}
      <div className="border-t border-stone-100 bg-white">
        {/* Action buttons */}
        <div className="px-5 py-2.5 flex items-center gap-2 flex-wrap border-b border-stone-50">
          {canIntervene && !hasTakenOver && localSession.ai_active && (
            <button
              onClick={handleTakeOver}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Take Over
            </button>
          )}
          {canIntervene && localSession.ai_active && (
            <button
              onClick={handlePauseAI}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100 transition-colors disabled:opacity-50"
            >
              <Pause className="w-3.5 h-3.5" />
              Pause AI
            </button>
          )}
          {canIntervene && !localSession.ai_active && localSession.status === 'paused' && (
            <button
              onClick={handleResumeAI}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              Resume AI
            </button>
          )}
          {canIntervene && (
            <button
              onClick={handleEndSession}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-stone-50 text-stone-500 border border-stone-100 hover:bg-stone-100 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              End Session
            </button>
          )}
          {hasTakenOver && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
              <UserCheck className="w-3.5 h-3.5" />
              You have taken over this conversation
            </span>
          )}
        </div>

        {/* Message input */}
        {canIntervene ? (
          <div className="px-4 py-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={interventionText}
                onChange={(e) => setInterventionText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendIntervention()}
                placeholder={hasTakenOver ? "Type a message as the pastor…" : "Intervene — type a message to take over the conversation…"}
                className="flex-1 text-sm border border-stone-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#2ec27e] focus:ring-2 focus:ring-[#2ec27e]/20 transition placeholder:text-stone-400"
              />
              <button
                onClick={handleSendIntervention}
                disabled={!interventionText.trim() || actionLoading}
                className="w-10 h-10 rounded-xl bg-[#2ec27e] hover:bg-[#1a2e2a] disabled:bg-stone-100 disabled:text-stone-400 text-white flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-stone-400 mt-2">
              {hasTakenOver
                ? "Your messages will appear directly to the visitor. The AI is paused."
                : "Sending a message will pause the AI and route the conversation to you."}
            </p>
          </div>
        ) : (
          <div className="px-5 py-4 text-center">
            <p className="text-xs text-stone-400">This conversation has ended.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isVisitor = message.sender_type === 'visitor';
  const isAI = message.sender_type === 'ai';
  const isPastor = message.sender_type === 'pastor';
  const isFlagged = Boolean(message.metadata?.flagged);

  const colorClass = SENTIMENT_COLORS[message.sentiment] ?? SENTIMENT_COLORS.neutral;

  return (
    <div className={`flex ${isVisitor ? 'justify-end' : 'justify-start'} gap-2`}>
      {!isVisitor && (
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
            isAI
              ? 'bg-gradient-to-br from-amber-400 to-amber-600'
              : 'bg-gradient-to-br from-blue-500 to-blue-700'
          }`}
        >
          {isAI ? (
            <Bot className="w-3.5 h-3.5 text-white" strokeWidth={2} />
          ) : (
            <UserCheck className="w-3.5 h-3.5 text-white" strokeWidth={2} />
          )}
        </div>
      )}

      <div className={`max-w-[75%] ${isVisitor ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isVisitor
              ? 'bg-stone-800 text-white rounded-tr-sm'
              : isPastor
                ? 'bg-blue-50 border border-blue-100 text-stone-800 rounded-tl-sm'
                : `border ${colorClass} text-stone-800 rounded-tl-sm`
          }`}
        >
          {isPastor && (
            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide block mb-0.5">
              Pastor
            </span>
          )}
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] text-stone-400">{timeAgo(message.created_at)}</span>
          {isFlagged && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-rose-500 font-medium">
              <AlertTriangle className="w-2.5 h-2.5" />
              Flagged
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
