import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../lib/auth';

interface HeaderProps {
  pageTitle?: string;
  pageSubtitle?: string;
  breadcrumb?: string;
}

export function Header({ pageTitle = 'DASHBOARD', pageSubtitle = 'System overview of your visitor engagement', breadcrumb = 'Dashboard' }: HeaderProps) {
  const { user, signOut } = useAuth();
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

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? 'Pastor Ray';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="fixed top-0 left-56 right-0 z-50 bg-white border-b border-stone-100 shadow-sm">
      <div className="h-14 flex items-center px-6 gap-4">
        {/* Breadcrumb + page info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span className="w-5 h-5 rounded-full bg-[#2ec27e] flex items-center justify-center shrink-0">
              <LayoutDashboard className="w-3 h-3 text-white" strokeWidth={2} />
            </span>
            <span className="font-semibold text-stone-700 text-xs tracking-wide">{pageTitle}</span>
          </div>
          <span className="text-stone-300 text-xs">|</span>
          <p className="text-xs text-stone-400 truncate">{pageSubtitle}</p>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="relative p-2 text-stone-400 hover:text-stone-700 transition-colors rounded-lg hover:bg-stone-50">
            <Bell className="w-4.5 h-4.5" strokeWidth={1.75} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 hover:bg-stone-50 rounded-lg px-2 py-1 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#1a2e2a] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {initials}
              </div>
              <span className="text-sm text-stone-700 font-medium max-w-[100px] truncate">{displayName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-100 rounded-2xl shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-stone-50">
                  <p className="text-sm font-medium text-stone-900 truncate">{displayName}</p>
                  {user?.email && (
                    <p className="text-xs text-stone-400 truncate mt-0.5">{user.email}</p>
                  )}
                </div>
                <button
                  onClick={() => { setMenuOpen(false); signOut(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
