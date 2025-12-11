
import React, { useState } from 'react';
import { User } from '../types';
import { X, Save, RefreshCw, Trophy, Clock, Book, Flame, Edit2, Globe, Folder } from 'lucide-react';

interface ProfileProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onUpdate: (user: User) => void;
    localMode?: boolean;
    onToggleLocalMode?: (enabled: boolean) => void;
}

export const Profile: React.FC<ProfileProps> = ({ isOpen, onClose, user, onUpdate, localMode, onToggleLocalMode }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);

    if (!isOpen) return null;

    const handleRandomizeAvatar = () => {
        const seed = Math.random().toString(36).substring(7);
        setFormData({
            ...formData,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
        });
    };

    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
    };

    // Format minutes to hours/mins
    const formatTime = (mins: number) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${h}h ${m}m`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="w-full max-w-2xl bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#18181b]">
                    <h2 className="text-xl font-bold text-white font-display">Reader Profile</h2>
                    <div className="flex gap-3 items-center">

                        {/* Mode Toggle */}
                        <div
                            className="relative flex items-center bg-black/40 rounded-full p-1 border border-white/10 cursor-pointer w-36 h-9"
                            onClick={() => onToggleLocalMode && onToggleLocalMode(!localMode)}
                        >
                            {/* Sliding Background */}
                            <div
                                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/30 transition-all duration-300 ease-out ${localMode ? 'left-[calc(50%+2px)]' : 'left-1'}`}
                            />

                            {/* Web Option */}
                            <div className={`flex-1 flex items-center justify-center gap-1.5 relative z-10 text-xs font-bold transition-colors duration-300 ${!localMode ? 'text-white' : 'text-gray-500'}`}>
                                <Globe size={14} />
                                <span>Web</span>
                            </div>

                            {/* Local Option */}
                            <div className={`flex-1 flex items-center justify-center gap-1.5 relative z-10 text-xs font-bold transition-colors duration-300 ${localMode ? 'text-white' : 'text-gray-500'}`}>
                                <Folder size={14} />
                                <span>Local</span>
                            </div>
                        </div>

                        <div className="w-px h-6 bg-white/10 mx-1" />

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 text-indigo-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <Edit2 size={20} />
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto flex-1 p-6 space-y-8">

                    {/* Top Section: Avatar & Details */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="relative group shrink-0">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-indigo-500/20 shadow-xl bg-[#0f0f12]">
                                <img src={isEditing ? formData.avatar : user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            {isEditing && (
                                <button
                                    onClick={handleRandomizeAvatar}
                                    className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition-colors shadow-lg"
                                    title="Randomize Avatar"
                                >
                                    <RefreshCw size={14} />
                                </button>
                            )}
                        </div>

                        <div className="flex-1 text-center sm:text-left space-y-3 w-full">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white font-bold text-xl focus:outline-none focus:border-indigo-500"
                                        placeholder="Username"
                                    />
                                    <textarea
                                        value={formData.bio || ''}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        rows={2}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
                                        placeholder="Bio..."
                                    />
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">{user.username}</h3>
                                        <p className="text-gray-400 text-sm">{user.bio || "No bio set."}</p>
                                    </div>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                                            Pro Reader
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
                                            {user.isGuest ? 'Guest' : 'Member'}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Statistics</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <StatCard
                                icon={<Clock className="text-blue-400" size={20} />}
                                label="Time Read"
                                value={formatTime(user.stats.totalReadTime)}
                            />
                            <StatCard
                                icon={<Book className="text-green-400" size={20} />}
                                label="Books Done"
                                value={user.stats.booksFinished}
                            />
                            <StatCard
                                icon={<Flame className="text-orange-400" size={20} />}
                                label="Streak"
                                value={`${user.stats.readingStreak} Days`}
                            />
                            <StatCard
                                icon={<Trophy className="text-yellow-400" size={20} />}
                                label="Chapters"
                                value={user.stats.chaptersRead}
                            />
                        </div>
                    </div>

                    {/* Achievements */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Achievements</h4>
                        <div className="space-y-3">
                            {user.achievements.map((ach) => (
                                <div key={ach.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${ach.unlocked ? 'bg-indigo-500/20 grayscale-0' : 'bg-white/5 grayscale opacity-50'}`}>
                                        {ach.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h5 className={`font-medium ${ach.unlocked ? 'text-white' : 'text-gray-500'}`}>{ach.title}</h5>
                                            <span className="text-xs text-gray-500">{ach.progress}%</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">{ach.description}</p>
                                        <div className="h-1 w-full bg-black/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 transition-all duration-500"
                                                style={{ width: `${ach.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                {isEditing && (
                    <div className="p-4 border-t border-white/5 bg-black/20 flex gap-4">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> Save Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center gap-2 hover:bg-white/10 transition-colors">
        <div className="p-2 rounded-full bg-black/20">
            {icon}
        </div>
        <div>
            <div className="text-xl font-bold text-white font-display">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
        </div>
    </div>
);
