import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { OnboardingProvider } from './lib/onboarding-context';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { BetaSignupPage } from './pages/BetaSignupPage';
import { BetaQRPage } from './pages/BetaQRPage';
import { DashboardPage } from './pages/DashboardPage';
import { PeoplePage } from './pages/PeoplePage';
import { ConversationsPage } from './pages/ConversationsPage';
import { AITrainingPage } from './pages/AITrainingPage';
import { FollowUpEnginePage } from './pages/FollowUpEnginePage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';
import { VisitorProfilePage } from './pages/VisitorProfilePage';
import { OnboardingPage } from './pages/OnboardingPage';

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:pl-56">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/people" element={<PeoplePage />} />
            <Route path="/conversations" element={<ConversationsPage />} />
            <Route path="/ai-training" element={<AITrainingPage />} />
            <Route path="/follow-up-engine" element={<FollowUpEnginePage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
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
      <OnboardingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/beta" element={<BetaSignupPage />} />
          <Route path="/beta/qr" element={<BetaQRPage />} />
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
      </OnboardingProvider>
    </AuthProvider>
  );
}
