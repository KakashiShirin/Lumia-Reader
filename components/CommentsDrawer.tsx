import React from 'react';
import { Comment } from '../types';
import { X, ThumbsUp, Send } from 'lucide-react';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  chapterNumber?: number;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({ isOpen, onClose, comments, chapterNumber }) => {
  const [newComment, setNewComment] = React.useState('');

  // Prevent scroll on body when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-surface z-50 shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-white/5 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-surface/90 backdrop-blur-md sticky top-0 z-10">
            <div>
                <h3 className="text-white font-bold text-lg">Comments</h3>
                {chapterNumber && <p className="text-xs text-gray-500">Chapter {chapterNumber}</p>}
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="group flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full bg-gray-700 object-cover" />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-gray-200">{comment.user}</span>
                    <span className="text-xs text-gray-600">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 leading-relaxed">{comment.content}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-400 transition-colors">
                        <ThumbsUp size={12} />
                        {comment.likes}
                    </button>
                    <button className="text-xs text-gray-500 hover:text-white transition-colors">Reply</button>
                  </div>
                </div>
              </div>
            ))}
            
            {comments.length === 0 && (
                <div className="text-center py-10 text-gray-600">
                    No comments yet. Be the first!
                </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 bg-surface">
            <div className="relative">
                <input 
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..." 
                    className="w-full bg-black/30 border border-white/10 rounded-full py-3 px-4 pr-12 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button 
                    disabled={!newComment.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-full disabled:opacity-50 disabled:bg-gray-700 transition-all hover:bg-indigo-500"
                >
                    <Send size={14} />
                </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
