export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 2) return 'just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hrs ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export const statusLabels: Record<string, string> = {
  new_visitor: 'New Visitor',
  thanked: 'Thanked',
  contacted: 'Contacted',
  engaged: 'Engaged',
  concern_raised: 'Concern Raised',
  concern_confirmed: 'Confirmed Concern',
  escalated: 'Escalated',
  invited: 'Invited',
  scheduled: 'Scheduled',
  returned: 'Returned',
  integrated: 'Integrated',
};

export const statusColors: Record<string, string> = {
  new_visitor: 'bg-sky-50 text-sky-700',
  thanked: 'bg-emerald-50 text-emerald-700',
  contacted: 'bg-teal-50 text-teal-700',
  engaged: 'bg-green-50 text-green-700',
  concern_raised: 'bg-amber-50 text-amber-700',
  concern_confirmed: 'bg-orange-50 text-orange-700',
  escalated: 'bg-rose-50 text-rose-700',
  invited: 'bg-blue-50 text-blue-700',
  scheduled: 'bg-violet-50 text-violet-700',
  returned: 'bg-lime-50 text-lime-700',
  integrated: 'bg-emerald-100 text-emerald-800',
};
