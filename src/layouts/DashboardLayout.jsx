import React from 'react';

import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';


const DashboardLayout = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-hidden">
      {children}
     
    </div>
  );
};

export default DashboardLayout;