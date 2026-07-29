// Native crypto.randomUUID used for id generation

export interface AdminUser {
  username: string;
  token: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  photo_url: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  gradient: string;
  photo_url?: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  gradient?: string;
  year: string;
  photo_url?: string;
}

export interface BlogPost {
  id: string;
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

export interface Consultation {
  id: string;
  category: string;
  budget: string;
  timeline: string;
  description: string;
  name: string;
  email: string;
  whatsapp: string;
  company?: string;
  created_at: string;
}

export interface AgencyStat {
  id: string;
  label: string;
  value: string;
  suffix: string;
  order_index: number;
}

// ─── Default Seed Data ────────────────────────────────────────────────────────

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "arjun-mehta",
    name: "Arjun Mehta",
    role: "Lead Designer",
    bio: "Arjun is a digital craftsman with 8+ years of experience building immersive brand stories and design systems.",
    skills: ["Figma", "Webflow", "UI/UX", "Brand Strategy"],
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    role: "Lead Engineer",
    bio: "Sarah specializes in React, Node.js, and high-performance WebGL integrations. She makes complex systems fast and reliable.",
    skills: ["React", "TypeScript", "Node.js", "Three.js"],
    photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "dev-patel",
    name: "Dev Patel",
    role: "Product Strategist",
    bio: "Dev works with founders to scope, validate, and launch digital products that find product-market fit.",
    skills: ["Product Strategy", "Agile", "User Research", "Analytics"],
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "aisha-rahman",
    name: "Aisha Rahman",
    role: "AI Researcher",
    bio: "Aisha leads our intelligent product design and builds machine learning pipelines for personalized user experiences.",
    skills: ["Python", "PyTorch", "LLMs", "Prompt Engineering"],
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  }
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    quote: "PixelForge didn't just build our platform — they redefined how we think about our product. The strategic depth they brought was unlike any agency we'd worked with before.",
    author: "Sarah Chen",
    role: "CEO, Luminary Ventures",
    avatar: "SC",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: "t-2",
    quote: "The team's ability to translate complex business logic into an elegant, performant application was exceptional. Delivered ahead of schedule, on budget, and the UX is outstanding.",
    author: "James O'Brien",
    role: "CTO, Nexaflow Inc.",
    avatar: "JO",
    gradient: "from-purple-500 to-violet-500"
  },
  {
    id: "t-3",
    quote: "Working with PixelForge felt like having a world-class product team embedded within our company. They cared about our outcomes as much as we did.",
    author: "Priya Nair",
    role: "Head of Product, Astra Labs",
    avatar: "PN",
    gradient: "from-emerald-500 to-teal-500"
  }
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "p-1",
    title: "Synthetix AI Core Integration",
    client: "Synthetix Corp",
    category: "AI & Machine Learning",
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
    year: "2026"
  },
  {
    id: "p-2",
    title: "Aura Luxury E-Commerce Engine",
    client: "Aura International",
    category: "Web Development",
    gradient: "from-purple-600 via-pink-600 to-red-500",
    year: "2025"
  },
  {
    id: "p-3",
    title: "Nova Fintech Wallet Experience",
    client: "Nova Labs Inc",
    category: "Mobile Apps",
    gradient: "from-emerald-500 via-teal-600 to-blue-600",
    year: "2025"
  }
];

