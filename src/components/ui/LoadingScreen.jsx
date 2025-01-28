import React from 'react';
import { Loader2 } from "lucide-react";

const LoadingScreen = ({ message = 'Cargando...' }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center flex-col gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-lg text-gray-600 animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingScreen;