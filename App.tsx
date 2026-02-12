
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DiseaseDetector from './components/DiseaseDetector';
import FolderTree from './components/FolderTree';
import Landing from './components/Landing';
import Auth from './components/Auth';
import History from './components/History';

type AppState = 'landing' | 'login' | 'register' | 'app';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Simple auth simulation persistence
  useEffect(() => {
    const isAuth = localStorage.getItem('agri_auth');
    if (isAuth) setAppState('app');
  }, []);

  const handleLoginSuccess = () => {
    localStorage.setItem('agri_auth', 'true');
    setAppState('app');
  };

  const handleLogout = () => {
    localStorage.removeItem('agri_auth');
    setAppState('landing');
  };

  if (appState === 'landing') {
    return <Landing 
      onGetStarted={() => setAppState('register')} 
      onLogin={() => setAppState('login')} 
    />;
  }

  if (appState === 'login' || appState === 'register') {
    return (
      <Auth 
        type={appState} 
        onSuccess={handleLoginSuccess}
        onSwitch={() => setAppState(appState === 'login' ? 'register' : 'login')}
        onBack={() => setAppState('landing')}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'detection':
        return <DiseaseDetector />;
      case 'architecture':
        return <FolderTree />;
      case 'history':
        return <History />;
      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 animate-fadeIn">
            <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-xl font-bold text-slate-900">System Configuration</h2>
            <p className="mt-1">Manage API keys, user permissions, and sensor nodes.</p>
            <button 
              onClick={handleLogout}
              className="mt-6 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
            >
              Sign Out Session
            </button>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </Layout>
  );
};

export default App;
