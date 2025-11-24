import React, { useState } from 'react';
import { ArrowRight, Sparkles, Zap, Smartphone, Moon } from 'lucide-react';

interface LandingProps {
  onStart: (url: string) => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onStart(url);
    }
  };

  const handlePasteDemo = () => {
      const demoUrl = "https://ranobes.net/novels/12345/chapter-1";
      setUrl(demoUrl);
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Ambient Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full z-10 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium uppercase tracking-wider mb-4 animate-pulse">
            <Sparkles size={12} />
            Next Gen Reader
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight">
            Lumina
            <span className="text-indigo-500">.</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
            Transform your light novel reading experience. 
            Distraction-free, infinite scrolling, and beautifully typographed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
          <div className="relative flex bg-surface border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <input
              type="url"
              placeholder="Paste novel link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-transparent px-6 py-4 text-white placeholder-gray-600 focus:outline-none font-sans"
              required
            />
            <button
              type="submit"
              className="px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors flex items-center gap-2"
            >
              Read <ArrowRight size={18} />
            </button>
          </div>
          <div className="mt-3 text-center">
             <button type="button" onClick={handlePasteDemo} className="text-xs text-gray-500 hover:text-indigo-400 underline decoration-dotted underline-offset-4">
                 Try with a demo link
             </button>
          </div>
        </form>

        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
            <Feature icon={<Zap size={20} />} title="Blazing Fast" />
            <Feature icon={<Smartphone size={20} />} title="Mobile First" />
            <Feature icon={<Moon size={20} />} title="Dark Mode" />
        </div>
      </div>
      
      <footer className="absolute bottom-6 text-center w-full text-xs text-gray-700 font-mono">
        v1.0.0 • Built with React & Tailwind
      </footer>
    </div>
  );
};

const Feature = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="flex flex-col items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors">
        <div className="p-3 bg-white/5 rounded-full mb-1">
            {icon}
        </div>
        <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
    </div>
);
