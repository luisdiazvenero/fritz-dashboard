import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-50">
      <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto flex items-center justify-center">
              <span className="text-white text-2xl font-bold">M</span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Mil Dashboard
            </h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;