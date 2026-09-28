import { useState } from 'react';
import { useOnboarding } from '../../lib/onboarding-context';
import { Check, Send, Eye, Edit3, AlertCircle, CheckCircle2 } from 'lucide-react';

export function Step7Message() {
  const { state, update } = useOnboarding();
  const [editing, setEditing] = useState(false);
  const [customBody, setCustomBody] = useState('');

  const template = state.templates.find((t) => t.id === state.selectedTemplate) ?? state.templates[0];
  const previewBody = customBody || template.body;

  function fillTemplate(text: string): string {
    return text
      .replace(/\{first_name\}/g, 'Sarah')
      .replace(/\{church_name\}/g, state.church.name || 'Grace Community Church')
      .replace(/\{kids_ministry\}/g, 'Kids Ministry');
  }

  function handleApprove() {
    if (customBody) {
      update({
        templates: [...state.templates.filter((t) => t.id !== 'custom'), { id: 'custom', name: 'Custom', body: customBody }],
        selectedTemplate: 'custom',
      });
    }
    update({
      firstMessageApproved: true,
      firstMessageApprovedBy: state.church.yourName || 'Admin',
      firstMessageApprovedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">First Message</h2>
        <p className="text-sm text-stone-500 mt-1">
          Your first message sets the tone for every conversation. Pick a template, make it yours, and send it to your pastor for approval.
        </p>
      </div>

      {/* Template picker */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <h3 className="text-sm font-semibold text-stone-800 mb-4">Choose a template</h3>
        <div className="space-y-2.5">
          {state.templates.map((t) => {
            const selected = state.selectedTemplate === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  update({ selectedTemplate: t.id });
                  setCustomBody('');
                  setEditing(false);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected
                    ? 'bg-[#10B981]/5 border-[#10B981]/30'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-stone-700">{t.name}</span>
                  {selected && (
                    <div className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <p className="text-xs text-stone-400 line-clamp-2">{t.body}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Edit / preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-stone-400" />
              <h3 className="text-sm font-semibold text-stone-800">Edit message</h3>
            </div>
            <button
              onClick={() => {
                setEditing(!editing);
                if (!editing) setCustomBody(template.body);
              }}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                editing
                  ? 'bg-[#10B981]/10 text-[#0d9668]'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {editing ? 'Done editing' : 'Edit'}
            </button>
          </div>
          {editing ? (
            <textarea
              value={customBody}
              onChange={(e) => setCustomBody(e.target.value)}
              rows={8}
              className="w-full text-sm border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition resize-none leading-relaxed"
            />
          ) : (
            <div className="bg-stone-50/50 rounded-xl p-4">
              <p className="text-sm text-stone-600 leading-relaxed">{previewBody}</p>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {['{first_name}', '{church_name}', '{kids_ministry}'].map((tag) => (
              <span key={tag} className="text-[10px] font-mono bg-stone-100 text-stone-500 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Phone preview */}
        <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-stone-400" />
            <h3 className="text-sm font-semibold text-stone-800">Preview on phone</h3>
          </div>
          <div className="mx-auto max-w-[260px]">
            <div className="bg-stone-900 rounded-[2rem] p-3 shadow-lg">
              <div className="bg-white rounded-[1.5rem] overflow-hidden">
                <div className="bg-stone-100 px-4 py-2.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-700">1Stayz</span>
                  <span className="text-[10px] text-stone-400">now</span>
                </div>
                <div className="px-4 py-6 min-h-[280px] flex flex-col justify-end">
                  <div className="bg-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%]">
                    <p className="text-sm text-stone-800 leading-relaxed">{fillTemplate(previewBody)}</p>
                    <p className="text-[10px] text-stone-400 mt-1.5">Delivered · 10:32 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Send className="w-4 h-4 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-800">Pastor Approval</h3>
        </div>
        {state.firstMessageApproved ? (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-stone-800">Approved by {state.firstMessageApprovedBy}</p>
              <p className="text-xs text-stone-400 mt-0.5">
                {state.firstMessageApprovedAt && new Date(state.firstMessageApprovedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Your first message needs to be approved before you can go live. Send it to your pastor for review, or approve it yourself if you're the senior pastor.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleApprove}
                className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl bg-[#1a2e2a] text-white hover:bg-[#245045] transition-colors"
              >
                <Check className="w-4 h-4" />
                Approve message
              </button>
              <button className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors">
                <Send className="w-4 h-4" />
                Send to pastor for review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
