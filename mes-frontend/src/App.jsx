import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginScreen from './pages/Login';
import Dashboard from './pages/Dashboard';
import { Loader2 } from 'lucide-react';

const AppContent = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return !user ? <LoginScreen /> : <Dashboard />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
