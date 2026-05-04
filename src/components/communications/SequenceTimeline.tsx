import { useState } from 'react';
import { ChevronDown, ChevronRight, Mail, MessageCircle, Phone, Send } from 'lucide-react';

export interface WeekMessage {
  channel: 'sms' | 'email' | 'whatsapp' | 'call';
  timing: string;
  subject?: string;
  preview: string;
  openRate?: number;
  replyRate?: number;
}

export interface SequenceWeek {
  week: number;
  title: string;
  goal: string;
  messages: WeekMessage[];
  completedCount: number;
  activeCount: number;
}

const CHANNEL_CONFIG = {
  sms: { icon: MessageCircle, color: 'text-sky-600', bg: 'bg-sky-50', label: 'SMS' },
  email: { icon: Mail, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Email' },
  whatsapp: { icon: Send, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'WhatsApp' },
  call: { icon: Phone, color: 'text-violet-600', bg: 'bg-violet-50', label: 'Personal Call' },
};

interface SequenceTimelineProps {
  weeks: SequenceWeek[];
}

export function SequenceTimeline({ weeks }: SequenceTimelineProps) {
  const [expanded, setExpanded] = useState<number | null>(1);

  return (
    <div className="space-y-3">
      {weeks.map((week) => {
        const isOpen = expanded === week.week;
        return (
          <div key={week.week} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpanded(isOpen ? null : week.week)}
              className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-stone-50/60 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-amber-700">W{week.week}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-stone-900">{week.title}</p>
                  <span className="text-xs text-stone-400">·</span>
                  <p className="text-xs text-stone-500">{week.messages.length} message{week.messages.length !== 1 ? 's' : ''}</p>
                </div>
                <p className="text-xs text-stone-400 mt-0.5 truncate">{week.goal}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-xs font-medium text-stone-700">{week.activeCount} active</p>
                  <p className="text-[11px] text-stone-400">{week.completedCount} completed</p>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-stone-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-stone-50 px-6 py-4 space-y-4 bg-stone-50/30">
                {week.messages.map((msg, i) => {
                  const cfg = CHANNEL_CONFIG[msg.channel];
                  return (
                    <div key={i} className="bg-white rounded-xl border border-stone-100 p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                          <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[11px] font-semibold ${cfg.color} uppercase tracking-wide`}>{cfg.label}</span>
                            <span className="text-[11px] text-stone-400">{msg.timing}</span>
                            {msg.subject && (
                              <>
                                <span className="text-stone-300">·</span>
                                <span className="text-xs text-stone-600 font-medium">{msg.subject}</span>
                              </>
                            )}
                          </div>
                          <p className="text-sm text-stone-600 leading-relaxed">{msg.preview}</p>
                          {(msg.openRate !== undefined || msg.replyRate !== undefined) && (
                            <div className="flex items-center gap-4 mt-2 pt-2 border-t border-stone-50">
                              {msg.openRate !== undefined && (
                                <span className="text-[11px] text-stone-400">
                                  <span className="font-medium text-stone-600">{msg.openRate}%</span> open rate
                                </span>
                              )}
                              {msg.replyRate !== undefined && (
                                <span className="text-[11px] text-stone-400">
                                  <span className="font-medium text-stone-600">{msg.replyRate}%</span> reply rate
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
