import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Briefcase, FileText, MessageSquare, 
  LogOut, Trash2, Lock, User, Mail, 
  Phone, Building, BarChart3
} from 'lucide-react';
import { CustomCursor } from '../components/CustomCursor';
import { 
  getStats, updateStat, getTestimonials, addTestimonial, deleteTestimonial,
  getPortfolio, addProject, deleteProject, getBlogs, addBlog, deleteBlog,
  getTeam, addTeamMember, deleteTeamMember, getLeads, deleteLead,
  loginAdmin, checkAdminToken
} from '../utils/db';

// Gradient choices to select from
const testimonialGradients = [
  { name: 'Blue Cyber', class: 'from-blue-500 to-cyan-500' },
  { name: 'Purple Dream', class: 'from-purple-500 to-violet-500' },
  { name: 'Emerald Spark', class: 'from-emerald-500 to-teal-500' },
  { name: 'Sunset Rose', class: 'from-pink-500 to-rose-500' },
];

const contentGradients = [
  { name: 'Indigo Flame', class: 'from-blue-600 via-indigo-600 to-purple-600' },
  { name: 'Sunset Burst', class: 'from-purple-600 via-pink-600 to-red-500' },
  { name: 'Forest Water', class: 'from-emerald-500 via-teal-600 to-blue-600' },
  { name: 'Volcano Glow', class: 'from-amber-500 via-orange-500 to-red-500' },
  { name: 'Ocean Breeze', class: 'from-cyan-500 via-sky-500 to-blue-500' },
  { name: 'Royal Velvet', class: 'from-violet-600 via-purple-600 to-indigo-600' },
];

const categories = ['Design', 'Development', 'AI', 'Business', 'Case Study'];

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

