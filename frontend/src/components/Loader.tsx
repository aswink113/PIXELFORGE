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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden"
          style={{ clipPath: "inset(0 0 0 0)" }}
        >
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
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
                src="/logo.jpeg"
                alt="PIXELFORGE Logo"
                className="h-20 sm:h-24 md:h-36 w-auto object-contain relative z-10 mix-blend-screen"
                animate={{ 
                  filter: ["drop-shadow(0 0 20px rgba(59, 130, 246, 0.2))", "drop-shadow(0 0 40px rgba(124, 58, 237, 0.6))", "drop-shadow(0 0 20px rgba(59, 130, 246, 0.2))"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-wider text-gradient font-heading z-10 leading-none">
                PIXELFORGE
              </span>
            </motion.div>

            {/* Premium Progress Bar (Line spanning screen) */}
            <div className="absolute bottom-10 left-0 w-full h-[1px] bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: `${progress > 100 ? 100 : progress}%` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </div>
            
            {/* Percentage Text (Huge Outline in background) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-bold opacity-5 pointer-events-none text-transparent"
                 style={{ WebkitTextStroke: '2px white' }}>
              {progress > 100 ? 100 : progress}
            </div>
            
            {/* Elegant Small Percentage */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-16 right-10 text-2xl font-light tracking-widest font-mono"
            >
              {progress > 100 ? 100 : progress}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
