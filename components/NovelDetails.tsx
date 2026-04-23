
import React, { useState, useMemo } from 'react';
import { LibraryEntry, TOCItem, Category } from '../types';
import { fetchTOC, refreshNovel } from '../services/mockService';
import { X, Play, Search, Check, Bookmark, Edit3, Save, Trash2, FolderInput, LayoutList, Info, RefreshCw } from 'lucide-react';

interface NovelDetailsProps {
  novel: LibraryEntry;
  categories: Category[];
  onClose: () => void;
  onPlay: (chapterNum: number) => void;
  onToggleBookmark: (chapterNum: number) => void;
  onUpdateNovel: (id: string, updates: Partial<LibraryEntry>) => void;
}

type Tab = 'overview' | 'chapters';

export const NovelDetails: React.FC<NovelDetailsProps> = ({
  novel,
  categories,
  onClose,
  onPlay,
  onToggleBookmark,
  onUpdateNovel
}) => {
  if (!novel) return null;

  const [chapters, setChapters] = useState<TOCItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Edit State
  const [editForm, setEditForm] = useState({
    customTitle: novel.customTitle || novel.title,
    customCoverUrl: novel.customCoverUrl || novel.coverUrl,
    categoryId: novel.categoryId,
    sourceUrl: novel.sourceUrl || ''
  });

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let data: TOCItem[] = [];
        // Check if local book (no sourceUrl or ID starts with local-)
        if (!novel.sourceUrl || novel.id.startsWith('local-')) {
          const { localReader } = await import('../services/LocalReaderService');
          data = await localReader.getTOC(novel.id);
        } else {
          data = await fetchTOC(novel.id);
        }
        setChapters(data);
      } catch (e) {
        console.error("Failed to load chapters:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [novel.id, novel.sourceUrl]);

  const handleRefresh = async () => {
    if (!novel.sourceUrl) return;
    setLoading(true);
    try {
      const updatedNovel = await refreshNovel(novel.sourceUrl);
      onUpdateNovel(novel.id, updatedNovel);
      // Reload chapters
      const data = await fetchTOC(novel.id);
      setChapters(data);
    } catch (e) {
      console.error("Failed to refresh:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = () => {
    onUpdateNovel(novel.id, {
      ...editForm,
      customTitle: editForm.customTitle,
      customCoverUrl: editForm.customCoverUrl
    });
    setIsEditing(false);
  };

  const handleMoveCategory = (catId: string) => {
    onUpdateNovel(novel.id, { categoryId: catId });
    setEditForm(prev => ({ ...prev, categoryId: catId }));
  };

  const filteredChapters = useMemo(() => {
    return chapters.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.number.toString().includes(search)
    );
  }, [chapters, search]);

  const displayTitle = novel.customTitle || novel.title;
  const displayCover = novel.customCoverUrl || novel.coverUrl;
  const currentCategoryName = categories.find(c => c.id === novel.categoryId)?.name || 'Uncategorized';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full h-full sm:h-[90vh] sm:max-w-6xl bg-[#121212] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row animate-in zoom-in-95 duration-300 border border-white/5">

        {/* Mobile Header & Tabs */}
        <div className="sm:hidden flex-none bg-[#18181b] border-b border-white/5 z-20">
          <div className="flex items-center justify-between p-4">
            <h2 className="font-bold text-white truncate max-w-[200px]">{displayTitle}</h2>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full"><X size={20} /></button>
          </div>
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'overview' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500'}`}
            >
              <Info size={16} /> Overview
            </button>
            <button
              onClick={() => setActiveTab('chapters')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'chapters' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500'}`}
            >
              <LayoutList size={16} /> Chapters ({chapters.length})
            </button>
          </div>
        </div>

        {/* Left Panel: Info (Hidden on Mobile if Tab is Chapters) */}
        <div className={`w-full sm:w-[400px] bg-[#18181b] flex flex-col relative sm:border-r border-white/10 overflow-y-auto custom-scrollbar transition-all ${activeTab === 'chapters' ? 'hidden sm:flex' : 'flex'}`}>

          {/* Background Blur Effect */}
          <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none sticky-top-0">
            {displayCover && <img src={displayCover} className="w-full h-full object-cover blur-3xl scale-150" />}
          </div>

          <div className="relative z-10 p-6 flex-1">
            {/* Desktop Close/Edit Actions */}
            <div className="hidden sm:flex justify-between items-start mb-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-black/20 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                  title="Edit Metadata"
                >
                  <Edit3 size={18} />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={18} /></button>
                  <button onClick={handleSaveEdit} className="p-2 bg-indigo-600 rounded-full hover:bg-indigo-500"><Save size={18} /></button>
                </div>
              )}
              <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Reload Button (Only if sourceUrl exists) */}
            {novel.sourceUrl && (
              <div className="absolute top-6 right-6 sm:hidden">
                <button onClick={handleRefresh} disabled={loading} className="p-2 bg-white/10 rounded-full text-white">
                  <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
              </div>
            )}

            {/* Cover Image */}
            <div className="aspect-[2/3] w-48 sm:w-56 mx-auto rounded-xl shadow-2xl overflow-hidden mb-8 border border-white/10 group relative">
              {displayCover ? (
                <img src={displayCover} alt={displayTitle} className="w-full h-full object-cover shadow-inner" />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-600">
                  <FolderInput size={48} />
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">Cover URL</span>
                  <input
                    type="text"
                    value={editForm.customCoverUrl}
                    onChange={(e) => setEditForm({ ...editForm, customCoverUrl: e.target.value })}
                    className="w-full bg-white/10 border border-white/30 rounded px-2 py-1 text-xs text-white"
                  />
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="space-y-6 text-center sm:text-left">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.customTitle}
                  onChange={(e) => setEditForm({ ...editForm, customTitle: e.target.value })}
                  className="w-full bg-transparent border-b border-white/20 text-2xl font-bold text-white focus:outline-none focus:border-indigo-500 pb-2 text-center"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight text-center">{displayTitle}</h1>
              )}

              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1"><span className="text-indigo-400">Author:</span> {novel.author}</span>
                <span>•</span>
                <span>{novel.status}</span>
                <span>•</span>
                <span>★ {novel.rating}</span>
                {novel.sourceUrl && (
                  <button onClick={handleRefresh} disabled={loading} className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors" title="Reload from Source">
                    <RefreshCw size={14} className={`text-gray-400 ${loading ? "animate-spin" : ""}`} />
                  </button>
                )}
              </div>

              {/* Category Switcher */}
              <div className="flex justify-center sm:justify-start">
                <div className="relative group inline-block">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors text-xs font-medium text-gray-300">
                    <FolderInput size={14} />
                    {currentCategoryName}
                  </button>
                  {/* Dropdown */}
                  <div className="absolute left-0 mt-2 w-48 bg-[#1f1f23] border border-white/10 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-50">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleMoveCategory(cat.id)}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-white/5 ${novel.categoryId === cat.id ? 'text-indigo-400 font-bold' : 'text-gray-400'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Play Button */}
              <button
                onClick={() => onPlay(novel.lastReadChapter > 0 ? novel.lastReadChapter : 1)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play size={22} fill="currentColor" />
                <span className="tracking-wide">{novel.lastReadChapter > 0 ? `Continue Chapter ${novel.lastReadChapter}` : 'Start Reading'}</span>
              </button>

              {/* Description */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Synopsis</h3>
                <p className="text-gray-300 text-sm leading-relaxed max-h-60 overflow-y-auto custom-scrollbar">
                  {novel.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {novel.tags.map(tag => (
                  <span key={tag} className="text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-white/10 text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Chapters (Hidden on Mobile if Tab is Overview) */}
        <div className={`flex-1 bg-[#0f0f12] flex flex-col h-full overflow-hidden ${activeTab === 'overview' ? 'hidden sm:flex' : 'flex'}`}>

          {/* Chapter Search Header */}
          <div className="p-4 border-b border-white/5 bg-[#18181b] z-10 flex-none">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Search chapters..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder-gray-600"
              />
            </div>
          </div>

          {/* Chapter List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="pb-20 sm:pb-0">
                {filteredChapters.map((chapter, index) => {
                  const isRead = novel.readChapters.includes(chapter.number);
                  const isBookmarked = novel.bookmarkedChapters.includes(chapter.number);
                  const isCurrent = novel.lastReadChapter === chapter.number;

                  return (
                    <div
                      key={chapter.number}
                      className={`group flex items-center justify-between p-4 border-b border-white/[0.02] hover:bg-white/5 transition-all cursor-pointer ${isCurrent ? 'bg-indigo-500/5' : ''}`}
                      onClick={() => onPlay(chapter.number)}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className={`text-xs font-mono w-10 shrink-0 opacity-50 ${isCurrent ? 'text-indigo-400 font-bold opacity-100' : 'text-gray-500'}`}>
                          {chapter.number.toString().padStart(3, '0')}
                        </span>
                        <div className="min-w-0">
                          <h4 className={`truncate text-sm font-medium pr-4 ${isCurrent ? 'text-indigo-400' : isRead ? 'text-gray-500' : 'text-gray-200'}`}>
                            {chapter.title}
                          </h4>
                          {isCurrent && <span className="text-[10px] text-indigo-500 font-bold tracking-wider uppercase">Last Read</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isRead && <Check size={14} className="text-green-500/50" />}
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleBookmark(chapter.number); }}
                          className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isBookmarked ? 'text-indigo-400' : 'text-gray-700 group-hover:text-gray-400'}`}
                        >
                          <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {filteredChapters.length === 0 && (
                  <div className="text-center py-20 text-gray-500 text-sm flex flex-col items-center gap-2">
                    <Search size={24} className="opacity-20" />
                    No chapters found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Gradient Overlay for List */}
          <div className="h-6 bg-gradient-to-t from-[#0f0f12] to-transparent pointer-events-none flex-none -mt-6 z-10 sm:hidden" />
        </div>
      </div>
    </div>
  );
};
