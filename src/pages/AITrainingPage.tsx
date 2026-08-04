import { useState, useRef } from 'react';
import {
  Bot,
  Upload,
  Shield,
  FileText,
  Plus,
  Trash2,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Sparkles,
  Sliders,
  Loader2,
  File,
  Settings2,
} from 'lucide-react';
import { useAIBots, useAIDocuments, useAIGuardrails } from '../lib/hooks';
import { supabase } from '../lib/supabase';
import { timeAgo } from '../lib/utils';
import type {
  AIBot,
  AIDocument,
  AIGuardrail,
  AIBotStatus,
  GuardrailRuleType,
  GuardrailSeverity,
} from '../lib/types';

const STATUS_CONFIG: Record<AIBotStatus, { label: string; dot: string; badge: string }> = {
  draft: { label: 'Draft', dot: 'bg-stone-300', badge: 'bg-stone-50 text-stone-500 border-stone-200' },
  training: { label: 'Training', dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-100' },
  active: { label: 'Active', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  paused: { label: 'Paused', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-100' },
};

const FILE_TYPE_ICONS: Record<string, string> = {
  pdf: 'bg-rose-50 text-rose-600',
  docx: 'bg-blue-50 text-blue-600',
  txt: 'bg-stone-50 text-stone-500',
  md: 'bg-teal-50 text-teal-600',
  url: 'bg-sky-50 text-sky-600',
  sermon_notes: 'bg-amber-50 text-amber-600',
};

const DOC_STATUS_CONFIG: Record<string, { label: string; icon: typeof CheckCircle2; color: string }> = {
  indexed: { label: 'Indexed', icon: CheckCircle2, color: 'text-emerald-600' },
  processing: { label: 'Processing', icon: Loader2, color: 'text-blue-500' },
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-500' },
  failed: { label: 'Failed', icon: AlertTriangle, color: 'text-rose-500' },
};

const RULE_TYPE_LABELS: Record<GuardrailRuleType, string> = {
  blocked_topic: 'Blocked Topic',
  required_response: 'Required Response',
  escalation_trigger: 'Escalation Trigger',
  tone_constraint: 'Tone Constraint',
  content_boundary: 'Content Boundary',
};

const RULE_TYPE_ICONS: Record<GuardrailRuleType, typeof Shield> = {
  blocked_topic: X,
  required_response: CheckCircle2,
  escalation_trigger: AlertTriangle,
  tone_constraint: Sliders,
  content_boundary: Shield,
};

const SEVERITY_CONFIG: Record<GuardrailSeverity, { label: string; badge: string }> = {
  low: { label: 'Low', badge: 'bg-stone-100 text-stone-500' },
  medium: { label: 'Medium', badge: 'bg-amber-100 text-amber-700' },
  high: { label: 'High', badge: 'bg-orange-100 text-orange-700' },
  critical: { label: 'Critical', badge: 'bg-rose-100 text-rose-700' },
};

type TabType = 'documents' | 'guardrails' | 'persona';

export function AITrainingPage() {
  const { bots, loading } = useAIBots();
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('documents');
  const [showCreateBot, setShowCreateBot] = useState(false);

  const selectedBot = bots.find((b) => b.id === selectedBotId) ?? null;

  // Auto-select first bot
  if (!selectedBotId && bots.length > 0 && !loading) {
    setTimeout(() => setSelectedBotId(bots[0].id), 0);
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] pt-20 pb-10 px-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">AI Training</h1>
          <p className="text-sm text-stone-400 mt-1">
            Train internal chatbots with your church's proprietary content and set guardrails for safe AI behavior.
          </p>
        </div>
        <button
          onClick={() => setShowCreateBot(true)}
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl bg-[#1a2e2a] text-white hover:bg-[#245045] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Chatbot
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-stone-100" />
          ))}
        </div>
      ) : (
        <>
          {/* Bot selector cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {bots.map((bot) => (
              <BotCard
                key={bot.id}
                bot={bot}
                isSelected={bot.id === selectedBotId}
                onClick={() => setSelectedBotId(bot.id)}
              />
            ))}
            {/* Create new bot card */}
            <button
              onClick={() => setShowCreateBot(true)}
              className="border-2 border-dashed border-stone-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-stone-400 hover:border-[#2ec27e] hover:text-[#2ec27e] transition-colors min-h-[160px]"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">Create New Chatbot</span>
            </button>
          </div>

          {/* Selected bot detail */}
          {selectedBot && (
            <BotDetailPanel
              bot={selectedBot}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}
        </>
      )}

      {showCreateBot && (
        <CreateBotModal
          onClose={() => setShowCreateBot(false)}
          onCreated={(id) => {
            setShowCreateBot(false);
            setSelectedBotId(id);
          }}
        />
      )}
    </div>
  );
}

