import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { getTestimonials } from '../utils/db';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  gradient: string;
  photo_url?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 'default-1',
    quote: "Lumiora didn't just build our platform — they redefined how we think about our product. The strategic depth they brought was unlike any agency we'd worked with before.",
    author: 'Sarah Chen',
    role: 'CEO, Luminary Ventures',
    avatar: 'SC',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'default-2',
    quote: "The team's ability to translate complex business logic into an elegant, performant application was exceptional. Delivered ahead of schedule, on budget, and the UX is outstanding.",
    author: 'James O\'Brien',
    role: 'CTO, Nexaflow Inc.',
    avatar: 'JO',
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    id: 'default-3',
    quote: "Working with Lumiora felt like having a world-class product team embedded within our company. They cared about our outcomes as much as we did.",
    author: 'Priya Nair',
    role: 'Head of Product, Astra Labs',
    avatar: 'PN',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

export const Testimonials = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);

  useEffect(() => {
    try {
      const data = getTestimonials();
      if (data && data.length > 0) {
        setTestimonials(data);
      }
    } catch (err) {
      console.error('Failed to fetch testimonials from local DB', err);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pf_testimonials') {
        try {
          const data = getTestimonials();
          if (data && data.length > 0) {
            setTestimonials(data);
          }
        } catch (err) {
          console.error('Failed to fetch testimonials from local DB', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <section ref={ref} className="relative py-28 overflow-hidden bg-brand-bg transition-colors duration-300">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-border-color to-transparent" />

      {/* Blob */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-700/6 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-pink-400 font-semibold mb-6 px-4 py-1.5 rounded-full border border-pink-500/20 bg-pink-500/5">
            Client Love
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading leading-[1.1] tracking-tight text-text-main">
            What Our{' '}
            <span className="text-gradient">Clients Say</span>
          </h2>
        </motion.div>

        {/* Quote Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="glass-card rounded-3xl p-10 md:p-14 text-center border border-border-color relative overflow-hidden"
            >
              {/* Big quote mark */}
              <span className="absolute top-6 left-10 text-8xl font-serif text-text-muted/10 leading-none select-none">"</span>

              <p className="relative text-xl md:text-2xl text-text-main leading-relaxed font-light max-w-3xl mx-auto mb-10">
                "{testimonials[active].quote}"
              </p>

              {/* Avatar + Info */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-zinc-900 border border-border-color flex-shrink-0">
                  {testimonials[active].photo_url ? (
                    <img 
                      src={testimonials[active].photo_url} 
                      alt={testimonials[active].author} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${testimonials[active].gradient} flex items-center justify-center text-white font-semibold text-sm`}>
                      {testimonials[active].avatar}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-text-main font-semibold text-base">{testimonials[active].author}</p>
                  <p className="text-text-muted text-sm">{testimonials[active].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`cursor-none hover-target transition-all duration-300 rounded-full ${
                  i === active
                    ? 'w-8 h-2 bg-blue-500'
                    : 'w-2 h-2 bg-text-muted/30 hover:bg-text-main/50'
                }`}
              />
            ))}
          </div>

          {/* Prev / Next */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 hidden md:flex justify-between px-2 md:-mx-16 pointer-events-none">
            <button
              onClick={() => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="pointer-events-auto w-10 h-10 rounded-full border border-border-color bg-card-bg hover:bg-card-hover-bg flex items-center justify-center text-text-muted hover:text-text-main transition-all cursor-none hover-target backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActive((prev) => (prev + 1) % testimonials.length)}
              className="pointer-events-auto w-10 h-10 rounded-full border border-border-color bg-card-bg hover:bg-card-hover-bg flex items-center justify-center text-text-muted hover:text-text-main transition-all cursor-none hover-target backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
