import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  gradient?: string;
  year: string;
  photo_url?: string;
}

interface ProjectProps {
  title: string;
  client: string;
  category: string;
  gradient?: string;
  year: string;
  photo_url?: string;
  onInquire: () => void;
}

const ProjectCard = ({ title, client, category, gradient, year, photo_url, onInquire }: ProjectProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="group relative rounded-3xl overflow-hidden glass-card hover:border-white/15 transition-all duration-500 flex flex-col h-[480px]"
    >
      {/* Cover image or gradient preview */}
      <div className="w-full h-64 relative flex items-center justify-center p-8 overflow-hidden bg-zinc-900 border-b border-white/5">
        {photo_url ? (
          <img 
            src={photo_url} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient || 'from-blue-600 via-indigo-600 to-purple-600'}`} />
        )}
        <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
        
        {/* Floating elements inside project cover */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-6 flex flex-col justify-between shadow-2xl relative z-10"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">{client}</span>
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/10 text-white hover-target">
            <ExternalLink className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Ambient background glow inside cover */}
        <div className="absolute w-32 h-32 bg-white/10 rounded-full blur-2xl -bottom-10 -right-10 pointer-events-none" />
      </div>

      {/* Info */}
      <div className="p-8 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>{category}</span>
            <span>{year}</span>
          </div>
          <h3 className="text-2xl font-bold font-heading text-white group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </h3>
        </div>

        {/* Action */}
        <button
          onClick={onInquire}
          className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors group/btn hover-target w-fit mt-4"
        >
          Request Case Study
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export const Portfolio = ({ onOpenPlanner }: { onOpenPlanner: (category: string) => void }) => {
  const defaultProjects: Project[] = [
    {
      id: "default-1",
      title: "Synthetix AI Core Integration",
      client: "Synthetix Corp",
      category: "AI & Machine Learning",
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
      year: "2026",
    },
    {
      id: "default-2",
      title: "Aura Luxury E-Commerce Engine",
      client: "Aura International",
      category: "Web Development",
      gradient: "from-purple-600 via-pink-600 to-red-500",
      year: "2025",
    },
    {
      id: "default-3",
      title: "Nova Fintech Wallet Experience",
      client: "Nova Labs Inc",
      category: "Mobile Apps",
      gradient: "from-emerald-500 via-teal-600 to-blue-600",
      year: "2025",
    }
  ];

  const [projects, setProjects] = useState<Project[]>(defaultProjects);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/portfolio');
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setProjects(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch portfolio projects', err);
      }
    };
    loadProjects();
  }, []);

  return (
    <section id="work" className="relative py-28 bg-[#050505] border-t border-white/5 z-10 px-6">
      {/* Ambient background lights */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.3em] text-purple-500 font-semibold mb-3 block">
              Case Studies
            </span>
            <h2 className="text-4xl md:text-6xl font-bold font-heading tracking-tight text-white mb-4">
              Selected <span className="text-gradient">projects.</span>
            </h2>
            <p className="text-gray-400 text-base font-light leading-relaxed">
              Explore our record of building highly refined digital platforms, tools, and bespoke software experiences.
            </p>
          </div>

          <button
            onClick={() => onOpenPlanner("General Inquiry")}
            className="group relative px-6 py-3 border border-white/20 hover:border-white text-white rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 hover-target flex items-center gap-2 cursor-none"
          >
            Inquire Full Archive
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              client={project.client}
              category={project.category}
              gradient={project.gradient}
              photo_url={project.photo_url}
              year={project.year}
              onInquire={() => onOpenPlanner(project.category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
