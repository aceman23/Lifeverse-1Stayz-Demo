import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { PeoplePage } from './pages/PeoplePage';
import { ConversationsPage } from './pages/ConversationsPage';
import { FollowUpEnginePage } from './pages/FollowUpEnginePage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';
import { VisitorProfilePage } from './pages/VisitorProfilePage';

function AppShell() {
  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <Sidebar />
      <div className="pl-56">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/people" element={<PeoplePage />} />
            <Route path="/conversations" element={<ConversationsPage />} />
            <Route path="/follow-up-engine" element={<FollowUpEnginePage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/visitor/:id" element={<VisitorProfilePage />} />
            <Route path="/people/:id" element={<VisitorProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
