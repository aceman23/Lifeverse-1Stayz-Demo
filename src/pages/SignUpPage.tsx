import { useState, type FormEvent } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { ChatWidget } from '../components/ui/ChatWidget';

export function SignUpPage() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!authLoading && session) {
    return <Navigate to="/" replace />;
  }

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    if (password.length < 6) return 'weak';
    if (password.length < 10 || !/[0-9]/.test(password)) return 'fair';
    return 'strong';
  })();

  const strengthConfig = {
    weak: { label: 'Weak', color: 'text-rose-500', bars: [true, false, false] },
    fair: { label: 'Fair', color: 'text-amber-500', bars: [true, true, false] },
    strong: { label: 'Strong', color: 'text-emerald-600', bars: [true, true, true] },
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => navigate('/'), 1500);
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
        <div className="relative z-10">
          <div className="mb-10">
            <img src="/LifeversLogo.png" alt="Lifeverse" className="h-40 w-auto" />
          </div>
          <h2 className="text-4xl font-light text-stone-800 leading-snug mb-4">
            Join the mission.<br />
            <span className="font-semibold text-amber-700">Reach every guest.</span>
          </h2>
          <p className="text-stone-500 text-base leading-relaxed max-w-sm">
            Set up your church in minutes and start engaging first-time visitors with
            AI-powered follow-up that feels warm and personal.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <img src="/LifeverseHeaderMenuLogo.png" alt="Lifeverse" className="h-9 w-auto" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-stone-900 mb-1.5">Create your account</h1>
            <p className="text-sm text-stone-500">Start engaging your visitors with Kingdom Ambassadors.</p>
          </div>

          {success && (
            <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-700">Account created! Redirecting you now&hellip;</p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-xl p-3.5 mb-5">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Pastor Mark Williams"
                className="w-full px-3.5 py-2.5 text-sm text-stone-900 bg-white border border-stone-200 rounded-xl placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-colors"
              />
            </div>

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
              <label className="block text-sm font-medium text-stone-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
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
              {passwordStrength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1">
                    {strengthConfig[passwordStrength].bars.map((filled, i) => (
                      <div
                        key={i}
                        className={`h-1 w-8 rounded-full transition-colors ${
                          filled
                            ? passwordStrength === 'weak'
                              ? 'bg-rose-400'
                              : passwordStrength === 'fair'
                              ? 'bg-amber-400'
                              : 'bg-emerald-500'
                            : 'bg-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${strengthConfig[passwordStrength].color}`}>
                    {strengthConfig[passwordStrength].label}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-sm font-medium py-2.5 rounded-xl transition-colors mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-stone-500 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-amber-700 hover:text-amber-800 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <ChatWidget context="auth" />
    </div>
  );
}
