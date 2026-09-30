import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, Menu, Eye, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useOnboarding } from '../../lib/onboarding-context';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onMenuClick?: () => void;
}

const ROUTE_META: Record<string, { title: string; subtitle: string }> = {
  '/today': { title: 'TODAY', subtitle: 'Your personalized action list' },
  '/': { title: 'DASHBOARD', subtitle: 'System overview of your visitor engagement' },
  '/people': { title: 'PEOPLE', subtitle: 'Every guest and their journey' },
  '/conversations': { title: 'CONVERSATIONS', subtitle: 'AI-powered chats across every channel' },
  '/ai-training': { title: 'AI TRAINING', subtitle: 'Documents, guardrails, and tone' },
  '/follow-up-engine': { title: 'FOLLOW-UP ENGINE', subtitle: 'Automated sequences that shepherd every visitor' },
  '/appointments': { title: 'APPOINTMENTS', subtitle: 'Coffee chats and meeting invites' },
  '/insights': { title: 'INSIGHTS', subtitle: 'Weekly metrics and pilot health' },
  '/settings': { title: 'SETTINGS', subtitle: 'Configure your 1Stayz workspace' },
};

export function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { state } = useOnboarding();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const routeKey = Object.keys(ROUTE_META).find((k) =>
    k === '/' ? location.pathname === '/' : location.pathname.startsWith(k)
  ) ?? '/';
  const { title: pageTitle, subtitle: pageSubtitle } = ROUTE_META[routeKey];

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? state.church.yourName ?? 'Pastor Ray';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const mode = state.mode;
  const modePill = mode === 'shadow'
    ? { label: 'Shadow', icon: Eye, bg: 'var(--warning-tint)', color: 'var(--warning)' }
    : mode === 'live'
      ? { label: 'Live', icon: Zap, bg: 'var(--success-tint)', color: 'var(--success)' }
      : { label: 'Setup', icon: AlertCircle, bg: 'var(--background)', color: 'var(--text-muted)', link: '/onboarding' };

  const ModeIcon = modePill.icon;

  return (
    <header
      className="flex fixed top-0 left-0 right-0 md:left-56 z-40 items-center px-4 md:px-6 gap-2 md:gap-3"
      style={{ height: '56px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
    >
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 -ml-1 text-ink-2 hover:text-ink transition-colors rounded-lg"
        style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
        <span className="font-semibold text-ink text-xs tracking-wide">{pageTitle}</span>
        <span className="hidden sm:block text-ink-3 text-xs">|</span>
        <p className="hidden sm:block text-xs text-ink-2 truncate">{pageSubtitle}</p>

        {('link' in modePill && modePill.link) ? (
          <Link to={modePill.link} className="ml-2 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-opacity hover:opacity-80" style={{ background: modePill.bg, color: modePill.color }}>
            <ModeIcon className="w-3 h-3" />
            {modePill.label}
          </Link>
        ) : (
          <span className="ml-2 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: modePill.bg, color: modePill.color }}>
            <ModeIcon className="w-3 h-3" />
            {modePill.label}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button className="relative p-2 text-ink-3 hover:text-ink transition-colors rounded-lg" style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell className="w-5 h-5" strokeWidth={1.75} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: 'var(--danger)' }} />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 hover:bg-bg rounded-lg px-2 py-1 transition-colors"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0" style={{ background: 'var(--text-primary)' }}>
              {initials}
            </div>
            <span className="hidden sm:block text-sm text-ink font-medium max-w-[100px] truncate">{displayName}</span>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-ink-3" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface rounded-12 shadow-soft overflow-hidden z-50 animate-slide-down" style={{ border: '1px solid var(--border)' }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm font-medium text-ink truncate">{displayName}</p>
                {user?.email && <p className="text-xs text-ink-3 truncate mt-0.5">{user.email}</p>}
              </div>
              <button
                onClick={() => { setMenuOpen(false); signOut(); }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-ink-2 hover:bg-bg hover:text-ink transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
