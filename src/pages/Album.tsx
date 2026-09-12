import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPhotos, type Photo } from '../data/mockData';

function PhotoModal({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-surface rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl border border-border-blue/40"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.url}
          alt={photo.caption}
          className="w-full h-64 object-cover"
        />
        <div className="p-5">
          <p className="font-serif text-lg text-text-primary mb-2">{photo.caption}</p>
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <Calendar size={12} />
            <span>{photo.date}</span>
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full py-2.5 rounded-full bg-baby-pink/15 border border-baby-pink/30 text-baby-pink text-sm font-medium active:scale-95 transition-transform"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Album() {
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

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
          <h2 className="font-serif text-xl text-text-primary">Our Memories</h2>
          <p className="text-xs text-text-muted">A scrapbook of beautiful moments</p>
        </div>
        <Heart size={18} className="text-baby-pink fill-baby-pink/30" />
      </motion.div>

      {/* Photo Grid */}
      <div className="px-4 pt-4">
        <div className="masonry-grid">
          {mockPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="masonry-item"
            >
              <button
                onClick={() => setSelectedPhoto(photo)}
                className="relative group w-full rounded-2xl overflow-hidden shadow-lg border border-border-blue/30 active:scale-[0.98] transition-transform"
                style={{ height: photo.height }}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-text-primary text-xs font-medium leading-tight mb-1 line-clamp-2">
                    {photo.caption}
                  </p>
                  <p className="text-text-muted text-[10px]">{photo.date}</p>
                </div>
                {/* Decorative corner */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart size={14} className="text-baby-pink fill-baby-pink/50" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Photo count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-6 pb-4"
      >
        <p className="text-xs text-text-muted italic">
          {mockPhotos.length} beautiful memories captured ✨
        </p>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
