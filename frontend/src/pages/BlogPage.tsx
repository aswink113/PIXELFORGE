import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { ProjectPlannerModal } from '../components/ProjectPlannerModal';
import { CustomCursor } from '../components/CustomCursor';

const categories = ['All', 'Design', 'Development', 'AI', 'Business', 'Case Study'];

interface BlogPost {
  id?: string;
  slug: string;
  category: string;
  tag: string;
  readTime: string;
  date: string;
  title: string;
  excerpt: string;
  gradient?: string;
  featured: boolean;
  photo_url?: string;
}

const defaultPosts: BlogPost[] = [
  {
    slug: 'building-ai-products-2026',
    category: 'AI',
    tag: 'AI',
    readTime: '7 min read',
    date: 'Jul 18, 2026',
    title: 'Building AI-First Products in 2026: A Strategic Framework',
    excerpt: 'The AI landscape has shifted dramatically. We break down how leading product teams are embedding intelligence from day one — not bolting it on as an afterthought.',
    gradient: 'from-blue-600 via-indigo-600 to-purple-600',
    featured: true,
  },
  {
    slug: 'design-systems-scale',
    category: 'Design',
    tag: 'Design',
    readTime: '5 min read',
    date: 'Jul 10, 2026',
    title: 'Why Your Design System Is Your Most Valuable Asset',
    excerpt: 'A well-maintained design system is the difference between a team that ships in days and one that takes weeks. Here\'s how we build them.',
    gradient: 'from-purple-600 via-pink-600 to-rose-500',
    featured: false,
  },
  {
    slug: 'react-performance-2026',
    category: 'Development',
    tag: 'Development',
    readTime: '9 min read',
    date: 'Jun 28, 2026',
    title: 'React Performance Patterns That Actually Move the Needle',
    excerpt: 'We benchmarked 12 optimisation techniques across real client apps. Only 4 consistently delivered meaningful improvements. Here\'s what worked.',
    gradient: 'from-emerald-500 via-teal-600 to-blue-600',
    featured: false,
  },
  {
    slug: 'ux-audit-process',
    category: 'Design',
    tag: 'Design',
    readTime: '6 min read',
    date: 'Jun 15, 2026',
    title: 'Our 3-Hour UX Audit Process That Reveals Hidden Revenue',
    excerpt: 'Most UX problems are invisible until you know where to look. Our structured audit framework has uncovered an average of 8 high-impact issues per engagement.',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    featured: false,
  },
  {
    slug: 'startup-mvp-mistakes',
    category: 'Business',
    tag: 'Business',
    readTime: '4 min read',
    date: 'Jun 5, 2026',
    title: '5 MVP Mistakes That Kill Startups Before They Launch',
    excerpt: 'After working with 30+ early-stage startups, we\'ve seen the same fatal mistakes repeat. Here\'s how to avoid them and ship something people actually want.',
    gradient: 'from-cyan-500 via-sky-500 to-blue-500',
    featured: false,
  },
  {
    slug: 'case-study-synthetix',
    category: 'Case Study',
    tag: 'Case Study',
    readTime: '10 min read',
    date: 'May 22, 2026',
    title: 'Case Study: How We Built Synthetix AI\'s Core Platform in 12 Weeks',
    excerpt: 'From blank Figma canvas to production-ready AI platform in 12 weeks. A detailed walkthrough of our architecture decisions, design process, and lessons learned.',
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    featured: false,
  },
];

const tagColors: Record<string, string> = {
  AI: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Design: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Development: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Business: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'Case Study': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const } },
};

export const BlogPage = () => {
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/blogs');
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setPosts(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch blog posts', err);
      }
    };
    loadBlogs();
  }, []);

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  const featured = posts.find((p) => p.featured);
  const grid = filtered.filter((p) => !p.featured || activeCategory !== 'All');

  return (
    <div className="bg-[#050505] min-h-screen text-white cursor-none">
      <CustomCursor />
      <ProjectPlannerModal isOpen={plannerOpen} onClose={() => setPlannerOpen(false)} />
      <Navbar onOpenPlanner={() => setPlannerOpen(true)} />

      {/* Page Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-700/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-blue-400 font-semibold mb-6 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5">
              Insights & Stories
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-heading leading-[1.0] tracking-tight text-white mb-6">
              The <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl leading-relaxed">
              Thoughts on design, engineering, AI, and building products that matter — from the PixelForge team.
            </p>
          </motion.div>

          {/* Category filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap gap-3 mt-12"
          >
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-none hover-target border ${
                  activeCategory === c
                    ? 'bg-white text-black border-white'
                    : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white bg-white/[0.02]'
                }`}
              >
                {c}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-32">
        {/* Featured Post */}
        {activeCategory === 'All' && featured && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="group relative rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-500 mb-12 cursor-none hover-target flex flex-col md:flex-row"
          >
            {/* Cover */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative flex-shrink-0 overflow-hidden bg-zinc-900 border-r border-white/5">
              {featured.photo_url ? (
                <img 
                  src={featured.photo_url} 
                  alt={featured.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${featured.gradient}`} />
              )}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
              <div className="absolute top-6 left-6 z-10">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${tagColors[featured.tag]}`}>
                  Featured
                </span>
              </div>
            </div>
            {/* Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${tagColors[featured.tag]}`}>
                  {featured.tag}
                </span>
                <span className="text-gray-600 text-xs">{featured.readTime}</span>
                <span className="text-gray-600 text-xs">{featured.date}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                {featured.title}
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">{featured.excerpt}</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                Read Article
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </div>
          </motion.div>
        )}

        {/* Posts Grid */}
        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {grid.map((post) => (
            <motion.article
              key={post.slug}
              variants={itemVariants}
              className="group relative rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 overflow-hidden cursor-none hover-target flex flex-col"
            >
              {/* Cover image or gradient */}
              <div className="w-full h-44 relative overflow-hidden flex-shrink-0 bg-zinc-900 border-b border-white/5">
                {post.photo_url ? (
                  <img 
                    src={post.photo_url} 
                    alt={post.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient}`} />
                )}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-500" />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${tagColors[post.tag]}`}>
                    {post.tag}
                  </span>
                  <span className="text-gray-600 text-xs">{post.readTime}</span>
                </div>
                <h3 className="text-base font-semibold font-heading text-white leading-snug mb-3 group-hover:text-blue-400 transition-colors duration-300 flex-grow">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <span className="text-gray-600 text-xs">{post.date}</span>
                  <span className="text-blue-400 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-gray-600">
            No posts in this category yet.
          </div>
        )}
      </div>
    </div>
  );
};