export const AdminPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'team' | 'portfolio' | 'blogs' | 'testimonials' | 'stats'>('overview');
  
  // Auth state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Database states
  const [leads, setLeads] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Forms state
  const [teamFile, setTeamFile] = useState<File | null>(null);
  const [teamFilePreview, setTeamFilePreview] = useState<string | null>(null);

  const [projectForm, setProjectForm] = useState({ title: '', client: '', category: 'UI/UX Design', gradient: contentGradients[0].class, year: new Date().getFullYear().toString() });
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [projectFilePreview, setProjectFilePreview] = useState<string | null>(null);
  
  const [blogForm, setBlogForm] = useState({ title: '', slug: '', category: 'AI', tag: 'AI', readTime: '5 min read', date: '', excerpt: '', gradient: contentGradients[0].class, featured: false });
  const [blogFile, setBlogFile] = useState<File | null>(null);
  const [blogFilePreview, setBlogFilePreview] = useState<string | null>(null);
  
  const [testimonialForm, setTestimonialForm] = useState({ quote: '', author: '', role: '', avatar: '', gradient: testimonialGradients[0].class });
  const [testimonialFile, setTestimonialFile] = useState<File | null>(null);
  const [testimonialFilePreview, setTestimonialFilePreview] = useState<string | null>(null);

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const triggerNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Check backend session (mocked)
  useEffect(() => {
    if (token) {
      const isValid = checkAdminToken(token);
      if (!isValid) {
        localStorage.removeItem('admin_token');
        setToken(null);
      }
    }
  }, [token]);

  // Load dashboard data
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLeads(getLeads());
        setTeam(getTeam());
        setPortfolio(getPortfolio());
        setBlogs(getBlogs());
        setTestimonials(getTestimonials());
        setStats(getStats());
      } catch (err) {
        console.error('Error loading admin panel data:', err);
      }
    };

    fetchData();
  }, [token, refreshTrigger]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const access_token = loginAdmin(username, password);
      setToken(access_token);
      triggerNotification('Successfully logged in as Super Admin');
    } catch (err: any) {
      setLoginError(err.message || 'Incorrect credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    triggerNotification('Logged out successfully');
  };

  // ─── CRUD Actions ──────────────────────────────────────────────────────────

  // Team
  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamFile) {
      alert('Please upload a photo for the team member.');
      return;
    }
    setLoading(true);

    try {
      const base64Photo = await fileToBase64(teamFile);
      addTeamMember("", "", "", "", base64Photo);
      triggerNotification('Team member added successfully!');
      setTeamFile(null);
      setTeamFilePreview(null);
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerNotification(err.message || 'Error adding team member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    try {
      deleteTeamMember(id);
      triggerNotification('Team member removed');
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerNotification(err.message, 'error');
    }
  };

  // Testimonials
  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialFile) {
      alert('Please upload a photo for the testimonial.');
      return;
    }
    setLoading(true);
    try {
      const base64Photo = await fileToBase64(testimonialFile);
      addTestimonial(testimonialForm.quote, testimonialForm.author, testimonialForm.role, base64Photo);
      triggerNotification('Testimonial added successfully!');
      setTestimonialForm({ quote: '', author: '', role: '', avatar: '', gradient: testimonialGradients[0].class });
      setTestimonialFile(null);
      setTestimonialFilePreview(null);
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      deleteTestimonial(id);
      triggerNotification('Testimonial deleted');
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerNotification(err.message, 'error');
    }
  };

  // Portfolio
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectFile) {
      alert('Please upload a cover image for the project.');
      return;
    }
    setLoading(true);
    try {
      const base64Photo = await fileToBase64(projectFile);
      addProject(projectForm.title, projectForm.client, projectForm.category, projectForm.year, base64Photo);
      triggerNotification('Portfolio project added!');
      setProjectForm({ title: '', client: '', category: 'UI/UX Design', gradient: contentGradients[0].class, year: new Date().getFullYear().toString() });
      setProjectFile(null);
      setProjectFilePreview(null);
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      deleteProject(id);
      triggerNotification('Project deleted');
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerNotification(err.message, 'error');
    }
  };

  // Blogs
  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogFile) {
      alert('Please upload a cover image for the blog post.');
      return;
    }
    setLoading(true);
    
    try {
      const base64Photo = await fileToBase64(blogFile);
      addBlog(blogForm.title, blogForm.category, blogForm.readTime, blogForm.excerpt, blogForm.featured, base64Photo);
      triggerNotification('Blog post created!');
      setBlogForm({ title: '', slug: '', category: 'AI', tag: 'AI', readTime: '5 min read', date: '', excerpt: '', gradient: contentGradients[0].class, featured: false });
      setBlogFile(null);
      setBlogFilePreview(null);
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      deleteBlog(id);
      triggerNotification('Blog post deleted');
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerNotification(err.message, 'error');
    }
  };

  // Leads
  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this consultation request?')) return;
    try {
      deleteLead(id);
      triggerNotification('Consultation inquiry deleted');
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerNotification(err.message, 'error');
    }
  };

  // Stats Bar CRUD
  const handleStatChange = (id: string, field: 'label' | 'value' | 'suffix', newVal: string) => {
    setStats(prev => prev.map(s => s.id === id ? { ...s, [field]: newVal } : s));
  };

  const handleSaveStat = async (id: string) => {
    const statToSave = stats.find(s => s.id === id);
    if (!statToSave) return;
    setLoading(true);
    try {
      updateStat(statToSave.id, statToSave.label, statToSave.value, statToSave.suffix);
      triggerNotification('Stat updated successfully!');
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerNotification(err.message || 'Error updating stat', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white cursor-none flex flex-col font-sans">
      <CustomCursor />

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[300] px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md border ${
              notification.type === 'error' 
                ? 'bg-red-500/20 border-red-500/30 text-red-300' 
                : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${notification.type === 'error' ? 'bg-red-400' : 'bg-emerald-400'}`} />
            <span className="text-sm font-semibold">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!token ? (
        // ─── LOGIN SCREEN ────────────────────────────────────────────────────
        <div className="flex-grow flex items-center justify-center relative p-6 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-700/10 rounded-full blur-[180px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[180px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md glass-card rounded-3xl p-8 border border-white/10 relative z-10 shadow-2xl"
          >
            <div className="text-center mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] text-blue-400 font-semibold mb-3 block">
                Control Panel
              </span>
              <h1 className="text-3xl font-bold font-heading text-white">
                Super Admin <span className="text-gradient">Portal</span>
              </h1>
              <p className="text-gray-500 text-xs mt-2">
                Log in to edit your team, works, blogs, and testimonials in real-time.
              </p>
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3.5 text-xs text-center mb-5">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-1.5">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-none hover-target shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Access Dashboard'}
              </button>
            </form>

            <div className="text-center mt-6">
              <button 
                onClick={() => navigate('/')} 
                className="text-gray-500 hover:text-white text-xs cursor-none hover-target transition-colors"
              >
                ← Back to Main Site
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        // ─── ADMIN DASHBOARD ─────────────────────────────────────────────────
        <div className="flex-grow flex flex-col md:flex-row">
          {/* SIDEBAR */}
          <aside className="w-full md:w-64 border-r border-white/5 bg-[#0b0c10] flex-shrink-0 flex flex-col justify-between p-6">
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold font-heading text-white">PixelForge</h2>
                  <span className="text-[10px] uppercase text-emerald-400 tracking-wider font-semibold">Super Admin</span>
                </div>
                <button 
                  onClick={() => navigate('/')}
                  className="text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-none hover-target"
                >
                  View Site
                </button>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'overview', name: 'Overview', icon: LayoutDashboard },
                  { id: 'leads', name: 'Leads / Planner', icon: Mail, badge: leads.length },
                  { id: 'team', name: 'Team Members', icon: Users, badge: team.length },
                  { id: 'portfolio', name: 'Portfolio Work', icon: Briefcase, badge: portfolio.length },
                  { id: 'blogs', name: 'Blogs', icon: FileText, badge: blogs.length },
                  { id: 'testimonials', name: 'Testimonials', icon: MessageSquare, badge: testimonials.length },
                  { id: 'stats', name: 'Agency Stats', icon: BarChart3, badge: undefined },
                ].map(item => {
                  const Icon = item.icon;
                  const isAct = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-none hover-target ${
                        isAct 
                          ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                          : 'text-gray-400 hover:bg-white/[0.02] hover:text-white border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAct ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6 md:mt-0">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/5 hover:text-red-300 transition-all cursor-none hover-target"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* MAIN WORKSPACE */}
          <main className="flex-grow p-6 md:p-10 max-w-6xl mx-auto w-full overflow-y-auto">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold font-heading text-white">System Overview</h1>
                  <p className="text-gray-500 text-sm mt-1">Manage and monitor all aspects of the PixelForge dynamic core.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { title: 'Inquiries', count: leads.length, icon: Mail, color: 'text-blue-400 bg-blue-500/10 border-blue-500/15' },
                    { title: 'Team', count: team.length, icon: Users, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15' },
                    { title: 'Projects', count: portfolio.length, icon: Briefcase, color: 'text-purple-400 bg-purple-500/10 border-purple-500/15' },
                    { title: 'Blog Posts', count: blogs.length, icon: FileText, color: 'text-amber-400 bg-amber-500/10 border-amber-500/15' },
                    { title: 'Testimonials', count: testimonials.length, icon: MessageSquare, color: 'text-pink-400 bg-pink-500/10 border-pink-500/15' },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden flex flex-col justify-between h-32">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{stat.title}</span>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${stat.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>
                        <h3 className="text-3xl font-bold font-heading text-white mt-4">{stat.count}</h3>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Leads Preview */}
                <div className="glass-card rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold font-heading">Recent Consultation Leads</h3>
                    <button 
                      onClick={() => setActiveTab('leads')} 
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-none hover-target"
                    >
                      View All Leads →
                    </button>
                  </div>

                  {leads.length === 0 ? (
                    <div className="text-center py-10 text-gray-600 text-sm">
                      No new client inquiries yet. Leads captured from the Project Planner modal show up here.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-400">
                        <thead className="text-xs text-gray-500 uppercase border-b border-white/5">
                          <tr>
                            <th className="py-3 px-4 font-semibold">Client</th>
                            <th className="py-3 px-4 font-semibold">Service</th>
                            <th className="py-3 px-4 font-semibold">Budget</th>
                            <th className="py-3 px-4 font-semibold">Timeline</th>
                            <th className="py-3 px-4 font-semibold">Submitted</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {leads.slice(0, 5).map((lead) => (
                            <tr key={lead.id} className="hover:bg-white/[0.01]">
                              <td className="py-4 px-4 font-medium text-white">
                                <div>{lead.name}</div>
                                <div className="text-[10px] text-gray-500">{lead.email}</div>
                              </td>
                              <td className="py-4 px-4">{lead.category}</td>
                              <td className="py-4 px-4 font-semibold text-emerald-400">{lead.budget}</td>
                              <td className="py-4 px-4 text-purple-400">{lead.timeline}</td>
                              <td className="py-4 px-4 text-xs">
                                {new Date(lead.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. LEADS TAB */}
            {activeTab === 'leads' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold font-heading text-white">Consultation Leads</h1>
                  <p className="text-gray-500 text-sm mt-1">Review proposals and contact details submitted via the client-side Project Planner modal.</p>
                </div>

                {leads.length === 0 ? (
                  <div className="glass-card rounded-2xl p-12 text-center text-gray-600 border border-white/5">
                    No leads found. Inquiries will populate dynamically as users complete the planner.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <div key={lead.id} className="glass-card rounded-2xl border border-white/5 p-6 space-y-4 hover:border-white/10 transition-all duration-300">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold font-heading text-white">{lead.name}</h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400 mt-1">
                              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-400" /> {lead.email}</span>
                              {lead.whatsapp && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {lead.whatsapp}</span>}
                              {lead.company && <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-purple-400" /> {lead.company}</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[11px] px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-300 font-semibold">{lead.category}</span>
                            <span className="text-[11px] px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-300 font-semibold">{lead.budget}</span>
                            <span className="text-[11px] px-3 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300 font-semibold">{lead.timeline}</span>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-2 rounded-xl border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all cursor-none hover-target"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-white/5 pt-4">
                          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1.5">Project Brief</h4>
                          <p className="text-sm text-gray-300 leading-relaxed bg-white/[0.01] border border-white/5 rounded-xl p-4">{lead.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. TEAM TAB */}
            {activeTab === 'team' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold font-heading text-white">Team Members</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage portraits, skills, and descriptions for the agency core.</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Create Member Form */}
                  <div className="glass-card rounded-2xl border border-white/5 p-6 h-fit space-y-6">
                    <h3 className="text-lg font-bold font-heading text-white border-b border-white/5 pb-3">Add Team Member</h3>
                    
                    <form onSubmit={handleAddTeam} className="space-y-4">
                      {/* File Upload Portait preview */}
                      <div 
                        onClick={() => document.getElementById('team-file-input')?.click()}
                        className="w-full h-44 rounded-xl border-2 border-dashed border-white/10 hover:border-blue-500/50 transition-colors cursor-none hover-target flex flex-col items-center justify-center overflow-hidden relative bg-white/[0.01]"
                      >
                        {teamFilePreview ? (
                          <img src={teamFilePreview} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                            <p className="text-xs text-gray-500 font-semibold">Upload Portrait</p>
                            <p className="text-[10px] text-gray-700 mt-1">JPG, PNG, WebP *</p>
                          </div>
                        )}
                        <input
                          id="team-file-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setTeamFile(file);
                              setTeamFilePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-none hover-target"
                      >
                        {loading ? 'Adding...' : 'Add Member'}
                      </button>
                    </form>
                  </div>

                  {/* List View */}
                  <div className="lg:col-span-2 space-y-4">
                    {team.length === 0 ? (
                      <div className="glass-card rounded-2xl p-12 text-center text-gray-600 border border-white/5">
                        No team members registered.
                      </div>
                    ) : (
                      team.map((member) => (
                        <div key={member.id} className="glass-card rounded-2xl border border-white/5 p-4 flex gap-5 hover:border-white/10 transition-all duration-300">
                          <img 
                            src={member.photo_url} 
                            alt={member.name || "Employee portrait"} 
                            className="w-24 h-24 object-cover rounded-xl border border-white/10 flex-shrink-0"
                          />
                          <div className="flex-grow flex flex-col justify-between py-1">
                            <div>
                              <div className="flex items-center justify-between">
                                <h4 className="text-base font-bold text-white font-heading">{member.name || "Employee Card"}</h4>
                                <button
                                  onClick={() => handleDeleteTeam(member.id)}
                                  className="text-gray-500 hover:text-red-400 p-1 cursor-none hover-target"
                                  title="Delete Member"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-xs text-blue-400 font-semibold">{member.role || "Photo only card"}</p>
                              {member.bio && member.bio.trim() && (
                                <p className="text-xs text-gray-400 leading-relaxed mt-2 line-clamp-2">{member.bio}</p>
                              )}
                            </div>
                            {member.skills && member.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {member.skills.map((skill: string, index: number) => (
                                  <span key={index} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. PORTFOLIO TAB */}
            {activeTab === 'portfolio' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold font-heading text-white">Portfolio Work</h1>
                  <p className="text-gray-500 text-sm mt-1">Manage project titles, categories, gradients, and years shown on the Work page.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Create Project Form */}
                  <div className="glass-card rounded-2xl border border-white/5 p-6 h-fit space-y-6">
                    <h3 className="text-lg font-bold font-heading text-white border-b border-white/5 pb-3">Add Project</h3>
                    
                    <form onSubmit={handleAddProject} className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-400 font-semibold block mb-1">Project Title</label>
                        <input
                          required
                          value={projectForm.title}
                          onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                          placeholder="e.g. Synthetix AI Integration"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 font-semibold block mb-1">Client Name</label>
                        <input
                          required
                          value={projectForm.client}
                          onChange={e => setProjectForm({ ...projectForm, client: e.target.value })}
                          placeholder="e.g. Synthetix Corp"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-400 font-semibold block mb-1">Category</label>
                          <select
                            value={projectForm.category}
                            onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                            className="w-full bg-[#0f1015] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          >
                            <option>AI & Machine Learning</option>
                            <option>Web Development</option>
                            <option>Mobile Apps</option>
                            <option>UI/UX Design</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 font-semibold block mb-1">Year</label>
                          <input
                            required
                            value={projectForm.year}
                            onChange={e => setProjectForm({ ...projectForm, year: e.target.value })}
                            placeholder="e.g. 2026"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 font-semibold block mb-1">Cover Photo</label>
                        <div 
                          onClick={() => document.getElementById('project-file-input')?.click()}
                          className="w-full h-40 rounded-xl border-2 border-dashed border-white/10 hover:border-blue-500/50 transition-colors cursor-none flex items-center justify-center overflow-hidden relative bg-white/[0.01]"
                        >
                          {projectFilePreview ? (
                            <img src={projectFilePreview} alt="preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-4">
                              <svg className="w-6 h-6 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-xs text-gray-500 font-medium block">Click to upload cover photo</span>
                              <span className="text-[9px] text-gray-600 block mt-0.5">JPEG, PNG or WebP</span>
                            </div>
                          )}
                          <input 
                            type="file" 
                            id="project-file-input"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setProjectFile(file);
                                setProjectFilePreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-none hover-target"
                      >
                        {loading ? 'Adding...' : 'Add Project'}
                      </button>
                    </form>
                  </div>

                  {/* List View */}
                  <div className="lg:col-span-2 space-y-4">
                    {portfolio.length === 0 ? (
                      <div className="glass-card rounded-2xl p-12 text-center text-gray-600 border border-white/5">
                        No projects registered.
                      </div>
                    ) : (
                      portfolio.map((proj) => (
                        <div key={proj.id} className="glass-card rounded-2xl border border-white/5 p-5 flex items-center justify-between gap-5 hover:border-white/10 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            {/* Small image or gradient representation */}
                            <div className="w-12 h-12 rounded-xl flex-shrink-0 border border-white/10 overflow-hidden bg-zinc-900 flex items-center justify-center">
                              {proj.photo_url ? (
                                <img src={proj.photo_url} alt="cover" className="w-full h-full object-cover" />
                              ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${proj.gradient}`} />
                              )}
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-white font-heading">{proj.title}</h4>
                              <p className="text-xs text-gray-400">{proj.client} • {proj.category} • {proj.year}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="text-gray-500 hover:text-red-400 p-2 cursor-none hover-target"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 5. BLOGS TAB */}
            {activeTab === 'blogs' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold font-heading text-white">Blog Management</h1>
                  <p className="text-gray-500 text-sm mt-1">Publish and delete insights, tech frameworks, and case studies.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Create Blog Form */}
                  <div className="glass-card rounded-2xl border border-white/5 p-6 h-fit space-y-6">
                    <h3 className="text-lg font-bold font-heading text-white border-b border-white/5 pb-3">Create Blog Post</h3>
                    
                    <form onSubmit={handleAddBlog} className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-400 font-semibold block mb-1">Article Title</label>
                        <input
                          required
                          value={blogForm.title}
                          onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                          placeholder="e.g. Building AI-First Products..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-400 font-semibold block mb-1">Category</label>
                          <select
                            value={blogForm.category}
                            onChange={e => setBlogForm({ ...blogForm, category: e.target.value, tag: e.target.value })}
                            className="w-full bg-[#0f1015] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          >
                            {categories.map((cat, idx) => (
                              <option key={idx}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 font-semibold block mb-1">Read Time</label>
                          <input
                            required
                            value={blogForm.readTime}
                            onChange={e => setBlogForm({ ...blogForm, readTime: e.target.value })}
                            placeholder="e.g. 7 min read"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 font-semibold block mb-1">Excerpt Summary</label>
                        <textarea
                          required
                          value={blogForm.excerpt}
                          onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                          placeholder="Describe what readers will learn..."
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="blog-featured"
                          checked={blogForm.featured}
                          onChange={e => setBlogForm({ ...blogForm, featured: e.target.checked })}
                          className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-none hover-target"
                        />
                        <label htmlFor="blog-featured" className="text-xs text-gray-400 font-semibold cursor-none hover-target select-none">
                          Feature this article (Hero element)
                        </label>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 font-semibold block mb-1">Cover Photo</label>
                        <div 
                          onClick={() => document.getElementById('blog-file-input')?.click()}
                          className="w-full h-40 rounded-xl border-2 border-dashed border-white/10 hover:border-blue-500/50 transition-colors cursor-none flex items-center justify-center overflow-hidden relative bg-white/[0.01]"
                        >
                          {blogFilePreview ? (
                            <img src={blogFilePreview} alt="preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-4">
                              <svg className="w-6 h-6 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-xs text-gray-500 font-medium block">Click to upload cover photo</span>
                              <span className="text-[9px] text-gray-600 block mt-0.5">JPEG, PNG or WebP</span>
                            </div>
                          )}
                          <input 
                            type="file" 
                            id="blog-file-input"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setBlogFile(file);
                                setBlogFilePreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-none hover-target"
                      >
                        {loading ? 'Creating...' : 'Publish Post'}
                      </button>
                    </form>
                  </div>

                  {/* List View */}
                  <div className="lg:col-span-2 space-y-4">
                    {blogs.length === 0 ? (
                      <div className="glass-card rounded-2xl p-12 text-center text-gray-600 border border-white/5">
                        No articles registered.
                      </div>
                    ) : (
                      blogs.map((post) => (
                        <div key={post.id} className="glass-card rounded-2xl border border-white/5 p-4 flex justify-between gap-5 hover:border-white/10 transition-all duration-300">
                          <div className="flex gap-4">
                            <div className="w-14 h-14 rounded-xl border border-white/10 flex-shrink-0 overflow-hidden bg-zinc-900 flex items-center justify-center">
                              {post.photo_url ? (
                                <img src={post.photo_url} alt="cover" className="w-full h-full object-cover" />
                              ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${post.gradient} flex items-center justify-center text-white/50 text-[10px]`}>
                                  Blog
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-bold text-white font-heading line-clamp-1">{post.title}</h4>
                                {post.featured && (
                                  <span className="text-[9px] px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 font-semibold uppercase">
                                    Hero
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{post.category} • {post.readTime} • {post.date}</p>
                              <p className="text-xs text-gray-500 leading-normal mt-2 line-clamp-1">{post.excerpt}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteBlog(post.id)}
                            className="text-gray-500 hover:text-red-400 p-2 cursor-none hover-target self-center"
                            title="Delete Blog Post"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 6. TESTIMONIALS TAB */}
            {activeTab === 'testimonials' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold font-heading text-white">Testimonial Reviews</h1>
                  <p className="text-gray-500 text-sm mt-1">Manage what clients say. Review feedback, authors, roles, and color gradients.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Create Testimonial Form */}
                  <div className="glass-card rounded-2xl border border-white/5 p-6 h-fit space-y-6">
                    <h3 className="text-lg font-bold font-heading text-white border-b border-white/5 pb-3">Add Testimonial</h3>
                    
                    <form onSubmit={handleAddTestimonial} className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-400 font-semibold block mb-1">Client Feedback Quote</label>
                        <textarea
                          required
                          value={testimonialForm.quote}
                          onChange={e => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                          placeholder="What did they write about PixelForge?..."
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 font-semibold block mb-1">Author Name</label>
                        <input
                          required
                          value={testimonialForm.author}
                          onChange={e => setTestimonialForm({ ...testimonialForm, author: e.target.value })}
                          placeholder="e.g. Sarah Chen"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 font-semibold block mb-1">Role / Company</label>
                        <input
                          required
                          value={testimonialForm.role}
                          onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                          placeholder="e.g. CEO, Luminary Ventures"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 font-semibold block mb-1">Client Avatar Photo</label>
                        <div 
                          onClick={() => document.getElementById('testimonial-file-input')?.click()}
                          className="w-full h-40 rounded-xl border-2 border-dashed border-white/10 hover:border-blue-500/50 transition-colors cursor-none flex items-center justify-center overflow-hidden relative bg-white/[0.01]"
                        >
                          {testimonialFilePreview ? (
                            <img src={testimonialFilePreview} alt="preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-4">
                              <svg className="w-6 h-6 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-xs text-gray-500 font-medium block">Click to upload avatar</span>
                              <span className="text-[9px] text-gray-600 block mt-0.5">JPEG, PNG or WebP</span>
                            </div>
                          )}
                          <input 
                            type="file" 
                            id="testimonial-file-input"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setTestimonialFile(file);
                                setTestimonialFilePreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-none hover-target"
                      >
                        {loading ? 'Adding...' : 'Add Testimonial'}
                      </button>
                    </form>
                  </div>

                  {/* List View */}
                  <div className="lg:col-span-2 space-y-4">
                    {testimonials.length === 0 ? (
                      <div className="glass-card rounded-2xl p-12 text-center text-gray-600 border border-white/5">
                        No testimonials registered.
                      </div>
                    ) : (
                      testimonials.map((test) => (
                        <div key={test.id} className="glass-card rounded-2xl border border-white/5 p-5 flex justify-between gap-5 hover:border-white/10 transition-all duration-300">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full border border-white/15 flex-shrink-0 overflow-hidden bg-zinc-900 flex items-center justify-center">
                              {test.photo_url ? (
                                <img src={test.photo_url} alt="avatar" className="w-full h-full object-cover" />
                              ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${test.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                                  {test.avatar}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-gray-300 italic leading-relaxed">"{test.quote}"</p>
                              <p className="text-xs text-blue-400 font-semibold mt-3">{test.author} <span className="text-gray-500 font-normal">— {test.role}</span></p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteTestimonial(test.id)}
                            className="text-gray-500 hover:text-red-400 p-2 cursor-none hover-target self-start"
                            title="Delete Testimonial"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 7. STATS TAB */}
            {activeTab === 'stats' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold font-heading text-white">Agency Stats</h1>
                  <p className="text-gray-500 text-sm mt-1">Manage the metrics and highlights displayed on the homepage stats bar.</p>
                </div>

                {stats.length === 0 ? (
                  <div className="glass-card rounded-2xl p-12 text-center text-gray-600 border border-white/5">
                    Loading stats... Make sure the backend server is running.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {stats.map((stat) => (
                      <div key={stat.id} className="glass-card rounded-2xl border border-white/5 p-6 space-y-4 hover:border-white/10 transition-all duration-300">
                        <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-3 gap-2">
                          <h3 className="text-lg font-bold font-heading text-white">{stat.label || `Stat ${stat.order_index + 1}`}</h3>
                          <span className="text-[11px] px-2.5 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-300 font-semibold uppercase tracking-wider">
                            Active Preview: {stat.value}{stat.suffix}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-gray-300 font-semibold block mb-1">Value</label>
                            <input
                              type="text"
                              value={stat.value}
                              onChange={e => handleStatChange(stat.id, 'value', e.target.value)}
                              placeholder="e.g. 150"
                              className="w-full bg-white/10 border border-white/25 rounded-xl px-3.5 py-2.5 text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all cursor-none hover-target"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-300 font-semibold block mb-1">Suffix</label>
                            <input
                              type="text"
                              value={stat.suffix}
                              onChange={e => handleStatChange(stat.id, 'suffix', e.target.value)}
                              placeholder="e.g. +"
                              className="w-full bg-white/10 border border-white/25 rounded-xl px-3.5 py-2.5 text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all cursor-none hover-target"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-gray-300 font-semibold block mb-1">Label</label>
                          <input
                             type="text"
                             value={stat.label}
                             onChange={e => handleStatChange(stat.id, 'label', e.target.value)}
                             placeholder="e.g. Projects Delivered"
                             className="w-full bg-white/10 border border-white/25 rounded-xl px-3.5 py-2.5 text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all cursor-none hover-target"
                          />
                        </div>

                        <button
                          onClick={() => handleSaveStat(stat.id)}
                          disabled={loading}
                          className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-none hover-target shadow-lg shadow-blue-500/10 text-sm"
                        >
                          Save Changes
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};
