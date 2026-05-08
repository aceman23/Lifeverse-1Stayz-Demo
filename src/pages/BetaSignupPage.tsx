import { useState, useRef } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CHURCH_SIZES = ['Under 100', '100–300', '300–500', '500–1,000', '1,000+'];

export function BetaSignupPage() {
  const [form, setForm] = useState({
    name: '',
    church: '',
    role: '',
    email: '',
    phone: '',
    church_size: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setSubmitting(true);
    const { error: insertError } = await supabase.from('beta_signups').insert({
      name: form.name.trim(),
      church: form.church.trim(),
      role: form.role.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      church_size: form.church_size,
      notes: form.notes.trim(),
    });
    setSubmitting(false);
    if (insertError) {
      setError('Something went wrong. Please try again.');
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">You're In!</h1>
          <p className="text-stone-500 max-w-xs mx-auto">
            Thanks for signing up for the 1Stayz beta. We'll be in touch soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/LVHI_1Stayz.png" alt="1Stayz" className="h-30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-900 leading-tight">Join the Beta</h1>
          <p className="text-sm text-stone-500 mt-1">Help us build the future of visitor follow-up.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-stone-100 p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Name *</label>
            <input
              ref={nameRef}
              autoFocus
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@church.org"
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Church</label>
              <input
                name="church"
                type="text"
                value={form.church}
                onChange={handleChange}
                placeholder="Church name"
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Role</label>
              <input
                name="role"
                type="text"
                value={form.role}
                onChange={handleChange}
                placeholder="Pastor, Admin..."
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Phone</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Church Size</label>
              <select
                name="church_size"
                value={form.church_size}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition appearance-none bg-white"
              >
                <option value="">Select...</option>
                {CHURCH_SIZES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Anything you'd like us to know..."
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition resize-none"
            />
          </div>

          {error && <p className="text-xs text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Join the Beta'
            )}
          </button>
        </form>

        <div className="flex flex-col items-center mt-6">
          <img src="/LifeversLogo.png" alt="Lifeverse Holdings" className="h-16 w-auto opacity-60" />
        </div>
      </div>
    </div>
  );
}
