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
    <div className="bg-[#050505] min-h-screen text-white cursor-none">
      <CustomCursor />
      <ProjectPlannerModal
        isOpen={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        initialCategory={plannerCategory}
      />
      <Navbar onOpenPlanner={() => openPlanner()} />

      {/* Page Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-700/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-purple-400 font-semibold mb-6 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5">
              Our Work
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-heading leading-[1.0] tracking-tight text-white mb-6">
              Selected <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl leading-relaxed">
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
                    ? 'bg-white text-black border-white'
                    : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white bg-white/[0.02]'
                }`}
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
      <section className="py-24 px-6 text-center border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Want to be our next{' '}
            <span className="text-gradient">success story?</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Let's talk about what we can build together.
          </p>
          <button
            onClick={() => openPlanner()}
            className="group relative px-8 py-4 bg-white text-black text-base font-semibold rounded-full overflow-hidden hover-target transition-all hover:scale-105 active:scale-95 cursor-none shadow-[0_0_40px_rgba(255,255,255,0.15)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start a Project
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </motion.div>
      </section>
    </div>
  );
};
