import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PublicLayoutProps {
  children: ReactNode;
  narrow?: boolean;
}

export function PublicLayout({ children, narrow = false }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#10151A]">
      <header className="border-b border-[#D8DDDC] bg-white/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="inline-flex items-center" aria-label="1Stayz home">
            <img src="/LVHI_1Stayz.png" alt="1Stayz" className="h-9 w-auto" />
          </Link>
          <nav className="flex items-center gap-5 text-sm text-[#6B6F76]">
            <Link to="/privacy" className="hidden transition-colors hover:text-[#10151A] sm:inline">Privacy</Link>
            <Link to="/terms" className="hidden transition-colors hover:text-[#10151A] sm:inline">Terms</Link>
            <Link to="/login" className="rounded-full bg-[#10151A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#26343A]">Sign in</Link>
          </nav>
        </div>
      </header>
      <main className={narrow ? 'mx-auto max-w-3xl px-5 py-12 sm:px-8' : ''}>{children}</main>
      <footer className="border-t border-[#D8DDDC] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-[#6B6F76] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Lifeverse. 1Stayz helps churches follow up personally.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-[#10151A]">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#10151A]">Terms</Link>
            <Link to="/login" className="hover:text-[#10151A]">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
