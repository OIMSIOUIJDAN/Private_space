import { motion } from 'framer-motion';
import { Heart, MessageCircle, Image, Sparkles, Calendar, Clock, Plane, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

function getDaysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date2.getTime() - date1.getTime()) / oneDay));
}

function getCountdownString(targetDate: Date): { days: number; hours: number; minutes: number } {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
}

export default function Home() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [daysSinceMet, setDaysSinceMet] = useState<number | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [greeting, setGreeting] = useState(getGreeting());
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      setGreeting(getGreeting());
      loadData();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const { data, error } = await supabase
      .from('relationship')
      .select('*')
      .single();

    if (error || !data) {
      setShowSetup(true);
      setLoading(false);
      return;
    }

    const now = new Date();
    setDaysSinceMet(getDaysBetween(new Date(data.met_date), now));
    setCountdown(getCountdownString(new Date(data.next_date)));
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen pb-28 px-5 pt-12 bg-cream">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-md mx-auto">
        {/* O2M Branding */}
        <motion.div variants={itemVariants} className="text-center mb-6 pt-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block mb-3"
          >
            <h2 className="font-serif text-3xl text-navy italic tracking-wide">O2M</h2>
          </motion.div>
          <h1 className="font-serif text-3xl text-navy mb-2 italic">
            {greeting}, {profile?.name || 'my love'}
          </h1>
          <p className="text-text-secondary text-sm">Every moment with you is a treasure ✨</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <p className="text-xs text-text-muted truncate max-w-[200px]">{user?.email}</p>
            <button onClick={signOut} className="p-1.5 rounded-full bg-navy/5 hover:bg-navy/10 transition-colors" title="Sign out">
              <LogOut size={14} className="text-navy" />
            </button>
          </div>
        </motion.div>

        {/* Countdown */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-border/50 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Plane size={18} className="text-navy" />
              <h3 className="font-serif text-lg text-navy">Countdown to Reunion</h3>
            </div>
            {loading ? (
              <p className="text-text-muted text-sm">Loading...</p>
            ) : countdown.days === 0 && countdown.hours === 0 ? (
              <p className="font-serif text-2xl text-navy italic">We're together now! 🥂</p>
            ) : (
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <div className="font-serif text-4xl text-navy font-bold">{countdown.days}</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wider">days</div>
                </div>
                <div className="text-center">
                  <div className="font-serif text-4xl text-navy font-bold">{countdown.hours}</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wider">hours</div>
                </div>
                <div className="text-center">
                  <div className="font-serif text-4xl text-navy font-bold">{countdown.minutes}</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wider">min</div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Days Since Met */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="bg-butter/40 rounded-3xl p-5 shadow-sm border border-butter-dark/30 text-center">
            <Calendar size={20} className="text-navy mx-auto mb-2" />
            <div className="font-serif text-3xl text-navy font-semibold mb-1">
              {loading ? '...' : daysSinceMet ?? '—'}
            </div>
            <div className="text-xs text-text-secondary font-medium">beautiful days since we met</div>
          </div>
        </motion.div>

        {/* Setup prompt */}
        {showSetup && !loading && (
          <motion.div variants={itemVariants} className="mb-6">
            <div className="bg-white rounded-3xl p-5 border border-border/50 text-center">
              <p className="text-text-primary text-sm mb-2 font-medium">Set up your love story</p>
              <p className="text-text-muted text-xs mb-4">Add your relationship dates to see the counters</p>
              <SetupForm onComplete={loadData} />
            </div>
          </motion.div>
        )}

        {/* Navigation Cards */}
        <motion.div variants={itemVariants} className="space-y-3 mb-6">
          <button onClick={() => navigate('/chat')} className="w-full bg-white rounded-3xl p-5 shadow-md border border-border/50 flex items-center gap-4 text-left active:scale-[0.98] transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-butter/60 flex items-center justify-center">
              <MessageCircle size={22} className="text-navy" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg text-navy">Our Chat</h3>
              <p className="text-xs text-text-secondary mt-0.5">Real-time messages 💌</p>
            </div>
          </button>

          <button onClick={() => navigate('/album')} className="w-full bg-white rounded-3xl p-5 shadow-md border border-border/50 flex items-center gap-4 text-left active:scale-[0.98] transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center">
              <Image size={22} className="text-navy" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg text-navy">Our Memories</h3>
              <p className="text-xs text-text-secondary mt-0.5">Our chic scrapbook 📸</p>
            </div>
          </button>

          <button onClick={() => navigate('/jar')} className="w-full bg-white rounded-3xl p-5 shadow-md border border-border/50 flex items-center gap-4 text-left active:scale-[0.98] transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-butter/60 flex items-center justify-center">
              <Sparkles size={22} className="text-navy" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg text-navy">Jar of Love</h3>
              <p className="text-xs text-text-secondary mt-0.5">Reasons I love you 💝</p>
            </div>
          </button>
        </motion.div>

        {/* Quote */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-border/40">
            <p className="font-serif italic text-text-secondary text-sm leading-relaxed">
              "Distance means so little when someone means so much."
            </p>
            <p className="text-xs text-text-muted mt-3">— Tom McNeal</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SetupForm({ onComplete }: { onComplete: () => void }) {
  const [metDate, setMetDate] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!metDate || !nextDate) return;
    setSaving(true);
    const { error } = await supabase.from('relationship').insert({
      met_date: metDate,
      next_date: nextDate,
    });
    if (!error) onComplete();
    setSaving(false);
  };

  return (
    <div className="space-y-3 text-left">
      <div>
        <label className="text-xs text-text-muted mb-1 block">Date you met</label>
        <input type="date" value={metDate} onChange={(e) => setMetDate(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-cream border border-border text-sm text-navy focus:outline-none focus:border-navy/30" />
      </div>
      <div>
        <label className="text-xs text-text-muted mb-1 block">Next reunion date</label>
        <input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-cream border border-border text-sm text-navy focus:outline-none focus:border-navy/30" />
      </div>
      <button onClick={handleSave} disabled={!metDate || !nextDate || saving} className="w-full py-2.5 rounded-full bg-navy text-butter font-medium disabled:opacity-40 active:scale-95 transition-all text-sm">
        {saving ? 'Saving...' : 'Save 💕'}
      </button>
    </div>
  );
}