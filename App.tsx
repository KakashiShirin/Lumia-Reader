import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Library } from './components/Library';
import { ReaderLayout } from './components/ReaderLayout';
import { NovelDetails } from './components/NovelDetails';
import { Profile } from './components/Profile';
import { User, LibraryEntry, Category, DEFAULT_CATEGORIES, Novel } from './types';
import { mockLogin, fetchLibrary } from './services/mockService';
import { StorageService } from './services/StorageService';
import { localReader } from './services/LocalReaderService';

type ViewState = 'auth' | 'library' | 'reader';

function App() {
  const [view, setView] = useState<ViewState>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [library, setLibrary] = useState<LibraryEntry[]>([]);
  const [localLibrary, setLocalLibrary] = useState<LibraryEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  // Modal States
  const [activeNovelId, setActiveNovelId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; targetId: string | null }>({
    isOpen: false,
    targetId: null
  });

  // Reader State
  const [readingSession, setReadingSession] = useState<{ novelId: string, chapter: number } | null>(null);
  const [localMode, setLocalMode] = useState(false);

  // Transition State
  const [ripple, setRipple] = useState<{ active: boolean; x: number; y: number; isCovering: boolean; targetMode: boolean }>({
    active: false,
    x: 0,
    y: 0,
    isCovering: false,
    targetMode: false
  });

  // --- Initial Load ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedBooks = await StorageService.getBooks();
        setLocalLibrary(storedBooks.map(book => ({
          ...book,
          lastReadChapter: book.lastReadChapter || 0,
          readChapters: book.readChapters || [],
          bookmarkedChapters: book.bookmarkedChapters || [],
          categoryId: book.categoryId || 'reading'
        } as LibraryEntry)));
      } catch (error) {
        console.error("Failed to load local library:", error);
      }
    };
    loadData();
  }, []);

  // --- Handlers ---

  const handleLogin = async (username: string) => {
    try {
      const userData = await mockLogin(username);
      setUser(userData);
      const libData = await fetchLibrary();
      setLibrary(libData);
      setView('library');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleGuest = async () => {
    await handleLogin('Guest');
  };

  const handleSelectNovel = (id: string) => {
    setActiveNovelId(id);
  };

  const handleStartReading = (novelId: string, chapter: number) => {
    setReadingSession({ novelId, chapter });
    setView('reader');
    setActiveNovelId(null);
  };

  const handleMarkChapterRead = (novelId: string, chapter: number) => {
    const update = (lib: LibraryEntry[]) => lib.map(n => 
      n.id === novelId 
        ? { ...n, lastReadChapter: chapter, readChapters: Array.from(new Set([...n.readChapters, chapter])) }
        : n
    );
    if (localMode) setLocalLibrary(update);
    else setLibrary(update);
  };

  const handleToggleBookmark = (novelId: string, chapter: number) => {
    const update = (lib: LibraryEntry[]) => lib.map(n => {
      if (n.id !== novelId) return n;
      const bookmarks = n.bookmarkedChapters.includes(chapter)
        ? n.bookmarkedChapters.filter(c => c !== chapter)
        : [...n.bookmarkedChapters, chapter];
      return { ...n, bookmarkedChapters: bookmarks };
    });
    if (localMode) setLocalLibrary(update);
    else setLibrary(update);
  };

  const handleUpdateNovel = (updated: LibraryEntry) => {
    const update = (lib: LibraryEntry[]) => lib.map(n => n.id === updated.id ? updated : n);
    if (localMode) setLocalLibrary(update);
    else setLibrary(update);
  };

  const handleDeleteNovel = (id: string) => {
    setDeleteConfirm({ isOpen: true, targetId: id });
  };

  const confirmDeleteNovel = async () => {
    if (deleteConfirm.targetId) {
      try {
        await StorageService.deleteBook(deleteConfirm.targetId);
        setLocalLibrary(prev => prev.filter(n => n.id !== deleteConfirm.targetId));
        setDeleteConfirm({ isOpen: false, targetId: null });
        setActiveNovelId(null);
      } catch (error) {
        console.error("Failed to delete novel:", error);
      }
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleAddNovel = (novel: LibraryEntry) => {
    if (localMode) {
        setLocalLibrary(prev => [...prev, novel]);
    } else {
        setLibrary(prev => [...prev, novel]);
    }
  };

  const handleCreateCategory = (cat: Category) => {
    setCategories(prev => [...prev, cat]);
  };

  const handleUpdateCategory = (cat: Category) => {
    setCategories(prev => prev.map(c => c.id === cat.id ? cat : c));
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const handleTimeUpdate = (novelId: string, minutes: number) => {
    if (user) {
      setUser({
        ...user,
        stats: {
          ...user.stats,
          totalReadTime: user.stats.totalReadTime + minutes
        }
      });
    }
  };

  const handleToggleLocalMode = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    setRipple({ active: true, x, y, isCovering: false, targetMode: !localMode });

    setTimeout(() => {
      setRipple(prev => ({ ...prev, isCovering: true }));
      setTimeout(() => {
        setLocalMode(prev => !prev);
        setRipple({ active: false, x: 0, y: 0, isCovering: false, targetMode: false });
      }, 1000);
    }, 50);
  };

  // --- Render Helpers ---
  const renderLibraryContent = (mode: boolean) => (
    <>
      <Library
        user={user!}
        novels={mode ? localLibrary : library}
        categories={categories}
        onSelectNovel={handleSelectNovel}
        onOpenProfile={() => setIsProfileOpen(true)}
        onAddNovel={handleAddNovel}
        onCreateCategory={handleCreateCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        localMode={mode}
        onDeleteNovel={handleDeleteNovel}
        onToggleMode={handleToggleLocalMode}
      />

      {activeNovelId && (() => {
        const activeNovel = (mode ? localLibrary : library).find(n => n.id === activeNovelId);
        return activeNovel ? (
          <NovelDetails
            novel={activeNovel}
            categories={categories}
            onClose={() => setActiveNovelId(null)}
            onPlay={(ch) => handleStartReading(activeNovelId, ch)}
            onToggleBookmark={(ch) => handleToggleBookmark(activeNovelId, ch)}
            onUpdateNovel={handleUpdateNovel}
          />
        ) : null;
      })()}

      <Profile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user!}
        onUpdate={handleUpdateUser}
        localMode={mode}
        onToggleLocalMode={() => { }}
      />
    </>
  );

  if (view === 'auth') {
    return <AuthScreen onLogin={handleLogin} onGuest={handleGuest} />;
  }

  if (view === 'reader' && readingSession) {
    const targetLibrary = localMode ? localLibrary : library;
    const currentNovel = targetLibrary.find(n => n.id === readingSession.novelId);
    if (!currentNovel) return <div>Error: Novel not found</div>;

    return (
      <ReaderLayout
        initialChapter={readingSession.chapter}
        novelId={currentNovel.id}
        novelTitle={currentNovel.customTitle || currentNovel.title}
        novelCover={currentNovel.customCoverUrl || currentNovel.coverUrl}
        onBack={() => setView('library')}
        onMarkRead={handleMarkChapterRead}
        onTimeUpdate={handleTimeUpdate}
        localMode={localMode}
      />
    );
  }

  return (
    <div className={`app-container relative min-h-screen bg-[#0f0f12] text-white overflow-hidden`}>
      <div className="absolute inset-0 z-0">
        {user && renderLibraryContent(localMode)}
      </div>

      {ripple.active && user && (
        <div
          className="absolute inset-0 z-10 bg-[#0f0f12]"
          style={{
            clipPath: ripple.isCovering
              ? `circle(150% at ${ripple.x}px ${ripple.y}px)`
              : `circle(0% at ${ripple.x}px ${ripple.y}px)`,
            transition: 'clip-path 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none',
          }}
        >
          {renderLibraryContent(ripple.targetMode)}
        </div>
      )}

      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm({ isOpen: false, targetId: null })} />
          <div className="relative w-full max-w-sm bg-[#18181b] rounded-2xl border border-white/10 shadow-2xl p-6">
            <h3 className="font-display font-bold text-xl text-white mb-2">Delete Novel?</h3>
            <p className="text-gray-400 text-sm mb-6">This action cannot be undone. The book will be permanently removed from your local library.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirm({ isOpen: false, targetId: null })} 
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteNovel} 
                className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
