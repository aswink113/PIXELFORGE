import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const pillars = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Strategic Vision',
    desc: 'Every pixel we craft is backed by research-driven strategy and deep industry insight.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Speed & Precision',
    desc: 'We move fast without compromising craft — delivering on time, every time.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Trusted Partnership',
    desc: 'We become an extension of your team — transparent, accountable, and fully invested.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } },
};

export const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Scroll Parallax for background elements
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const blobY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section id="about" ref={ref} className="relative py-28 overflow-hidden bg-brand-bg transition-colors duration-300">
      {/* Background grid using dynamic theme RGB value */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(var(--cursor-color), 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--cursor-color), 0.015) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Ambient blob with scroll parallax */}
      <motion.div 
        style={{ y: blobY }}
        className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-purple-700/10 rounded-full blur-[180px] pointer-events-none" 
      />

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        {/* Left: Text content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.span
            variants={itemVariants}
            className="inline-block text-xs uppercase tracking-[0.3em] text-blue-400 font-semibold mb-6 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5"
          >
            Who We Are
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold font-heading leading-[1.1] tracking-tight text-text-main mb-6"
          >
            A Consultancy Built for{' '}
            <span className="text-gradient">Ambitious Brands</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-text-muted text-lg leading-relaxed mb-6"
          >
            PixelForge is a full-service digital consultancy specialising in crafting
            transformative digital products. We partner with startups, scale-ups, and
            enterprises to design, build, and launch experiences that drive real business
            outcomes.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-text-muted/80 text-base leading-relaxed mb-10"
          >
            Founded by a team of product thinkers and engineers, we operate at the
            intersection of strategy, design, and technology. We don't just build websites
            — we engineer competitive advantages.
          </motion.p>

          <motion.a
            variants={itemVariants}
            href="#contact"
            className="inline-flex items-center gap-3 text-sm font-semibold text-text-main border border-border-color px-6 py-3 rounded-full hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300 hover-target cursor-none"
          >
            Meet the Team
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.a>
        </motion.div>

        {/* Right: Pillars */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col gap-5"
        >
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group relative flex items-start gap-5 p-6 rounded-2xl border border-border-color bg-card-bg hover:bg-card-hover-bg hover:border-blue-500/20 transition-all duration-500"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/15 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/20 transition-colors duration-300">
                {p.icon}
              </div>
              <div>
                <h3 className="text-text-main font-semibold text-base mb-1.5">{p.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{p.desc}</p>
              </div>
              {/* Bottom glow line on hover */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
