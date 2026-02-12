
import React, { useState } from 'react';

interface AuthProps {
  type: 'login' | 'register';
  onSuccess: (email: string) => void;
  onSwitch: () => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ type, onSuccess, onSwitch, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(email);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 flex flex-col">
        <div className="p-10">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {type === 'login' ? 'Welcome Back' : 'Join AgriDetect'}
          </h2>
          <p className="text-slate-500 mb-8 text-sm">
            {type === 'login' 
              ? 'Access your farm dashboard. Tip: user "admin" in email for admin view.' 
              : 'Create an account to start monitoring your crops.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {type === 'register' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  placeholder="John Farmer"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="john@farm.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                required 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              disabled={loading}
              className={`
                w-full py-4 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-3
                ${loading ? 'bg-slate-300' : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'}
              `}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (type === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              {type === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button onClick={onSwitch} className="ml-2 text-emerald-600 font-bold hover:underline">
                {type === 'login' ? 'Register Now' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
