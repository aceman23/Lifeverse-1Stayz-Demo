import { useState } from 'react';
import { BookOpen, Heart, Calendar, Users, HandHelping, ChevronDown } from 'lucide-react';

interface ContentItem {
  trigger: string;
  response: string;
  scripture?: string;
}

interface ContentCategory {
  icon: typeof BookOpen;
  label: string;
  color: string;
  bg: string;
  count: number;
  items: ContentItem[];
}

const categories: ContentCategory[] = [
  {
    icon: Heart,
    label: 'Grief & Loss',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    count: 12,
    items: [
      { trigger: 'Lost a loved one', response: 'We are deeply sorry for your loss. Grief is not something you should carry alone. Our care team would love to walk with you through this season.', scripture: 'Psalm 34:18' },
      { trigger: 'Going through a divorce', response: 'We see your pain and we want you to know there\'s no judgment here — only love. Pastor Sarah runs a healing group for people in transition that meets every Tuesday.', scripture: 'Isaiah 41:10' },
    ],
  },
  {
    icon: HandHelping,
    label: 'Questions of Faith',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    count: 24,
    items: [
      { trigger: 'Doubting faith', response: 'Doubt is actually a sign of a searching heart — and that\'s a beautiful thing. We\'d love to explore those questions with you. No question is off the table here.' },
      { trigger: 'Never been to church', response: 'Welcome! You\'re in the right place. We believe faith is a journey, not a destination. We have a "Starting Point" class designed for people exactly where you are.' },
    ],
  },
  {
    icon: Users,
    label: 'Community & Belonging',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    count: 18,
    items: [
      { trigger: 'Feeling isolated', response: 'Community is one of God\'s greatest gifts — and we take it seriously. Our small groups are designed to be the kind of place where you\'re truly known.', scripture: 'Hebrews 10:24-25' },
      { trigger: 'Recently moved to area', response: 'Starting over in a new city is hard, but you\'ve already taken a brave step by walking through our doors. Let\'s help make My Sanctuary feel like home.' },
    ],
  },
  {
    icon: Calendar,
    label: 'Events & Next Steps',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    count: 9,
    items: [
      { trigger: 'Want to get involved', response: 'That\'s wonderful! We have serve teams across worship, kids, community outreach, and more. What feels most like you? I can connect you with the right team leader.' },
      { trigger: 'Membership inquiry', response: 'Our membership class "The Foundation" meets on the first Saturday of every month. It\'s relaxed, informative, and a great way to meet Pastor James personally.' },
    ],
  },
  {
    icon: BookOpen,
    label: 'Prayer Requests',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    count: 7,
    items: [
      { trigger: 'Health concerns', response: 'We\'re covering you in prayer right now. Our prayer team meets every week and we\'d love to add your name. Would it be okay to share your request (confidentially) with them?', scripture: 'James 5:16' },
      { trigger: 'Financial hardship', response: 'You don\'t have to face this alone. Beyond prayer, we also have a community care fund that can sometimes help with practical needs. Can I connect you with our care coordinator?' },
    ],
  },
];

export function ContentLibrary() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-50">
        <h3 className="text-sm font-semibold text-stone-900">Church-Approved Content Library</h3>
        <p className="text-xs text-stone-400 mt-0.5">Reviewed and approved responses by pastoral team</p>
      </div>
      <div className="divide-y divide-stone-50">
        {categories.map((cat) => {
          const isOpen = open === cat.label;
          return (
            <div key={cat.label}>
              <button
                onClick={() => setOpen(isOpen ? null : cat.label)}
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-stone-50/60 transition-colors text-left"
              >
                <div className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center shrink-0`}>
                  <cat.icon className={`w-4 h-4 ${cat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-800">{cat.label}</p>
                  <p className="text-xs text-stone-400">{cat.count} approved responses</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="bg-stone-50/40 border-t border-stone-50 px-5 py-3 space-y-3">
                  {cat.items.map((item, i) => (
                    <div key={i} className="bg-white rounded-xl border border-stone-100 p-3.5">
                      <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide mb-1.5">When visitor mentions: {item.trigger}</p>
                      <p className="text-sm text-stone-700 leading-relaxed">{item.response}</p>
                      {item.scripture && (
                        <p className="text-[11px] text-amber-600 font-medium mt-2">Scripture reference: {item.scripture}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
