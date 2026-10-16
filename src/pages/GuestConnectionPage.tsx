import { FormEvent, useMemo, useState } from 'react';
import { CheckCircle2, Download, Loader2, ShieldCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PublicLayout } from '../components/public/PublicLayout';

const CONSENT_WORDING_VERSION = '2026-10-16-v1';

function titleFromSlug(slug: string): string {
  if (slug === 'grace-community-church') return 'Grace Community Church';
  return slug.split('-').filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Your Church';
}

export function GuestConnectionPage() {
  const { churchSlug = 'grace-community-church' } = useParams();
  const churchName = useMemo(() => titleFromSlug(churchSlug), [churchSlug]);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', mobile: '', whichService: '' });
  const [smsConsent, setSmsConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (smsConsent && !form.mobile.trim()) {
      setError('Add a mobile number if you would like to receive text messages.');
      return;
    }
    setStatus('saving');
    const { error: insertError } = await supabase.from('public_guest_connections').insert({
      church_slug: churchSlug,
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      mobile: form.mobile.trim() || null,
      which_service: form.whichService,
      sms_consent: smsConsent,
      sms_consent_at: smsConsent ? new Date().toISOString() : null,
      consent_wording_version: CONSENT_WORDING_VERSION,
    });
    if (insertError) {
      setStatus('error');
      setError('We could not save your card right now. Please try again or speak with someone at the welcome desk.');
      return;
    }
    setStatus('success');
  }

  if (status === 'success') {
    return <PublicLayout><div className="mx-auto max-w-xl px-5 py-20 text-center sm:py-28"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E7F4F1] text-[#018477]"><CheckCircle2 className="h-8 w-8" /></div><h1 className="mt-6 text-4xl font-semibold tracking-tight">Thanks for connecting.</h1><p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#6B6F76]">Someone from {churchName} will follow up with you soon. We’re glad you joined us.</p><Link to="/" className="mt-8 inline-flex rounded-full bg-[#10151A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#26343A]">Back to 1Stayz</Link></div></PublicLayout>;
  }

  return <PublicLayout><div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:py-20"><div className="lg:pt-10"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#017A6E]">Guest connection card</p><h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">We’re glad you’re here.</h1><p className="mt-5 max-w-md text-base leading-7 text-[#6B6F76]">Share a few details so {churchName} can thank you, answer questions, and help you find your next step.</p><div className="mt-8 flex items-start gap-3 text-sm text-[#6B6F76]"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#018477]" /><span>Your information goes to {churchName} for guest follow-up.</span></div><a href={`/connect/${churchSlug}/card.pdf`} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#017A6E] hover:text-[#10151A]"><Download className="h-4 w-4" /> Printable connection card</a></div><form onSubmit={handleSubmit} className="rounded-3xl border border-[#D8DDDC] bg-white p-6 shadow-[0_20px_50px_rgba(16,21,26,0.06)] sm:p-8"><div className="mb-7"><h2 className="text-xl font-semibold text-[#10151A]">{churchName}</h2><p className="mt-1 text-sm text-[#6B6F76]">All fields except mobile are required.</p></div><div className="grid gap-4 sm:grid-cols-2"><Field label="First name" value={form.firstName} onChange={(value) => updateField('firstName', value)} required /><Field label="Last name" value={form.lastName} onChange={(value) => updateField('lastName', value)} required /></div><div className="mt-4 space-y-4"><Field label="Email" type="email" value={form.email} onChange={(value) => updateField('email', value)} required /><Field label="Mobile (optional)" type="tel" value={form.mobile} onChange={(value) => updateField('mobile', value)} /><label className="flex items-start gap-3 rounded-2xl border border-[#D8DDDC] bg-[#F7FAF9] p-4"><input type="checkbox" checked={smsConsent} onChange={(event) => setSmsConsent(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-[#A3AAAC] accent-[#018477]" /><span className="text-xs leading-5 text-[#6B6F76]">Yes, text me. By checking this box, you agree to receive text messages from {churchName}, sent by 1Stayz on the church's behalf, about your visit and next steps. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help. <Link to="/privacy" className="font-medium text-[#017A6E] underline">Privacy Policy</Link> · <Link to="/terms" className="font-medium text-[#017A6E] underline">Terms</Link></span></label><label className="block"><span className="mb-1.5 block text-sm font-medium text-[#26343A]">Which service did you attend?</span><select value={form.whichService} onChange={(event) => updateField('whichService', event.target.value)} required className="w-full rounded-xl border border-[#D8DDDC] bg-white px-3.5 py-3 text-sm text-[#26343A] outline-none focus:border-[#018477] focus:ring-2 focus:ring-[#018477]/15"><option value="">Select a service</option><option>First service</option><option>Second service</option><option>Online service</option><option>Other</option></select></label></div>{error && <p className="mt-4 rounded-xl border border-[#F2C7CE] bg-[#FDF1F2] px-3.5 py-3 text-sm text-[#9F1239]">{error}</p>}<button type="submit" disabled={status === 'saving'} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#018477] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#016F65] disabled:cursor-not-allowed disabled:bg-[#A3AAAC]">{status === 'saving' && <Loader2 className="h-4 w-4 animate-spin" />}{status === 'saving' ? 'Saving your card…' : 'Submit connection card'}</button><p className="mt-4 text-center text-xs leading-5 text-[#A3AAAC]">Submitting without checking the box is completely okay. Texting is optional.</p></form></div></PublicLayout>;
}

function Field({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium text-[#26343A]">{label}{required && <span className="text-[#C8102E]"> *</span>}</span><input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-[#D8DDDC] px-3.5 py-3 text-sm text-[#26343A] outline-none transition focus:border-[#018477] focus:ring-2 focus:ring-[#018477]/15" /></label>;
}
