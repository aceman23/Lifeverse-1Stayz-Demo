import { useRef } from 'react';
import { useOnboarding } from '../../lib/onboarding-context';
import { Upload, FileText, Trash2, ArrowRight, Shield, AlertTriangle, Sliders, Check, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import type { DoctrinalPosition } from '../../data/onboarding';
import { LOCKED_RULES } from '../../data/onboarding';

export function Step5Guardrails() {
  const { state, update } = useOnboarding();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function updatePosition(id: string, patch: Partial<DoctrinalPosition>) {
    update({
      doctrinalPositions: state.doctrinalPositions.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      guardrailsApprovedBy: null,
      guardrailsApprovedAt: null,
    });
  }

  function updateDoc(id: string, patch: Partial<{ name: string; type: string }>) {
    update({ documents: state.documents.map((d) => (d.id === id ? { ...d, ...patch } : d)) });
  }

  function deleteDoc(id: string) {
    update({ documents: state.documents.filter((d) => d.id !== id) });
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const newDocs = Array.from(files).map((f) => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: f.name,
      type: f.name.split('.').pop() || 'txt',
    }));
    update({ documents: [...state.documents, ...newDocs] });
  }

  function toggleEscalation(id: string) {
    update({
      escalationTopics: state.escalationTopics.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e)),
      guardrailsApprovedBy: null,
      guardrailsApprovedAt: null,
    });
  }

  function toggleTone(t: string) {
    if (state.tone.includes(t)) {
      update({ tone: state.tone.filter((x) => x !== t) });
    } else {
      update({ tone: [...state.tone, t] });
    }
  }

  function approveGuardrails() {
    update({
      guardrailsApprovedBy: state.church.yourName || 'Pastor',
      guardrailsApprovedAt: new Date().toISOString(),
    });
  }

  const guardrailsApproved = !!state.guardrailsApprovedBy;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">Guardrails</h2>
        <p className="text-sm text-stone-500 mt-1">
          The most important step. These guardrails keep the assistant aligned with your church's beliefs.
        </p>
      </div>

      {/* Training documents */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-4 h-4 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-800">Training Documents</h3>
        </div>
        <p className="text-xs text-stone-400 mb-4">Upload sermons, policies, core messaging — anything the AI should know.</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-stone-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#10B981] transition-colors mb-3"
        >
          <Upload className="w-6 h-6 text-stone-300" />
          <p className="text-sm text-stone-500">Drop files here or click to browse</p>
          <p className="text-xs text-stone-400">PDF, DOCX, TXT, Markdown</p>
        </div>
        {state.documents.length > 0 && (
          <>
            <div className="space-y-2">
              {state.documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-stone-50/50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={doc.name}
                    onChange={(e) => updateDoc(doc.id, { name: e.target.value })}
                    placeholder="Document name"
                    className="flex-1 text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition placeholder:text-stone-300"
                  />
                  <button
                    onClick={() => deleteDoc(doc.id)}
                    className="p-2 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              We found 9 positions in your documents.
            </p>
          </>
        )}
      </div>

      {/* Doctrinal positions */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-800">Doctrinal Positions</h3>
        </div>
        <p className="text-xs text-stone-400 mb-4">
          For each topic, choose whether your assistant should explain your church's view, route to a pastor, or not discuss it.
        </p>
        <div className="space-y-3">
          {state.doctrinalPositions.map((pos) => (
            <div key={pos.id} className="border border-stone-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-stone-700">{pos.topic}</span>
                <div className="flex items-center gap-1">
                  {(['explain', 'route', 'skip'] as const).map((stance) => (
                    <button
                      key={stance}
                      onClick={() => updatePosition(pos.id, { stance })}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                        pos.stance === stance
                          ? stance === 'explain'
                            ? 'bg-emerald-100 text-emerald-700'
                            : stance === 'route'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-stone-100 text-stone-500'
                          : 'text-stone-400 hover:bg-stone-50'
                      }`}
                    >
                      {stance === 'explain' && 'Explain'}
                      {stance === 'route' && 'Route to pastor'}
                      {stance === 'skip' && "Don't discuss"}
                    </button>
                  ))}
                </div>
              </div>
              {pos.stance === 'explain' && (
                <input
                  type="text"
                  value={pos.wording}
                  onChange={(e) => updatePosition(pos.id, { wording: e.target.value })}
                  placeholder="Approved wording for this topic…"
                  className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition placeholder:text-stone-300"
                />
              )}
              {pos.stance === 'route' && (
                <p className="text-xs text-blue-600 flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3" />
                  Will route to a pastor when this topic comes up
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Locked rules */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-800">Locked Rules</h3>
        </div>
        <p className="text-xs text-stone-400 mb-4">These rules are always on and can't be changed.</p>
        <div className="flex flex-wrap gap-2">
          {LOCKED_RULES.map((rule) => (
            <span key={rule} className="text-xs font-medium px-3.5 py-2 rounded-full bg-stone-100 text-stone-500 border border-stone-200 inline-flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-stone-400" />
              {rule}
            </span>
          ))}
        </div>
      </div>

      {/* Escalation topics */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-800">Escalation Topics</h3>
        </div>
        <p className="text-xs text-stone-400 mb-4">When these come up, the assistant immediately routes to a pastor.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {state.escalationTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => toggleEscalation(topic.id)}
              className={`flex items-center gap-2.5 p-3 rounded-lg border transition-all text-left ${
                topic.enabled
                  ? 'bg-rose-50/50 border-rose-100'
                  : 'bg-white border-stone-200'
              }`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                topic.enabled ? 'border-rose-400 bg-rose-400' : 'border-stone-300'
              }`}>
                {topic.enabled && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
              </div>
              <span className={`text-sm ${topic.enabled ? 'text-stone-700' : 'text-stone-400'}`}>{topic.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Sliders className="w-4 h-4 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-800">Tone</h3>
        </div>
        <p className="text-xs text-stone-400 mb-4">Select one or more tones for your assistant.</p>
        <div className="flex flex-wrap gap-2">
          {['Warm', 'Casual', 'Formal', 'Joyful', 'Pastoral'].map((t) => {
            const selected = state.tone.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleTone(t)}
                className={`text-sm font-medium px-4 py-2 rounded-full border transition-all ${
                  selected
                    ? 'bg-[#10B981]/10 text-[#0d9668] border-[#10B981]/30'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                }`}
              >
                {selected && <Check className="w-3.5 h-3.5 inline mr-1" />}
                {t}
              </button>
            );
          })}
        </div>
        <div className="mt-4">
          <label className="text-xs font-medium text-stone-600 mb-1.5 block">Sign-off</label>
          <input
            type="text"
            value={state.signOff}
            onChange={(e) => update({ signOff: e.target.value })}
            placeholder="The team at Grace Community Church"
            className="w-full text-sm border border-stone-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition placeholder:text-stone-300"
          />
        </div>
      </div>

      {/* Pastor approval */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <h3 className="text-sm font-semibold text-stone-800 mb-4">Pastor Approval</h3>
        {guardrailsApproved ? (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-stone-800">Guardrails approved by {state.guardrailsApprovedBy}</p>
              <p className="text-xs text-stone-400 mt-0.5">
                {state.guardrailsApprovedAt && new Date(state.guardrailsApprovedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={approveGuardrails}
            className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl bg-[#1a2e2a] text-white hover:bg-[#245045] transition-colors"
          >
            <Check className="w-4 h-4" />
            Approve guardrails as pastor
          </button>
        )}
      </div>
    </div>
  );
}
