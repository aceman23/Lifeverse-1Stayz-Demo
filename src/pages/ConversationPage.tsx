import { Bot, Sliders, BarChart3, ShieldCheck, MessageSquare, Zap } from 'lucide-react';
import { AvatarChat } from '../components/conversation/AvatarChat';
import { ContentLibrary } from '../components/conversation/ContentLibrary';

const toneSettings = [
  { label: 'Warmth', value: 92, description: 'Caring, personal tone in every message' },
  { label: 'Directness', value: 54, description: 'Balanced — not pushy, not too passive' },
  { label: 'Formality', value: 31, description: 'Conversational over formal language' },
  { label: 'Scripture Use', value: 65, description: 'Moderate — cited when directly relevant' },
];

const topicCoverage = [
  { topic: 'Grief & Loss', ready: true, approved: 12 },
  { topic: 'Questions of Faith', ready: true, approved: 24 },
  { topic: 'Community & Belonging', ready: true, approved: 18 },
  { topic: 'Events & Next Steps', ready: true, approved: 9 },
  { topic: 'Prayer Requests', ready: true, approved: 7 },
  { topic: 'Financial Need', ready: true, approved: 5 },
  { topic: 'Marriage & Family', ready: false, approved: 0 },
  { topic: 'Mental Health Support', ready: false, approved: 0 },
];

const escalationRules = [
  { trigger: 'Keywords: suicide, self-harm, crisis', action: 'Immediate pastor alert + hotline info', level: 'critical' },
  { trigger: 'Urgency level: high or critical concern', action: 'Pause AI, notify pastor within 15 min', level: 'high' },
  { trigger: 'Visitor requests human contact', action: 'Flag for pastoral call within 24h', level: 'medium' },
  { trigger: 'Negative sentiment 3+ turns', action: 'Escalate to senior care coordinator', level: 'medium' },
  { trigger: 'No response after 3 outreach attempts', action: 'Move to manual follow-up queue', level: 'low' },
];

const engagementStats = [
  { label: 'Total Conversations', value: '1,247', change: '+89 this week' },
  { label: 'Avg Messages / Session', value: '6.4', change: '+0.3 vs last month' },
  { label: 'Concern Detection Rate', value: '91%', change: 'above 85% target' },
  { label: 'Escalations This Month', value: '31', change: '14 resolved' },
];

export function ConversationPage() {
  return (
    <div className="pt-14 min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Conversation Engine</h1>
            <p className="text-sm text-stone-500 mt-1">
              Grace — AI pastoral care avatar powered by church-approved content
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Voice: Active
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
              <Zap className="w-3 h-3" />
              Model: GPT-4o
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {engagementStats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
              <p className="text-2xl font-semibold text-stone-900">{s.value}</p>
              <p className="text-sm text-stone-500 mt-0.5">{s.label}</p>
              <p className="text-xs text-stone-400 mt-2">{s.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-stone-400" strokeWidth={1.75} />
                <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Live Conversation Simulator</h2>
              </div>
              <AvatarChat />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-stone-400" strokeWidth={1.75} />
                <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Escalation Rules</h2>
              </div>
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-stone-50">
                  {escalationRules.map((rule) => (
                    <div key={rule.trigger} className="px-5 py-3.5 flex items-start gap-3">
                      <span className={`shrink-0 mt-0.5 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        rule.level === 'critical' ? 'bg-rose-100 text-rose-700' :
                        rule.level === 'high' ? 'bg-orange-100 text-orange-700' :
                        rule.level === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-stone-100 text-stone-500'
                      }`}>
                        {rule.level}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-700">{rule.trigger}</p>
                        <p className="text-xs text-stone-400 mt-0.5">→ {rule.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sliders className="w-4 h-4 text-stone-400" strokeWidth={1.75} />
                <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Tone & Persona</h2>
              </div>
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-50">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
                    <Bot className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Grace</p>
                    <p className="text-xs text-stone-400">Pastoral Care Assistant</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">Approved by Pastor James · Apr 2026</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {toneSettings.map((t) => (
                    <div key={t.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-stone-700">{t.label}</span>
                        <span className="text-xs text-stone-400">{t.value}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${t.value}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1">{t.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-stone-400" strokeWidth={1.75} />
                <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Topic Coverage</h2>
              </div>
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-stone-50">
                  {topicCoverage.map((t) => (
                    <div key={t.topic} className="flex items-center gap-3 px-4 py-2.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${t.ready ? 'bg-emerald-400' : 'bg-stone-200'}`} />
                      <span className="text-xs text-stone-700 flex-1">{t.topic}</span>
                      {t.ready ? (
                        <span className="text-[11px] text-stone-400">{t.approved} responses</span>
                      ) : (
                        <span className="text-[11px] text-amber-500 font-medium">Pending review</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-stone-400" strokeWidth={1.75} />
            <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Content Library</h2>
          </div>
          <ContentLibrary />
        </div>
      </div>
    </div>
  );
}
