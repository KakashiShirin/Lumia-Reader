import React from 'react';
import { Chapter, ReaderSettings, THEMES } from '../types';
import { MessageSquare, Bookmark } from 'lucide-react';

interface ChapterNodeProps {
  chapter: Chapter;
  settings: ReaderSettings;
  onOpenComments: (chapterId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (chapterNum: number) => void;
  innerRef?: React.Ref<HTMLDivElement>;
}

export const ChapterNode: React.FC<ChapterNodeProps> = React.memo(({ 
    chapter, 
    settings, 
    onOpenComments, 
    isBookmarked,
    onToggleBookmark,
    innerRef 
}) => {
  const theme = THEMES[settings.theme];

  return (
    <div 
      ref={innerRef}
      className={`mx-auto px-4 sm:px-8 py-12 md:py-20 transition-all duration-500 ease-in-out ${settings.fontFamily}`}
      style={{
        maxWidth: `${settings.maxWidth}px`,
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.lineHeight,
        textAlign: settings.textAlign,
        color: theme.text,
      }}
    >
      <header className="mb-12 text-center border-b pb-8" style={{ borderColor: theme.border }}>
        <div className="flex items-center justify-center gap-2 mb-4">
             <span 
                className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase font-sans"
                style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
             >
                Chapter {chapter.number}
            </span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6" style={{ color: theme.text }}>
          {chapter.title}
        </h2>
      </header>

      <div className="space-y-6">
        {chapter.content.map((paragraph, idx) => (
          <p 
            key={idx} 
            style={{ marginBottom: `${settings.paragraphSpacing}rem` }}
            className="rendering-pixelated"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <footer className="mt-16 pt-8 border-t flex items-center justify-between" style={{ borderColor: theme.border }}>
        <div className="flex gap-6">
            <button 
                onClick={() => onOpenComments(chapter.id)}
                className="flex items-center gap-2 transition-colors font-sans text-base opacity-70 hover:opacity-100"
                style={{ color: theme.textMuted }}
            >
                <MessageSquare size={18} />
                <span>{chapter.comments.length} Comments</span>
            </button>
            <button 
                onClick={() => onToggleBookmark(chapter.number)}
                className="flex items-center gap-2 transition-colors font-sans text-base opacity-70 hover:opacity-100"
                style={{ color: isBookmarked ? theme.accent : theme.textMuted }}
            >
                <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
        </div>
        <span className="text-sm font-sans opacity-50" style={{ color: theme.textMuted }}>
            {Math.ceil(chapter.content.length * 0.5)} min read
        </span>
      </footer>
    </div>
  );
});

ChapterNode.displayName = 'ChapterNode';