const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: "b-1",
    slug: "building-ai-products-2026",
    category: "AI",
    tag: "AI",
    readTime: "7 min read",
    date: "Jul 18, 2026",
    title: "Building AI-First Products in 2026: A Strategic Framework",
    excerpt: "The AI landscape has shifted dramatically. We break down how leading product teams are embedding intelligence from day one — not bolting it on as an afterthought.",
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
    featured: true
  },
  {
    id: "b-2",
    slug: "design-systems-scale",
    category: "Design",
    tag: "Design",
    readTime: "5 min read",
    date: "Jul 10, 2026",
    title: "Why Your Design System Is Your Most Valuable Asset",
    excerpt: "A well-maintained design system is the difference between a team that ships in days and one that takes weeks. Here's how we build them.",
    gradient: "from-purple-600 via-pink-600 to-rose-500",
    featured: false
  },
  {
    id: "b-3",
    slug: "react-performance-2026",
    category: "Development",
    tag: "Development",
    readTime: "9 min read",
    date: "Jun 28, 2026",
    title: "React Performance Patterns That Actually Move the Needle",
    excerpt: "We benchmarked 12 optimisation techniques across real client apps. Only 4 consistently delivered meaningful improvements. Here's what worked.",
    gradient: "from-emerald-500 via-teal-600 to-blue-600",
    featured: false
  },
  {
    id: "b-4",
    slug: "ux-audit-process",
    category: "Design",
    tag: "Design",
    readTime: "6 min read",
    date: "Jun 15, 2026",
    title: "Our 3-Hour UX Audit Process That Reveals Hidden Revenue",
    excerpt: "Most UX problems are invisible until you know where to look. Our structured audit framework has uncovered an average of 8 high-impact issues per engagement.",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    featured: false
  },
  {
    id: "b-5",
    slug: "startup-mvp-mistakes",
    category: "Business",
    tag: "Business",
    readTime: "4 min read",
    date: "Jun 5, 2026",
    title: "5 MVP Mistakes That Kill Startups Before They Launch",
    excerpt: "After working with 30+ early-stage startups, we've seen the same fatal mistakes repeat. Here's how to avoid them and ship something people actually want.",
    gradient: "from-cyan-500 via-sky-500 to-blue-500",
    featured: false
  },
  {
    id: "b-6",
    slug: "case-study-synthetix",
    category: "Case Study",
    tag: "Case Study",
    readTime: "10 min read",
    date: "May 22, 2026",
    title: "Case Study: How We Built Synthetix AI's Core Platform in 12 Weeks",
    excerpt: "From blank Figma canvas to production-ready AI platform in 12 weeks. A detailed walkthrough of our architecture decisions, design process, and lessons learned.",
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    featured: false
  }
];

const DEFAULT_STATS: AgencyStat[] = [
  { id: "stat-1", label: "Projects Delivered", value: "150+", suffix: "", order_index: 0 },
  { id: "stat-2", label: "Client Satisfaction", value: "98", suffix: "%", order_index: 1 },
  { id: "stat-3", label: "Years of Excellence", value: "7", suffix: "+", order_index: 2 },
  { id: "stat-4", label: "Expert Creatives", value: "40", suffix: "+", order_index: 3 }
];

// Helper to initialize localStorage
const initDB = () => {
  if (!localStorage.getItem('pf_team')) {
    localStorage.setItem('pf_team', JSON.stringify(DEFAULT_TEAM));
  }
  if (!localStorage.getItem('pf_testimonials')) {
    localStorage.setItem('pf_testimonials', JSON.stringify(DEFAULT_TESTIMONIALS));
  }
  if (!localStorage.getItem('pf_projects')) {
    localStorage.setItem('pf_projects', JSON.stringify(DEFAULT_PROJECTS));
  }
  if (!localStorage.getItem('pf_blogs')) {
    localStorage.setItem('pf_blogs', JSON.stringify(DEFAULT_BLOGS));
  }
  if (!localStorage.getItem('pf_stats')) {
    localStorage.setItem('pf_stats', JSON.stringify(DEFAULT_STATS));
  }
  if (!localStorage.getItem('pf_leads')) {
    localStorage.setItem('pf_leads', JSON.stringify([]));
  }
};

initDB();

// ─── DB Methods ──────────────────────────────────────────────────────────────

export const getStats = (): AgencyStat[] => {
  initDB();
  const data = JSON.parse(localStorage.getItem('pf_stats') || '[]');
  return data.sort((a: AgencyStat, b: AgencyStat) => a.order_index - b.order_index);
};

export const updateStat = (id: string, label: string, value: string, suffix: string): AgencyStat => {
  const stats = getStats();
  const index = stats.findIndex(s => s.id === id);
  if (index !== -1) {
    stats[index] = { ...stats[index], label, value, suffix };
    localStorage.setItem('pf_stats', JSON.stringify(stats));
    return stats[index];
  }
  throw new Error('Stat not found');
};

export const getTestimonials = (): Testimonial[] => {
  initDB();
  return JSON.parse(localStorage.getItem('pf_testimonials') || '[]');
};

