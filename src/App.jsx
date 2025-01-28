import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './components/dashboard/Dashboard';
import DashboardLayout from './layouts/DashboardLayout';
import AdminPage from './pages/admin/AdminPage';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { Toaster } from "@/components/ui/toaster";



const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isInitialized = useAuthStore(state => state.isInitialized);
  const user = useAuthStore(state => state.user); // Obtener datos del usuario
  
  if (!isInitialized) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar roles permitidos
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};


function App() {
  const initialize = useAuthStore(state => state.initialize);
  const [initStarted, setInitStarted] = useState(false);

  useEffect(() => {
    if (!initStarted) {
      setInitStarted(true);
      initialize();
    }
  }, [initialize, initStarted]);
  
  return (
    <ErrorBoundary>
      <BrowserRouter>
      <Routes>
        
  <Route path="/login" element={<LoginPage />} />
  <Route path="/" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
  <Route path="/admin" element={
    <ProtectedRoute allowedRoles={['admin', 'editor']}>
      <AdminPage />
    </ProtectedRoute>
  } />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>

        
      </BrowserRouter>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;