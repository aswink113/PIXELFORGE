import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, PhoneCall } from 'lucide-react';
import { getOrbitIcons, getExpertiseCards, getStats } from '../utils/db';

// Orbiting Icon definition for Canvas
interface OrbitIcon {
  emoji: string;
  label: string;
  color: string;
  speed: number;
  angle: number;
  radius: number;
  size: number;
  iconUrl?: string;
  iconImg?: HTMLImageElement;
}

// CountUp component using standard requestAnimationFrame for clean animation when in view
const CountUp: React.FC<{ end: number; suffix: string; label: string }> = ({ end, suffix, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          let startTimestamp: number | null = null;
          const duration = 2000; // 2 seconds

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            setCount(Math.floor(easeProgress * end));

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="flex flex-col items-start border-l-2 border-[#5E5BFF]/10 pl-6 py-2">
      <span className="text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight font-heading">
        {count}{suffix}
      </span>
      <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-1">
        {label}
      </span>
    </div>
  );
};

export const Hero = ({ onOpenPlanner }: { onOpenPlanner?: () => void }) => {
  const [activeModal, setActiveModal] = useState<'project' | 'portfolio' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamic content loaded from local storage database
  const [dynamicIcons, setDynamicIcons] = useState<any[]>([]);
  const [dynamicCards, setDynamicCards] = useState<any[]>([]);
  const [dynamicStats, setDynamicStats] = useState<any[]>([]);

  useEffect(() => {
    setDynamicIcons(getOrbitIcons());
    setDynamicCards(getExpertiseCards());
    setDynamicStats(getStats());

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pf_orbit_icons') {
        setDynamicIcons(getOrbitIcons());
      } else if (e.key === 'pf_expertise_cards') {
        setDynamicCards(getExpertiseCards());
      } else if (e.key === 'pf_stats') {
        setDynamicStats(getStats());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Mouse positions for interactive parallax and tilt
  const mouseX = useSpring(0, { stiffness: 60, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 60, damping: 20 });

  // Floating service cards spring-based 3D tilt coordinates
  const cardRotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const cardRotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // High performance Canvas centerpiece loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotationAngle = 0;
    
    // Canvas Size Handling using outermost container dimensions
    const handleResize = () => {
      const container = containerRef.current;
      if (container) {
        const width = window.innerWidth >= 1024 ? container.clientWidth * 0.5 : container.clientWidth;
        const height = container.clientHeight || window.innerHeight;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Orbiting Icons definitions (all at same speed, distributed along the quadrant)
    const iconSpacing = Math.PI / 10;
    const icons: OrbitIcon[] = dynamicIcons.map((ico, idx) => ({
      emoji: ico.emoji,
      label: ico.label,
      color: ico.color,
      iconUrl: ico.iconUrl,
      speed: 0.0015,
      angle: Math.PI + idx * iconSpacing,
      radius: 580,
      size: 46
    }));

    // Pre-load uploaded icon images
    icons.forEach(icon => {
      if (icon.iconUrl) {
        const img = new Image();
        img.src = icon.iconUrl;
        icon.iconImg = img;
      }
    });

    // Background particles
    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * 400,
      y: Math.random() * 400,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 0.3 + 0.1,
    }));

    const render = () => {
      const dpr = window.devicePixelRatio;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.scale(dpr, dpr);

      // Center exactly at bottom right of the canvas element
      const centerX = (w / dpr);
      const centerY = (h / dpr);

      // Slowly rotate background particles / glows slightly
      rotationAngle += 0.002;

      // Draw floating background particles
      particles.forEach((p, idx) => {
        p.y -= p.speed;
        if (p.y < 0) p.y = h / dpr;
        ctx.beginPath();
        ctx.arc((p.x + idx * 10) % (w / dpr), p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94, 91, 255, ${p.opacity})`;
        ctx.fill();
      });

      // 1. Draw Ring Glow (Shadow / Aurora underlay centered at bottom-right)
      ctx.save();
      ctx.translate(centerX, centerY);
      const glowGrad = ctx.createRadialGradient(0, 0, 460, 0, 0, 680);
      glowGrad.addColorStop(0, 'rgba(94, 91, 255, 0.06)');
      glowGrad.addColorStop(0.5, 'rgba(138, 109, 255, 0.02)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(0, 0, 680, Math.PI, 1.5 * Math.PI);
      ctx.fillStyle = glowGrad;
      ctx.fill();
      ctx.restore();

      // 2. Draw Translucent Metallic Glass 1/4 Ring (Thick fuzzy track like the video)
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // 1/4 Ring path (from 180 to 270 degrees)
      ctx.beginPath();
      ctx.arc(0, 0, 580, Math.PI, 1.5 * Math.PI);
      ctx.lineWidth = 130;
      ctx.strokeStyle = 'rgba(235, 235, 242, 0.5)';
      ctx.shadowColor = 'rgba(94, 91, 255, 0.04)';
      ctx.shadowBlur = 36;
      ctx.stroke();

      // Sharp inner highlight core for glass tube effect (road center)
      ctx.beginPath();
      ctx.arc(0, 0, 580, Math.PI, 1.5 * Math.PI);
      ctx.lineWidth = 80;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
      ctx.stroke();

      // Inner thin highlight strokes
      ctx.beginPath();
      ctx.arc(0, 0, 620, Math.PI, 1.5 * Math.PI);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 540, Math.PI, 1.5 * Math.PI);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.stroke();
      
      ctx.restore();

      // 3. Draw Orbiting Icons & Comet Motion Trails
      icons.forEach((icon) => {
        icon.angle += icon.speed;
        if (icon.angle > 1.5 * Math.PI) {
          icon.angle = Math.PI;
        }

        // Smooth fade-in / fade-out alpha based on angle
        let alpha = 1;
        const fadeThreshold = 0.025 * Math.PI;
        const startAngle = Math.PI;
        const endAngle = 1.5 * Math.PI;

        if (icon.angle - startAngle < fadeThreshold) {
          alpha = (icon.angle - startAngle) / fadeThreshold;
        } else if (endAngle - icon.angle < fadeThreshold) {
          alpha = (endAngle - icon.angle) / fadeThreshold;
        }
        alpha = Math.max(0, Math.min(1, alpha));

        // Draw Comet Motion Trail behind the icon
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(centerX, centerY);
        ctx.beginPath();
        // Arc goes backwards from current angle to form a tail
        const tailLength = 0.28;
        ctx.arc(0, 0, icon.radius, icon.angle - tailLength, icon.angle);
        ctx.lineWidth = 48;
        
        // Linear gradient to fade tail smoothly
        const startX = Math.cos(icon.angle - tailLength) * icon.radius;
        const startY = Math.sin(icon.angle - tailLength) * icon.radius;
        const endX = Math.cos(icon.angle) * icon.radius;
        const endY = Math.sin(icon.angle) * icon.radius;
        const tailGrad = ctx.createLinearGradient(startX, startY, endX, endY);
        tailGrad.addColorStop(0, 'rgba(94, 91, 255, 0)');
        tailGrad.addColorStop(1, `${icon.color}35`); // Glowing translucent tail color
        
        ctx.strokeStyle = tailGrad;
        ctx.shadowColor = icon.color;
        ctx.shadowBlur = 24;
        ctx.stroke();
        ctx.restore();

        // Calculate orbit position around the bottom-right center
        const orbitX = centerX + Math.cos(icon.angle) * icon.radius;
        const orbitY = centerY + Math.sin(icon.angle) * icon.radius;

        // Draw Icon Glass Capsule
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(orbitX, orbitY);

        // Soft outer neon glow
        const itemGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, icon.size / 2 + 10);
        itemGlow.addColorStop(0, `${icon.color}2A`);
        itemGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.beginPath();
        ctx.arc(0, 0, icon.size / 2 + 10, 0, Math.PI * 2);
        ctx.fillStyle = itemGlow;
        ctx.fill();

        // Capsule Body (Glassmorphism card effect on canvas)
        ctx.beginPath();
        ctx.arc(0, 0, icon.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.shadowColor = 'rgba(94, 91, 255, 0.1)';
        ctx.shadowBlur = 10;
        ctx.fill();

        // Capsule border
        ctx.beginPath();
        ctx.arc(0, 0, icon.size / 2, 0, Math.PI * 2);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.stroke();

        // Draw Icon inside capsule (uploaded image or emoji fallback)
        if (icon.iconImg && icon.iconImg.complete && icon.iconImg.naturalWidth > 0) {
          const imgSize = icon.size * 0.78;
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, icon.size / 2 - 1.5, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(icon.iconImg, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
          ctx.restore();
        } else {
          ctx.font = `${icon.size * 0.45}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowBlur = 0;
          ctx.fillText(icon.emoji, 0, 0);
        }

        ctx.restore();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dynamicIcons]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center pt-32 pb-20 lg:py-0 overflow-hidden bg-transparent"
    >
      {/* Absolute canvas wrapper for full screen bottom-right orbit layout */}
      <div className="absolute right-0 bottom-0 w-full lg:w-[50vw] h-screen pointer-events-none z-10 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="absolute inset-0 w-full h-full"
        >
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full pointer-events-none" 
          />
          {/* Ambient glow in corner */}
          <div className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full bg-[#5E5BFF]/5 blur-3xl pointer-events-none animate-pulse" />
        </motion.div>
      </div>

      {/* Desktop Metrics positioned INSIDE the orbit sweep (bottom-right corner) */}
      <div className="hidden lg:grid absolute bottom-16 right-16 grid-cols-2 gap-x-12 gap-y-8 max-w-[400px] z-30">
        {dynamicStats.map((metric) => (
          <CountUp 
            key={metric.id}
            end={parseInt(metric.value) || 0} 
            suffix={metric.suffix} 
            label={metric.label} 
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
        
        {/* Left Side Content Column */}
        <div className="lg:col-span-10 flex flex-col items-start text-left space-y-8">
          
          {/* Sparkle Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-[#5E5BFF]/8 border border-[#5E5BFF]/15 text-[#5E5BFF] text-xs font-bold tracking-wider uppercase select-none shadow-sm shadow-[#5E5BFF]/5"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>
              ✨ {dynamicIcons.length > 0 ? dynamicIcons.map((ico) => ico.label).join(' • ') : 'AI • Web • Mobile • Branding • Cloud'}
            </span>
          </motion.div>

          {/* Premium Headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl sm:text-8xl lg:text-8xl font-extrabold text-[#111111] leading-[1.08] tracking-tight font-heading max-w-none"
            >
              WHERE <span className="text-gradient font-black">INNOVATION</span> <br className="hidden sm:inline" />MEETS INTELLIGENCE
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-stone-500 text-base md:text-lg font-medium leading-relaxed max-w-xl"
            >
              Lumiora designs and develops premium websites, AI-powered applications, enterprise software, branding, cloud solutions, and digital products that help ambitious businesses scale faster.
            </motion.p>
          </div>

          {/* Action Call to Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4 items-center w-full z-30"
          >
            {/* Primary CTA */}
            <motion.button
              onClick={onOpenPlanner}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group/btn overflow-hidden px-8 py-4 bg-gradient-to-r from-[#5E5BFF] to-[#8A6DFF] text-white text-sm font-bold rounded-full tracking-wider transition-all duration-300 uppercase shadow-lg shadow-[#5E5BFF]/20"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                CONNECT WITH US
                <PhoneCall className="w-4 h-4" />
              </span>
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              onClick={() => setActiveModal('portfolio')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white/40 hover:bg-white/80 backdrop-blur-md border border-stone-200 text-stone-900 text-sm font-bold rounded-full tracking-wider transition-all duration-300 uppercase shadow-sm"
            >
              Explore Our Work
            </motion.button>
          </motion.div>

          {/* Floating Glass Service Cards */}
          <div className="w-full">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">OUR EXPERTISE</h4>
            <motion.div 
              style={{ rotateX: cardRotateX, rotateY: cardRotateY, transformStyle: 'preserve-3d' }}
              className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl"
            >
              {dynamicCards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -5, scale: 1.03 }}
                  className="glass-card px-4 py-3 rounded-2xl flex items-center justify-center text-center cursor-pointer shadow-md select-none"
                >
                  <span className="text-xs font-bold text-stone-850 tracking-wide font-heading">
                    {card.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right Side Column (Mobile Metrics only) */}
        <div className="lg:col-span-2 lg:hidden flex flex-col items-center justify-center relative min-h-[200px] z-20">
          <div className="grid grid-cols-2 gap-6 w-full max-w-[400px]">
            {dynamicStats.map((metric) => (
              <CountUp 
                key={metric.id}
                end={parseInt(metric.value) || 0} 
                suffix={metric.suffix} 
                label={metric.label} 
              />
            ))}
          </div>
        </div>

      </div>

      {/* Modern Dialog Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/10 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="max-w-md w-full p-8 rounded-3xl text-center bg-white border border-stone-200/50 shadow-2xl relative"
            >
              {/* Close button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-2 rounded-full hover:bg-stone-50 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="w-16 h-16 rounded-2xl bg-[#5E5BFF]/8 border border-[#5E5BFF]/15 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-[#5E5BFF]" />
              </div>

              <h3 className="text-2xl font-bold font-heading mb-3 text-stone-900">
                {activeModal === 'project' ? 'Start Your Project' : 'Our Portfolio'}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-8">
                {activeModal === 'project'
                  ? "Let's align on your next digital milestone. We will get back to you within 24 hours."
                  : "We craft top-tier software and premium identity suites. Standard case studies are undergoing update."}
              </p>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-4 font-bold rounded-full text-white transition-all duration-300 shadow-lg shadow-[#5E5BFF]/20"
                style={{
                  background: 'linear-gradient(135deg, #5E5BFF 0%, #7B68FF 100%)',
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
