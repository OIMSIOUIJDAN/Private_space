import { motion } from 'framer-motion';
import { Heart, MessageCircle, Image, Sparkles, Calendar, Clock, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface RelationshipData {
  id: string;
  met_date: string;
  next_date: string;
  pet_name: string;
  partner_name: string;
}

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

export default function Home() {
  const navigate = useNavigate();
  const [daysSinceMet, setDaysSinceMet] = useState<number | null>(null);
  const [daysUntilDate, setDaysUntilDate] = useState<number | null>(null);
  const [greeting, setGreeting] = useState(getGreeting());
  const [petName, setPetName] = useState('my love');
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const { data, error } = await supabase
      .from('relationship')
      .select('*')
      .single();

    if (error || !data) {
      // No data yet, show setup
      setShowSetup(true);
      setLoading(false);
      return;
    }

    const relData = data as RelationshipData;
    const now = new Date();
    setDaysSinceMet(getDaysBetween(new Date(relData.met_date), now));
    setDaysUntilDate(getDaysBetween(now, new Date(relData.next_date)));
    setPetName(relData.pet_name || 'my love');
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen pb-28 px-5 pt-12 bg-navy">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto"
      >
        {/* Greeting Section */}
        <motion.div variants={itemVariants} className="text-center mb-8 pt-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block mb-4"
          >
            <Heart className="text-baby-pink fill-baby-pink/30" size={36} />
          </motion.div>
          <h1 className="font-serif text-3xl text-text-primary mb-2 italic">
            {greeting}, {petName}
          </h1>
          <p className="text-text-secondary text-sm">
            Every moment with you is a treasure ✨
          </p>
        </motion.div>

        {/* Setup prompt if no data */}
        {showSetup && !loading && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-surface-light/80 rounded-3xl p-5 border border-baby-pink/20 text-center">
              <Database size={24} className="text-baby-pink mx-auto mb-3" />
              <p className="text-text-primary text-sm mb-2 font-medium">Welcome! Let's set up your love story</p>
              <p className="text-text-muted text-xs mb-4">
                Add your relationship dates to see the counters come alive
              </p>
              <SetupForm onComplete={loadData} />
            </div>
          </motion.div>
        )}

        {/* Date Counters */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-surface/80 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-border-blue/40 text-center">
            <Calendar size={20} className="text-baby-pink mx-auto mb-2" />
            <div className="font-serif text-3xl text-baby-pink font-semibold mb-1">
              {loading ? '...' : daysSinceMet ?? '—'}
            </div>
            <div className="text-xs text-text-muted font-medium">
              days since we met
            </div>
          </div>
          <div className="bg-surface/80 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-border-blue/40 text-center">
            <Clock size={20} className="text-baby-pink mx-auto mb-2" />
            <div className="font-serif text-3xl text-baby-pink font-semibold mb-1">
              {loading ? '...' : daysUntilDate ?? '—'}
            </div>
            <div className="text-xs text-text-muted font-medium">
              days until our date
            </div>
          </div>
        </motion.div>

        {/* Quick Navigation Cards */}
        <motion.div variants={itemVariants} className="space-y-3 mb-8">
          <button
            onClick={() => navigate('/chat')}
            className="w-full bg-surface-light/80 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-border-blue/30 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-baby-pink/10 flex items-center justify-center shadow-sm">
              <MessageCircle size={22} className="text-baby-pink" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg text-text-primary">Our Chat</h3>
              <p className="text-xs text-text-secondary mt-0.5">Real-time messages 💌</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/album')}
            className="w-full bg-surface-light/80 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-border-blue/30 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-baby-pink/10 flex items-center justify-center shadow-sm">
              <Image size={22} className="text-baby-pink" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg text-text-primary">Our Memories</h3>
              <p className="text-xs text-text-secondary mt-0.5">Upload & share photos 📸</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/jar')}
            className="w-full bg-surface-light/80 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-border-blue/30 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-baby-pink/10 flex items-center justify-center shadow-sm">
              <Sparkles size={22} className="text-baby-pink" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg text-text-primary">Jar of Love</h3>
              <p className="text-xs text-text-secondary mt-0.5">Reasons I love you 💝</p>
            </div>
          </button>
        </motion.div>

        {/* Sweet Quote */}
        <motion.div variants={itemVariants} className="text-center mt-6">
          <div className="bg-surface/60 backdrop-blur-sm rounded-3xl p-6 border border-border-blue/30">
            <p className="font-serif italic text-text-secondary text-sm leading-relaxed">
              "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine."
            </p>
            <p className="text-xs text-text-muted mt-3">— Maya Angelou</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Setup form component
function SetupForm({ onComplete }: { onComplete: () => void }) {
  const [metDate, setMetDate] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [petName, setPetName] = useState('my love');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!metDate || !nextDate) return;
    setSaving(true);

    const { error } = await supabase.from('relationship').insert({
      met_date: metDate,
      next_date: nextDate,
      pet_name: petName,
      partner_name: 'babe',
    });

    if (error) {
      console.error('Error saving:', error);
    } else {
      onComplete();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3 text-left">
      <div>
        <label className="text-xs text-text-muted mb-1 block">What do you call them?</label>
        <input
          type="text"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          placeholder="my love"
          className="w-full px-3 py-2 rounded-xl bg-navy border border-border-blue/50 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-baby-pink/50"
        />
      </div>
      <div>
        <label className="text-xs text-text-muted mb-1 block">Date you met</label>
        <input
          type="date"
          value={metDate}
          onChange={(e) => setMetDate(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-navy border border-border-blue/50 text-sm text-text-primary focus:outline-none focus:border-baby-pink/50"
        />
      </div>
      <div>
        <label className="text-xs text-text-muted mb-1 block">Next date night</label>
        <input
          type="date"
          value={nextDate}
          onChange={(e) => setNextDate(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-navy border border-border-blue/50 text-sm text-text-primary focus:outline-none focus:border-baby-pink/50"
        />
      </div>
      <button
        onClick={handleSave}
        disabled={!metDate || !nextDate || saving}
        className="w-full py-2.5 rounded-full bg-gradient-to-r from-baby-pink to-baby-pink-dark text-navy font-medium disabled:opacity-40 active:scale-95 transition-all text-sm"
      >
        {saving ? 'Saving...' : 'Save & start our story 💕'}
      </button>
    </div>
  );
}
