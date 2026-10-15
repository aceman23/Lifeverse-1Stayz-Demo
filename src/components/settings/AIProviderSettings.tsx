import { useEffect, useState } from 'react';
import { Bot, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../../lib/auth';

type Provider = 'openai' | 'anthropic' | 'google';

interface ProviderOption {
  id: Provider;
  name: string;
  description: string;
  models: string[];
  accent: string;
}

interface SavedProvider {
  provider: Provider;
  model: string;
  key_last4: string;
  enabled: boolean;
}

const PROVIDERS: ProviderOption[] = [
  { id: 'openai', name: 'ChatGPT', description: 'OpenAI models for fast, flexible answers.', models: ['gpt-4o-mini', 'gpt-4o'], accent: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { id: 'anthropic', name: 'Claude', description: 'Anthropic models for thoughtful, long-form responses.', models: ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest'], accent: 'bg-orange-50 text-orange-700 border-orange-100' },
  { id: 'google', name: 'Gemini', description: 'Google models for quick, multimodal assistance.', models: ['gemini-2.0-flash', 'gemini-1.5-pro'], accent: 'bg-blue-50 text-blue-700 border-blue-100' },
];

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-settings`;

export function AIProviderSettings() {
  const { session, demoMode } = useAuth();
  const [selected, setSelected] = useState<Provider>('openai');
  const [model, setModel] = useState(PROVIDERS[0].models[0]);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState<SavedProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const provider = PROVIDERS.find((item) => item.id === selected) ?? PROVIDERS[0];
  const authHeaders: Record<string, string> = session
    ? { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' }
    : {};

  useEffect(() => {
    if (!session || demoMode) {
      setLoading(false);
      return;
    }
    fetch(FUNCTION_URL, { headers: authHeaders })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !Array.isArray(data)) throw new Error(data.error ?? 'Could not load settings.');
        setSaved(data as SavedProvider[]);
        if (data[0]) {
          setSelected(data[0].provider);
          setModel(data[0].model);
        }
      })
      .catch(() => setError('Could not load your AI provider settings.'))
      .finally(() => setLoading(false));
  }, [demoMode, session]);

  function selectProvider(next: Provider) {
    const nextProvider = PROVIDERS.find((item) => item.id === next) ?? PROVIDERS[0];
    const existing = saved.find((item) => item.provider === next);
    setSelected(next);
    setModel(existing?.model ?? nextProvider.models[0]);
    setApiKey('');
    setMessage('');
    setError('');
  }

  async function saveProvider() {
    setMessage('');
    setError('');
    if (!session || demoMode) {
      setError('Sign in to save provider credentials.');
      return;
    }
    if (apiKey.trim().length < 12) {
      setError('Enter an API key to connect this provider.');
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ provider: selected, model, apiKey }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not save provider.');
      setSaved((current) => [...current.filter((item) => item.provider !== selected), { provider: selected, model, key_last4: data.keyLast4, enabled: true }]);
      setApiKey('');
      setMessage(`${provider.name} is connected. Your key is stored securely.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save this provider.');
    } finally {
      setSaving(false);
    }
  }

  async function removeProvider(providerId: Provider) {
    if (!session || demoMode) return;
    setError('');
    try {
      const response = await fetch(FUNCTION_URL, {
        method: 'DELETE',
        headers: authHeaders,
        body: JSON.stringify({ provider: providerId }),
      });
      if (!response.ok) throw new Error('Could not remove provider.');
      setSaved((current) => current.filter((item) => item.provider !== providerId));
      setMessage('Provider removed.');
    } catch {
      setError('Could not remove this provider.');
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-semibold text-stone-900">AI assistant providers</h2>
        </div>
        <p className="text-sm text-stone-500 mt-1">Connect ChatGPT, Claude, or Gemini to power Ask 1Stayz.</p>
      </div>

      {demoMode && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Demo mode lets you preview the interface. Sign in to save provider credentials and use a live AI assistant.
        </div>
      )}
      {error && <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-700">{error}</div>}
      {message && <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">{message}</div>}

      <div className="grid gap-3 sm:grid-cols-3">
        {PROVIDERS.map((item) => {
          const connected = saved.some((entry) => entry.provider === item.id);
          return (
            <button key={item.id} onClick={() => selectProvider(item.id)} className={`text-left rounded-2xl border p-4 transition-all ${selected === item.id ? 'border-teal-400 bg-teal-50/50 shadow-sm' : 'border-stone-100 bg-white hover:border-stone-200'}`}>
              <div className="flex items-start justify-between gap-2">
                <span className={`inline-flex rounded-lg border px-2 py-1 text-[11px] font-semibold ${item.accent}`}>{item.name}</span>
                {connected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </div>
              <p className="text-xs text-stone-500 leading-relaxed mt-3">{item.description}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <KeyRound className="w-4 h-4 text-stone-400" />
          <div>
            <h3 className="text-sm font-semibold text-stone-800">Connect {provider.name}</h3>
            <p className="text-xs text-stone-400 mt-0.5">Your key is only used on the server to call {provider.name}.</p>
          </div>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-stone-600">Model</span>
            <select value={model} onChange={(event) => setModel(event.target.value)} className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100">
              {provider.models.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-stone-600">API key</span>
            <div className="relative mt-1.5">
              <input type={showKey ? 'text' : 'password'} value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder={saved.some((item) => item.provider === selected) ? 'Enter a new key to replace the saved key' : 'Paste your provider API key'} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 pr-10 text-sm text-stone-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
              <button type="button" onClick={() => setShowKey((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700" aria-label={showKey ? 'Hide API key' : 'Show API key'}>
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </label>
          <button onClick={saveProvider} disabled={saving || loading || demoMode} className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving…' : 'Save provider'}
          </button>
        </div>
      </div>

      {saved.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-800 mb-3">Connected providers</h3>
          <div className="space-y-2">
            {saved.map((item) => {
              const name = PROVIDERS.find((option) => option.id === item.provider)?.name ?? item.provider;
              return <div key={item.provider} className="flex items-center justify-between rounded-xl bg-stone-50 px-3.5 py-3"><div><p className="text-sm font-medium text-stone-700">{name}</p><p className="text-xs text-stone-400">{item.model} · key ending in {item.key_last4}</p></div><button onClick={() => removeProvider(item.provider)} className="text-stone-400 hover:text-rose-600" aria-label={`Remove ${name}`}><Trash2 className="w-4 h-4" /></button></div>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
