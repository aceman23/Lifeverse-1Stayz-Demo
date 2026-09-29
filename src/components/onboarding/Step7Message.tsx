import { useState } from 'react';
import { useOnboarding } from '../../lib/onboarding-context';
import { Check, Send, Eye, Edit3, AlertCircle, CheckCircle2, Clock, Copy } from 'lucide-react';
import { CONSENT_WORDING } from '../../data/onboarding';

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const dh = h % 12 || 12;
  return `${dh}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function Step7Message() {
  const { state, update } = useOnboarding();
  const [editing, setEditing] = useState(false);
  const [customBody, setCustomBody] = useState('');
  const [copied, setCopied] = useState(false);

  const template = state.templates.find((t) => t.id === state.selectedTemplate) ?? state.templates[0];
  const previewBody = customBody || template.body;
  const isSeniorPastor = state.church.yourRole === 'Senior Pastor';
  const firstService = state.serviceSchedule[0];
  const sendByTime = firstService ? formatTime(addMinutes(firstService.endTime, 30)) : '—';

  function fillTemplate(text: string): string {
    return text
      .replace(/\{first_name\}/g, 'Sarah')
      .replace(/\{last_name\}/g, 'Johnson')
      .replace(/\{church_name\}/g, state.church.name || 'Grace Community Church')
      .replace(/\{kids_ministry\}/g, 'Kids Ministry')
      .replace(/\{service_name\}/g, firstService?.name || 'Sunday Morning');
  }

  function clearApproval() {
    update({
      firstMessageStatus: 'draft',
      firstMessageApprovedBy: null,
      firstMessageApprovedAt: null,
    });
  }

  function handleEditToggle() {
    if (!editing) {
      setCustomBody(template.body);
      clearApproval();
    }
    setEditing(!editing);
  }

  function handleSelectTemplate(id: string) {
    update({ selectedTemplate: id });
    setCustomBody('');
    setEditing(false);
    clearApproval();
  }

  function handleApproveAsPastor() {
    if (customBody) {
      update({
        templates: [...state.templates.filter((t) => t.id !== 'custom'), { id: 'custom', name: 'Custom', body: customBody }],
        selectedTemplate: 'custom',
      });
    }
    update({
      firstMessageStatus: 'approved',
      firstMessageApprovedBy: state.church.yourName || 'Pastor',
      firstMessageApprovedAt: new Date().toISOString(),
    });
  }

  function handleSendForApproval() {
    if (customBody) {
      update({
        templates: [...state.templates.filter((t) => t.id !== 'custom'), { id: 'custom', name: 'Custom', body: customBody }],
        selectedTemplate: 'custom',
      });
    }
    update({ firstMessageStatus: 'awaiting' });
  }

  function handleSimulateApproval() {
    update({
      firstMessageStatus: 'approved',
      firstMessageApprovedBy: state.church.yourName || 'Pastor',
      firstMessageApprovedAt: new Date().toISOString(),
    });
  }

  function copyConsent() {
    const text = CONSENT_WORDING.replace(/\{church_name\}/g, state.church.name || 'Grace Community Church');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const consentText = CONSENT_WORDING.replace(/\{church_name\}/g, state.church.name || 'Grace Community Church');
  const status = state.firstMessageStatus;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">First Message</h2>
        <p className="text-sm text-stone-500 mt-1">
          Your first message sets the tone for every conversation. Pick a template, make it yours, and get it approved.
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
                onClick={() => handleSelectTemplate(t.id)}
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
              onClick={handleEditToggle}
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
            {['{first_name}', '{last_name}', '{church_name}', '{kids_ministry}', '{service_name}'].map((tag) => (
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
                  <span className="text-[10px] text-stone-400">
                    {firstService ? formatTime(addMinutes(firstService.endTime, 30)) : 'now'}
                  </span>
                </div>
                <div className="px-4 py-6 min-h-[280px] flex flex-col justify-end">
                  <div className="bg-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%]">
                    <p className="text-sm text-stone-800 leading-relaxed">{fillTemplate(previewBody)}</p>
                    <p className="text-[10px] text-stone-400 mt-1.5">
                      Delivered · {firstService ? formatTime(addMinutes(firstService.endTime, 30)) : '10:32 AM'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {firstService && (
            <p className="text-xs text-stone-400 mt-3 text-center">
              Sends within 30 min after {firstService.name} ends (by {sendByTime})
            </p>
          )}
        </div>
      </div>

      {/* Consent wording */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-stone-800">Connection Card Consent Wording</h3>
          <button
            onClick={copyConsent}
            className="text-xs font-medium text-stone-500 hover:text-stone-700 inline-flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="bg-stone-50/50 rounded-xl p-4">
          <p className="text-xs text-stone-500 leading-relaxed">{consentText}</p>
        </div>
      </div>

      {/* Approval */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Send className="w-4 h-4 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-800">Pastor Approval</h3>
        </div>

        {status === 'approved' ? (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-stone-800">Approved by {state.firstMessageApprovedBy}</p>
              <p className="text-xs text-stone-400 mt-0.5">
                {state.firstMessageApprovedAt && new Date(state.firstMessageApprovedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : status === 'awaiting' ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-stone-700">Awaiting pastor approval</p>
                <p className="text-xs text-stone-400 mt-0.5">Sent to your pastor for review.</p>
              </div>
            </div>
            <button
              onClick={handleSimulateApproval}
              className="text-xs font-medium text-[#10B981] hover:text-[#0d9668] underline"
            >
              Simulate pastor approval
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Your first message needs to be approved before you can go live.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {isSeniorPastor ? (
                <button
                  onClick={handleApproveAsPastor}
                  className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl bg-[#1a2e2a] text-white hover:bg-[#245045] transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Approve as pastor
                </button>
              ) : (
                <button
                  onClick={handleSendForApproval}
                  className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl bg-[#1a2e2a] text-white hover:bg-[#245045] transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send to pastor for approval
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
