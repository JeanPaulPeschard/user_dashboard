// src/App.tsx
import React from 'react';
import UserDashboard from './components/UserDashboard';

const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <UserDashboard />
    </div>
  );
};

export default App;
