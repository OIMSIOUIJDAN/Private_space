import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Calendar, Upload, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Photo {
  id: string;
  caption: string;
  date: string;
  image_url: string;
  created_at: string;
}

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
          src={photo.image_url}
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
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading photos:', error);
    } else if (data) {
      setPhotos(data);
    }
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadCaption.trim()) return;
    setUploading(true);

    try {
      const fileName = `${Date.now()}-${uploadFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, uploadFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('photos').insert({
        caption: uploadCaption,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        image_url: urlData.publicUrl,
      });

      if (dbError) {
        console.error('DB error:', dbError);
      } else {
        await loadPhotos();
        setShowUpload(false);
        setUploadCaption('');
        setUploadFile(null);
      }
    } catch (err) {
      console.error('Error:', err);
    }

    setUploading(false);
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
          <h2 className="font-serif text-xl text-text-primary">Our Memories</h2>
          <p className="text-xs text-text-muted">A scrapbook of beautiful moments</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="p-2 rounded-full bg-baby-pink/15 active:scale-95 transition-transform"
        >
          <Upload size={18} className="text-baby-pink" />
        </button>
      </motion.div>

      {/* Photo Grid */}
      <div className="px-4 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-text-muted text-sm">Loading memories...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart size={40} className="text-baby-pink/30 mb-4" />
            <p className="text-text-secondary mb-2">No memories yet</p>
            <p className="text-text-muted text-xs">Tap + to add your first photo</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {photos.map((photo, index) => (
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
                  style={{ height: 220 + (index % 3) * 40 }}
                >
                  <img
                    src={photo.image_url}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-text-primary text-xs font-medium leading-tight mb-1 line-clamp-2">
                      {photo.caption}
                    </p>
                    <p className="text-text-muted text-[10px]">{photo.date}</p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart size={14} className="text-baby-pink fill-baby-pink/50" />
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Photo count */}
      {!loading && photos.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 pb-4"
        >
          <p className="text-xs text-text-muted italic">
            {photos.length} beautiful memories captured ✨
          </p>
        </motion.div>
      )}

      {/* Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-navy/70 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowUpload(false)}
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
                <h3 className="font-serif text-xl text-text-primary">Add a memory</h3>
                <button
                  onClick={() => setShowUpload(false)}
                  className="p-2 rounded-full bg-navy active:scale-95 transition-transform"
                >
                  <X size={18} className="text-text-secondary" />
                </button>
              </div>

              {/* File picker */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 rounded-2xl border-2 border-dashed border-border-blue/50 flex flex-col items-center justify-center gap-2 mb-4 active:scale-95 transition-transform bg-navy/50"
              >
                {uploadFile ? (
                  <img src={URL.createObjectURL(uploadFile)} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <>
                    <Upload size={24} className="text-baby-pink/50" />
                    <p className="text-text-muted text-xs">Tap to choose a photo</p>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />

              <textarea
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="Add a sweet caption..."
                className="w-full h-20 p-4 rounded-2xl bg-navy border border-border-blue/50 text-sm text-text-primary placeholder:text-text-muted/60 resize-none focus:outline-none focus:border-baby-pink/50 focus:ring-2 focus:ring-baby-pink/20 transition-all mb-4"
              />

              <button
                onClick={handleUpload}
                disabled={!uploadFile || !uploadCaption.trim() || uploading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-baby-pink to-baby-pink-dark text-navy font-medium disabled:opacity-40 active:scale-95 transition-all shadow-lg shadow-baby-pink/20"
              >
                {uploading ? 'Uploading...' : 'Save memory 💕'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
