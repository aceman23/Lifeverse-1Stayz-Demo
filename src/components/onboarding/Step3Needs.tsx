import { useOnboarding } from '../../lib/onboarding-context';
import { NEEDS_LIVE, NEEDS_SOON } from '../../data/onboarding';
import { Check } from 'lucide-react';

export function Step3Needs() {
  const { state, update } = useOnboarding();

  function toggleNeed(label: string) {
    if (state.needs.includes(label)) {
      update({ needs: state.needs.filter((n) => n !== label) });
    } else {
      update({ needs: [...state.needs, label] });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">What You Need</h2>
        <p className="text-sm text-stone-500 mt-1">
          Choose what you want 1Stayz to handle during the pilot. We'll focus on the essentials first.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <h3 className="text-sm font-semibold text-stone-800 mb-1">Available now</h3>
        <p className="text-xs text-stone-400 mb-4">These are ready to go on day one.</p>
        <div className="space-y-2.5">
          {NEEDS_LIVE.map((need) => {
            const selected = state.needs.includes(need.label);
            return (
              <button
                key={need.label}
                onClick={() => toggleNeed(need.label)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                  selected
                    ? 'bg-[#10B981]/5 border-[#10B981]/30'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <span className="text-xl">{need.emoji}</span>
                <span className="text-sm text-stone-700 flex-1">{need.label}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selected ? 'border-[#10B981] bg-[#10B981]' : 'border-stone-300'
                }`}>
                  {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <h3 className="text-sm font-semibold text-stone-800 mb-1">Coming soon</h3>
        <p className="text-xs text-stone-400 mb-4">Select any you'd like us to prioritize.</p>
        <div className="space-y-2.5">
          {NEEDS_SOON.map((need) => {
            const selected = state.needs.includes(need.label);
            return (
              <button
                key={need.label}
                onClick={() => toggleNeed(need.label)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                  selected
                    ? 'bg-[#10B981]/5 border-[#10B981]/30'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <span className="text-xl">{need.emoji}</span>
                <span className="text-sm text-stone-700 flex-1">{need.label}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selected ? 'border-[#10B981] bg-[#10B981]' : 'border-stone-300'
                }`}>
                  {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <label className="text-xs font-medium text-stone-600 mb-1.5 block">Anything else you'd like 1Stayz to do?</label>
        <input
          type="text"
          value={state.otherNeed}
          onChange={(e) => update({ otherNeed: e.target.value })}
          placeholder="Type a need not listed above…"
          className="w-full text-sm border border-stone-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition placeholder:text-stone-300"
        />
      </div>
    </div>
  );
}
