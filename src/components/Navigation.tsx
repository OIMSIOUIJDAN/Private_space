import { motion } from 'framer-motion';
import { Heart, MessageCircle, Image, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', icon: Heart, label: 'Home' },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/album', icon: Image, label: 'Album' },
  { path: '/jar', icon: Sparkles, label: 'Jar' },
];

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
    >
      <div className="mx-auto max-w-md px-4 pb-2">
        <div className="flex items-center justify-around rounded-3xl bg-white/80 backdrop-blur-xl px-2 py-2 shadow-lg border border-rose-light/30">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-300"
              >
                {isActive && (
                  <motion.div
                    layoutId="navBubble"
                    className="absolute inset-0 bg-soft-pink/60 rounded-2xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  size={20}
                  className={`relative z-10 transition-colors duration-300 ${
                    isActive ? 'text-burgundy' : 'text-text-muted'
                  }`}
                />
                <span
                  className={`relative z-10 text-[10px] font-medium transition-colors duration-300 ${
                    isActive ? 'text-burgundy' : 'text-text-muted'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
