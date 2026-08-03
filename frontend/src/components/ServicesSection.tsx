import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

const servicesData = [
  {
    number: '01',
    category: 'Digital Strategy',
    title: 'Digital Strategy & Consulting',
    desc: 'We analyse your market, define your digital roadmap, and create a blueprint for sustainable growth. From UX audits to tech stack decisions — we guide every strategic move.',
    tags: ['Market Analysis', 'Tech Stack Design', 'Growth Roadmaps'],
    image: '/services/01_strategy.png',
    badge: 'Strategic Vision',
    stat: '98% Success Rate',
    color: 'from-[#6D4AFF] to-[#8B5DFF]'
  },
  {
    number: '02',
    category: 'Experience Design',
    title: 'UI/UX Design & Prototyping',
    desc: 'We craft intuitive, visually stunning interfaces grounded in user psychology. Every design decision is purposeful, every interaction delightful.',
    tags: ['Wireframing', 'Design Systems', 'Interactive Prototypes'],
    image: '/services/02_uiux.png',
    badge: 'Human-Centered UX',
    stat: 'Awwwards Quality',
    color: 'from-[#EC4899] to-[#8B5DFF]'
  },
  {
    number: '03',
    category: 'Engineering',
    title: 'Web & Mobile Development',
    desc: 'From high-performance React applications to native mobile apps — we build scalable, maintainable software that grows with your business.',
    tags: ['React & Next.js', 'React Native', 'Cloud Architecture'],
    image: '/services/03_dev.png',
    badge: 'High Performance',
    stat: '60 FPS Smooth',
    color: 'from-[#3B82F6] to-[#6D4AFF]'
  },
  {
    number: '04',
    category: 'Machine Learning',
    title: 'AI Integration & Automation',
    desc: 'We embed intelligent capabilities into your products — from custom LLM integrations to automated pipelines that eliminate repetitive workflows.',
    tags: ['LLM Integrations', 'Workflow Automation', 'Predictive Models'],
    image: '/services/04_ai.png',
    badge: 'Autonomous AI',
    stat: '10x Efficiency',
    color: 'from-[#10B981] to-[#6D4AFF]'
  },
  {
    number: '05',
    category: 'Brand Strategy',
    title: 'Brand Identity & Content',
    desc: 'We build cohesive brand identities that resonate and endure. Logo, typography, tone of voice, and content strategy — all unified under a single, powerful narrative.',
    tags: ['Visual Identity', 'Copywriting', 'Brand Guidelines'],
    image: '/services/05_brand.png',
    badge: 'Iconic Branding',
    stat: '100% Unique Voice',
    color: 'from-[#F59E0B] to-[#EC4899]'
  },
  {
    number: '06',
    category: 'Marketing',
    title: 'Growth & Performance Marketing',
    desc: 'Data-driven campaigns that fill your pipeline. We manage paid media, SEO, conversion optimisation, and analytics to maximise your ROI.',
    tags: ['SEO & SEM', 'Conversion Optimisation', 'Analytics'],
    image: '/services/06_growth.png',
    badge: 'Scalable Growth',
    stat: '+340% Avg ROI',
    color: 'from-[#8B5DFF] to-[#3B82F6]'
  },
];

