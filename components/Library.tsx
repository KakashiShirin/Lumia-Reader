
import React, { useState, useEffect } from 'react';
import { User, LibraryEntry, Category, Novel } from '../types';
import { Search, BookOpen, Plus, MoreHorizontal, PenSquare, Trash2, Check, X, FolderPlus, Link as LinkIcon, ArrowRight, Loader2, Clock } from 'lucide-react';
import { fetchNovelFromUrl } from '../services/mockService';

interface LibraryProps {
    user: User;
    novels: LibraryEntry[];
    categories: Category[];
    onSelectNovel: (id: string) => void;
    onOpenProfile: () => void;
    onAddNovel: (novel: Novel, categoryId: string, fileData?: ArrayBuffer) => void;
    onUpdateCategory: (id: string, name: string) => void;
    onCreateCategory: (name: string) => void;
    onDeleteCategory: (id: string) => void;
    localMode?: boolean;
    onDeleteNovel: (id: string) => void;
    onToggleMode: (e: React.MouseEvent) => void;
}

export const Library: React.FC<LibraryProps> = ({
    user,
    novels,
    categories,
    onSelectNovel,
    onOpenProfile,
    onAddNovel,
    onUpdateCategory,
    onCreateCategory,
    onDeleteCategory,
    localMode,
    onDeleteNovel,
    onToggleMode
}) => {
    const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id || 'reading');
    const [isManagingCats, setIsManagingCats] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [editingCatId, setEditingCatId] = useState<string | null>(null);
    const [editingCatName, setEditingCatName] = useState('');
    const [greeting, setGreeting] = useState('Welcome back');

    // Quick Add Modal State
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [quickAddUrl, setQuickAddUrl] = useState('');
    const [isFetchingUrl, setIsFetchingUrl] = useState(false);
    const [fetchedNovel, setFetchedNovel] = useState<Novel | null>(null);
    const [selectedQuickAddCategory, setSelectedQuickAddCategory] = useState('plan'); // Default to Plan to Read

    const recentNovel = novels.find(n => n.lastReadChapter > 0);
    const filteredNovels = novels.filter(n => n.categoryId === activeCategoryId);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    // Ensure Plan to Read exists for default add
    const planToReadId = categories.find(c => c.id === 'plan')?.id || categories[0].id;

    const handleCreateCategory = () => {
        if (newCatName.trim()) {
            onCreateCategory(newCatName.trim());
            setNewCatName('');
        }
    };

    const handleDeleteWithConfirm = (id: string, name: string) => {
        if (window.confirm(`Delete category "${name}"? Novels will be moved to Default.`)) {
            onDeleteCategory(id);
            if (activeCategoryId === id) {
                setActiveCategoryId(categories[0].id); // Reset to first available
            }
        }
    };

    const handleUpdateCategory = (id: string) => {
        if (editingCatName.trim()) {
            onUpdateCategory(id, editingCatName.trim());
            setEditingCatId(null);
        }
    };

    const handleFetchNovel = async () => {
        if (!quickAddUrl.trim()) return;
        setIsFetchingUrl(true);
        try {
            const novel = await fetchNovelFromUrl(quickAddUrl);
            setFetchedNovel(novel);
        } catch (e) {
            alert("Failed to fetch novel details.");
        } finally {
            setIsFetchingUrl(false);
        }
    };

    const handleConfirmAdd = () => {
        if (fetchedNovel) {
            onAddNovel(fetchedNovel, selectedQuickAddCategory || planToReadId);
            handleCloseQuickAdd();
        }
    };

    const handleCloseQuickAdd = () => {
        setIsQuickAddOpen(false);
        setQuickAddUrl('');
        setFetchedNovel(null);
        setSelectedQuickAddCategory(planToReadId);
    };

    return (

        <div className="min-h-screen bg-[#0f0f12] text-white pb-32 font-sans">

            {/* Header */}
            <header className="sticky top-0 z-30 bg-[#0f0f12]/90 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-[#0f0f12]/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">

                    {/* Logo */}
                    {/* Logo (Mode Switch) */}
                    <div className="flex items-center gap-3 shrink-0 cursor-pointer group" onClick={(e) => onToggleMode(e)} title="Switch Library Mode">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] ring-1 transition-all duration-500 ${localMode ? 'bg-emerald-500/20 text-emerald-400 ring-emerald-500/30' : 'bg-indigo-500/20 text-indigo-400 ring-indigo-500/30'}`}>
                            <BookOpen size={20} className="group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <span className="font-display font-bold text-lg leading-none tracking-tight">Lumina</span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${localMode ? 'text-emerald-500' : 'text-indigo-500'}`}>{localMode ? 'Local' : 'Cloud'}</span>
                        </div>
                    </div>

                    {/* Search & Quick Add */}
                    <div className="flex-1 max-w-md mx-auto flex items-center gap-2">
                        <div className="relative group flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search your library..."
                                className="w-full bg-[#18181b] border border-white/5 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-600"
                            />
                        </div>
                        <button
                            onClick={() => setIsQuickAddOpen(true)}
                            className="p-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 shrink-0"
                            title="Quick Add Novel"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    {/* User Profile */}
                    <button
                        onClick={onOpenProfile}
                        className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group shrink-0"
                    >
                        <div className="text-right hidden sm:block">
                            <div className="text-xs font-bold text-gray-300 group-hover:text-white">{user.username}</div>
                            <div className="text-xs text-gray-500">{user.isGuest ? 'Guest' : 'Lvl. 12'}</div>
                        </div>
                        <img src={user.avatar} alt={user.username} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-700 border border-white/10" />
                    </button>
                </div>

                {/* Categories Tab Bar */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between border-t border-white/5">
                    {/* Hide scrollbar class added via inline style as requested for mobile view */}
                    <div
                        className="flex gap-2 overflow-x-auto py-3 flex-1 mask-gradient-right"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategoryId(cat.id)}
                                className={`relative whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${activeCategoryId === cat.id
                                    ? 'text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {activeCategoryId === cat.id && (
                                    <span className="absolute inset-0 bg-indigo-600 rounded-full -z-10 animate-in zoom-in-90 duration-300 ease-out" />
                                )}
                                <span className="relative z-10">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                    <div className="pl-4 border-l border-white/10 flex items-center shadow-[-10px_0_10px_-5px_rgba(0,0,0,0.5)] z-10 bg-[#0f0f12]">
                        <button
                            onClick={() => setIsManagingCats(!isManagingCats)}
                            className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${isManagingCats ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <MoreHorizontal size={16} /> <span className="hidden sm:inline">Edit Tabs</span>
                        </button>
                    </div>
                </div >

                {/* Category Manager (Expandable) */}
                {
                    isManagingCats && (
                        <div className="bg-[#121214] border-b border-white/10 animate-in slide-in-from-top-2 shadow-2xl relative z-10">
                            <div className="max-w-7xl mx-auto px-4 py-6">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Manage Custom Categories</h3>

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {/* Create New */}
                                    <div className="flex gap-2 p-1 bg-black/40 rounded-lg border border-white/5 border-dashed focus-within:border-indigo-500/50 transition-colors">
                                        <div className="pl-3 flex items-center text-gray-500"><FolderPlus size={16} /></div>
                                        <input
                                            type="text"
                                            value={newCatName}
                                            onChange={(e) => setNewCatName(e.target.value)}
                                            placeholder="Create new..."
                                            className="flex-1 bg-transparent py-2 text-sm text-white focus:outline-none placeholder-gray-600"
                                        />
                                        <button
                                            onClick={handleCreateCategory}
                                            className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold disabled:opacity-50"
                                            disabled={!newCatName.trim()}
                                        >
                                            ADD
                                        </button>
                                    </div>

                                    {/* Edit Existing */}
                                    {categories.map(cat => (
                                        <div key={cat.id} className={`flex gap-2 items-center bg-white/5 p-2 rounded-lg border border-white/5 ${cat.isDefault ? 'opacity-75' : ''}`}>
                                            {editingCatId === cat.id ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={editingCatName}
                                                        onChange={(e) => setEditingCatName(e.target.value)}
                                                        className="flex-1 bg-black/40 rounded px-2 py-1 text-sm text-white focus:outline-none border border-indigo-500"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleUpdateCategory(cat.id)} className="text-green-400 p-1.5 hover:bg-white/10 rounded"><Check size={14} /></button>
                                                    <button onClick={() => setEditingCatId(null)} className="text-red-400 p-1.5 hover:bg-white/10 rounded"><X size={14} /></button>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="flex-1 text-sm text-gray-300 truncate px-2 font-medium">{cat.name} {cat.isDefault && <span className="text-[10px] text-gray-600 ml-2 uppercase border border-gray-700 px-1 rounded">Default</span>}</span>
                                                    {!cat.isDefault && (
                                                        <>
                                                            <button
                                                                onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name); }}
                                                                className="text-gray-500 hover:text-indigo-400 p-1.5 hover:bg-white/5 rounded transition-colors"
                                                            >
                                                                <PenSquare size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteWithConfirm(cat.id, cat.name)}
                                                                className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-white/5 rounded transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }
            </header >

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">

                {/* Welcome Message */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-1">
                        <Clock size={14} />
                        <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
                        {greeting}, <span className="text-gray-400">{user.username}</span>.
                    </h1>
                </div>

                {/* Continue Reading Hero */}
                {recentNovel && activeCategoryId === 'reading' && !localMode && (
                    <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                            Continue Reading
                        </h2>
                        <div
                            className="group relative rounded-2xl overflow-hidden aspect-[2/1] sm:aspect-[3/1] md:h-80 flex items-end p-6 sm:p-10 border border-white/10 cursor-pointer shadow-2xl shadow-indigo-900/10 hover:shadow-indigo-500/20 transition-all duration-500"
                            onClick={() => onSelectNovel(recentNovel.id)}
                        >
                            <div className="absolute inset-0">
                                <img src={recentNovel.customCoverUrl || recentNovel.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-[#0f0f12]/40 to-transparent" />
                                <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors duration-500 mix-blend-overlay" />
                            </div>

                            <div className="relative z-10 w-full flex items-end justify-between gap-4">
                                <div className="max-w-2xl">
                                    <h3 className="text-2xl sm:text-4xl font-display font-bold text-white mb-2 leading-tight drop-shadow-lg group-hover:text-indigo-200 transition-colors">
                                        {recentNovel.customTitle || recentNovel.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                                        <span className="text-indigo-400 font-medium bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Chapter {recentNovel.lastReadChapter}</span>
                                        <span className="truncate opacity-80">by {recentNovel.author}</span>
                                    </div>
                                </div>
                                <button className="hidden sm:flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-indigo-50 transition-all shadow-lg transform group-hover:scale-105 active:scale-95">
                                    <BookOpen size={18} fill="currentColor" /> Resume
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* Library Grid */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider animate-in fade-in duration-500">
                            {localMode ? 'Local Books' : categories.find(c => c.id === activeCategoryId)?.name}
                        </h2>
                        <div className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded">{localMode ? novels.length + ' Items' : filteredNovels.length + ' Items'}</div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
                        {(localMode ? novels : filteredNovels).map((novel, idx) => (
                            <div
                                key={novel.id}
                                className="group cursor-pointer space-y-4 animate-in fade-in zoom-in-95 duration-500 relative perspective-1000 fill-mode-backwards"
                                style={{ animationDelay: `${idx * 50}ms` }}
                                onClick={() => onSelectNovel(novel.id)}
                            >
                                <div className="relative aspect-[2/3] rounded-xl transition-all duration-300 group-hover:-translate-y-2 preserve-3d">
                                    {/* Shadow & Glow */}
                                    <div className="absolute -inset-0.5 bg-indigo-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-lg group-hover:shadow-2xl bg-[#18181b]">
                                        {(novel.customCoverUrl || novel.coverUrl) ? (
                                            <img src={novel.customCoverUrl || novel.coverUrl} alt={novel.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900/40 to-black p-4 text-center">
                                                <BookOpen size={32} className="text-white/20 mb-2" />
                                                <span className="text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-widest line-clamp-2">{novel.customTitle || novel.title}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                                        {/* Status Badge */}
                                        <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-y-2 group-hover:translate-y-0">
                                            {novel.status}
                                        </div>

                                        {/* Delete Button */}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-y-2 group-hover:translate-y-0">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDeleteNovel(novel.id); }}
                                                className="p-1.5 rounded-full bg-red-500/80 text-white hover:bg-red-500 shadow-lg backdrop-blur-md transition-colors"
                                                title="Delete Novel"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reflection Effect */}
                                    <div className="absolute -bottom-4 left-0 right-0 h-full scale-y-[-0.3] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none origin-bottom mask-gradient-to-t">
                                        {(novel.customCoverUrl || novel.coverUrl) && (
                                            <img src={novel.customCoverUrl || novel.coverUrl} className="w-full h-full object-cover blur-sm" />
                                        )}
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="font-bold text-gray-200 leading-tight group-hover:text-indigo-400 transition-colors line-clamp-2 text-sm sm:text-base">
                                        {novel.customTitle || novel.title}
                                    </h3>
                                    <div className="mt-1 flex items-center gap-2">
                                        {novel.readChapters.length > 0 && (
                                            <div className="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500" style={{ width: `${(novel.readChapters.length / novel.totalChapters) * 100}%` }} />
                                            </div>
                                        )}
                                        <span className="text-[10px] text-gray-500">{novel.totalChapters > 0 ? `${novel.totalChapters} chs` : 'EPUB'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Empty State / Add Button */}
                        {(localMode ? novels : filteredNovels).length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-600 gap-4">
                                <BookOpen size={48} className="opacity-20" />
                                <p>No novels in this category yet.</p>
                                <button onClick={() => setIsQuickAddOpen(true)} className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-2">
                                    <Plus size={16} /> Add Novel
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Quick Add Modal (Web) */}
            {
                isQuickAddOpen && !localMode && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={handleCloseQuickAdd} />
                        <div className="relative w-full max-w-lg bg-[#18181b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                                    <LinkIcon size={20} className="text-indigo-500" /> Quick Add
                                </h3>
                                <button onClick={handleCloseQuickAdd} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* URL Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Novel URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={quickAddUrl}
                                            onChange={(e) => setQuickAddUrl(e.target.value)}
                                            placeholder="Paste link here..."
                                            className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            onKeyDown={(e) => e.key === 'Enter' && handleFetchNovel()}
                                        />
                                        <button
                                            onClick={handleFetchNovel}
                                            disabled={isFetchingUrl || !quickAddUrl}
                                            className="bg-white/5 hover:bg-indigo-600 hover:text-white text-gray-300 px-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isFetchingUrl ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Preview */}
                                {fetchedNovel && (
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="flex gap-4">
                                            <img src={fetchedNovel.coverUrl} alt="" className="w-16 h-24 object-cover rounded-md shadow-lg" />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-white truncate">{fetchedNovel.title}</h4>
                                                <p className="text-xs text-gray-400 mt-1">{fetchedNovel.author}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="text-[10px] px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/20">{fetchedNovel.status}</span>
                                                    <span className="text-[10px] px-2 py-0.5 bg-white/5 text-gray-400 rounded border border-white/10">{fetchedNovel.totalChapters} Chapters</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category Select */}
                                        <div className="mt-4 pt-4 border-t border-white/5">
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Add to Category</label>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => setSelectedQuickAddCategory(cat.id)}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedQuickAddCategory === cat.id
                                                            ? 'bg-indigo-600 border-indigo-500 text-white'
                                                            : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'
                                                            }`}
                                                    >
                                                        {cat.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-3">
                                <button onClick={handleCloseQuickAdd} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                                <button
                                    onClick={handleConfirmAdd}
                                    disabled={!fetchedNovel}
                                    className="px-6 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                                >
                                    Add to Library
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Add Local Book Modal */}
            {
                isQuickAddOpen && localMode && (
                    <AddLocalBookModal
                        onClose={() => setIsQuickAddOpen(false)}
                        onAdd={(novel, fileData) => {
                            onAddNovel(novel, 'reading', fileData);
                            setIsQuickAddOpen(false);
                        }}
                    />
                )
            }
        </div >
    );
};

