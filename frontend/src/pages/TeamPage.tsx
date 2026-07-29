import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { ProjectPlannerModal } from '../components/ProjectPlannerModal';
import { CustomCursor } from '../components/CustomCursor';
import { getTeam, addTeamMember, deleteTeamMember } from '../utils/db';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  photo_url: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    rotateY: -25,
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateY: 0,
    transition: { 
      type: "spring",
      stiffness: 110,
      damping: 18,
      mass: 0.8
    } 
  },
};

// ── Admin Upload Panel ──────────────────────────────────────────────────────
const AdminPanel = ({ onAdded }: { onAdded: () => void }) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const base64 = reader.result as string;
        addTeamMember("", "", "", "", base64);
        setPreview(null);
        if (fileRef.current) fileRef.current.value = '';
        setOpen(false);
        onAdded();
      } catch (err) {
        console.error(err);
        alert('Failed to add member.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Floating add button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-110 active:scale-95 transition-all cursor-none hover-target"
        title="Add team member"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
            <div className="absolute inset-0" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="glass-card relative rounded-3xl border border-white/10 w-full max-w-lg p-8 shadow-[0_0_80px_rgba(59,130,246,0.15)]"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors cursor-none p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="text-xl font-bold font-heading text-white mb-6">Add Team Member</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Photo upload */}
                <div
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-48 rounded-2xl border-2 border-dashed border-white/15 hover:border-blue-500/50 transition-colors cursor-none flex items-center justify-center overflow-hidden relative"
                >
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 text-sm">Click to upload portrait photo</p>
                      <p className="text-gray-700 text-xs mt-1">JPG, PNG, or WebP</p>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFile}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-none mt-2"
                >
                  {uploading ? 'Uploading...' : 'Add to Team'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// ── Portrait Card ───────────────────────────────────────────────────────────
const PortraitCard = ({ member, onDelete }: { member: TeamMember; onDelete: (id: string) => void }) => {
  const [hovered, setHovered] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    if (!confirming) { setConfirming(true); return; }
    deleteTeamMember(member.id);
    onDelete(member.id);
  };

  const hasDetails = member.name && member.name.trim() !== "";

  return (
    <motion.div
      variants={itemVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirming(false); }}
      className="group relative cursor-none hover-target rounded-3xl overflow-hidden border-[3px] border-[#7C3AED]/70 bg-slate-950/20 backdrop-blur-md transition-all duration-500 shadow-[0_8px_32px_rgba(124,58,237,0.15)]"
      style={{ aspectRatio: '3/4', transformStyle: 'preserve-3d' }}
    >
      {/* 1. Purple Grid Background */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none z-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #7C3AED 1px, transparent 1px), 
            linear-gradient(to bottom, #7C3AED 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }} 
      />

      {/* 2. Glowing Wave/Bezier Curve Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M -50,300 C 50,220 100,380 200,280 C 300,180 320,320 400,220" 
          stroke="#7C3AED" 
          strokeWidth="6" 
          strokeLinecap="round" 
          filter="drop-shadow(0 0 8px #7C3AED)" 
        />
        <path 
          d="M -50,320 C 60,270 110,400 190,320 C 270,240 330,340 400,250" 
          stroke="#A78BFA" 
          strokeWidth="3" 
          strokeLinecap="round" 
          opacity="0.6" 
        />
      </svg>

      {/* 3. Watermark Corner Logo Grid */}
      <svg className="absolute top-4 right-4 w-12 h-12 text-[#7C3AED]/20 pointer-events-none z-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 25 H80 V45 H20 Z" fill="currentColor" opacity="0.3" />
        <path d="M40 45 L80 85 M40 85 L80 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <circle cx="20" cy="75" r="10" fill="currentColor" />
      </svg>

      {/* 4. Portrait employee photo */}
      <img
        src={member.photo_url}
        alt={member.name || "Employee portrait"}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-10"
      />

      {/* 5. Bottom banner: Semi-transparent purple glassmorphic banner (ONLY rendered if details exist) */}
      {hasDetails && (
        <div className="absolute bottom-4 left-4 right-4 bg-purple-950/75 backdrop-blur-md border border-purple-500/30 rounded-xl px-4 py-2.5 shadow-[0_4px_20px_rgba(124,58,237,0.25)] z-20">
          <h3 className="text-white font-bold text-sm md:text-base font-heading tracking-wide truncate">{member.name}</h3>
          <p className="text-purple-300 text-xs font-semibold mt-0.5 truncate">{member.role}</p>
        </div>
      )}

      {/* 6. Admin Delete Button (Appears on Hover) */}
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
        <button
          onClick={(e) => { e.stopPropagation(); handleDelete(); }}
          className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all duration-200 cursor-none hover-target ${
            confirming
              ? 'border-red-500 bg-red-500/30 text-red-200'
              : 'border-white/10 bg-black/60 text-gray-400 hover:text-red-400 hover:border-red-500/50'
          }`}
        >
          {confirming ? 'Confirm Remove?' : 'Remove'}
        </button>
      </div>

      {/* Optional Hover Details Overlay (Only for detailed/seeded members) */}
      {hasDetails && hovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col justify-between z-25"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-bold text-lg font-heading">{member.name}</h3>
              <p className="text-purple-400 text-xs font-semibold">{member.role}</p>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">{member.bio}</p>
            <div className="flex flex-wrap gap-1.5">
              {member.skills.map((sk, i) => (
                <span key={i} className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {sk}
                </span>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleDelete}
            className={`w-full text-center text-xs py-2.5 rounded-xl border transition-all duration-200 cursor-none hover-target ${
              confirming
                ? 'border-red-500 bg-red-500/20 text-red-400 font-bold'
                : 'border-white/10 bg-white/5 text-gray-500 hover:text-red-400 hover:border-red-500/30'
            }`}
          >
            {confirming ? 'Confirm Remove?' : 'Remove Member'}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

// ── Empty State ─────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-28 text-center">
    <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center mb-5">
      <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
    <h3 className="text-white font-semibold text-lg mb-2">No team members yet</h3>
    <p className="text-gray-500 text-sm max-w-xs">
      Click the <span className="text-blue-400">+</span> button in the bottom-right to add your first team member.
    </p>
  </div>
);

// ── Main Page ───────────────────────────────────────────────────────────────
export const TeamPage = () => {
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const data = getTeam();
      setMembers(data || []);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleDelete = (id: string) => setMembers(prev => prev.filter(m => m.id !== id));

  return (
    <div className="min-h-screen cursor-none" style={{ background: 'linear-gradient(150deg, #EBF0FF 0%, #F2EEFF 28%, #F9EEFF 58%, #EBF4FF 100%)', backgroundAttachment: 'fixed' }}>
      <CustomCursor />
      <ProjectPlannerModal isOpen={plannerOpen} onClose={() => setPlannerOpen(false)} />
      <Navbar onOpenPlanner={() => setPlannerOpen(true)} />

      {/* Admin panel — floating + button */}
      <AdminPanel onAdded={fetchTeam} />

      {/* Page Hero — no stats */}
      <section className="relative pt-24 pb-2 px-6 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[400px] rounded-full blur-[180px] pointer-events-none" style={{ background: 'rgba(99,102,241,0.09)' }} />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[350px] rounded-full blur-[160px] pointer-events-none" style={{ background: 'rgba(139,92,246,0.07)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-indigo-500 font-semibold mb-4 px-4 py-1 rounded-full border border-indigo-300/40 bg-indigo-50">
              Our Team
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-heading leading-[1.0] tracking-tight mb-3" style={{ color: '#1E1B4B' }}>
              The People Behind <br />
              <span className="text-gradient">LUMIORA</span>
            </h1>
            <p className="text-xl max-w-2xl leading-relaxed" style={{ color: '#6366A8' }}>
              A tight-knit crew of designers, engineers, and strategists united by one belief —
              great digital products change everything.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-2 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5" style={{ perspective: 1500 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-indigo-100 animate-pulse" style={{ aspectRatio: '3/4', background: 'rgba(255,255,255,0.5)' }} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
              style={{ perspective: 1500 }}
            >
              {members.length === 0 ? (
                <EmptyState />
              ) : (
                members.map(m => (
                  <PortraitCard key={m.id} member={m} onDelete={handleDelete} />
                ))
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Hiring CTA */}
      <section className="py-24 px-6 border-t border-indigo-100">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-indigo-500 font-semibold mb-6 px-4 py-1.5 rounded-full border border-indigo-300/40 bg-indigo-50">
            We're Hiring
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-5" style={{ color: '#1E1B4B' }}>
            Want to Join the{' '}
            <span className="text-gradient">Team?</span>
          </h2>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: '#6366A8' }}>
            We're always looking for exceptional designers, engineers, and strategists who want to do the best work of their lives.
          </p>
          <button
            onClick={() => setPlannerOpen(true)}
            className="group relative px-8 py-4 text-white font-semibold rounded-full overflow-hidden hover-target transition-all hover:scale-105 cursor-none"
            style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 8px 30px rgba(99,102,241,0.30)' }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Get In Touch
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
