import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronRight, Mail, Phone } from 'lucide-react';
import { useAllVisitors } from '../lib/hooks';
import type { Visitor, FollowUpStatus } from '../lib/types';
import { formatDate } from '../lib/utils';

function fullName(v: Visitor) {
  return `${v.first_name} ${v.last_name}`.trim();
}

function initials(v: Visitor) {
  return `${v.first_name[0] ?? ''}${v.last_name[0] ?? ''}`.toUpperCase();
}

const STATUS_LABELS: Record<FollowUpStatus, string> = {
  new_visitor: 'New',
  thanked: 'Thanked',
  contacted: 'Contacted',
  engaged: 'Engaged',
  concern_raised: 'Concern',
  concern_confirmed: 'Confirmed',
  escalated: 'Escalated',
  invited: 'Invited',
  scheduled: 'Scheduled',
  returned: 'Returned',
  integrated: 'Integrated',
};

const STATUS_COLORS: Record<FollowUpStatus, string> = {
  new_visitor: 'bg-stone-100 text-stone-600',
  thanked: 'bg-blue-50 text-blue-600',
  contacted: 'bg-sky-50 text-sky-700',
  engaged: 'bg-emerald-50 text-emerald-700',
  concern_raised: 'bg-amber-50 text-amber-700',
  concern_confirmed: 'bg-orange-50 text-orange-700',
  escalated: 'bg-rose-50 text-rose-700',
  invited: 'bg-teal-50 text-teal-700',
  scheduled: 'bg-green-50 text-green-700',
  returned: 'bg-lime-50 text-lime-700',
  integrated: 'bg-emerald-100 text-emerald-800',
};

const FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new_visitor' },
  { label: 'Engaged', value: 'engaged' },
  { label: 'Needs Attention', value: 'concern_raised,concern_confirmed,escalated' },
  { label: 'Scheduled', value: 'scheduled' },
];

function VisitorCard({ visitor, onClick }: { visitor: Visitor; onClick: () => void }) {
  const status = visitor.follow_up_status as FollowUpStatus;
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-stone-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md hover:border-stone-200 transition-all group text-left"
    >
      {visitor.avatar_url ? (
        <img
          src={visitor.avatar_url}
          alt={fullName(visitor)}
          className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-stone-50"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a2e2a] to-[#2ec27e] flex items-center justify-center text-white text-sm font-semibold shrink-0">
          {initials(visitor)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-stone-800">{fullName(visitor)}</span>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[status] ?? 'bg-stone-100 text-stone-600'}`}>
            {STATUS_LABELS[status] ?? status}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {visitor.email && (
            <span className="flex items-center gap-1 text-xs text-stone-400 truncate">
              <Mail className="w-3 h-3 shrink-0" />
              {visitor.email}
            </span>
          )}
          {visitor.phone && (
            <span className="flex items-center gap-1 text-xs text-stone-400">
              <Phone className="w-3 h-3 shrink-0" />
              {visitor.phone}
            </span>
          )}
          {visitor.visit_date && !visitor.email && !visitor.phone && (
            <span className="text-xs text-stone-400">
              First visit {formatDate(visitor.visit_date)}
            </span>
          )}
        </div>
        {visitor.segmentation_tags?.length > 0 && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {visitor.segmentation_tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] bg-stone-50 text-stone-500 border border-stone-100 px-2 py-0.5 rounded-full">
                {tag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}
      </div>
      {visitor.visit_date && (
        <div className="text-right shrink-0 hidden sm:block">
          <p className="text-[11px] text-stone-400">Last visit</p>
          <p className="text-xs font-medium text-stone-600">{formatDate(visitor.visit_date)}</p>
        </div>
      )}
      <ChevronRight className="w-4 h-4 text-stone-200 group-hover:text-stone-400 transition-colors shrink-0" />
    </button>
  );
}

export function PeoplePage() {
  const navigate = useNavigate();
  const { visitors, loading } = useAllVisitors();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = visitors.filter((v) => {
    const matchesSearch =
      search === '' ||
      fullName(v).toLowerCase().includes(search.toLowerCase()) ||
      (v.email ?? '').toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === 'all' ||
      activeFilter.split(',').includes(v.follow_up_status);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#f5f6f8] px-6 pt-20 pb-10">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">People</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            {loading ? '—' : `${visitors.length} visitor${visitors.length !== 1 ? 's' : ''}`} in your pipeline
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2ec27e]/30 focus:border-[#2ec27e] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-stone-400 shrink-0" />
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                activeFilter === opt.value
                  ? 'bg-[#1a2e2a] text-white border-[#1a2e2a]'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visitor list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-stone-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 py-20 flex flex-col items-center gap-3">
          <Search className="w-8 h-8 text-stone-200" />
          <p className="text-stone-400 text-sm">No visitors match your search.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((v) => (
            <VisitorCard
              key={v.id}
              visitor={v}
              onClick={() => navigate(`/people/${v.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
