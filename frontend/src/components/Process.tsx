import { useRef } from 'react';
import { motion, useInView, useScroll } from 'framer-motion';

const steps = [
  {
    step: '01',
    title: 'Discovery & Scoping',
    desc: 'We start with a deep-dive workshop to understand your goals, users, and constraints. We leave with a clear brief and a shared vision.',
    duration: '1 – 2 weeks',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Strategy & Architecture',
    desc: 'We map out the technical blueprint and UX strategy — defining every feature, flow, and integration before a line of code is written.',
    duration: '1 – 2 weeks',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Design & Prototype',
    desc: 'Our designers produce high-fidelity Figma prototypes that you can click through before we build anything. Iterate fast, decide confidently.',
    duration: '2 – 4 weeks',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Build & Iterate',
    desc: "Our engineers ship in two-week sprints with continuous demos, so you always know exactly what's happening and can steer the direction.",
    duration: '4 – 16 weeks',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    step: '05',
    title: 'Launch & Scale',
    desc: 'We handle deployment, monitoring, and post-launch optimisation. Your success is our success — we stay on to grow with you.',
    duration: 'Ongoing',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l14 9-14 9V3z" />
      </svg>
    ),
  },
];

export const Process = () => {
  const ref = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Scroll timeline progress drawing
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });

  return (
    <section id="process" ref={ref} className="relative py-28 overflow-hidden bg-brand-bg transition-colors duration-300">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(var(--cursor-color), 0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--cursor-color), 0.012) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-border-color to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold mb-6 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
            How We Work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading leading-[1.1] tracking-tight text-text-main">
            A Process That{' '}
            <span className="text-gradient">Delivers Results</span>
          </h2>
          <p className="mt-5 text-text-muted text-lg max-w-xl mx-auto leading-relaxed">
            Our proven five-stage framework turns ambiguous ideas into polished, scalable products.
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Vertical track line */}
          <div className="absolute left-[27px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-border-color opacity-30" />
          
          {/* Glowing active drawing line */}
          <motion.div 
            style={{ scaleY: scrollYProgress, originY: 0 }}
            className="absolute left-[27px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-400" 
          />

          <div className="flex flex-col gap-12">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: [0.76, 0, 0.24, 1] }}
                  className={`relative flex items-start gap-6 md:gap-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Content card */}
                  <div className={`w-full md:w-[calc(50%-48px)] ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12'} pl-16 md:pl-0`}>
                    <div className="group relative p-6 rounded-2xl border border-border-color bg-card-bg hover:bg-card-hover-bg hover:border-blue-500/20 transition-all duration-500">
                      <div className={`flex items-center gap-3 mb-3 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-blue-400 flex-shrink-0">
                          {step.icon}
                        </div>
                        <span className="text-xs font-mono text-text-muted/40 tracking-widest">{step.step}</span>
                      </div>
                      <h3 className="text-text-main font-semibold text-lg font-heading mb-2">{step.title}</h3>
                      <p className="text-text-muted text-sm leading-relaxed mb-4">{step.desc}</p>
                      <span className="inline-flex items-center gap-1.5 text-xs text-blue-400/80 font-mono">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {step.duration}
                      </span>
                      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </div>
                  </div>

                  {/* Centre dot */}
                  <motion.div 
                    whileInView={{ scale: 1.25 }}
                    viewport={{ margin: "-120px" }}
                    className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-6 w-[14px] h-[14px] rounded-full bg-blue-500 border-2 border-brand-bg ring-4 ring-blue-500/20 flex-shrink-0 transition-colors duration-300" 
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
