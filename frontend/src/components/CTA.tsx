import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const CTA = ({ onOpenPlanner }: { onOpenPlanner?: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contact" ref={ref} className="relative py-32 overflow-hidden bg-brand-bg transition-colors duration-300">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-border-color to-transparent" />

      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[400px] bg-gradient-to-r from-blue-700/15 via-purple-700/15 to-blue-700/15 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-blue-400 font-semibold mb-8 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5">
            Let's Build Together
          </span>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading leading-[1.0] tracking-tight text-text-main mb-6">
            Ready to Start <br />
            <span className="text-gradient">Your Project?</span>
          </h2>

          <p className="text-text-muted text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-12">
            Whether you're launching a new product or scaling an existing one, we're ready to help you move fast and build right.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={() => onOpenPlanner && onOpenPlanner()}
              className="group relative px-8 py-4 rounded-full overflow-hidden hover-target transition-all hover:scale-105 active:scale-95 cursor-none shadow-[0_0_40px_rgba(var(--cursor-color),0.15)] hover:shadow-[0_0_60px_rgba(var(--cursor-color),0.3)]"
              style={{
                backgroundColor: 'var(--text-color)',
                color: 'var(--bg-color)'
              }}
            >
              <span className="relative z-10 flex items-center gap-2.5 font-semibold">
                Schedule a Discovery Call
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <div 
                className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10" 
                style={{ backgroundColor: 'var(--bg-color)' }}
              />
            </button>

            <a
              href="mailto:hello@pixelforge.studio"
              className="px-6 py-4 text-text-muted hover:text-text-main text-base font-medium transition-colors duration-300 flex items-center gap-2 cursor-none hover-target"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              hello@pixelforge.studio
            </a>
          </div>

          {/* Trust line */}
          <p className="mt-12 text-text-muted/60 text-sm">
            No commitment. Free 30-minute strategy session. ✦ We respond within 24 hours.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
