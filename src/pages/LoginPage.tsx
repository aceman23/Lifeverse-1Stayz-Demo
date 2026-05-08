import { useState, type FormEvent } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { ChatWidget } from '../components/ui/ChatWidget';

export function LoginPage() {
  const navigate = useNavigate();
  const { session, loading: authLoading, demoMode, enterDemoMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authLoading && (session || demoMode)) {
    return <Navigate to="/" replace />;
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

    navigate('/');
  };

  const handleDemoLogin = () => {
    enterDemoMode();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 relative overflow-hidden items-end p-16">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt=""
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="relative z-10 w-full">
          <h2 className="text-4xl font-light text-stone-800 leading-snug mb-4">
            Save more souls.<br />
            <span className="font-semibold text-[#2ec27e]">Retain more of your 1st time visitors.</span>
          </h2>
          <p className="text-stone-500 text-base leading-relaxed max-w-sm">
            Agentic AI digital assistants helps your church follow up with every guest through intelligent,
            personalized engagement that feels genuinely human.
          </p>
          <div className="mt-10 flex justify-center">
            <img src="/LifeversLogo.png" alt="Lifeverse" className="h-28 w-auto opacity-60" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <img src="/LifeverseHeaderMenuLogo.png" alt="Lifeverse" className="h-9 w-auto" />
          </div>

          <div className="mb-8">
            <div className="mb-4 flex justify-center">
              <img src="/LVHI_1Stayz.png" alt="1Stayz" className="w-auto" style={{ height: '11.25rem', clipPath: 'inset(20% 0 15% 0)' }} />
            </div>
            <h1 className="text-2xl font-semibold text-stone-900 mb-1.5">Welcome back</h1>
            <p className="text-sm text-stone-500">Sign in to your Agentic AI digital assistants account.</p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-xl p-3.5 mb-5">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor="email">
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
                className="w-full px-3.5 py-2.5 text-sm text-stone-900 bg-white border border-stone-200 rounded-xl placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-stone-700" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-amber-700 hover:text-amber-800 transition-colors"
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
                  className="w-full px-3.5 py-2.5 pr-10 text-sm text-stone-900 bg-white border border-stone-200 rounded-xl placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-sm font-medium py-2.5 rounded-xl transition-colors mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-stone-50 px-3 text-xs text-stone-400">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-amber-50 hover:bg-amber-100 disabled:opacity-50 border border-amber-200 text-amber-800 text-sm font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Try Demo Account
          </button>

          <p className="text-sm text-stone-500 text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/sign-up" className="font-medium text-amber-700 hover:text-amber-800 transition-colors">
              Create one
            </Link>
          </p>

          <div className="flex items-center justify-center gap-4 mt-4">
            <Link to="/beta" className="text-xs text-teal-700 hover:text-teal-800 font-medium transition-colors">
              Join the Beta
            </Link>
            <span className="text-stone-300">|</span>
            <Link to="/beta/qr" className="text-xs text-teal-700 hover:text-teal-800 font-medium transition-colors">
              Beta QR Code
            </Link>
          </div>
        </div>
      </div>
      <ChatWidget context="auth" />
    </div>
  );
}
