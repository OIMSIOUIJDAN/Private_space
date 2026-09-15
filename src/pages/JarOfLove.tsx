import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Plus, X, Heart, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';

interface LoveNote {
  id: string;
  note_text: string;
  created_at: string;
}

export default function JarOfLove() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [notes, setNotes] = useState<LoveNote[]>([]);
  const [currentNote, setCurrentNote] = useState<LoveNote | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const { data, error } = await supabase
      .from('love_notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading notes:', error);
    } else if (data) {
      setNotes(data);
    }
    setLoading(false);
  };

  const pullRandomNote = () => {
    if (notes.length === 0) return;
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      const randomIndex = Math.floor(Math.random() * notes.length);
      setCurrentNote(notes[randomIndex]);
    }, 800);
  };

  const addNote = async () => {
    if (!newNoteText.trim()) return;
    const { error } = await supabase.from('love_notes').insert({
      note_text: newNoteText,
    });
    if (error) {
      console.error('Error adding note:', error);
    } else {
      await loadNotes();
      setNewNoteText('');
      setShowAddForm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen pb-28 bg-cream">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 flex items-center gap-3 px-5 py-4 bg-white/80 backdrop-blur-xl border-b border-border/50 safe-top"
      >
        <button onClick={() => navigate('/')} className="p-1">
          <ArrowLeft size={20} className="text-navy" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl text-navy">Jar of Love</h2>
            <span className="font-serif text-xs text-butter-dark italic">O2M</span>
          </div>
          <p className="text-xs text-text-muted">Reasons I love you, one at a time</p>
        </div>
        <button onClick={signOut} className="p-2 rounded-full bg-navy/5 hover:bg-navy/10 transition-colors" title="Sign out">
          <LogOut size={16} className="text-navy" />
        </button>
        <button onClick={() => setShowAddForm(true)} className="p-2 rounded-full bg-butter/60 border border-butter-dark/30 active:scale-95 transition-transform">
          <Plus size={18} className="text-navy" />
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
            animate={isShaking ? { rotate: [-3, 3, -3, 3, -2, 2, 0], scale: [1, 1.02, 1, 1.02, 1] } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="w-48 h-56 bg-gradient-to-b from-white/90 to-butter-light/50 rounded-[40%_40%_35%_35%] border-2 border-navy/10 shadow-lg relative overflow-hidden">
              <div className="absolute inset-3 flex flex-wrap items-center justify-center gap-1 p-2">
                {notes.slice(0, 8).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="w-6 h-8 rounded-sm"
                    style={{
                      backgroundColor: ['#FCEEA8', '#FDF5D4', '#E8D87A', '#FCEEA8', '#FDF5D4', '#E8D87A', '#FCEEA8', '#FDF5D4'][i],
                      transform: `rotate(${-15 + i * 8}deg)`,
                      opacity: 0.8,
                    }}
                  />
                ))}
              </div>
              <div className="absolute top-4 left-4 w-8 h-20 bg-white/40 rounded-full blur-sm" />
            </div>
            <div className="w-36 h-6 bg-gradient-to-b from-navy to-navy-light rounded-t-xl mx-auto -mt-1 shadow-sm" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-lg border border-navy/10">
              <p className="text-[10px] text-navy font-medium">{notes.length} notes</p>
            </div>
          </motion.div>

          <motion.button
            onClick={pullRandomNote}
            disabled={notes.length === 0}
            whileTap={{ scale: 0.95 }}
            className="mt-8 flex items-center gap-2 px-8 py-4 rounded-full bg-navy text-butter font-medium shadow-lg active:scale-95 transition-transform disabled:opacity-40"
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
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-border/50 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <Heart size={14} className="text-navy fill-butter" />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-butter/20 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-butter/20 rounded-full blur-xl" />
                <p className="font-serif text-lg text-navy leading-relaxed italic text-center mb-4">
                  "{currentNote.note_text}"
                </p>
                <p className="text-xs text-text-muted text-center">
                  Added on {formatDate(currentNote.created_at)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes list */}
        {!loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10">
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
                  className="bg-white/80 rounded-2xl px-4 py-3 border border-border/50 flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-butter/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Heart size={10} className="text-navy fill-navy/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-navy leading-relaxed">{note.note_text}</p>
                    <p className="text-[10px] text-text-muted mt-1">{formatDate(note.created_at)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Add Note Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-navy/30 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-10 safe-bottom"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl text-navy">Add a reason</h3>
                <button onClick={() => setShowAddForm(false)} className="p-2 rounded-full bg-cream active:scale-95 transition-transform">
                  <X size={18} className="text-text-secondary" />
                </button>
              </div>
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Write why you love them..."
                className="w-full h-32 p-4 rounded-2xl bg-cream border border-border text-sm text-navy placeholder:text-text-muted/60 resize-none focus:outline-none focus:border-navy/30 transition-all"
                autoFocus
              />
              <button
                onClick={addNote}
                disabled={!newNoteText.trim()}
                className="mt-4 w-full py-3 rounded-full bg-navy text-butter font-medium disabled:opacity-40 active:scale-95 transition-all shadow-md"
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