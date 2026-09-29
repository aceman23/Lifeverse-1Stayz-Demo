import { useState, type FormEvent } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, HelpCircle, QrCode } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { useOnboarding } from '../lib/onboarding-context';
import { createDemoState, createInitialState } from '../data/onboarding';
import { ChatWidget } from '../components/ui/ChatWidget';
import { SpecMarker } from '../components/ui/SpecMarker';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading: authLoading, demoMode, enterDemoMode } = useAuth();
  const { update } = useOnboarding();
  const savedMessage = (location.state as { savedMessage?: string } | null)?.savedMessage;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authLoading && (session || demoMode)) {
    return <Navigate to="/today" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    navigate('/today');
  };

  const handleDemoLogin = () => {
    const demoState = createDemoState();
    update(demoState);
    enterDemoMode();
    navigate('/today');
  };

  const handleStartOnboarding = () => {
    update(createInitialState());
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* Desktop left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end p-16">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.35 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, var(--background) 0%, transparent 40%, transparent 60%, var(--background) 100%)' }}
          />
        </div>
        <div className="relative z-10 w-full">
          <h2
            className="font-bold text-ink leading-tight mb-4"
            style={{ fontSize: '44px', letterSpacing: '-0.02em' }}
          >
            Retain more of your<br />first-time visitors.
          </h2>
          <p className="text-ink-2 text-lg leading-relaxed max-w-md">
            1Stayz follows up with every guest through intelligent, personalized engagement that feels genuinely human.
          </p>
          <div className="mt-12">
            <img src="/LifeversLogo.png" alt="Lifeverse" className="h-10 w-auto opacity-50" />
          </div>
        </div>
      </div>

      {/* Right / mobile column */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full" style={{ maxWidth: '400px' }}>
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/LVHI_1Stayz.png"
              alt="1Stayz"
              className="w-auto"
              style={{ height: '64px', objectFit: 'contain' }}
            />
          </div>

          <h1
            className="font-bold text-ink text-center mb-2"
            style={{ fontSize: '32px', letterSpacing: '-0.02em' }}
          >
            Welcome back
          </h1>
          <p className="text-ink-2 text-center text-base mb-8">
            Sign in to your 1Stayz account.
          </p>

          {savedMessage && (
            <div
              className="flex items-start gap-2.5 rounded-12 p-3.5 mb-5"
              style={{ background: 'var(--success-tint)', border: '1px solid var(--success)' }}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--success)' }} />
              <p className="text-sm" style={{ color: 'var(--success)' }}>{savedMessage}</p>
            </div>
          )}

          {error && (
            <div
              className="flex items-start gap-2.5 rounded-12 p-3.5 mb-5"
              style={{ background: 'var(--danger-tint)', border: '1px solid var(--danger)' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--danger)' }} />
              <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@church.org"
                className="w-full px-4 rounded-12 text-sm text-ink bg-surface outline-none transition-colors"
                style={{ height: '56px', border: '1px solid var(--border)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand-teal)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(1,132,119,.12)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-ink" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium transition-colors"
                  style={{ color: 'var(--brand-teal-text)' }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 pr-12 rounded-12 text-sm text-ink bg-surface outline-none transition-colors"
                  style={{ height: '56px', border: '1px solid var(--border)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand-teal)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(1,132,119,.12)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink transition-colors"
                  style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-between rounded-12 text-white text-sm font-semibold transition-opacity disabled:opacity-50 px-5"
              style={{ height: '56px', background: 'var(--button-primary)' }}
            >
              <span>{loading ? 'Signing in…' : 'Sign in'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* or divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'var(--border)' }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-ink-3" style={{ background: 'var(--background)' }}>or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartOnboarding}
            className="w-full flex items-center justify-between rounded-12 text-sm font-semibold transition-colors px-5 bg-surface"
            style={{ height: '56px', border: '1.5px solid var(--brand-teal)', color: 'var(--brand-teal-text)' }}
          >
            <span>Join the Pilot</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <SpecMarker id="login.demo">
          <p className="text-sm text-ink-2 text-center mt-6">
            Just want to look around?{' '}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="font-semibold transition-colors"
              style={{ color: 'var(--brand-teal-text)' }}
            >
              Try the demo →
            </button>
          </p>
          </SpecMarker>

          {/* Need help divider */}
          <div className="relative mt-8 mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'var(--border)' }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-ink-3" style={{ background: 'var(--background)' }}>Need help?</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); document.dispatchEvent(new CustomEvent('open-chat-widget')); }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-2 hover:text-ink transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Contact support
            </a>
            <Link
              to="/beta/qr"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-2 hover:text-ink transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              Beta QR Code
            </Link>
          </div>
        </div>
      </div>
      <ChatWidget context="auth" />
    </div>
  );
}
