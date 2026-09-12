import { motion } from 'framer-motion';
import { Heart, MessageCircle, Image, Sparkles, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { relationshipData } from '../data/mockData';
import { useState, useEffect } from 'react';

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
  const [daysSinceMet, setDaysSinceMet] = useState(0);
  const [daysUntilDate, setDaysUntilDate] = useState(0);
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const now = new Date();
    setDaysSinceMet(getDaysBetween(relationshipData.metDate, now));
    setDaysUntilDate(getDaysBetween(now, relationshipData.nextDate));
    setGreeting(getGreeting());

    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

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
            {greeting}, {relationshipData.petName}
          </h1>
          <p className="text-text-secondary text-sm">
            Every moment with you is a treasure ✨
          </p>
        </motion.div>

        {/* Date Counters */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-surface/80 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-border-blue/40 text-center">
            <Calendar size={20} className="text-baby-pink mx-auto mb-2" />
            <div className="font-serif text-3xl text-baby-pink font-semibold mb-1">
              {daysSinceMet}
            </div>
            <div className="text-xs text-text-muted font-medium">
              days since we met
            </div>
          </div>
          <div className="bg-surface/80 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-border-blue/40 text-center">
            <Clock size={20} className="text-baby-pink mx-auto mb-2" />
            <div className="font-serif text-3xl text-baby-pink font-semibold mb-1">
              {daysUntilDate}
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
              <p className="text-xs text-text-secondary mt-0.5">Your sweet messages await 💌</p>
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
              <p className="text-xs text-text-secondary mt-0.5">A scrapbook of us 📸</p>
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
              <p className="text-xs text-text-secondary mt-0.5">Pull out a reason I love you 💝</p>
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
