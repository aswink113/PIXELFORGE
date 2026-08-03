import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const servicesData = [
  {
    number: '01',
    category: 'Digital Strategy',
    title: 'Digital Strategy & Consulting',
    desc: 'We analyse your market, define your digital roadmap, and create a blueprint for sustainable growth. From UX audits to tech stack decisions — we guide every strategic move.',
    tags: ['Market Analysis', 'Tech Stack Design', 'Growth Roadmaps'],
    image: '/services/01_strategy.png'
  },
  {
    number: '02',
    category: 'Experience Design',
    title: 'UI/UX Design & Prototyping',
    desc: 'We craft intuitive, visually stunning interfaces grounded in user psychology. Every design decision is purposeful, every interaction delightful.',
    tags: ['Wireframing', 'Design Systems', 'Interactive Prototypes'],
    image: '/services/02_uiux.png'
  },
  {
    number: '03',
    category: 'Engineering',
    title: 'Web & Mobile Development',
    desc: 'From high-performance React applications to native mobile apps — we build scalable, maintainable software that grows with your business.',
    tags: ['React & Next.js', 'React Native', 'Cloud Architecture'],
    image: '/services/03_dev.png'
  },
  {
    number: '04',
    category: 'Machine Learning',
    title: 'AI Integration & Automation',
    desc: 'We embed intelligent capabilities into your products — from custom LLM integrations to automated pipelines that eliminate repetitive workflows.',
    tags: ['LLM Integrations', 'Workflow Automation', 'Predictive Models'],
    image: '/services/04_ai.png'
  },
  {
    number: '05',
    category: 'Brand Strategy',
    title: 'Brand Identity & Content',
    desc: 'We build cohesive brand identities that resonate and endure. Logo, typography, tone of voice, and content strategy — all unified under a single, powerful narrative.',
    tags: ['Visual Identity', 'Copywriting', 'Brand Guidelines'],
    image: '/services/05_brand.png'
  },
  {
    number: '06',
    category: 'Marketing',
    title: 'Growth & Performance Marketing',
    desc: 'Data-driven campaigns that fill your pipeline. We manage paid media, SEO, conversion optimisation, and analytics to maximise your ROI.',
    tags: ['SEO & SEM', 'Conversion Optimisation', 'Analytics'],
    image: '/services/06_growth.png'
  },
];

export const ServicesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track scrolling over the 600vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      // Divide the 0-1 progress into 6 segments
      const totalServices = servicesData.length;
      // We use Math.floor but cap it at 5
      const index = Math.min(Math.floor(latest * totalServices), totalServices - 1);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    });
  }, [scrollYProgress, activeIndex]);

  const activeService = servicesData[activeIndex];

  // Motion variants for the Left Side Text Content reflecting user specifications
  // Previous -> Move Up, Scale 0.9, RotateX -12
  // Next -> Starts Scale 0.8, RotateY 18, TranslateY 150px
  // Center -> Scale 1, Translate 0, Rotate 0
  const contentVariants = {
    enter: {
      opacity: 0,
      y: 150,
      scale: 0.8,
      rotateY: 18,
      filter: 'blur(8px)'
    },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as any // Power4.out equivalent
      }
    },
    exit: {
      opacity: 0.35,
      y: -100,
      scale: 0.9,
      rotateX: -12,
      filter: 'blur(8px)',
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  return (
    <section ref={containerRef} className="relative bg-[#FCFCFC] h-[600vh]">
      {/* Sticky Full-Screen Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Column (45%) - Typography & Content */}
        <div className="w-full md:w-[45%] h-[50vh] md:h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 z-20 relative">
          
          {/* Progress Indicator (Static overlay on left) */}
          <div className="absolute top-12 lg:top-24 left-8 lg:left-24 flex items-center gap-4">
            <div className="w-12 h-[2px] bg-black/10 overflow-hidden rounded-full">
               <motion.div 
                 className="h-full bg-[#6D4AFF]"
                 style={{ width: `${(activeIndex + 1) / 6 * 100}%` }}
                 layout
                 transition={{ duration: 0.5 }}
               />
            </div>
            <span className="text-xs font-mono font-bold text-gray-400">
              0{activeIndex + 1} <span className="opacity-40">/ 06</span>
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-start w-full"
              style={{ perspective: 1000 }} // Enable 3D transforms for rotateX/Y
            >
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6D4AFF]/5 border border-[#6D4AFF]/10 text-[#6D4AFF] text-[11px] font-bold tracking-widest uppercase mb-8 shadow-sm">
                {activeService.category}
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#111111] leading-[1.05] tracking-tight font-heading mb-6">
                {activeService.title}
              </h2>

              {/* Description */}
              <p className="text-gray-500 text-sm md:text-lg leading-relaxed max-w-lg mb-10 font-medium">
                {activeService.desc}
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-3 mb-12">
                {activeService.tags.map((tag, i) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    className="px-4 py-2 rounded-xl bg-white border border-black/[0.04] text-xs font-bold text-gray-600 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
                  >
                    {tag}
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center transition-transform group-hover:bg-[#6D4AFF] shadow-lg shadow-black/10">
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:rotate-12" />
                </div>
                <span className="font-bold text-sm tracking-wide uppercase text-[#111111] group-hover:text-[#6D4AFF] transition-colors">
                  Explore Service
                </span>
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column (55%) - Glassmorphism 3D Image Showcase */}
        <div className="w-full md:w-[55%] h-[50vh] md:h-full relative bg-transparent z-10 flex items-center justify-center p-6 md:p-12 lg:p-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.85, y: 60, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -60, rotateY: -15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl aspect-[4/3] flex items-center justify-center perspective-[1200px]"
            >
              {/* Outer Ambient Glowing Aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#6D4AFF]/30 via-[#8B5DFF]/25 to-purple-500/20 rounded-[3rem] blur-3xl -z-10 animate-pulse" />

              {/* Glowing Gradient Border Frame */}
              <div className="relative w-full h-full p-[2px] rounded-[2.5rem] bg-gradient-to-br from-[#6D4AFF] via-[#8B5DFF]/60 to-[#6D4AFF]/20 shadow-[0_25px_60px_rgba(109,74,255,0.22)] group transition-all duration-500">
                
                {/* Glassmorphic Inner Container */}
                <div className="w-full h-full rounded-[2.4rem] bg-white/40 backdrop-blur-2xl border border-white/60 p-6 md:p-8 flex items-center justify-center relative overflow-hidden shadow-inner">
                  
                  {/* Subtle Glass Reflection Highlight */}
                  <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/40 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-[#6D4AFF]/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Floating 3D Pop-Out Image */}
                  <motion.img 
                    src={activeService.image} 
                    alt={activeService.title}
                    className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_35px_rgba(109,74,255,0.3)] z-10 transition-transform duration-500 hover:scale-105"
                    animate={{ 
                      y: [0, -12, 0],
                      rotateZ: [0, 1.5, 0, -1.5, 0]
                    }}
                    transition={{ 
                      duration: 6, 
                      ease: "easeInOut", 
                      repeat: Infinity 
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
