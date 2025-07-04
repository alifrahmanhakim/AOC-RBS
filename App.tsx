


import React from 'react';
import { HashRouter, Link, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { OperatorProvider } from './hooks/useOperators';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DashboardPage } from './pages/DashboardPage';
import { OperatorDetailPage } from './pages/OperatorDetailPage';
import { AddOperatorPage } from './pages/AddOperatorPage';
import { LoginPage } from './pages/LoginPage'; // New Import
import { Header } from './components/shared/Header';
import { Toaster } from 'react-hot-toast';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

// ProtectedRoute component
const ProtectedRoute: React.FC = () => {
  const { currentUser, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(space.16)-theme(space.16))]"> {/* Adjust height based on header/footer */}
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Renders child routes if authenticated
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <OperatorProvider>
        <HashRouter>
          <div className="min-h-screen flex flex-col bg-slate-100">
            <Header />
            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/operator/new" element={<AddOperatorPage />} />
                  <Route path="/operator/:operatorId" element={<OperatorDetailPage />} />
                </Route>
                {/* Fallback route for any other path, redirect to dashboard if logged in, else login */}
                <Route path="*" element={<NavigateTo />} />
              </Routes>
            </main>
            <footer className="bg-slate-800 text-white text-center p-4">
              <p>&copy; {new Date().getFullYear()} DGCA Risk Management System dev by STDATABASE.</p>
            </footer>
          </div>
          <Toaster position="top-right" reverseOrder={false} />
        </HashRouter>
      </OperatorProvider>
    </AuthProvider>
  );
};

// Helper component to determine where to redirect for "*"
const NavigateTo: React.FC = () => {
  const { currentUser } = useAuth();
  return <Navigate to={currentUser ? "/" : "/login"} replace />;
}

export default App;