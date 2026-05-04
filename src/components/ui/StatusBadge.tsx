import { statusLabels, statusColors } from '../../lib/utils';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const label = statusLabels[status] ?? status;
  const colors = statusColors[status] ?? 'bg-stone-50 text-stone-600';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colors} ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
      }`}
    >
      {label}
    </span>
  );
}