// --- Add Local Book Modal Component ---
const AddLocalBookModal = ({ onClose, onAdd }: { onClose: () => void, onAdd: (novel: Novel, fileData: ArrayBuffer) => void }) => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [parsedNovel, setParsedNovel] = useState<Novel | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setLoading(true);

        try {
            const { localReader } = await import('../services/LocalReaderService');
            const buffer = await selectedFile.arrayBuffer();
            // Load temporarily to extract metadata
            const novel = await localReader.loadBook(buffer, `temp-${Date.now()}`);

            setParsedNovel(novel);
            setTitle(novel.title);
            setAuthor(novel.author);
            setCoverUrl(novel.coverUrl);
        } catch (err) {
            console.error("Failed to parse EPUB", err);
            alert("Failed to parse EPUB file.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!file || !title.trim()) return;

        setLoading(true);
        try {
            const { localReader } = await import('../services/LocalReaderService');
            const buffer = await file.arrayBuffer();
            // Load properly with final ID
            const novel = await localReader.loadBook(buffer);

            // Apply custom metadata
            novel.customTitle = title;
            novel.author = author; // Allow overriding author too
            if (coverUrl && coverUrl !== novel.coverUrl) {
                novel.customCoverUrl = coverUrl;
            }

            onAdd(novel, buffer);
        } catch (err) {
            console.error("Failed to add book", err);
            alert("Failed to add book.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-[#18181b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                        <FolderPlus size={20} className="text-indigo-500" /> Add Local Book
                    </h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* File Input */}
                    {!file ? (
                        <div
                            className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={() => document.getElementById('epub-file-input')?.click()}
                        >
                            <input
                                type="file"
                                id="epub-file-input"
                                accept=".epub"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400 mb-4">
                                <FolderPlus size={32} />
                            </div>
                            <h4 className="font-bold text-white mb-1">Select EPUB File</h4>
                            <p className="text-sm text-gray-500">Click to browse your device</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                    <BookOpen size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-white truncate">{file.name}</div>
                                    <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                                <button onClick={() => { setFile(null); setParsedNovel(null); }} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            {loading ? (
                                <div className="py-8 flex justify-center">
                                    <Loader2 size={32} className="animate-spin text-indigo-500" />
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Book Title <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500"
                                            placeholder="Enter title..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Author</label>
                                        <input
                                            type="text"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500"
                                            placeholder="Enter author..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Cover URL (Optional)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={coverUrl}
                                                onChange={(e) => setCoverUrl(e.target.value)}
                                                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500"
                                                placeholder="https://..."
                                            />
                                            {coverUrl && (
                                                <div className="w-12 h-12 rounded-lg border border-white/10 overflow-hidden shrink-0">
                                                    <img src={coverUrl} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                    <button
                        onClick={handleConfirm}
                        disabled={!file || !title.trim() || loading}
                        className="px-6 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                    >
                        Add to Library
                    </button>
                </div>
            </div>
        </div>
    );
};