export const ServicesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track scrolling over the 600vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const totalServices = servicesData.length;
      const index = Math.min(Math.floor(latest * totalServices), totalServices - 1);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    });
  }, [scrollYProgress, activeIndex]);

  // Interactive 3D Card Tilt with Mouse
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = (e.clientX - rect.left) / width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(mouseXPos);
    mouseY.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const activeService = servicesData[activeIndex];

  const contentVariants = {
    enter: {
      opacity: 0,
      y: 100,
      scale: 0.9,
      filter: 'blur(10px)'
    },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as any
      }
    },
    exit: {
      opacity: 0,
      y: -80,
      scale: 0.95,
      filter: 'blur(10px)',
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  return (
    <section ref={containerRef} className="relative bg-[#FCFCFC] h-[600vh]">
      {/* Sticky Full-Screen Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col md:flex-row items-center justify-between">
        
        {/* Ambient Subtle Background Elements */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#6D4AFF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Left Column (48%) - Typography & Content */}
        <div className="w-full md:w-[48%] h-[50vh] md:h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 z-20 relative">
          
          {/* Progress Bar & Header */}
          <div className="absolute top-10 lg:top-16 left-8 lg:left-24 flex items-center gap-4 z-30">
            <div className="w-16 h-[3px] bg-black/10 overflow-hidden rounded-full">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#6D4AFF] to-[#8B5DFF]"
                style={{ width: `${((activeIndex + 1) / servicesData.length) * 100}%` }}
                layout
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-xs font-mono font-bold tracking-wider text-gray-500">
              <span className="text-[#6D4AFF]">0{activeIndex + 1}</span> / 06
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-start w-full relative"
            >
              {/* Huge Watermark Service Number */}
              <span className="text-[12rem] md:text-[14rem] font-black text-black/[0.025] select-none absolute -top-28 -left-8 font-heading pointer-events-none leading-none">
                {activeService.number}
              </span>

              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6D4AFF]/10 to-[#8B5DFF]/10 border border-[#6D4AFF]/20 text-[#6D4AFF] text-xs font-bold tracking-widest uppercase mb-6 shadow-sm backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#6D4AFF] animate-pulse" />
                {activeService.category}
              </div>

              {/* Title */}
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-[#111111] leading-[1.05] tracking-tight font-heading mb-6">
                {activeService.title}
              </h2>

              {/* Description */}
              <p className="text-stone-500 text-sm md:text-base lg:text-lg leading-relaxed max-w-lg mb-8 font-medium">
                {activeService.desc}
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-2.5 mb-10">
                {activeService.tags.map((tag, i) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200/80 text-xs font-bold text-stone-700 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-[#6D4AFF]/40 hover:text-[#6D4AFF] transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6D4AFF]" />
                    {tag}
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.03, x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative group overflow-hidden px-7 py-3.5 bg-[#111111] hover:bg-[#6D4AFF] text-white text-xs font-bold rounded-full tracking-wider transition-all duration-300 uppercase shadow-xl shadow-black/10 flex items-center gap-3"
                >
                  <span className="relative z-10">EXPLORE SERVICE</span>
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </motion.button>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Quick Service Navigator Tabs */}
          <div className="absolute bottom-10 left-8 lg:left-24 flex items-center gap-2 z-30">
            {servicesData.map((svc, idx) => (
              <button
                key={svc.number}
                onClick={() => {
                  if (containerRef.current) {
                    const sectionTop = containerRef.current.offsetTop;
                    const sectionHeight = containerRef.current.clientHeight;
                    const targetScroll = sectionTop + (idx / servicesData.length) * sectionHeight;
                    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx 
                    ? 'w-8 bg-[#6D4AFF]' 
                    : 'w-2 bg-stone-300 hover:bg-stone-400'
                }`}
                title={svc.title}
              />
            ))}
          </div>

        </div>

        {/* Right Column (52%) - Floating 3D Transparent Showcase (No Background Box) */}
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full md:w-[52%] h-[50vh] md:h-full relative bg-transparent z-10 flex items-center justify-center p-6 md:p-12 lg:p-16"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.85, y: 60, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -60, rotateY: -15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className="relative w-full max-w-2xl h-full flex items-center justify-center perspective-[1200px]"
            >
              {/* Soft Ambient Colorful Background Glow */}
              <div className={`absolute inset-10 bg-gradient-to-tr ${activeService.color} opacity-25 rounded-full blur-[100px] -z-10 animate-pulse transition-all duration-1000`} />

              {/* Floating Floating Pill Badges */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-black/5 text-[#6D4AFF] text-xs font-bold shadow-lg shadow-purple-500/10">
                <Zap className="w-3.5 h-3.5 text-[#6D4AFF]" />
                {activeService.badge}
              </div>
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-black/5 text-stone-800 text-xs font-mono font-bold shadow-lg shadow-purple-500/10">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6D4AFF]" />
                {activeService.stat}
              </div>

              {/* Directly Floating Transparent Image */}
              <motion.img 
                src={activeService.image} 
                alt={activeService.title}
                className="max-w-full max-h-[80vh] w-auto h-auto object-contain filter drop-shadow-[0_20px_40px_rgba(109,74,255,0.25)] z-10 transition-transform duration-300 hover:scale-105"
                animate={{ 
                  y: [0, -16, 0],
                  rotateZ: [0, 1.2, 0, -1.2, 0]
                }}
                transition={{ 
                  duration: 6, 
                  ease: "easeInOut", 
                  repeat: Infinity 
                }}
              />

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
