import { ClipboardList, Globe, Smartphone, QrCode, ArrowDownToLine, RefreshCw } from 'lucide-react';
import { SourceCard } from '../components/ingestion/SourceCard';
import { SubmissionFeed } from '../components/ingestion/SubmissionFeed';
import type { Submission } from '../components/ingestion/SubmissionFeed';

const sources = [
  {
    icon: ClipboardList,
    label: 'Connection Cards',
    count: 214,
    trend: '+18 this Sunday',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    status: 'active' as const,
    lastSync: '3 min ago',
  },
  {
    icon: Globe,
    label: 'Online Registrations',
    count: 89,
    trend: '+7 this week',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    status: 'active' as const,
    lastSync: '1 min ago',
  },
  {
    icon: Smartphone,
    label: 'Check-in Kiosk',
    count: 341,
    trend: '+43 this Sunday',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    status: 'active' as const,
    lastSync: 'Just now',
  },
  {
    icon: QrCode,
    label: 'QR Walk-up Forms',
    count: 67,
    trend: '+5 this week',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    status: 'active' as const,
    lastSync: '8 min ago',
  },
];

const submissions: Submission[] = [
  { id: '1', name: 'Marcus Okafor', email: 'marcus.o@gmail.com', phone: '(214) 555-0132', source: 'Connection Card', status: 'processed', timestamp: '2 min ago', service: 'Sunday 9AM', tags: ['first_time_guest', 'brought_kids'] },
  { id: '2', name: 'Priya Sharma', email: 'p.sharma@outlook.com', phone: '(214) 555-0189', source: 'Online Form', status: 'processed', timestamp: '5 min ago', service: 'Sunday 11AM', tags: ['returning_guest', 'college_student'] },
  { id: '3', name: 'Deon Williams', email: 'deon.w@gmail.com', phone: '(469) 555-0244', source: 'Check-in Kiosk', status: 'processed', timestamp: '11 min ago', service: 'Sunday 9AM', tags: ['first_time_guest'] },
  { id: '4', name: 'Sandra Osei', email: 'sandra.osei@yahoo.com', phone: '(972) 555-0371', source: 'QR Walk-up', status: 'pending', timestamp: '14 min ago', service: 'Sunday 11AM', tags: ['recently_moved'] },
  { id: '5', name: 'James Harrington', email: 'jharrington@email.com', phone: '(214) 555-0512', source: 'Connection Card', status: 'processed', timestamp: '22 min ago', service: 'Sunday 9AM', tags: ['single_parent', 'brought_kids'] },
  { id: '6', name: 'Amara Diallo', email: 'amara.d@gmail.com', phone: '(469) 555-0618', source: 'Online Form', status: 'processed', timestamp: '31 min ago', service: 'Saturday 6PM', tags: ['first_time_guest', 'evening_service'] },
  { id: '7', name: 'Tyler Brook', email: 'tyler.b@outlook.com', phone: '(214) 555-0723', source: 'Check-in Kiosk', status: 'error', timestamp: '45 min ago', service: 'Sunday 11AM', tags: [] },
  { id: '8', name: 'Chen Wei', email: 'c.wei2024@email.com', phone: '(972) 555-0819', source: 'Connection Card', status: 'processed', timestamp: '58 min ago', service: 'Sunday 9AM', tags: ['first_time_guest', 'recently_moved'] },
  { id: '9', name: 'Fatima Al-Rasheed', email: 'fatima.ar@gmail.com', phone: '(214) 555-0927', source: 'QR Walk-up', status: 'processed', timestamp: '1h 12m ago', service: 'Sunday 11AM', tags: ['has_family'] },
  { id: '10', name: 'Robert Castillo', email: 'r.castillo@yahoo.com', phone: '(469) 555-1043', source: 'Online Form', status: 'pending', timestamp: '1h 34m ago', service: 'Saturday 6PM', tags: ['returning_guest', 'evening_service'] },
];

const stats = [
  { label: 'Submitted Today', value: '711', delta: '+47 this week' },
  { label: 'Successfully Processed', value: '697', delta: '98.0% success rate' },
  { label: 'Pending Review', value: '11', delta: '3 need attention' },
  { label: 'Integration Errors', value: '3', delta: '0.4% error rate' },
];

const fieldMapping = [
  { formField: 'Full Name', systemField: 'first_name + last_name', confidence: 100 },
  { formField: 'Email Address', systemField: 'email', confidence: 100 },
  { formField: 'Mobile Number', systemField: 'phone', confidence: 100 },
  { formField: 'Service Attended', systemField: 'service_attended', confidence: 98 },
  { formField: 'Prayer Request', systemField: 'ai_memory.prayer_requests', confidence: 94 },
  { formField: 'How Did You Hear', systemField: 'segmentation_tags[]', confidence: 91 },
  { formField: 'Children Names / Ages', systemField: 'family_details.children', confidence: 88 },
  { formField: 'Contact Preference', systemField: 'preferred_channel', confidence: 96 },
];

export function IngestionPage() {
  return (
    <div className="pt-14 min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Ingestion Service</h1>
            <p className="text-sm text-stone-500 mt-1">
              Church forms and check-ins flowing into the agentic AI digital assistants pipeline
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-xl px-4 py-2 transition-colors shadow-sm hover:shadow">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 text-sm text-white bg-amber-500 hover:bg-amber-600 rounded-xl px-4 py-2 transition-colors shadow-sm hover:shadow">
              <ArrowDownToLine className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
              <p className="text-2xl font-semibold text-stone-900">{s.value}</p>
              <p className="text-sm text-stone-500 mt-0.5">{s.label}</p>
              <p className="text-xs text-stone-400 mt-2">{s.delta}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {sources.map((src) => (
            <SourceCard key={src.label} {...src} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2">
            <SubmissionFeed submissions={submissions} />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-50">
                <h3 className="text-sm font-semibold text-stone-900">Field Mapping</h3>
                <p className="text-xs text-stone-400 mt-0.5">Form fields → system fields</p>
              </div>
              <div className="divide-y divide-stone-50">
                {fieldMapping.map((f) => (
                  <div key={f.formField} className="px-5 py-2.5 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-700 truncate">{f.formField}</p>
                      <p className="text-[11px] text-stone-400 truncate font-mono">{f.systemField}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5">
                      <div className="w-12 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-400"
                          style={{ width: `${f.confidence}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-stone-500 w-8 text-right">{f.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Ingestion Pipeline</h3>
              <div className="space-y-3">
                {[
                  { step: 'Receive', detail: 'Form data via webhook or API', done: true },
                  { step: 'Validate', detail: 'Required fields & format check', done: true },
                  { step: 'Deduplicate', detail: 'Match against existing visitors', done: true },
                  { step: 'Tag', detail: 'AI segmentation & tagging', done: true },
                  { step: 'Enqueue', detail: 'Add to follow-up sequence', done: true },
                  { step: 'Notify', detail: 'Alert assigned pastor', done: false },
                ].map((step, i) => (
                  <div key={step.step} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${
                      step.done ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-stone-800">{step.step}</p>
                      <p className="text-[11px] text-stone-400">{step.detail}</p>
                    </div>
                    {!step.done && (
                      <span className="ml-auto text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                        In Progress
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
