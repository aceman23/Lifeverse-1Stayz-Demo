import { MessageSquare } from 'lucide-react';

export function ConversationsPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f8] px-6 pt-20 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Conversations</h1>
        <p className="text-sm text-stone-400 mt-1">AI-powered conversations with your visitors.</p>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
          <MessageSquare className="w-7 h-7 text-blue-500" strokeWidth={1.5} />
        </div>
        <p className="text-stone-500 font-medium">Conversations inbox coming soon</p>
        <p className="text-sm text-stone-400 max-w-xs text-center">
          Every SMS, email, and chat thread with your visitors will live here in one unified inbox.
        </p>
      </div>
    </div>
  );
}
