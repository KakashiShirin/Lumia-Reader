
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Settings as SettingsIcon, BookOpen, Share2, List } from 'lucide-react';
import { Chapter, DEFAULT_SETTINGS, ReaderSettings, THEMES, TOCItem } from '../types';
import { fetchChapter, fetchTOC } from '../services/mockService';
import { ChapterNode } from './ChapterNode';
import { SettingsDrawer } from './SettingsDrawer';
import { CommentsDrawer } from './CommentsDrawer';
import { TOCDrawer } from './TOCDrawer';

interface ReaderLayoutProps {
  onBack: () => void;
  initialChapter: number;
  novelId: string;
  novelTitle: string;
  novelCover?: string;
  onMarkRead: (chapterNum: number) => void;
  onTimeUpdate: (minutes: number) => void;
}

export const ReaderLayout: React.FC<ReaderLayoutProps> = ({ 
    onBack, 
    initialChapter, 
    novelId, 
    novelTitle, 
    novelCover,
    onMarkRead,
    onTimeUpdate
}) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);
  
  // Drawer States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeCommentsChapterId, setActiveCommentsChapterId] = useState<string | null>(null);
  const [isTOCOpen, setIsTOCOpen] = useState(false);

  // Data States
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showControls, setShowControls] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  const loaderRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const readingTimerRef = useRef<number | null>(null);
  
  const theme = THEMES[settings.theme];

  // Initialize: Load Theme Body Color & Initial Chapter
  useEffect(() => {
    loadMoreChapters(initialChapter, true); // True to clear existing
    loadTOC();
    
    // Load Bookmarks
    const savedBookmarks = localStorage.getItem(`lumina_bookmarks_${novelId}`);
    if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Body Background on Theme Change
  useEffect(() => {
    document.body.style.backgroundColor = theme.bg;
    return () => {
        document.body.style.backgroundColor = '';
    };
  }, [theme]);

  // Reading Timer
  useEffect(() => {
    // Increment reading time every minute
    readingTimerRef.current = window.setInterval(() => {
        onTimeUpdate(1); 
    }, 60000);

    return () => {
        if (readingTimerRef.current) clearInterval(readingTimerRef.current);
    };
  }, [onTimeUpdate]);

  const loadTOC = async () => {
      const items = await fetchTOC(novelId);
      setToc(items);
  };

  const loadMoreChapters = async (startNum: number, clearExisting = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const newChapter = await fetchChapter(startNum, novelId);
      setChapters(prev => clearExisting ? [newChapter] : [...prev, newChapter]);
      
      // Mark as read when loaded (simple heuristic for now)
      onMarkRead(newChapter.number);

      if (clearExisting) {
          window.scrollTo({ top: 0, behavior: 'auto' });
      }
    } catch (e) {
      console.error("Failed to load chapter", e);
    } finally {
      setLoading(false);
    }
  };

  const jumpToChapter = (chapterNum: number) => {
      setIsTOCOpen(false);
      loadMoreChapters(chapterNum, true);
  };

  const toggleBookmark = (chapterNum: number) => {
      const newBookmarks = bookmarks.includes(chapterNum)
        ? bookmarks.filter(b => b !== chapterNum)
        : [...bookmarks, chapterNum];
      
      setBookmarks(newBookmarks);
      localStorage.setItem(`lumina_bookmarks_${novelId}`, JSON.stringify(newBookmarks));
  };

  const handleShare = async () => {
      const text = `Reading ${novelTitle} - Chapter ${chapters[chapters.length-1]?.number} on Lumina`;
      if (navigator.share) {
          try {
            await navigator.share({ title: 'Lumina Reader', text: text, url: window.location.href });
          } catch (err) { console.log("Share failed", err); }
      } else {
          navigator.clipboard.writeText(window.location.href);
          alert("Link copied to clipboard!");
      }
  };

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && chapters.length > 0) {
          const lastChapter = chapters[chapters.length - 1];
          loadMoreChapters(lastChapter.number + 1);
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loading, chapters]);

  // Hide/Show Controls on Scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      
      if (totalHeight > 0) {
        setReadingProgress(Math.min(100, Math.max(0, (currentScrollY / totalHeight) * 100)));
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowControls(false);
      } else {
        setShowControls(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeComments = chapters.find(c => c.id === activeCommentsChapterId)?.comments || [];
  
  // Header Logic
  const currentChapterNum = chapters.length > 0 ? chapters[0].number : 0;
  const lastLoadedChapterNum = chapters.length > 0 ? chapters[chapters.length - 1].number : 0;
  const chapterDisplay = currentChapterNum === lastLoadedChapterNum 
    ? `Chapter ${currentChapterNum}` 
    : `Chapter ${currentChapterNum} - ${lastLoadedChapterNum}`;

  return (
    <div className="min-h-screen relative transition-colors duration-500" style={{ backgroundColor: theme.bg }}>
      
      {/* Top Navigation Bar */}
      <nav 
        className={`fixed top-0 inset-x-0 z-40 backdrop-blur-md border-b transition-all duration-300 ${showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
        style={{ 
            backgroundColor: `${theme.bg}CC`, // Hex with alpha
            borderColor: theme.border
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={onBack} 
            className="p-2 rounded-full transition-colors hover:bg-black/5"
            style={{ color: theme.textMuted }}
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex-1 flex items-center justify-center gap-3 mx-4 overflow-hidden">
             {novelCover && (
                 <img 
                    src={novelCover} 
                    alt="Cover" 
                    className="w-8 h-10 rounded object-cover shadow-sm border border-white/10 hidden sm:block" 
                 />
             )}
             <div className="text-center overflow-hidden">
                <h1 className="text-sm font-semibold truncate opacity-0 sm:opacity-100 transition-opacity" style={{ color: theme.text }}>
                {novelTitle}
                </h1>
                <p className="text-xs truncate font-mono" style={{ color: theme.textMuted }}>
                    {chapters.length > 0 ? chapterDisplay : 'Loading...'}
                </p>
             </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Share Button */}
            <button 
                onClick={handleShare}
                className="p-2 rounded-full transition-colors hover:bg-black/5"
                style={{ color: theme.textMuted }}
                title="Share"
            >
               <Share2 size={18} />
            </button>
            <button 
                onClick={() => setIsTOCOpen(true)}
                className="p-2 rounded-full transition-colors hover:bg-black/5"
                style={{ color: theme.textMuted }}
            >
               <List size={20} />
            </button>
            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full transition-colors hover:bg-black/5"
                style={{ color: theme.textMuted }}
            >
              <SettingsIcon size={20} />
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-0.5 w-full" style={{ backgroundColor: theme.border }}>
            <div 
                className="h-full transition-all duration-150 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{ width: `${readingProgress}%`, backgroundColor: theme.accent }}
            />
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="pt-16 pb-32">
        {chapters.map((chapter) => (
          <ChapterNode 
            key={chapter.id} 
            chapter={chapter} 
            settings={settings}
            onOpenComments={(id) => setActiveCommentsChapterId(id)}
            isBookmarked={bookmarks.includes(chapter.number)}
            onToggleBookmark={toggleBookmark}
          />
        ))}
        
        {/* Infinite Scroll Trigger / Loader */}
        <div ref={loaderRef} className="py-20 flex justify-center items-center">
            {loading ? (
                <div className="flex flex-col items-center gap-4">
                    <div 
                        className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" 
                        style={{ borderColor: theme.border, borderTopColor: theme.accent }}
                    />
                </div>
            ) : (
                <div className="h-20" /> 
            )}
        </div>
      </div>

      {/* Floating Action Button (Menu) */}
      <button 
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl transition-all duration-300 z-30 hover:scale-105 active:scale-95 ${showControls ? 'scale-100' : 'scale-0'}`}
        style={{ backgroundColor: theme.accent, color: '#fff' }}
        onClick={() => setIsTOCOpen(true)}
      >
        <BookOpen size={24} />
      </button>

      {/* Drawers */}
      <SettingsDrawer 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        onUpdate={setSettings}
      />
      
      <CommentsDrawer
        isOpen={!!activeCommentsChapterId}
        onClose={() => setActiveCommentsChapterId(null)}
        comments={activeComments}
        chapterNumber={chapters.find(c => c.id === activeCommentsChapterId)?.number}
      />

      <TOCDrawer 
        isOpen={isTOCOpen}
        onClose={() => setIsTOCOpen(false)}
        items={toc}
        currentChapter={chapters.length > 0 ? chapters[0].number : 1}
        bookmarks={bookmarks}
        theme={theme}
        onSelectChapter={jumpToChapter}
      />

    </div>
  );
};
