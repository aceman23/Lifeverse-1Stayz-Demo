import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Sparkles,
  Zap,
  CalendarDays,
  BarChart2,
  Settings,
  X,
  Sun,
} from 'lucide-react';
import { useOnboarding } from '../../lib/onboarding-context';
import { escalations, todayTasks } from '../../data/today';

const navItems = [
  { to: '/today', icon: Sun, label: 'Today' },
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/people', icon: Users, label: 'People' },
  { to: '/conversations', icon: MessageSquare, label: 'Conversations' },
  { to: '/ai-training', icon: Sparkles, label: 'AI Training' },
  { to: '/follow-up-engine', icon: Zap, label: 'Follow-Up Engine', soon: true },
  { to: '/appointments', icon: CalendarDays, label: 'Appointments', soon: true },
  { to: '/insights', icon: BarChart2, label: 'Insights' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { state } = useOnboarding();

  const todayBadge = escalations.length + (state.mode === 'shadow' ? todayTasks.filter((t) => t.status === 'approval').length : 0);

  useEffect(() => {
    if (mobileOpen) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nav = (
    <aside className="flex flex-col h-full bg-[#1a2e2a] w-56">
      {/* Brand */}
      <div className="px-4 pt-5 pb-4 border-b border-white/10 flex items-center justify-between">
        <img
          src="/LVHI_1Stayz.png"
          alt="1Stayz"
          className="h-auto w-auto object-contain brightness-0 invert"
          style={{ height: '10.5rem' }}
        />
        <button
          onClick={onClose}
          className="md:hidden text-white/50 hover:text-white transition-colors ml-2 shrink-0"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map(({ to, icon: Icon, label, soon }) => {
            const badge = to === '/today' ? todayBadge : undefined;
            const badgeColor = 'bg-rose-500';
            return (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-[#2ec27e]/20 text-[#2ec27e] font-medium'
                      : 'text-white/60 hover:bg-white/8 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                {label}
                {badge !== undefined && badge > 0 && (
                  <span className={`ml-auto text-[10px] font-bold text-white ${badgeColor} px-1.5 py-0.5 rounded-full min-w-[18px] text-center`}>
                    {badge}
                  </span>
                )}
                {soon && (
                  <span className="ml-auto text-[9px] font-medium text-white/40 bg-white/10 px-1.5 py-0.5 rounded">
                    Soon
                  </span>
                )}
              </NavLink>
            </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-white/40 text-xs">1Stayz by Lifeverse</p>
        <span className="text-white/25 text-[10px] font-mono tracking-wide">v{__APP_VERSION__}</span>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 z-40 flex-col overflow-y-auto">
        {nav}
      </div>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-56 flex flex-col shadow-2xl">
            {nav}
          </div>
        </div>
      )}
    </>
  );
}
