import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const services = [
  {
    number: '01',
    title: 'Digital Strategy & Consulting',
    short: 'Strategy',
    desc: 'We analyse your market, define your digital roadmap, and create a blueprint for sustainable growth. From UX audits to tech stack decisions — we guide every strategic move.',
    tags: ['Brand Positioning', 'UX Research', 'Roadmapping', 'Tech Consulting'],
    gradient: 'from-blue-500/20 to-cyan-500/5',
    accent: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  {
    number: '02',
    title: 'UI/UX Design & Prototyping',
    short: 'Design',
    desc: 'We craft intuitive, visually stunning interfaces grounded in user psychology. Every design decision is purposeful, every interaction delightful.',
    tags: ['Figma Prototypes', 'Design Systems', 'Motion Design', 'Accessibility'],
    gradient: 'from-purple-500/20 to-violet-500/5',
    accent: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  {
    number: '03',
    title: 'Web & Mobile Development',
    short: 'Development',
    desc: 'From high-performance React applications to native mobile apps — we build scalable, maintainable software that grows with your business.',
    tags: ['React / Next.js', 'React Native', 'Node.js', 'Cloud Infrastructure'],
    gradient: 'from-emerald-500/20 to-teal-500/5',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  {
    number: '04',
    title: 'AI Integration & Automation',
    short: 'AI & Automation',
    desc: 'We embed intelligent capabilities into your products — from custom LLM integrations to automated pipelines that eliminate repetitive workflows.',
    tags: ['LLM Integration', 'Workflow Automation', 'Data Pipelines', 'Custom AI Models'],
    gradient: 'from-orange-500/20 to-amber-500/5',
    accent: 'text-orange-400',
    border: 'border-orange-500/20',
  },
  {
    number: '05',
    title: 'Brand Identity & Content',
    short: 'Branding',
    desc: 'We build cohesive brand identities that resonate and endure. Logo, typography, tone of voice, and content strategy — all unified under a single, powerful narrative.',
    tags: ['Logo Design', 'Brand Guidelines', 'Copywriting', 'Social Strategy'],
    gradient: 'from-pink-500/20 to-rose-500/5',
    accent: 'text-pink-400',
    border: 'border-pink-500/20',
  },
  {
    number: '06',
    title: 'Growth & Performance Marketing',
    short: 'Growth',
    desc: 'Data-driven campaigns that fill your pipeline. We manage paid media, SEO, conversion optimisation, and analytics to maximise your ROI.',
    tags: ['SEO & SEM', 'Paid Ads', 'CRO', 'Analytics & Reporting'],
    gradient: 'from-cyan-500/20 to-sky-500/5',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const } },
};

export const ServicesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="services" ref={ref} className="relative py-28 overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute left-0 top-1/3 w-[500px] h-[500px] bg-blue-700/8 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute right-0 bottom-1/4 w-[400px] h-[400px] bg-purple-700/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-purple-400 font-semibold mb-6 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5">
              What We Do
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading leading-[1.1] tracking-tight text-white">
              End-to-End Digital{' '}
              <span className="text-gradient">Services</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-sm text-base leading-relaxed md:text-right">
            A holistic suite of services designed to take your brand from concept to market-leader.
          </p>
        </motion.div>

        {/* Service Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((svc, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`group relative rounded-2xl border p-7 cursor-none overflow-hidden transition-all duration-500 ${
                hovered === i ? `bg-gradient-to-br ${svc.gradient} ${svc.border}` : 'bg-white/[0.02] border-white/5'
              }`}
            >
              {/* Number */}
              <span className={`text-xs font-mono font-semibold tracking-widest ${hovered === i ? svc.accent : 'text-gray-600'} transition-colors duration-300`}>
                {svc.number}
              </span>

              <h3 className="mt-3 mb-3 text-lg font-semibold font-heading text-white leading-snug">
                {svc.title}
              </h3>

              <AnimatePresence mode="wait">
                {hovered === i ? (
                  <motion.p
                    key="desc"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400 text-sm leading-relaxed mb-5"
                  >
                    {svc.desc}
                  </motion.p>
                ) : (
                  <motion.p
                    key="short"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-600 text-sm leading-relaxed mb-5"
                  >
                    Hover to learn more →
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {svc.tags.map((tag, t) => (
                  <span
                    key={t}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all duration-300 ${
                      hovered === i
                        ? `${svc.accent} ${svc.border} bg-white/5`
                        : 'text-gray-600 border-white/5 bg-white/[0.02]'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Corner arrow */}
              <div className={`absolute top-6 right-6 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${
                hovered === i ? `${svc.border} ${svc.accent}` : 'border-white/10 text-gray-700'
              }`}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
