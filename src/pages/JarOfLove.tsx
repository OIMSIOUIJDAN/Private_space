import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Plus, X, Heart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockLoveNotes, type LoveNote } from '../data/mockData';

export default function JarOfLove() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<LoveNote[]>(mockLoveNotes);
  const [currentNote, setCurrentNote] = useState<LoveNote | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const pullRandomNote = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      const randomIndex = Math.floor(Math.random() * notes.length);
      setCurrentNote(notes[randomIndex]);
    }, 800);
  };

  const addNote = () => {
    if (!newNoteText.trim()) return;
    const newNote: LoveNote = {
      id: Date.now().toString(),
      text: newNoteText,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setNotes([...notes, newNote]);
    setNewNoteText('');
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen pb-28 bg-navy">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 flex items-center gap-3 px-5 py-4 bg-surface/80 backdrop-blur-xl border-b border-border-blue/40 safe-top"
      >
        <button onClick={() => navigate('/')} className="p-1">
          <ArrowLeft size={20} className="text-text-secondary" />
        </button>
        <div className="flex-1">
          <h2 className="font-serif text-xl text-text-primary">Jar of Love</h2>
          <p className="text-xs text-text-muted">Reasons I love you, one at a time</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="p-2 rounded-full bg-baby-pink/15 active:scale-95 transition-transform"
        >
          <Plus size={18} className="text-baby-pink" />
        </button>
      </motion.div>

      <div className="max-w-md mx-auto px-5 pt-8">
        {/* Jar Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center mb-8"
        >
          <motion.div
            animate={isShaking ? { 
              rotate: [-3, 3, -3, 3, -2, 2, 0],
              scale: [1, 1.02, 1, 1.02, 1]
            } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Jar body */}
            <div className="w-48 h-56 bg-gradient-to-b from-surface-light/80 to-navy-mid/60 rounded-[40%_40%_35%_35%] border-2 border-baby-pink/30 shadow-lg shadow-baby-pink/10 relative overflow-hidden">
              {/* Notes inside jar */}
              <div className="absolute inset-3 flex flex-wrap items-center justify-center gap-1 p-2">
                {notes.slice(0, 8).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="w-6 h-8 rounded-sm"
                    style={{
                      backgroundColor: ['#f8c8dc', '#fdd5e5', '#e8a0bc', '#f8c8dc', '#fdd5e5', '#e8a0bc', '#f8c8dc', '#fdd5e5'][i],
                      transform: `rotate(${-15 + i * 8}deg)`,
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>
              {/* Glass shine */}
              <div className="absolute top-4 left-4 w-8 h-20 bg-baby-pink/10 rounded-full blur-sm" />
            </div>
            {/* Jar lid */}
            <div className="w-36 h-6 bg-gradient-to-b from-blue-accent to-blue-soft rounded-t-xl mx-auto -mt-1 shadow-sm" />
            {/* Jar label */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-surface/90 px-3 py-1 rounded-lg border border-baby-pink/30">
              <p className="text-[10px] text-baby-pink font-medium">{notes.length} notes</p>
            </div>
          </motion.div>

          {/* Pull button */}
          <motion.button
            onClick={pullRandomNote}
            whileTap={{ scale: 0.95 }}
            className="mt-8 flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-baby-pink to-baby-pink-dark text-navy font-medium shadow-lg shadow-baby-pink/20 active:scale-95 transition-transform"
          >
            <Sparkles size={18} />
            <span>Pull a note</span>
          </motion.button>
        </motion.div>

        {/* Current Note Display */}
        <AnimatePresence mode="wait">
          {currentNote && (
            <motion.div
              key={currentNote.id}
              initial={{ opacity: 0, y: 20, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, rotateX: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative"
            >
              <div className="bg-surface-light rounded-3xl p-6 shadow-lg border border-baby-pink/20 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-3 right-3">
                  <Heart size={14} className="text-baby-pink fill-baby-pink/30" />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-baby-pink/10 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-baby-pink/10 rounded-full blur-xl" />
                
                <p className="font-serif text-lg text-text-primary leading-relaxed italic text-center mb-4">
                  "{currentNote.text}"
                </p>
                <p className="text-xs text-text-muted text-center">
                  Added on {currentNote.date}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent notes list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10"
        >
          <h3 className="font-serif text-sm text-text-secondary mb-3 flex items-center gap-2">
            <Sparkles size={14} />
            All our reasons
          </h3>
          <div className="space-y-2">
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="bg-surface-light/60 rounded-2xl px-4 py-3 border border-border-blue/30 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-baby-pink/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart size={10} className="text-baby-pink fill-baby-pink/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary leading-relaxed">{note.text}</p>
                  <p className="text-[10px] text-text-muted mt-1">{note.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Add Note Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-navy/70 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-md bg-surface rounded-t-3xl p-6 pb-10 safe-bottom border-t border-border-blue/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl text-text-primary">Add a reason</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 rounded-full bg-navy active:scale-95 transition-transform"
                >
                  <X size={18} className="text-text-secondary" />
                </button>
              </div>
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Write why you love them..."
                className="w-full h-32 p-4 rounded-2xl bg-navy border border-border-blue/50 text-sm text-text-primary placeholder:text-text-muted/60 resize-none focus:outline-none focus:border-baby-pink/50 focus:ring-2 focus:ring-baby-pink/20 transition-all"
                autoFocus
              />
              <button
                onClick={addNote}
                disabled={!newNoteText.trim()}
                className="mt-4 w-full py-3 rounded-full bg-gradient-to-r from-baby-pink to-baby-pink-dark text-navy font-medium disabled:opacity-40 active:scale-95 transition-all shadow-lg shadow-baby-pink/20"
              >
                Add to the jar 💕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
