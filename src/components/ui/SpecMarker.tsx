import { useSpecMode } from '../../lib/spec-mode-context';
import { SPEC_DATA, type SpecEntry } from '../../data/spec';
import { X, Copy, Check, List } from 'lucide-react';
import { useState, useEffect, type ReactNode } from 'react';

interface SpecMarkerProps {
  id: string;
  children: ReactNode;
}

export function SpecMarker({ id, children }: SpecMarkerProps) {
  const { specMode, setActiveSpecId, registerId, unregisterId } = useSpecMode();

  useEffect(() => {
    registerId(id);
    return () => unregisterId(id);
  }, [id, registerId, unregisterId]);

  if (!specMode) return <>{children}</>;

  const entry = SPEC_DATA[id];
  if (!entry) return <>{children}</>;

  return (
    <div className="relative">
      <div className="absolute -top-2 -right-2 z-30">
        <button
          onClick={() => setActiveSpecId(id)}
          className="w-6 h-6 rounded-full bg-[#6366F1] text-white text-[10px] font-bold flex items-center justify-center shadow-md hover:scale-110 transition-transform ring-2 ring-white"
          title={entry.title}
        >
          {entry.cards[0] ?? '?'}
        </button>
      </div>
      <div className="rounded-xl outline-dashed outline-1 outline-[#6366F1]/50 outline-offset-2">
        {children}
      </div>
    </div>
  );
}

export function SpecModeToggle() {
  const { specMode, toggle } = useSpecMode();
  return (
    <button
      onClick={toggle}
      className={`fixed bottom-4 left-4 z-50 text-xs font-medium px-3 py-2 rounded-full shadow-lg transition-all flex items-center gap-1.5 ${
        specMode
          ? 'bg-[#6366F1] text-white'
          : 'bg-white text-stone-500 border border-stone-200 hover:border-stone-300'
      }`}
      title="Toggle spec mode (Shift+S)"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${specMode ? 'bg-white' : 'bg-[#6366F1]'}`} />
      Spec mode
    </button>
  );
}

export function SpecPanel() {
  const { specMode, activeSpecId, setActiveSpecId, registeredIds } = useSpecMode();
  const [copied, setCopied] = useState(false);
  if (!specMode || !activeSpecId) return null;

  const entry: SpecEntry | undefined = SPEC_DATA[activeSpecId];
  if (!entry) return null;
  const e: SpecEntry = entry;

  const scopeColors: Record<string, string> = {
    'Pilot': 'bg-emerald-100 text-emerald-700',
    'Pilot-lite': 'bg-blue-100 text-blue-700',
    'Later': 'bg-stone-100 text-stone-500',
  };

  function copyMarkdown() {
    const md = `## ${e.title}\n\n- **Scope:** ${e.scope}\n- **Cards:** ${e.cards.join(', ')}\n- **Reads:** ${(e.reads ?? []).join(', ') || '—'}\n- **Writes:** ${(e.writes ?? []).join(', ') || '—'}\n- **Rules:**\n${e.rules.map((r: string) => `  - ${r}`).join('\n')}\n- **Done when:** ${e.doneWhen}${e.demoGap ? `\n- **Demo gap:** ${e.demoGap}` : ''}`;
    navigator.clipboard?.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setActiveSpecId(null)} />
      <div className="fixed top-14 right-0 bottom-0 w-[380px] bg-white border-l border-stone-200 shadow-2xl z-40 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${scopeColors[e.scope]}`}>
              {e.scope}
            </span>
            <h3 className="text-sm font-semibold text-stone-800">{e.title}</h3>
          </div>
          <button onClick={() => setActiveSpecId(null)} className="text-stone-300 hover:text-stone-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          {e.cards.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1.5">Card IDs</p>
              <div className="flex flex-wrap gap-1.5">
                {e.cards.map((card: string) => (
                  <span key={card} className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-1 rounded">{card}</span>
                ))}
              </div>
            </div>
          )}
          {(e.reads && e.reads.length > 0) || (e.writes && e.writes.length > 0) ? (
            <div>
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1.5">Reads / Writes</p>
              <div className="flex flex-wrap gap-1.5">
                {e.reads?.map((r: string) => (
                  <span key={r} className="text-[10px] font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded">R: {r}</span>
                ))}
                {e.writes?.map((w: string) => (
                  <span key={w} className="text-[10px] font-mono bg-emerald-50 text-emerald-600 px-2 py-1 rounded">W: {w}</span>
                ))}
              </div>
            </div>
          ) : null}
          <div>
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1.5">Server rules</p>
            <ul className="space-y-1.5">
              {e.rules.map((rule: string, i: number) => (
                <li key={i} className="text-xs text-stone-600 flex items-start gap-2">
                  <span className="text-stone-300 mt-0.5">•</span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1.5">Done when</p>
            <p className="text-xs text-stone-600 leading-relaxed">{e.doneWhen}</p>
          </div>
          {e.demoGap && (
            <div>
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1.5">Demo gap</p>
              <p className="text-xs text-amber-600 leading-relaxed">{e.demoGap}</p>
            </div>
          )}
          <button
            onClick={copyMarkdown}
            className="w-full inline-flex items-center justify-center gap-2 text-xs font-medium px-4 py-2.5 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy as Markdown'}
          </button>

          {registeredIds.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <List className="w-3 h-3" />
                Spec: this screen
              </p>
              <div className="space-y-1">
                {registeredIds.map((rid) => {
                  const rEntry = SPEC_DATA[rid];
                  return (
                    <button
                      key={rid}
                      onClick={() => setActiveSpecId(rid)}
                      className={`w-full text-left text-xs px-2.5 py-2 rounded-lg transition-colors ${
                        rid === activeSpecId
                          ? 'bg-[#6366F1]/10 text-[#6366F1] font-medium'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {rEntry?.cards[0] ? <span className="font-mono text-[10px] text-stone-400 mr-1.5">{rEntry.cards[0]}</span> : null}
                      {rEntry?.title ?? rid}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
