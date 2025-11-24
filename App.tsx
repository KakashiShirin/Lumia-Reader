
import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Library } from './components/Library';
import { ReaderLayout } from './components/ReaderLayout';
import { NovelDetails } from './components/NovelDetails';
import { Profile } from './components/Profile';
import { User, LibraryEntry, Category, DEFAULT_CATEGORIES, Novel } from './types';
import { mockLogin, fetchLibrary } from './services/mockService';

type ViewState = 'auth' | 'library' | 'reader';

function App() {
  const [view, setView] = useState<ViewState>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [library, setLibrary] = useState<LibraryEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  
  // Modal States
  const [activeNovelId, setActiveNovelId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Reader State
  const [readingSession, setReadingSession] = useState<{novelId: string, chapter: number} | null>(null);

  // Load library data on mount (mock DB)
  useEffect(() => {
    const load = async () => {
        const data = await fetchLibrary();
        setLibrary(data);
    };
    load();
  }, []);

  const handleLogin = async (username: string) => {
    const u = await mockLogin(username);
    setUser(u);
    setView('library');
  };

  const handleGuest = async () => {
    const u = await mockLogin('');
    setUser(u);
    setView('library');
  };

  const handleUpdateUser = (newUser: User) => {
      setUser(newUser);
  };

  const handleSelectNovel = (id: string) => {
    setActiveNovelId(id);
  };

  const handleStartReading = (novelId: string, chapterNum: number) => {
    setReadingSession({ novelId, chapter: chapterNum });
    setView('reader');
    setActiveNovelId(null); // Close details modal
  };

  const handleMarkChapterRead = (chapterNum: number) => {
      if (!readingSession) return;
      
      setLibrary(prev => prev.map(novel => {
          if (novel.id === readingSession.novelId) {
              // Update last read
              const newLastRead = Math.max(novel.lastReadChapter, chapterNum);
              // Add to read history if not exists
              const newReadList = novel.readChapters.includes(chapterNum) 
                ? novel.readChapters 
                : [...novel.readChapters, chapterNum];
              
              return { ...novel, lastReadChapter: newLastRead, readChapters: newReadList };
          }
          return novel;
      }));

      // Update User Stats (Chapters Read)
      if (user) {
          setUser({
              ...user,
              stats: {
                  ...user.stats,
                  chaptersRead: user.stats.chaptersRead + 1
              }
          });
      }
  };

  const handleTimeUpdate = (minutes: number) => {
      if (user) {
          setUser(prev => prev ? ({
              ...prev,
              stats: {
                  ...prev.stats,
                  totalReadTime: prev.stats.totalReadTime + minutes
              }
          }) : null);
      }
  };

  const handleToggleBookmark = (novelId: string, chapterNum: number) => {
      setLibrary(prev => prev.map(novel => {
          if (novel.id === novelId) {
             const newBookmarks = novel.bookmarkedChapters.includes(chapterNum)
                ? novel.bookmarkedChapters.filter(c => c !== chapterNum)
                : [...novel.bookmarkedChapters, chapterNum];
             return { ...novel, bookmarkedChapters: newBookmarks };
          }
          return novel;
      }));
  };

  // --- Category Management ---
  const handleCreateCategory = (name: string) => {
      const newCat: Category = {
          id: `cat-${Date.now()}`,
          name: name,
          sortOrder: categories.length
      };
      setCategories([...categories, newCat]);
  };

  const handleUpdateCategory = (id: string, name: string) => {
      setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  };

  const handleDeleteCategory = (id: string) => {
      // Don't allow deleting the last category
      if (categories.length <= 1) return;

      // Find a fallback category (first available that isn't the deleted one)
      const fallbackCatId = categories.find(c => c.id !== id)?.id || 'reading';

      setCategories(prev => prev.filter(c => c.id !== id));
      
      // Move novels in this category to fallback
      setLibrary(prev => prev.map(n => n.categoryId === id ? { ...n, categoryId: fallbackCatId } : n));
  };

  const handleUpdateNovel = (id: string, updates: Partial<LibraryEntry>) => {
      setLibrary(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  // --- Import Novel ---
  const handleAddNovel = (novel: Novel, categoryId: string) => {
      const newEntry: LibraryEntry = {
          ...novel,
          lastReadChapter: 0,
          readChapters: [],
          bookmarkedChapters: [],
          categoryId: categoryId
      };
      setLibrary(prev => [newEntry, ...prev]);
  };

  // Render logic
  if (view === 'auth') {
    return <AuthScreen onLogin={handleLogin} onGuest={handleGuest} />;
  }

  if (view === 'reader' && readingSession) {
    const currentNovel = library.find(n => n.id === readingSession.novelId);
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
      />
    );
  }

  // Library View
  return (
    <div className="antialiased text-gray-200">
      {user && (
        <>
          <Library 
            user={user}
            novels={library}
            categories={categories}
            onSelectNovel={handleSelectNovel}
            onOpenProfile={() => setIsProfileOpen(true)}
            onAddNovel={handleAddNovel}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
          
          {/* Novel Details Modal */}
          {activeNovelId && (
            <NovelDetails 
               novel={library.find(n => n.id === activeNovelId)!}
               categories={categories}
               onClose={() => setActiveNovelId(null)}
               onPlay={(ch) => handleStartReading(activeNovelId, ch)}
               onToggleBookmark={(ch) => handleToggleBookmark(activeNovelId, ch)}
               onUpdateNovel={handleUpdateNovel}
            />
          )}

          {/* Profile Modal */}
          <Profile 
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            user={user}
            onUpdate={handleUpdateUser}
          />
        </>
      )}
    </div>
  );
}

export default App;
