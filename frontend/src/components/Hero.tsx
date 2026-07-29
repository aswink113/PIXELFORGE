import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';

// Smooth easing curve used across all animations
const EASE = [0.25, 0.1, 0.25, 1] as const;

// Particle Field — slow, dreamy rotation
function ParticleField() {
  const ref = useRef<any>(null);
  const sphere = random.inSphere(new Float32Array(4500), { radius: 1.5 });
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 25;
      ref.current.rotation.y -= delta / 35;
    }
  });
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#818CF8"
          size={0.0018}
          sizeAttenuation
          depthWrite={false}
          opacity={0.2}
        />
      </Points>
    </group>
  );
}

// Cycling words
const cycleWords = ['Web Apps', 'Mobile Apps', 'AI Products', 'SaaS Tools', 'Brands'];

// Smooth expanding pulse ring
function PulseRing({ size, delay }: { size: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: [0, 0.3, 0], scale: [0.4, 1.6, 2.2] }}
      transition={{
        duration: 5.5,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
        times: [0, 0.5, 1],
      }}
      className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        border: '1px solid rgba(129,140,248,0.5)',
      }}
    />
  );
}

export const Hero = ({ onOpenPlanner }: { onOpenPlanner?: () => void }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [activeModal, setActiveModal] = useState<'project' | 'portfolio' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cycle words every 3s
  useEffect(() => {
    const t = setInterval(() => setWordIndex(i => (i + 1) % cycleWords.length), 3000);
    return () => clearInterval(t);
  }, []);

  // Scroll parallax
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });
  const yText = useTransform(smoothScroll, [0, 1], [0, 300]);
  const opacityText = useTransform(smoothScroll, [0, 0.45], [1, 0]);
  const scaleText = useTransform(smoothScroll, [0, 1], [1, 0.9]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[120vh] overflow-hidden"
      style={{ background: 'linear-gradient(150deg, #EBF0FF 0%, #F2EEFF 28%, #F9EEFF 58%, #EBF4FF 100%)' }}
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #6366F1 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Deep centre radial glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(139,92,246,0.13) 0%, transparent 70%)',
        }}
      />

      {/* 3D Particle cloud */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <ParticleField />
        </Canvas>
      </div>

      {/* Pulse rings — very slow, centred on hero text */}
      <PulseRing size={380} delay={0} />
      <PulseRing size={580} delay={1.8} />
      <PulseRing size={780} delay={3.6} />

      {/* Ambient gradient blobs */}
      <motion.div
        animate={{ x: [0, 50, -20, 0], y: [0, -35, 15, 0], scale: [1, 1.08, 0.97, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-[10%] -left-[8%] w-[750px] h-[750px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.16) 0%, transparent 68%)' }}
      />
      <motion.div
        animate={{ x: [0, -55, 25, 0], y: [0, 45, -20, 0], scale: [1, 1.14, 0.94, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-[12%] -right-[6%] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.14) 0%, transparent 68%)' }}
      />
      <motion.div
        animate={{ x: [0, 30, -30, 0], y: [0, -25, 10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[30%] left-[60%] w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 68%)' }}
      />

      {/* ── Main Content ── */}
      <div className="absolute top-0 left-0 w-full h-screen flex flex-col items-center pt-20 md:pt-24">
        <motion.div
          style={{ y: yText, opacity: opacityText, scale: scaleText }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center pointer-events-auto my-auto"
        >

          {/* Agency pill */}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.2, ease: EASE }}
            className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
            style={{
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(99,102,241,0.2)',
              boxShadow: '0 4px 20px rgba(99,102,241,0.08)',
              color: '#6366F1',
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"
            />
            Your Digital Consultancy
          </motion.div>

          {/* Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            className="mb-7 flex items-center justify-center gap-3"
          >
            {['DESIGN', 'CREATE', 'ELEVATE'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55 + i * 0.12, ease: EASE }}
                className="flex items-center gap-3"
              >
                <span className="text-[11px] font-bold tracking-[0.24em] text-zinc-400 uppercase">{word}</span>
                {i < 2 && (
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1.25, 0.85] }}
                    transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
                    className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #A855F7)' }}
                  />
                )}
              </motion.span>
            ))}
          </motion.div>

          {/* Main heading */}
          <h1 className="font-bold tracking-tight leading-[1.08] mb-6 font-heading">

            {/* Line 1 */}
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: '105%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.7, ease: EASE }}
                className="block text-[2.4rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.8rem] text-zinc-900"
              >
                We Craft Premium
              </motion.span>
            </div>

            {/* Line 2 — static "Digital" + cycling word pill */}
            <div className="overflow-hidden flex items-center justify-center gap-3 my-2">
              <motion.span
                initial={{ y: '105%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.85, ease: EASE }}
                className="inline-block text-[2.4rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.8rem] text-zinc-900"
              >
                Digital
              </motion.span>

              {/* Cycling word pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 1.0, ease: EASE }}
                className="relative overflow-hidden rounded-[14px] px-5 py-1.5 flex items-center"
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)',
                  boxShadow: '0 6px 28px rgba(99,102,241,0.3)',
                }}
              >
                {/* shimmer sweep */}
                <motion.div
                  animate={{ x: ['-120%', '220%'] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)', transform: 'skewX(-12deg)' }}
                />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ y: '80%', opacity: 0, filter: 'blur(4px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: '-80%', opacity: 0, filter: 'blur(4px)' }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="relative z-10 text-[2rem] sm:text-[2.5rem] md:text-[3.2rem] lg:text-[3.8rem] font-bold text-white whitespace-nowrap"
                  >
                    {cycleWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Line 3 */}
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: '105%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.1, delay: 1.0, ease: EASE }}
                className="block text-[2.4rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.8rem] text-gradient"
              >
                That Define The Future
              </motion.span>
            </div>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 1.2, ease: EASE }}
            className="text-base sm:text-lg text-zinc-500 max-w-lg font-light leading-relaxed mb-10"
          >
            Premium web, mobile & AI solutions for visionaries<br className="hidden sm:block" />
            who refuse to settle for ordinary.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 1.4, ease: EASE }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            {/* Primary */}
            <button
              onClick={() => onOpenPlanner ? onOpenPlanner() : setActiveModal('project')}
              className="group relative px-9 py-4 text-white text-sm font-bold rounded-full overflow-hidden hover-target transition-all duration-300 hover:scale-[1.04] active:scale-[0.97] cursor-none"
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                boxShadow: '0 8px 32px rgba(79,70,229,0.32)',
              }}
            >
              <span className="relative z-10 flex items-center gap-2.5 tracking-wide">
                Start Your Project
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </motion.svg>
              </span>
              {/* shimmer on hover */}
              <motion.div
                className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)', transform: 'skewX(-12deg)' }}
              />
            </button>

            {/* Secondary */}
            <button
              onClick={() => setActiveModal('portfolio')}
              className="group relative px-8 py-4 text-sm font-bold rounded-full overflow-hidden hover-target transition-all duration-300 hover:scale-[1.04] active:scale-[0.97] cursor-none"
              style={{
                background: 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(14px)',
                border: '1.5px solid rgba(99,102,241,0.22)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                color: '#4338CA',
              }}
            >
              <span className="relative z-10 flex items-center gap-2 tracking-wide">
                <svg className="w-4 h-4 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                View Our Work
              </span>
              <div className="absolute inset-0 bg-indigo-50/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            </button>
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 1.2, ease: EASE }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.38em] font-semibold text-zinc-400/80">Scroll</span>
        <div
          className="w-6 h-10 rounded-full border flex items-start justify-center pt-1.5"
          style={{ borderColor: 'rgba(129,140,248,0.35)' }}
        >
          <motion.div
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[3px] h-[6px] rounded-full"
            style={{ background: 'linear-gradient(to bottom, #6366F1, #A855F7)' }}
          />
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/25 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 28 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 28 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="max-w-md w-full p-8 rounded-3xl text-center relative"
              style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(28px)',
                border: '1px solid rgba(99,102,241,0.16)',
                boxShadow: '0 28px 80px rgba(79,70,229,0.16)',
              }}
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 hover-target p-2 rounded-full hover:bg-zinc-100 transition-all duration-200 cursor-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', border: '1px solid rgba(99,102,241,0.15)' }}
              >
                <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {activeModal === 'project'
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  }
                </svg>
              </div>

              <h3 className="text-2xl font-bold font-heading mb-3 text-zinc-900">
                {activeModal === 'project' ? 'Start Your Project' : 'Our Portfolio'}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                {activeModal === 'project'
                  ? "Our team will reach out shortly to schedule a discovery call and begin scoping your project."
                  : "Explore our premium case studies — crafted for visionaries who demand excellence."}
              </p>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-4 font-bold rounded-full text-white transition-all duration-300 hover-target cursor-none hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                  boxShadow: '0 8px 24px rgba(79,70,229,0.28)',
                }}
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
