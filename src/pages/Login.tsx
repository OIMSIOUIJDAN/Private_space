import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail, Lock, LogIn, UserPlus, User, Image as ImageIcon, Key, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [mode, setMode] = useState<'auth' | 'profile'>('auth');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user && !profile && !authLoading) {
      setMode('profile');
    }
  }, [user, profile, authLoading]);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileStep, setProfileStep] = useState(1);
  const [profileError, setProfileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setAuthError(error.message);
        } else {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 1500);
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          setAuthError(error.message);
        } else {
          setAuthError('Check your email to confirm your account 💌');
        }
      }
    } catch {
      setAuthError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;

    const fileName = `${user.id}-${Date.now()}-${avatarFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile);

    if (uploadError) {
      console.error('Avatar upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setProfileError('');

    try {
      const avatarUrl = await uploadAvatar();

      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('partner_number')
        .eq('secret_code', secretCode.toLowerCase().trim())
        .limit(1);

      const partnerNumber: 1 | 2 = (existingProfiles && existingProfiles.length > 0) ? 2 : 1;

      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: user.id,
        name: name.trim(),
        bio: bio.trim() || null,
        avatar_url: avatarUrl,
        secret_code: secretCode.toLowerCase().trim(),
        partner_number: partnerNumber,
      });

      if (profileError) {
        setProfileError('Failed to save profile: ' + profileError.message);
        console.error('Profile error:', profileError);
      } else {
        await refreshProfile();
        navigate('/', { replace: true });
      }
    } catch (err) {
      setProfileError('Something went wrong. Please try again.');
      console.error('Submit error:', err);
    }

    setLoading(false);
  };

  if (mode === 'auth') {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-butter opacity-20"
              initial={{ x: Math.random() * 400, y: Math.random() * 800, rotate: Math.random() * 360 }}
              animate={{ y: [null, -100], rotate: [null, 360], opacity: [0.2, 0] }}
              transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, delay: i * 1.5 }}
            >
              <Heart size={20 + i * 5} className="fill-butter" />
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-cream/90 backdrop-blur-sm"
            >
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: 2 }}>
                <Heart size={80} className="text-navy fill-butter" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block mb-4">
            <Heart size={48} className="text-navy fill-butter" />
          </motion.div>
          <h1 className="font-serif text-5xl text-navy italic mb-2 tracking-wide">O2M</h1>
          <p className="text-text-secondary text-sm italic">Our Private Space</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-sm">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-border/50">
            <h2 className="font-serif text-2xl text-navy text-center mb-2">
              {isLogin ? 'Welcome back' : 'Begin our story'}
            </h2>
            <p className="text-xs text-text-muted text-center mb-6">
              {isLogin ? 'Your love story continues here' : 'Create your account to start'}
            </p>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="text-xs text-text-muted mb-1 block font-medium">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream border border-border text-navy placeholder:text-text-muted/60 focus:outline-none focus:border-navy/30 text-sm" />
                </div>
              </div>

              <div>
                <label className="text-xs text-text-muted mb-1 block font-medium">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream border border-border text-navy placeholder:text-text-muted/60 focus:outline-none focus:border-navy/30 text-sm" />
                </div>
              </div>

              {authError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-center text-navy bg-butter/40 rounded-xl py-2 px-3">
                  {authError}
                </motion.p>
              )}

              <button type="submit" disabled={loading} className="w-full py-3 rounded-full bg-navy text-butter font-medium disabled:opacity-60 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-butter/30 border-t-butter rounded-full" />
                ) : isLogin ? (
                  <><LogIn size={16} /><span>Sign in</span></>
                ) : (
                  <><UserPlus size={16} /><span>Create account</span></>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-text-muted">
                {isLogin ? "New to our space?" : 'Already have an account?'}
              </p>
              <button onClick={() => { setIsLogin(!isLogin); setAuthError(''); }} className="text-sm text-navy font-medium mt-1 hover:underline">
                {isLogin ? 'Create account' : 'Sign in'}
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-text-muted mt-6 font-serif italic">Between us, always</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block mb-4">
          <Heart size={40} className="text-navy fill-butter" />
        </motion.div>
        <h1 className="font-serif text-4xl text-navy italic mb-2 tracking-wide">O2M</h1>
        <p className="text-text-secondary text-sm italic mb-4">Our Private Space</p>
        <p className="text-text-secondary text-sm">
          {profileStep === 1 ? "Let's get to know you" : 'Your secret connection'}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-border/50">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {profileStep === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="flex flex-col items-center">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-butter/50 hover:border-butter transition-colors group">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-cream flex items-center justify-center">
                        <ImageIcon size={32} className="text-text-muted" />
                      </div>
                    )}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  <p className="text-xs text-text-muted mt-2">Tap to add your photo</p>
                </div>

                <div>
                  <label className="text-xs text-text-muted mb-1 block font-medium">What should we call you?</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream border border-border text-navy placeholder:text-text-muted/60 focus:outline-none focus:border-navy/30 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-muted mb-1 block font-medium">A little about you (optional)</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Share something sweet..." rows={3} className="w-full px-4 py-3 rounded-2xl bg-cream border border-border text-navy placeholder:text-text-muted/60 focus:outline-none focus:border-navy/30 text-sm resize-none" />
                </div>

                <button type="button" onClick={() => { if (name.trim()) setProfileStep(2); }} disabled={!name.trim()} className="w-full py-3 rounded-full bg-navy text-butter font-medium disabled:opacity-40 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {profileStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="bg-butter/20 rounded-2xl p-4 border border-butter/30">
                  <div className="flex items-start gap-3">
                    <Key size={20} className="text-navy mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-navy font-medium mb-1">Your Secret Code</p>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        A special word or phrase only you and your person know.
                      </p>
                      <p className="text-xs text-navy font-medium mt-2">💡 Example: "paris2024"</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-muted mb-1 block font-medium">Enter your secret code</label>
                  <div className="relative">
                    <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="text" value={secretCode} onChange={(e) => setSecretCode(e.target.value)} placeholder="Your secret code" required className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream border border-border text-navy placeholder:text-text-muted/60 focus:outline-none focus:border-navy/30 text-sm" />
                  </div>
                </div>

                {profileError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-center text-navy bg-butter/40 rounded-xl py-2 px-3">
                    {profileError}
                  </motion.p>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setProfileStep(1)} className="flex-1 py-3 rounded-full bg-cream border border-border text-navy font-medium active:scale-95 transition-all">
                    Back
                  </button>
                  <button type="submit" disabled={!secretCode.trim() || loading} className="flex-1 py-3 rounded-full bg-navy text-butter font-medium disabled:opacity-40 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
                    {loading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-butter/30 border-t-butter rounded-full" />
                    ) : (
                      <><Check size={16} /><span>Finish</span></>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-text-muted mt-6 font-serif italic">Two hearts, one secret</p>
      </motion.div>
    </div>
  );
}