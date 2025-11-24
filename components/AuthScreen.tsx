
import React, { useState } from 'react';
import { ArrowRight, BookOpen, User as UserIcon } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (username: string) => void;
  onGuest: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onGuest }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    // Simulate loading
    setTimeout(() => onLogin(username), 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f12] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <BookOpen className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">
            Lumina Reader
          </h1>
          <p className="text-gray-400 text-sm">
            Your personal infinite library. <br /> Distraction-free. Beautiful. Fast.
          </p>
        </div>

        <div className="space-y-6 backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-2xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-gray-500">Username</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your alias..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Enter Library <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-xs">OR</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button
            onClick={onGuest}
            className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
