import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface FloatingHeartsProps {
  active: boolean;
  type?: 'hearts' | 'kisses';
}

export default function FloatingHearts({ active, type = 'hearts' }: FloatingHeartsProps) {
  const items = Array.from({ length: 12 }, (_, i) => i);

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {items.map((i) => {
            const delay = Math.random() * 0.8;
            const x = Math.random() * 100;
            const size = 16 + Math.random() * 20;
            const duration = 2 + Math.random() * 1.5;

            return (
              <motion.div
                key={`${type}-${i}`}
                initial={{ 
                  opacity: 1, 
                  y: '100vh', 
                  x: `${x}vw`,
                  scale: 0.5,
                  rotate: 0
                }}
                animate={{ 
                  opacity: [1, 1, 0], 
                  y: '-20vh',
                  scale: [0.5, 1.2, 0.8],
                  rotate: [-15, 15, -5]
                }}
                transition={{ 
                  duration, 
                  delay, 
                  ease: 'easeOut' 
                }}
                className="absolute"
              >
                {type === 'hearts' ? (
                  <Heart
                    size={size}
                    className="text-burgundy fill-burgundy/40"
                  />
                ) : (
                  <span style={{ fontSize: size }} className="select-none">💋</span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
