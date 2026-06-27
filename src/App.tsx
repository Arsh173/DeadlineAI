import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

// Pages
import { Landing } from "./pages/Landing";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Tasks } from "./pages/Tasks";
import { Scheduler } from "./pages/Scheduler";
import { Study } from "./pages/Study";
import { Habits } from "./pages/Habits";
import { Analytics } from "./pages/Analytics";
import { Chat } from "./pages/Chat";

// Protected Route Wrapper
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, user } = useApp();
  const location = useLocation();

  // If unauthenticated, redirect to marketing landing page
  if (!isLoggedIn && !localStorage.getItem("deadlineai_profile_anonymous_user")) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <div className="bg-[#030305] text-zinc-100 min-h-screen relative font-sans selection:bg-purple-500/20 selection:text-purple-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Panel Content container */}
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pb-12 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />

          {/* Secure SaaS Panels */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <ProtectedLayout>
                <Tasks />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/scheduler" 
            element={
              <ProtectedLayout>
                <Scheduler />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/study" 
            element={
              <ProtectedLayout>
                <Study />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/habits" 
            element={
              <ProtectedLayout>
                <Habits />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedLayout>
                <Analytics />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedLayout>
                <Chat />
              </ProtectedLayout>
            } 
          />

          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