export const addTestimonial = (quote: string, author: string, role: string, photo_url: string): Testimonial => {
  const testimonials = getTestimonials();
  const newT: Testimonial = {
    id: crypto.randomUUID(),
    quote,
    author,
    role,
    avatar: author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    gradient: "from-blue-500 to-purple-500",
    photo_url
  };
  testimonials.push(newT);
  localStorage.setItem('pf_testimonials', JSON.stringify(testimonials));
  return newT;
};

export const deleteTestimonial = (id: string): void => {
  const testimonials = getTestimonials();
  const filtered = testimonials.filter(t => t.id !== id);
  localStorage.setItem('pf_testimonials', JSON.stringify(filtered));
};

export const getPortfolio = (): Project[] => {
  initDB();
  return JSON.parse(localStorage.getItem('pf_projects') || '[]');
};

export const addProject = (title: string, client: string, category: string, year: string, photo_url: string): Project => {
  const projects = getPortfolio();
  const newP: Project = {
    id: crypto.randomUUID(),
    title,
    client,
    category,
    year,
    photo_url
  };
  projects.push(newP);
  localStorage.setItem('pf_projects', JSON.stringify(projects));
  return newP;
};

export const deleteProject = (id: string): void => {
  const projects = getPortfolio();
  const filtered = projects.filter(p => p.id !== id);
  localStorage.setItem('pf_projects', JSON.stringify(filtered));
};

export const getBlogs = (): BlogPost[] => {
  initDB();
  return JSON.parse(localStorage.getItem('pf_blogs') || '[]');
};

export const addBlog = (title: string, category: string, readTime: string, excerpt: string, featured: boolean, photo_url: string): BlogPost => {
  const blogs = getBlogs();
  
  // Generate slug
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (blogs.some(b => b.slug === slug)) {
    slug = `${slug}-${crypto.randomUUID().slice(0, 4)}`;
  }

  // Handle single featured post
  if (featured) {
    blogs.forEach(b => { b.featured = false; });
  }

  const newB: BlogPost = {
    id: crypto.randomUUID(),
    slug,
    category,
    tag: category,
    readTime,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    title,
    excerpt,
    featured,
    photo_url
  };
  blogs.push(newB);
  localStorage.setItem('pf_blogs', JSON.stringify(blogs));
  return newB;
};

export const deleteBlog = (id: string): void => {
  const blogs = getBlogs();
  const filtered = blogs.filter(b => b.id !== id);
  localStorage.setItem('pf_blogs', JSON.stringify(filtered));
};

export const getTeam = (): TeamMember[] => {
  initDB();
  return JSON.parse(localStorage.getItem('pf_team') || '[]');
};

export const addTeamMember = (name: string, role: string, bio: string, skillsStr: string, photo_url: string): TeamMember => {
  const team = getTeam();
  const skills = skillsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
  const newM: TeamMember = {
    id: crypto.randomUUID(),
    name,
    role,
    bio,
    skills,
    photo_url
  };
  team.push(newM);
  localStorage.setItem('pf_team', JSON.stringify(team));
  return newM;
};

export const deleteTeamMember = (id: string): void => {
  const team = getTeam();
  const filtered = team.filter(m => m.id !== id);
  localStorage.setItem('pf_team', JSON.stringify(filtered));
};

export const getLeads = (): Consultation[] => {
  initDB();
  return JSON.parse(localStorage.getItem('pf_leads') || '[]');
};

export const addLead = (leadData: Omit<Consultation, 'id' | 'created_at'>): Consultation => {
  const leads = getLeads();
  const newLead: Consultation = {
    ...leadData,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  };
  leads.push(newLead);
  localStorage.setItem('pf_leads', JSON.stringify(leads));
  return newLead;
};

export const deleteLead = (id: string): void => {
  const leads = getLeads();
  const filtered = leads.filter(l => l.id !== id);
  localStorage.setItem('pf_leads', JSON.stringify(filtered));
};

// ─── Auth Mocking ────────────────────────────────────────────────────────────

export const loginAdmin = (usernameInput: string, passwordInput: string): string => {
  const adminUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';
  if (usernameInput === adminUsername && passwordInput === adminPassword) {
    const mockToken = `mock-token-${crypto.randomUUID()}`;
    localStorage.setItem('admin_token', mockToken);
    return mockToken;
  }
  throw new Error('Incorrect username or password');
};

export const checkAdminToken = (token: string | null): boolean => {
  if (!token) return false;
  return token === localStorage.getItem('admin_token');
};
