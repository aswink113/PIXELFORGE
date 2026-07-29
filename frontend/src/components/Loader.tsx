import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Loader = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoaded(true);
            setTimeout(() => onLoadingComplete(), 1500); // Wait for exit animation
          }, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 1;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="loader"
          exit={{ 
            clipPath: "inset(0 0 100% 0)", 
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ 
            clipPath: "inset(0 0 0 0)",
            background: "linear-gradient(135deg, #F0F4FF 0%, #FAF0FF 40%, #FFF0F8 70%, #F0F8FF 100%)"
          }}
        >
          <div className="absolute inset-0 opacity-[0.06]" 
               style={{ backgroundImage: 'linear-gradient(#7C3AED 1px, transparent 1px), linear-gradient(90deg, #7C3AED 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />

          <div className="relative flex flex-col items-center justify-center w-full max-w-4xl px-8">
            {/* Pulsing Logo and Text */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="mb-16 flex items-center gap-4 sm:gap-6 md:gap-8 justify-center relative"
            >
              <motion.img
                src="/logo.png"
                alt="LUMIORA Logo"
                className="h-20 sm:h-24 md:h-36 w-auto object-contain relative z-10 rounded-2xl"
                style={{ mixBlendMode: 'multiply' }}
                animate={{ 
                  filter: ["drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))", "drop-shadow(0 0 40px rgba(124, 58, 237, 0.7))", "drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-wider text-gradient font-heading z-10 leading-none">
                LUMIORA
              </span>
            </motion.div>

            {/* Slogan */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="flex items-center gap-2 mb-8"
            >
              {['DESIGN', 'CREATE', 'ELEVATE'].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.2 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-zinc-400 uppercase">
                    {word}
                  </span>
                  {i < 2 && (
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5 }}
                      className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 inline-block"
                    />
                  )}
                </motion.span>
              ))}
            </motion.div>

            {/* Premium Progress Bar */}
            <div className="absolute bottom-10 left-0 w-full h-[1px] bg-zinc-900/10">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: `${progress > 100 ? 100 : progress}%` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </div>
            
            {/* Percentage Text (Huge Outline in background) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-bold opacity-[0.04] pointer-events-none text-transparent"
                 style={{ WebkitTextStroke: '2px #09090B' }}>
              {progress > 100 ? 100 : progress}
            </div>
            
            {/* Elegant Small Percentage */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-16 right-10 text-2xl font-light tracking-widest font-mono text-zinc-400"
            >
              {progress > 100 ? 100 : progress}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
