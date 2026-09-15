import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Calendar, Upload, X, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';

interface Photo {
  id: string;
  image_url: string;
  caption: string;
  date_taken: string;
  created_at: string;
}

function PhotoModal({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-white p-4 pb-12 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={photo.image_url} alt={photo.caption} className="w-full h-64 object-cover" />
        <p className="polaroid-caption text-sm mt-3">{photo.caption}</p>
        <p className="polaroid-date">{photo.date_taken}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-full bg-navy text-butter text-sm font-medium active:scale-95 transition-transform"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Album() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
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

      const { data } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('photos').insert({
        image_url: data.publicUrl,
        caption: uploadCaption,
        date_taken: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
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

  const getRotation = (index: number) => {
    const rotations = [-2, 1, -1, 2, -1.5, 1.5, 0, -2, 1];
    return rotations[index % rotations.length];
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
            <h2 className="font-serif text-xl text-navy">Our Memories</h2>
            <span className="font-serif text-xs text-butter-dark italic">O2M</span>
          </div>
          <p className="text-xs text-text-muted">A chic scrapbook of us</p>
        </div>
        <button
          onClick={signOut}
          className="p-2 rounded-full bg-navy/5 hover:bg-navy/10 transition-colors"
          title="Sign out"
        >
          <LogOut size={16} className="text-navy" />
        </button>
        <button
          onClick={() => setShowUpload(true)}
          className="p-2 rounded-full bg-butter/60 border border-butter-dark/30 active:scale-95 transition-transform"
        >
          <Upload size={18} className="text-navy" />
        </button>
      </motion.div>

      {/* Photo Grid */}
      <div className="px-4 pt-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-text-muted text-sm">Loading memories...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-32 h-40 bg-white shadow-md border border-border/50 mb-4 flex items-center justify-center">
              <Heart size={32} className="text-navy/20" />
            </div>
            <p className="text-text-secondary mb-2 font-serif italic">No memories yet</p>
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
                  className="polaroid w-full active:scale-[0.98] transition-transform"
                  style={{ transform: `rotate(${getRotation(index)}deg)` }}
                >
                  <img
                    src={photo.image_url}
                    alt={photo.caption}
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                  />
                  <p className="polaroid-caption">{photo.caption}</p>
                  <p className="polaroid-date">{photo.date_taken}</p>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {!loading && photos.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 pb-4"
        >
          <p className="text-xs text-text-muted italic font-serif">
            {photos.length} beautiful memories captured ✨
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedPhoto && <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-navy/40 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowUpload(false)}
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
                <h3 className="font-serif text-xl text-navy">Add a memory</h3>
                <button
                  onClick={() => setShowUpload(false)}
                  className="p-2 rounded-full bg-cream active:scale-95 transition-transform"
                >
                  <X size={18} className="text-text-secondary" />
                </button>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 mb-4 active:scale-95 transition-transform bg-cream/50"
              >
                {uploadFile ? (
                  <img src={URL.createObjectURL(uploadFile)} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <>
                    <Upload size={24} className="text-navy/40" />
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
                className="w-full h-20 p-4 rounded-2xl bg-cream border border-border text-sm text-navy placeholder:text-text-muted/60 resize-none focus:outline-none focus:border-navy/30 transition-all mb-4"
              />

              <button
                onClick={handleUpload}
                disabled={!uploadFile || !uploadCaption.trim() || uploading}
                className="w-full py-3 rounded-full bg-navy text-butter font-medium disabled:opacity-40 active:scale-95 transition-all shadow-md"
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