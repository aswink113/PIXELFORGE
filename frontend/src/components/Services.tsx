import { motion } from 'framer-motion';
import { Code2, Smartphone, Brain, Compass, ArrowRight } from 'lucide-react';

interface ServiceProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  color: string;
  onSelect: () => void;
}

const ServiceCard = ({ icon, title, description, features, color, onSelect }: ServiceProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="glass-card p-8 rounded-3xl relative overflow-hidden group hover:border-white/15 transition-all duration-500 flex flex-col justify-between h-full"
    >
      {/* Background glow hover effect */}
      <div className={`absolute -right-20 -top-20 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${color}`} />

      <div>
        {/* Icon wrapper */}
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-gray-300 group-hover:text-white group-hover:bg-white/10 transition-all duration-300 border border-white/5">
          {icon}
        </div>

        {/* Text */}
        <h3 className="text-2xl font-bold font-heading mb-3 text-white">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">{description}</p>

        {/* Feature Tags */}
        <ul className="space-y-2 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-1 h-1 rounded-full bg-blue-500" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Action */}
      <button 
        onClick={onSelect}
        className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors group/btn hover-target w-fit"
      >
        Inquire Service
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};

export const Services = ({ onOpenPlanner }: { onOpenPlanner: (category: string) => void }) => {
  const servicesList = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Web Platforms",
      description: "Premium, responsive web applications engineered with Next.js, Vite, and high-performance cloud architectures.",
      features: ["Next.js & React Architectures", "High-frequency systems", "Cloud-native microservices"],
      color: "bg-blue-500/20",
      category: "Web Development"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Products",
      description: "Highly polished iOS and Android applications with native fluid performance and gesture-driven UX design.",
      features: ["Native iOS & Android", "Cross-platform solutions", "Fluid animations & haptics"],
      color: "bg-purple-500/20",
      category: "Mobile Apps"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Integration",
      description: "Incorporate cutting-edge LLMs, deep learning models, and automated pipeline solutions into your existing products.",
      features: ["Cognitive LLM agents", "Predictive ML pipelines", "RAG & Vector search implementations"],
      color: "bg-pink-500/20",
      category: "AI & Machine Learning"
    },
    {
      icon: <Compass className="w-6 h-6" />,
      title: "UI/UX & Branding",
      description: "Bespoke digital design system formulation, brand identity design, and high-fidelity product prototyping.",
      features: ["Interactive design systems", "Brand architecture", "Premium rapid prototyping"],
      color: "bg-emerald-500/20",
      category: "UI/UX Design"
    }
  ];

  return (
    <section id="services" className="relative py-28 bg-[#050505] z-10 px-6 overflow-hidden">
      {/* Visual ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-blue-500 font-semibold mb-3 block"
          >
            Specializations
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold font-heading tracking-tight text-white mb-6 leading-tight"
          >
            We engineer high-fidelity <span className="text-gradient">digital solutions.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg font-light leading-relaxed max-w-2xl"
          >
            From custom cloud platforms and AI systems to responsive mobile environments, our design-led engineering process drives technical excellence.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              features={service.features}
              color={service.color}
              onSelect={() => onOpenPlanner(service.category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
