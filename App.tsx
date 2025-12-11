
import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Library } from './components/Library';
import { ReaderLayout } from './components/ReaderLayout';
import { NovelDetails } from './components/NovelDetails';
import { Profile } from './components/Profile';
import { User, LibraryEntry, Category, DEFAULT_CATEGORIES, Novel } from './types';
import { mockLogin, fetchLibrary } from './services/mockService';
import { StorageService } from './services/StorageService';
import { LocalReaderService } from './services/LocalReaderService';

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


  // ... (rest of the state and handlers remain, scroll down to handleToggleLocalMode) ...

  const handleToggleLocalMode = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;

    // Start ripple with TARGET mode (opposite of current)
    setRipple({ active: true, x, y, isCovering: false, targetMode: !localMode });

    // Wait for ripple to cover screen (Mask Reveal)
    setTimeout(() => {
      setRipple(prev => ({ ...prev, isCovering: true }));

      // After animation completes, update actual state and reset ripple
      setTimeout(() => {
        setLocalMode(prev => !prev);
        setRipple({ active: false, x: 0, y: 0, isCovering: false, targetMode: false });
      }, 1000); // 1s animation
    }, 50);
  };

  // ... (rest of handlers) ...

  // Helper to render library content for a specific mode
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

      {/* Novel Details Modal (Only if active novel belongs to this mode) */}
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

      {/* Profile Modal - Always available */}
      <Profile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user!}
        onUpdate={handleUpdateUser}
        localMode={mode}
        onToggleLocalMode={() => { }} // Disable toggle inside profile during transition or just ignore
      // Actually profile toggle might be redundant now, but keep prop safe
      />
    </>
  );

  // --- Render ---

  if (view === 'auth') {
    return (
      <>
        <AuthScreen onLogin={handleLogin} onGuest={handleGuest} />
      </>
    );
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

      {/* Base Layer (Current Mode) */}
      <div className="absolute inset-0 z-0">
        {user && renderLibraryContent(localMode)}
        {/* Note: During transition, localMode is still the OLD mode until the end. */}
      </div>

      {/* Overlay Layer (Target Mode) - Mask Reveal */}
      {ripple.active && user && (
        <div
          className="absolute inset-0 z-10 bg-[#0f0f12]"
          style={{
            clipPath: ripple.isCovering
              ? `circle(150% at ${ripple.x}px ${ripple.y}px)`
              : `circle(0% at ${ripple.x}px ${ripple.y}px)`,
            transition: 'clip-path 1s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none', // Allow clicks to pass through if needed, but usually we block during transition
          }}
        >
          {renderLibraryContent(ripple.targetMode)}
        </div>
      )}

      {/* Confirmation Modal (Global Z-Index) */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setDeleteConfirm({ isOpen: false, targetId: null })} />
          <div className="relative w-full max-w-sm bg-[#18181b] rounded-2xl border border-white/10 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <h3 className="font-display font-bold text-xl text-white mb-2">Delete Novel?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This action cannot be undone. The book will be permanently removed from your local library.
            </p>
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
