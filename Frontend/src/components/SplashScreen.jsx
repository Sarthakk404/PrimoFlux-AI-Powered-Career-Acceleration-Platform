import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('enter'); // enter -> reveal -> exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal'), 1200);
    const t2 = setTimeout(() => setPhase('exit'), 2800);
    const t3 = setTimeout(() => onComplete(), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  // Generate random particles
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    size: 2 + Math.random() * 4,
  }));

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          className="splash-screen"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Background grid */}
          <div className="grid-lines" />

          {/* Floating orbs */}
          <div className="splash-orb" style={{
            width: '400px', height: '400px',
            top: '0%', left: '0%',
            background: 'radial-gradient(circle, rgba(197, 160, 89, 0.15), transparent 70%)',
            animationDelay: '0s'
          }} />
          <div className="splash-orb" style={{
            width: '350px', height: '350px',
            bottom: '0%', right: '0%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1), transparent 70%)',
            animationDelay: '-2s'
          }} />
          <div className="splash-orb" style={{
            width: '250px', height: '250px',
            top: '50%', right: '20%',
            background: 'radial-gradient(circle, rgba(140, 166, 152, 0.1), transparent 70%)',
            animationDelay: '-1s'
          }} />

          {/* Particles */}
          <div className="splash-particles">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="splash-particle"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.8, 0.8, 0],
                  scale: [0, 1, 1.5, 0],
                  y: [0, -60 - Math.random() * 60],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Central logo animation */}
          <div className="relative flex items-center justify-center" style={{ width: '160px', height: '160px' }}>
            {/* Spinning rings */}
            <motion.div
              className="splash-ring"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <motion.div
              className="splash-ring-inner"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            />
            
            {/* Center icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 200 }}
              className="absolute flex items-center justify-center"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #C5A059, #D4AF37)',
                boxShadow: '0 10px 40px rgba(197, 160, 89, 0.3)',
              }}
            >
              <Crown className="w-10 h-10 text-white" />
            </motion.div>
          </div>

          {/* Brand text */}
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: phase === 'reveal' ? 1 : 0, y: phase === 'reveal' ? 0 : 30 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <span style={{ color: '#1C1C1C' }}>Primo</span>
              <span className="text-gradient">Flux</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm mt-4 tracking-[0.3em] uppercase font-medium"
              style={{ color: '#82807C' }}
            >
              AI-Powered Career Acceleration
            </motion.p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="mt-12"
            style={{ width: '200px', height: '2px', background: 'rgba(197, 160, 89, 0.1)', borderRadius: '999px', overflow: 'hidden' }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              style={{
                height: '100%',
                borderRadius: '999px',
                background: 'linear-gradient(90deg, #C5A059, #D4AF37, #E2B974)',
              }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
