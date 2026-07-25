import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

// 3D Particle Field Component
function ParticleField() {
  const ref = useRef<any>();
  // Generate random positions within a sphere
  const sphere = random.inSphere(new Float32Array(8000), { radius: 2 });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#7C3AED"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

const words = "Building Digital Experiences".split(" ");

export const Hero = ({ onOpenPlanner }: { onOpenPlanner?: () => void }) => {
  const [activeModal, setActiveModal] = useState<'project' | 'portfolio' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Smooth scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothScrollY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const yText = useTransform(smoothScrollY, [0, 1], [0, 400]);
  const opacityText = useTransform(smoothScrollY, [0, 0.5], [1, 0]);
  const scaleText = useTransform(smoothScrollY, [0, 1], [1, 0.8]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[120vh] overflow-hidden bg-[#050505]"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <ParticleField />
        </Canvas>
      </div>

      {/* Floating Gradient Blobs */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0], 
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          x: [0, -100, 0], 
          y: [0, 50, 0],
          scale: [1, 1.5, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" 
      />

      {/* Content wrapper centered physically in the first viewport height, with safe spacing to prevent navbar overlap */}
      <div className="absolute top-0 left-0 w-full h-screen flex flex-col items-center pt-20 pb-8 md:pt-24">
        <motion.div 
          style={{ y: yText, opacity: opacityText, scale: scaleText }}
          className="relative z-10 text-center px-4 max-w-6xl mx-auto flex flex-col items-center pointer-events-auto my-auto"
        >

          {/* Staggered Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold tracking-tighter leading-[0.9] flex flex-wrap justify-center gap-[0.15em]">
            {words.map((word, i) => (
              <div key={i} className="overflow-hidden inline-block pb-4">
                <motion.span
                  initial={{ y: "120%", rotate: 5 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.8 + (i * 0.1), 
                    ease: [0.76, 0, 0.24, 1] 
                  }}
                  className="inline-block origin-bottom-left text-white"
                >
                  {word}
                </motion.span>
              </div>
            ))}
            <div className="w-full flex justify-center overflow-hidden pb-4 mt-2 md:mt-4">
              <motion.span
                initial={{ y: "120%", rotate: -5 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1.4, delay: 1.2, ease: [0.76, 0, 0.24, 1] }}
                className="inline-block text-gradient origin-bottom-right"
              >
                That Define The Future
              </motion.span>
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5, ease: [0.76, 0, 0.24, 1] }}
            className="mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl font-light leading-relaxed"
          >
            We engineer premium web, mobile, and AI solutions for visionaries who refuse to settle for ordinary.
          </motion.p>

          {/* Premium Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.7, ease: [0.76, 0, 0.24, 1] }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-6"
          >
            <button 
              onClick={() => onOpenPlanner ? onOpenPlanner() : setActiveModal('project')}
              className="group relative px-8 py-3.5 bg-white text-black text-base font-semibold rounded-full overflow-hidden hover-target transition-all hover:scale-105 active:scale-95 cursor-none shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                Start Your Project
                <motion.svg 
                  className="w-4.5 h-4.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </motion.svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.76,0,0.24,1]" />
            </button>
            
            <a 
              href="#work"
              className="px-6 py-3.5 text-white text-base font-medium hover-target relative overflow-hidden group cursor-none"
            >
              <span className="relative z-10 group-hover:text-blue-400 transition-colors duration-300">View Portfolio</span>
              <span className="absolute bottom-2 left-6 right-6 h-[2px] bg-white/30 group-hover:bg-blue-500 transition-colors duration-300" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-gray-500 z-10 pointer-events-none"
      >
        <span className="text-xs uppercase tracking-[0.3em] font-medium">Scroll to explore</span>
        <div className="w-[2px] h-16 bg-white/10 relative overflow-hidden rounded-full">
          <motion.div 
            animate={{ y: [-20, 64], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "circInOut" }}
            className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-transparent via-blue-500 to-transparent rounded-full"
          />
        </div>
      </motion.div>

      {/* Custom Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="glass-card max-w-md w-full p-8 rounded-3xl text-center relative border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.2)]"
            >
              {/* Close Icon Button */}
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white hover-target p-2 rounded-full hover:bg-white/10 transition-all cursor-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Icon */}
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400 border border-blue-500/20">
                {activeModal === 'project' ? (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              {/* Text */}
              <h3 className="text-2xl font-bold font-heading mb-3 text-white">
                {activeModal === 'project' ? 'Start Your Project' : 'View Portfolio'}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                {activeModal === 'project' 
                  ? 'Our team will contact you shortly to schedule a discovery call and begin scoping your project details.' 
                  : 'Opening the interactive portfolio showcase. Explore our premium case studies and digital agency archives.'}
              </p>

              {/* Action Button */}
              <button 
                onClick={() => setActiveModal(null)}
                className="w-full py-4 bg-white text-black font-semibold rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 hover-target shadow-lg cursor-none"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
