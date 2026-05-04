import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading, demoMode } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-[#2ec27e] animate-spin" />
          <p className="text-sm text-stone-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session && !demoMode) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
