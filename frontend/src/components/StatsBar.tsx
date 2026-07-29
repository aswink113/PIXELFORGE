import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { getStats } from '../utils/db';

interface StatItem {
  id?: string;
  value: string;
  label: string;
  suffix: string;
}

export const StatsBar = () => {
  const [statsData, setStatsData] = useState<StatItem[]>([
    { id: 'stat-1', value: '150+', label: 'Projects Delivered', suffix: '' },
    { id: 'stat-2', value: '98', label: 'Client Satisfaction', suffix: '%' },
    { id: 'stat-3', value: '7', label: 'Years of Excellence', suffix: '+' },
    { id: 'stat-4', value: '40', label: 'Expert Creatives', suffix: '+' },
  ]);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    try {
      const data = getStats();
      if (data && data.length > 0) {
        setStatsData(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  return (
    <section ref={ref} className="relative py-16 overflow-hidden">
      {/* Separator line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-border-color to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border-color rounded-3xl overflow-hidden border border-border-color">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.id || i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }}
              className="relative group flex flex-col items-center justify-center py-10 px-6 bg-brand-bg hover:bg-card-hover-bg transition-colors duration-500"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-blue-600/5 to-purple-600/5 rounded-none" />

              <span className="text-4xl md:text-5xl font-bold font-heading text-gradient">
                {stat.value}
                <span className="text-blue-400">{stat.suffix}</span>
              </span>
              <span className="mt-2 text-xs uppercase tracking-[0.2em] text-text-muted font-medium text-center">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

