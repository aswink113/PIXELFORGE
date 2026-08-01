import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const services = [
  {
    number: '01',
    title: 'Digital Strategy & Consulting',
    desc: 'We analyse your market, define your digital roadmap, and create a blueprint for sustainable growth. From UX audits to tech stack decisions — we guide every strategic move.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'UI/UX Design & Prototyping',
    desc: 'We craft intuitive, visually stunning interfaces grounded in user psychology. Every design decision is purposeful, every interaction delightful.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Web & Mobile Development',
    desc: 'From high-performance React applications to native mobile apps — we build scalable, maintainable software that grows with your business.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'AI Integration & Automation',
    desc: 'We embed intelligent capabilities into your products — from custom LLM integrations to automated pipelines that eliminate repetitive workflows.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Brand Identity & Content',
    desc: 'We build cohesive brand identities that resonate and endure. Logo, typography, tone of voice, and content strategy — all unified under a single, powerful narrative.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    number: '06',
    title: 'Growth & Performance Marketing',
    desc: 'Data-driven campaigns that fill your pipeline. We manage paid media, SEO, conversion optimisation, and analytics to maximise your ROI.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export const ServicesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" ref={ref} className="py-28 bg-[#FCFCFC] border-t border-black/[0.01]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#5E5BFF] block mb-3">
              What We Do
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] tracking-tight font-heading leading-tight">
              End-to-End Digital Services
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              A holistic suite of premium digital services designed to take your brand from initial concept to dominant market leader.
            </p>
          </div>
        </motion.div>

        {/* Clean Minimalist Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {services.map((svc, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group p-8 rounded-2xl border border-black/[0.04] bg-white transition-all duration-300 hover:border-[#5E5BFF]/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#5E5BFF]/5 text-[#5E5BFF] flex items-center justify-center transition-colors duration-300 group-hover:bg-[#5E5BFF] group-hover:text-white">
                  {svc.icon}
                </div>
                <span className="text-xs font-mono font-bold text-gray-300 group-hover:text-[#5E5BFF]/50 transition-colors">
                  {svc.number}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#111111] tracking-tight mb-3 font-heading">
                {svc.title}
              </h3>
              <p className="text-gray-500 text-xs md:text-[13px] leading-relaxed">
                {svc.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
