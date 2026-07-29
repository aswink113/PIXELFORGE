import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Portfolio } from '../components/Portfolio';
import { ProjectPlannerModal } from '../components/ProjectPlannerModal';
import { CustomCursor } from '../components/CustomCursor';

const filters = ['All', 'Web Development', 'Mobile Apps', 'AI & Machine Learning', 'UI/UX Design'];

export const WorkPage = () => {
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [plannerCategory, setPlannerCategory] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const openPlanner = (category = '') => {
    setPlannerCategory(category);
    setPlannerOpen(true);
  };

  return (
    <div className="min-h-screen cursor-none" style={{ background: 'linear-gradient(150deg, #EBF0FF 0%, #F2EEFF 28%, #F9EEFF 58%, #EBF4FF 100%)', backgroundAttachment: 'fixed' }}>
      <CustomCursor />
      <ProjectPlannerModal
        isOpen={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        initialCategory={plannerCategory}
      />
      <Navbar onOpenPlanner={() => openPlanner()} />

      {/* Page Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[180px] pointer-events-none" style={{ background: 'rgba(99,102,241,0.10)' }} />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[300px] rounded-full blur-[150px] pointer-events-none" style={{ background: 'rgba(139,92,246,0.08)' }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-indigo-500 font-semibold mb-6 px-4 py-1.5 rounded-full border border-indigo-400/25 bg-indigo-500/8">
              Our Work
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-heading leading-[1.0] tracking-tight mb-6" style={{ color: '#1E1B4B' }}>
              Selected <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-xl max-w-2xl leading-relaxed" style={{ color: '#6366A8' }}>
              A curated collection of digital products, platforms, and experiences we've crafted for ambitious brands worldwide.
            </p>
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="flex flex-wrap gap-3 mt-12"
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-none hover-target border ${
                  activeFilter === f
                    ? 'text-white border-indigo-500'
                    : 'text-indigo-600 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50'
                }`}
                style={activeFilter === f ? { background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' } : {}}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <Portfolio onOpenPlanner={openPlanner} />

      {/* Bottom CTA */}
      <section className="py-24 px-6 text-center border-t border-indigo-100">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4" style={{ color: '#1E1B4B' }}>
            Want to be our next{' '}
            <span className="text-gradient">success story?</span>
          </h2>
          <p className="mb-8 max-w-md mx-auto text-lg" style={{ color: '#6366A8' }}>
            Let's talk about what we can build together.
          </p>
          <button
            onClick={() => openPlanner()}
            className="group relative px-8 py-4 text-white text-base font-semibold rounded-full overflow-hidden hover-target transition-all hover:scale-105 active:scale-95 cursor-none"
            style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 8px 30px rgba(99,102,241,0.30)' }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start a Project
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </motion.div>
      </section>
    </div>
  );
};
