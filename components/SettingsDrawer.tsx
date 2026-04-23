
import React from 'react';
import { ReaderSettings, FontFamily, THEMES, ThemeId } from '../types';
import { X, Type, AlignLeft, AlignJustify, Minus, Plus, Palette, Monitor } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdate: (newSettings: ReaderSettings) => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose, settings, onUpdate }) => {
  const activeTheme = THEMES[settings.theme];

  if (!isOpen) return null;

  const update = (key: keyof ReaderSettings, value: any) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center justify-end sm:justify-center sm:inset-0 pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div 
        className="w-full max-w-md border-t sm:border sm:rounded-xl p-6 shadow-2xl pointer-events-auto transform transition-transform duration-300 ease-out animate-in slide-in-from-bottom-4 overflow-y-auto max-h-[85vh]"
        style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium flex items-center gap-2" style={{ color: activeTheme.text }}>
            <Type size={18} />
            Appearance
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full transition-colors opacity-70 hover:opacity-100"
            style={{ color: activeTheme.text, backgroundColor: 'rgba(128,128,128,0.1)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
            
          {/* Themes */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold opacity-60" style={{ color: activeTheme.text }}>Theme</label>
            <div className="grid grid-cols-4 gap-3">
              {(Object.values(THEMES) as any[]).map((t) => (
                 <button
                    key={t.id}
                    onClick={() => update('theme', t.id)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all ${settings.theme === t.id ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                    style={{ borderColor: settings.theme === t.id ? activeTheme.accent : 'transparent' }}
                 >
                    <div className="w-full aspect-square rounded-full shadow-inner" style={{ backgroundColor: t.bg }}></div>
                    <span className="text-xs font-medium" style={{ color: activeTheme.text }}>{t.name}</span>
                 </button>
              ))}
            </div>
          </div>

          <hr style={{ borderColor: activeTheme.border }} />

          {/* Font Family */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold opacity-60" style={{ color: activeTheme.text }}>Font Family</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Serif', value: FontFamily.SERIF },
                { label: 'Sans', value: FontFamily.SANS },
                { label: 'Lora', value: FontFamily.LORA },
                { label: 'Mono', value: FontFamily.MONO },
              ].map((font) => (
                <button
                  key={font.value}
                  onClick={() => update('fontFamily', font.value)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                    settings.fontFamily === font.value
                      ? 'text-white'
                      : 'hover:opacity-100 opacity-60'
                  }`}
                  style={{
                      backgroundColor: settings.fontFamily === font.value ? activeTheme.accent : 'transparent',
                      borderColor: settings.fontFamily === font.value ? activeTheme.accent : activeTheme.border,
                      color: settings.fontFamily === font.value ? '#fff' : activeTheme.text
                  }}
                >
                  <span className={font.value}>{font.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
             <label className="text-xs uppercase tracking-wider font-semibold opacity-60" style={{ color: activeTheme.text }}>Size ({settings.fontSize}px)</label>
             <div className="flex items-center gap-4 rounded-lg p-2" style={{ backgroundColor: 'rgba(128,128,128,0.1)' }}>
                <button 
                  onClick={() => update('fontSize', Math.max(12, settings.fontSize - 1))}
                  className="p-2 rounded-md hover:bg-black/5"
                  style={{ color: activeTheme.text }}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="range"
                  min="12"
                  max="32"
                  value={settings.fontSize}
                  onChange={(e) => update('fontSize', Number(e.target.value))}
                  className="flex-1 h-1 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: activeTheme.accent }}
                />
                <button 
                  onClick={() => update('fontSize', Math.min(32, settings.fontSize + 1))}
                  className="p-2 rounded-md hover:bg-black/5"
                  style={{ color: activeTheme.text }}
                >
                  <Plus size={16} />
                </button>
             </div>
          </div>

          {/* Width & Line Height */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                  <label className="text-xs uppercase tracking-wider font-semibold opacity-60" style={{ color: activeTheme.text }}>Page Width</label>
                  <Monitor size={14} style={{ color: activeTheme.text }} className="opacity-50"/>
              </div>
              <input
                type="range"
                min="400"
                max="2000"
                step="50"
                value={settings.maxWidth}
                onChange={(e) => update('maxWidth', Number(e.target.value))}
                className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: activeTheme.accent }}
              />
              <div className="flex justify-between text-[10px] opacity-40 font-mono" style={{ color: activeTheme.text }}>
                  <span>Narrow</span>
                  <span>Full Screen</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold opacity-60" style={{ color: activeTheme.text }}>Line Height</label>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.1"
                value={settings.lineHeight}
                onChange={(e) => update('lineHeight', Number(e.target.value))}
                className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: activeTheme.accent }}
              />
            </div>
          </div>

          {/* Alignment */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold opacity-60" style={{ color: activeTheme.text }}>Alignment</label>
            <div className="flex rounded-lg p-1" style={{ backgroundColor: 'rgba(128,128,128,0.1)' }}>
              <button
                onClick={() => update('textAlign', 'left')}
                className={`flex-1 py-1.5 rounded-md flex justify-center transition-all`}
                style={{ 
                    backgroundColor: settings.textAlign === 'left' ? activeTheme.accent : 'transparent',
                    color: settings.textAlign === 'left' ? '#fff' : activeTheme.text
                }}
              >
                <AlignLeft size={18} />
              </button>
              <button
                onClick={() => update('textAlign', 'justify')}
                className={`flex-1 py-1.5 rounded-md flex justify-center transition-all`}
                style={{ 
                    backgroundColor: settings.textAlign === 'justify' ? activeTheme.accent : 'transparent',
                    color: settings.textAlign === 'justify' ? '#fff' : activeTheme.text
                }}
              >
                <AlignJustify size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