function BotCard({ bot, isSelected, onClick }: { bot: AIBot; isSelected: boolean; onClick: () => void }) {
  const status = STATUS_CONFIG[bot.status];
  return (
    <button
      onClick={onClick}
      className={`text-left bg-white rounded-2xl border p-5 transition-all ${
        isSelected ? 'border-[#2ec27e] shadow-md ring-2 ring-[#2ec27e]/10' : 'border-stone-100 hover:border-stone-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow-sm">
          <Bot className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone-900 truncate">{bot.name}</p>
          <p className="text-xs text-stone-400 truncate mt-0.5">{bot.model}</p>
        </div>
        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>
      <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mb-4">
        {bot.description ?? 'No description provided.'}
      </p>
      <div className="flex items-center gap-4 text-xs text-stone-400">
        <span className="inline-flex items-center gap-1">
          <FileText className="w-3 h-3" />
          {bot.document_count} docs
        </span>
        <span className="inline-flex items-center gap-1">
          <Shield className="w-3 h-3" />
          {bot.guardrail_count} guardrails
        </span>
        {bot.last_trained_at && (
          <span className="inline-flex items-center gap-1 ml-auto">
            <Clock className="w-3 h-3" />
            {timeAgo(bot.last_trained_at)}
          </span>
        )}
      </div>
    </button>
  );
}

function BotDetailPanel({ bot, activeTab, onTabChange }: { bot: AIBot; activeTab: TabType; onTabChange: (t: TabType) => void }) {
  const tabs: { id: TabType; label: string; icon: typeof FileText }[] = [
    { id: 'documents', label: 'Training Documents', icon: FileText },
    { id: 'guardrails', label: 'Guardrails', icon: Shield },
    { id: 'persona', label: 'Persona & Tone', icon: Sliders },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 pt-4 border-b border-stone-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-t-lg transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-[#1a2e2a] border-[#2ec27e]'
                : 'text-stone-400 border-transparent hover:text-stone-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {activeTab === 'documents' && <DocumentsTab bot={bot} />}
        {activeTab === 'guardrails' && <GuardrailsTab bot={bot} />}
        {activeTab === 'persona' && <PersonaTab bot={bot} />}
      </div>
    </div>
  );
}

// ============================================================
// DOCUMENTS TAB
// ============================================================
function DocumentsTab({ bot }: { bot: AIBot }) {
  const { documents, loading } = useAIDocuments(bot.id);
  const [showUpload, setShowUpload] = useState(false);
  const [localDocs, setLocalDocs] = useState<AIDocument[]>([]);

  // Sync local state when documents load
  if (localDocs.length === 0 && documents.length > 0) {
    setTimeout(() => setLocalDocs(documents), 0);
  }

  async function handleDeleteDoc(docId: string) {
    setLocalDocs((prev) => prev.filter((d) => d.id !== docId));
    await supabase.from('ai_documents').delete().eq('id', docId);
    await supabase
      .from('ai_bots')
      .update({ document_count: Math.max(0, (bot.document_count ?? 0) - 1) })
      .eq('id', bot.id);
  }

  const allDocs = localDocs.length > 0 ? localDocs : documents;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">Training Documents</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Upload sermons, policies, and core messaging to train {bot.name}.
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-lg bg-[#2ec27e] text-white hover:bg-[#1a2e2a] transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {loading && allDocs.length === 0 ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-stone-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : allDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <FileText className="w-8 h-8 text-stone-200" />
          <p className="text-stone-400 text-sm">No training documents yet.</p>
          <p className="text-xs text-stone-300">Upload PDFs, sermon notes, or core messaging files to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allDocs.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} onDelete={() => handleDeleteDoc(doc.id)} />
          ))}
        </div>
      )}

      {showUpload && (
        <UploadModal
          botId={bot.id}
          onClose={() => setShowUpload(false)}
          onUploaded={(newDoc) => {
            setLocalDocs((prev) => [newDoc, ...prev]);
            setShowUpload(false);
          }}
        />
      )}
    </div>
  );
}

function DocumentRow({ doc, onDelete }: { doc: AIDocument; onDelete: () => void }) {
  const statusCfg = DOC_STATUS_CONFIG[doc.status] ?? DOC_STATUS_CONFIG.pending;
  const StatusIcon = statusCfg.icon;
  const fileTypeColor = FILE_TYPE_ICONS[doc.file_type] ?? 'bg-stone-50 text-stone-500';

  return (
    <div className="flex items-center gap-3 p-3.5 bg-stone-50/50 rounded-xl border border-stone-50 hover:border-stone-100 transition-colors group">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${fileTypeColor}`}>
        <File className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-800 truncate">{doc.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] uppercase font-medium text-stone-400">{doc.file_type}</span>
          {doc.file_size_kb && (
            <>
              <span className="text-stone-200">·</span>
              <span className="text-xs text-stone-400">{doc.file_size_kb < 1024 ? `${doc.file_size_kb} KB` : `${(doc.file_size_kb / 1024).toFixed(1)} MB`}</span>
            </>
          )}
          <span className="text-stone-200">·</span>
          <span className={`inline-flex items-center gap-1 text-xs ${statusCfg.color}`}>
            <StatusIcon className={`w-3 h-3 ${doc.status === 'processing' ? 'animate-spin' : ''}`} />
            {statusCfg.label}
          </span>
          {doc.uploaded_by && (
            <>
              <span className="text-stone-200">·</span>
              <span className="text-xs text-stone-400">{doc.uploaded_by}</span>
            </>
          )}
        </div>
        {doc.content_summary && (
          <p className="text-xs text-stone-400 mt-1 line-clamp-1">{doc.content_summary}</p>
        )}
        {doc.tags.length > 0 && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {doc.tags.map((tag) => (
              <span key={tag} className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                {tag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={onDelete}
        className="shrink-0 p-2 rounded-lg text-stone-300 hover:text-rose-500 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function UploadModal({
  botId,
  onClose,
  onUploaded,
}: {
  botId: string;
  onClose: () => void;
  onUploaded: (doc: AIDocument) => void;
}) {
  const [title, setTitle] = useState('');
  const [fileType, setFileType] = useState('pdf');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload() {
    if (!title.trim()) return;
    setUploading(true);

    const { data, error } = await supabase
      .from('ai_documents')
      .insert({
        bot_id: botId,
        title: title.trim(),
        file_type: fileType,
        file_size_kb: fileName ? Math.floor(Math.random() * 2000) + 50 : null,
        content_summary: summary.trim() || null,
        status: 'processing',
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        uploaded_by: 'Admin',
      })
      .select('*')
      .single();

    setUploading(false);

    if (error) {
      console.error('[upload]', error);
      return;
    }

    // Update bot document count
    const { data: bot } = await supabase.from('ai_bots').select('document_count').eq('id', botId).single();
    if (bot) {
      await supabase
        .from('ai_bots')
        .update({ document_count: (bot.document_count ?? 0) + 1 })
        .eq('id', botId);
    }

    // Simulate processing completion
    setTimeout(async () => {
      await supabase
        .from('ai_documents')
        .update({ status: 'indexed' })
        .eq('id', data.id);
    }, 2500);

    onUploaded(data as AIDocument);
  }

  function handleFileSelected(file: File) {
    setFileName(file.name);
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'txt';
    const validTypes = ['pdf', 'docx', 'txt', 'md'];
    if (validTypes.includes(ext)) setFileType(ext);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="text-sm font-semibold text-stone-900">Upload Training Document</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors p-1 rounded-lg hover:bg-stone-50">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Drag & drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFileSelected(file);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
              dragOver ? 'border-[#2ec27e] bg-[#2ec27e]/5' : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.md"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelected(file);
              }}
            />
            <Upload className={`w-6 h-6 ${dragOver ? 'text-[#2ec27e]' : 'text-stone-300'}`} />
            {fileName ? (
              <p className="text-sm font-medium text-stone-700">{fileName}</p>
            ) : (
              <>
                <p className="text-sm text-stone-500">Drop a file here or click to browse</p>
                <p className="text-xs text-stone-400">PDF, DOCX, TXT, or Markdown</p>
              </>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">Document Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sermon Series: Hope in Hard Times"
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ec27e] focus:ring-2 focus:ring-[#2ec27e]/20 transition placeholder:text-stone-400"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">Content Summary (optional)</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief description of what this document contains…"
              rows={2}
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ec27e] focus:ring-2 focus:ring-[#2ec27e]/20 transition placeholder:text-stone-400 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="sermons, hope, pastoral-care"
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ec27e] focus:ring-2 focus:ring-[#2ec27e]/20 transition placeholder:text-stone-400"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-stone-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="text-sm font-medium px-4 py-2 rounded-lg text-stone-500 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!title.trim() || uploading}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-[#2ec27e] text-white hover:bg-[#1a2e2a] transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading…' : 'Upload & Index'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// GUARDRAILS TAB
// ============================================================
function GuardrailsTab({ bot }: { bot: AIBot }) {
  const { guardrails, loading } = useAIGuardrails(bot.id);
  const [showAdd, setShowAdd] = useState(false);
  const [localGuardrails, setLocalGuardrails] = useState<AIGuardrail[]>([]);

  if (localGuardrails.length === 0 && guardrails.length > 0) {
    setTimeout(() => setLocalGuardrails(guardrails), 0);
  }

  async function handleToggle(guardrailId: string, currentActive: boolean) {
    setLocalGuardrails((prev) =>
      prev.map((g) => (g.id === guardrailId ? { ...g, is_active: !currentActive } : g))
    );
    await supabase
      .from('ai_guardrails')
      .update({ is_active: !currentActive })
      .eq('id', guardrailId);
  }

  async function handleDelete(guardrailId: string) {
    setLocalGuardrails((prev) => prev.filter((g) => g.id !== guardrailId));
    await supabase.from('ai_guardrails').delete().eq('id', guardrailId);
    const { data: botData } = await supabase.from('ai_bots').select('guardrail_count').eq('id', bot.id).single();
    if (botData) {
      await supabase
        .from('ai_bots')
        .update({ guardrail_count: Math.max(0, (botData.guardrail_count ?? 0) - 1) })
        .eq('id', bot.id);
    }
  }

  const allGuardrails = localGuardrails.length > 0 ? localGuardrails : guardrails;
  const activeCount = allGuardrails.filter((g) => g.is_active).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">Guardrails & Safety Rules</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            {activeCount} of {allGuardrails.length} rules active — define what the AI can and cannot do.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-lg bg-[#2ec27e] text-white hover:bg-[#1a2e2a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Guardrail
        </button>
      </div>

      {loading && allGuardrails.length === 0 ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-stone-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : allGuardrails.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Shield className="w-8 h-8 text-stone-200" />
          <p className="text-stone-400 text-sm">No guardrails configured.</p>
          <p className="text-xs text-stone-300">Add rules to keep your AI assistant safe and aligned with your church's values.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allGuardrails.map((gr) => (
            <GuardrailRow
              key={gr.id}
              guardrail={gr}
              onToggle={() => handleToggle(gr.id, gr.is_active)}
              onDelete={() => handleDelete(gr.id)}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <AddGuardrailModal
          botId={bot.id}
          onClose={() => setShowAdd(false)}
          onAdded={(newGuardrail) => {
            setLocalGuardrails((prev) => [newGuardrail, ...prev]);
            setShowAdd(false);
          }}
        />
      )}
    </div>
  );
}

function GuardrailRow({
  guardrail,
  onToggle,
  onDelete,
}: {
  guardrail: AIGuardrail;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const RuleIcon = RULE_TYPE_ICONS[guardrail.rule_type] ?? Shield;
  const sev = SEVERITY_CONFIG[guardrail.severity] ?? SEVERITY_CONFIG.medium;

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors group ${
      guardrail.is_active ? 'bg-white border-stone-100' : 'bg-stone-50/50 border-stone-50 opacity-60'
    }`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
        guardrail.severity === 'critical' ? 'bg-rose-50 text-rose-600' :
        guardrail.severity === 'high' ? 'bg-orange-50 text-orange-600' :
        guardrail.severity === 'medium' ? 'bg-amber-50 text-amber-600' :
        'bg-stone-50 text-stone-500'
      }`}>
        <RuleIcon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-stone-700">{RULE_TYPE_LABELS[guardrail.rule_type]}</span>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${sev.badge}`}>{sev.label}</span>
        </div>
        <p className="text-sm text-stone-600 mt-1 leading-relaxed">{guardrail.rule_text}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onToggle}
          className={`p-2 rounded-lg transition-colors ${
            guardrail.is_active
              ? 'text-[#2ec27e] hover:bg-[#2ec27e]/10'
              : 'text-stone-300 hover:bg-stone-100'
          }`}
          title={guardrail.is_active ? 'Deactivate' : 'Activate'}
        >
          {guardrail.is_active ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-stone-300 hover:text-rose-500 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function AddGuardrailModal({
  botId,
  onClose,
  onAdded,
}: {
  botId: string;
  onClose: () => void;
  onAdded: (gr: AIGuardrail) => void;
}) {
  const [ruleType, setRuleType] = useState<GuardrailRuleType>('blocked_topic');
  const [ruleText, setRuleText] = useState('');
  const [severity, setSeverity] = useState<GuardrailSeverity>('medium');
  const [saving, setSaving] = useState(false);

  const ruleTypeOptions = Object.entries(RULE_TYPE_LABELS) as [GuardrailRuleType, string][];
  const severityOptions = (['low', 'medium', 'high', 'critical'] as GuardrailSeverity[]).map((s) => ({
    value: s,
    label: SEVERITY_CONFIG[s].label,
  }));

  async function handleAdd() {
    if (!ruleText.trim()) return;
    setSaving(true);

    const { data, error } = await supabase
      .from('ai_guardrails')
      .insert({
        bot_id: botId,
        rule_type: ruleType,
        rule_text: ruleText.trim(),
        severity,
        is_active: true,
      })
      .select('*')
      .single();

    setSaving(false);

    if (error) {
      console.error('[addGuardrail]', error);
      return;
    }

    const { data: botData } = await supabase.from('ai_bots').select('guardrail_count').eq('id', botId).single();
    if (botData) {
      await supabase
        .from('ai_bots')
        .update({ guardrail_count: (botData.guardrail_count ?? 0) + 1 })
        .eq('id', botId);
    }

    onAdded(data as AIGuardrail);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="text-sm font-semibold text-stone-900">Add Guardrail Rule</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors p-1 rounded-lg hover:bg-stone-50">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Rule type */}
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">Rule Type</label>
            <div className="grid grid-cols-2 gap-2">
              {ruleTypeOptions.map(([value, label]) => {
                const Icon = RULE_TYPE_ICONS[value];
                return (
                  <button
                    key={value}
                    onClick={() => setRuleType(value)}
                    className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-2.5 rounded-lg border transition-colors ${
                      ruleType === value
                        ? 'bg-[#1a2e2a] text-white border-[#1a2e2a]'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">Severity</label>
            <div className="flex items-center gap-2 flex-wrap">
              {severityOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSeverity(opt.value)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    severity === opt.value
                      ? 'bg-stone-800 text-white border-stone-800'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rule text */}
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">Rule Description</label>
            <textarea
              value={ruleText}
              onChange={(e) => setRuleText(e.target.value)}
              placeholder="Describe the rule in plain language… e.g. 'Never provide specific financial advice. Refer to a pastor or financial counselor.'"
              rows={3}
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ec27e] focus:ring-2 focus:ring-[#2ec27e]/20 transition placeholder:text-stone-400 resize-none"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-stone-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="text-sm font-medium px-4 py-2 rounded-lg text-stone-500 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!ruleText.trim() || saving}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-[#2ec27e] text-white hover:bg-[#1a2e2a] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {saving ? 'Adding…' : 'Add Rule'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PERSONA TAB
// ============================================================
function PersonaTab({ bot }: { bot: AIBot }) {
  const [personaPrompt, setPersonaPrompt] = useState(bot.persona_prompt);
  const [warmth, setWarmth] = useState(bot.tone_warmth);
  const [directness, setDirectness] = useState(bot.tone_directness);
  const [formality, setFormality] = useState(bot.tone_formality);
  const [scripture, setScripture] = useState(bot.scripture_use);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toneSettings = [
    { label: 'Warmth', value: warmth, setter: setWarmth, description: 'Caring, personal tone in every message' },
    { label: 'Directness', value: directness, setter: setDirectness, description: 'Balanced — not pushy, not too passive' },
    { label: 'Formality', value: formality, setter: setFormality, description: 'Conversational over formal language' },
    { label: 'Scripture Use', value: scripture, setter: setScripture, description: 'How often to cite scripture' },
  ];

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from('ai_bots')
      .update({
        persona_prompt: personaPrompt,
        tone_warmth: warmth,
        tone_directness: directness,
        tone_formality: formality,
        scripture_use: scripture,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bot.id);

    setSaving(false);
    if (error) {
      console.error('[savePersona]', error);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleToggleStatus() {
    const newStatus: AIBotStatus = bot.status === 'active' ? 'paused' : 'active';
    await supabase
      .from('ai_bots')
      .update({ status: newStatus })
      .eq('id', bot.id);
  }

  async function handleRetrain() {
    setSaving(true);
    await supabase
      .from('ai_bots')
      .update({
        status: 'training',
        last_trained_at: new Date().toISOString(),
      })
      .eq('id', bot.id);

    setTimeout(async () => {
      await supabase
        .from('ai_bots')
        .update({ status: 'active' })
        .eq('id', bot.id);
      setSaving(false);
    }, 3000);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Persona prompt */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-stone-400" strokeWidth={1.75} />
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">System Prompt</h3>
        </div>
        <textarea
          value={personaPrompt}
          onChange={(e) => setPersonaPrompt(e.target.value)}
          rows={8}
          className="w-full text-sm border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-[#2ec27e] focus:ring-2 focus:ring-[#2ec27e]/20 transition resize-none leading-relaxed"
          placeholder="Define the AI's personality, role, and behavioral guidelines…"
        />
        <p className="text-xs text-stone-400 mt-2">
          This prompt is sent to the AI as its core identity and behavioral instructions.
        </p>
      </div>

      {/* Tone sliders */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="w-4 h-4 text-stone-400" strokeWidth={1.75} />
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Tone & Personality</h3>
        </div>
        <div className="bg-stone-50/50 rounded-xl border border-stone-100 p-5 space-y-5">
          {toneSettings.map((t) => (
            <div key={t.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-stone-700">{t.label}</span>
                <span className="text-xs text-stone-400">{t.value}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={t.value}
                onChange={(e) => t.setter(Number(e.target.value))}
                className="w-full accent-[#2ec27e]"
              />
              <p className="text-[11px] text-stone-400 mt-1">{t.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action bar */}
      <div className="lg:col-span-2 flex items-center justify-between pt-2 border-t border-stone-50">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleStatus}
            className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              bot.status === 'active'
                ? 'bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'
            }`}
          >
            {bot.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {bot.status === 'active' ? 'Pause Bot' : 'Activate Bot'}
          </button>
          <button
            onClick={handleRetrain}
            disabled={saving}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {saving ? 'Training…' : 'Retrain'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-[#1a2e2a] text-white hover:bg-[#245045] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings2 className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CREATE BOT MODAL
// ============================================================
function CreateBotModal({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [personaPrompt, setPersonaPrompt] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setSaving(true);

    const { data, error } = await supabase
      .from('ai_bots')
      .insert({
        name: name.trim(),
        description: description.trim() || null,
        persona_prompt: personaPrompt.trim() || 'You are a helpful pastoral care assistant.',
        status: 'draft',
      })
      .select('*')
      .single();

    setSaving(false);

    if (error) {
      console.error('[createBot]', error);
      return;
    }

    onCreated(data.id);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="text-sm font-semibold text-stone-900">Create New Chatbot</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors p-1 rounded-lg hover:bg-stone-50">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">Chatbot Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Welcome Assistant, Prayer Companion"
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ec27e] focus:ring-2 focus:ring-[#2ec27e]/20 transition placeholder:text-stone-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will this chatbot do?"
              rows={2}
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ec27e] focus:ring-2 focus:ring-[#2ec27e]/20 transition placeholder:text-stone-400 resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">System Prompt (optional)</label>
            <textarea
              value={personaPrompt}
              onChange={(e) => setPersonaPrompt(e.target.value)}
              placeholder="Define the AI's personality and behavioral guidelines…"
              rows={4}
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ec27e] focus:ring-2 focus:ring-[#2ec27e]/20 transition placeholder:text-stone-400 resize-none"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-stone-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="text-sm font-medium px-4 py-2 rounded-lg text-stone-500 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || saving}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-[#2ec27e] text-white hover:bg-[#1a2e2a] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
            {saving ? 'Creating…' : 'Create Chatbot'}
          </button>
        </div>
      </div>
    </div>
  );
}
