import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Zap,
  CalendarDays,
  BarChart2,
  Settings,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/people', icon: Users, label: 'People' },
  { to: '/conversations', icon: MessageSquare, label: 'Conversations' },
  { to: '/follow-up-engine', icon: Zap, label: 'Follow-Up Engine' },
  { to: '/appointments', icon: CalendarDays, label: 'Appointments' },
  { to: '/insights', icon: BarChart2, label: 'Insights' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-[#1a2e2a] z-40 flex flex-col overflow-y-auto">
      {/* Brand */}
      <div className="px-4 pt-5 pb-4 border-b border-white/10">
        <img
          src="/LVHI_1Stayz.png"
          alt="1Stayz"
          className="h-42 w-auto object-contain brightness-0 invert"
          style={{ height: '10.5rem' }}
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
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
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer brand */}
      <div className="px-4 py-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-white/40 text-xs">1Stayz by Lifeverse</p>
        <span className="text-white/25 text-[10px] font-mono tracking-wide">v{__APP_VERSION__}</span>
      </div>
    </aside>
  );
}
