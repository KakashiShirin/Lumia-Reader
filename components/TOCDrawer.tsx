import React, { useState, useMemo } from 'react';
import { TOCItem, ThemeColors } from '../types';
import { X, Search, Bookmark, ChevronRight } from 'lucide-react';

interface TOCDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: TOCItem[];
  currentChapter: number;
  bookmarks: number[];
  theme: ThemeColors;
  onSelectChapter: (num: number) => void;
}

export const TOCDrawer: React.FC<TOCDrawerProps> = ({ 
    isOpen, 
    onClose, 
    items, 
    currentChapter, 
    bookmarks,
    theme,
    onSelectChapter 
}) => {
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
      return items.filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) || 
        item.number.toString().includes(search)
      );
  }, [items, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        className="relative w-full sm:w-[400px] h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col"
        style={{ backgroundColor: theme.surface, color: theme.text }}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: theme.border }}>
            <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                <input 
                    type="text" 
                    placeholder="Search chapters..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-black/5 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1"
                    style={{ 
                        backgroundColor: 'rgba(128,128,128,0.1)', 
                        color: theme.text,
                        borderColor: theme.accent 
                    }}
                />
            </div>
            <button 
                onClick={onClose} 
                className="p-2 rounded-full hover:bg-black/5"
            >
                <X size={20} />
            </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
            {filteredItems.map((item) => {
                const isCurrent = item.number === currentChapter;
                const isBookmarked = bookmarks.includes(item.number);
                
                return (
                    <button
                        key={item.number}
                        onClick={() => onSelectChapter(item.number)}
                        className="w-full text-left p-4 border-b flex items-center justify-between group transition-colors hover:bg-black/5"
                        style={{ 
                            borderColor: theme.border,
                            backgroundColor: isCurrent ? `${theme.accent}10` : 'transparent'
                        }}
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-indigo-500' : 'opacity-50'}`} style={{ color: isCurrent ? theme.accent : theme.textMuted }}>
                                    Chapter {item.number}
                                </span>
                                {isBookmarked && (
                                    <Bookmark size={12} fill={theme.accent} stroke={theme.accent} />
                                )}
                            </div>
                            <h4 className="font-medium text-sm truncate" style={{ color: isCurrent ? theme.accent : theme.text }}>
                                {item.title}
                            </h4>
                        </div>
                        {isCurrent && <ChevronRight size={16} style={{ color: theme.accent }} />}
                    </button>
                );
            })}
            
            {filteredItems.length === 0 && (
                <div className="p-8 text-center opacity-50 text-sm">
                    No chapters found matching "{search}"
                </div>
            )}
        </div>
      </div>
    </div>
  );
};