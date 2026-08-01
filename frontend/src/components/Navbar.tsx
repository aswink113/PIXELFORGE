import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Navbar = ({ onOpenPlanner }: { onOpenPlanner: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [menuOpen]);

  const navLinks = [
    { name: 'Home', href: '/', isRoute: true },
    { name: 'Services', href: '#services', isRoute: false },
    { name: 'Solutions', href: '#process', isRoute: false },
    { name: 'Projects', href: '#projects', isRoute: false },
    { name: 'About', href: '#about', isRoute: false },
    { name: 'Team', href: '/team', isRoute: true },
    { name: 'Contact', href: '#contact', isRoute: false },
  ];

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/' + href);
    } else {
      e.preventDefault();
      const id = href.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'py-4 bg-[#FCFCFC]/70 backdrop-blur-xl border-b border-[#5E5BFF]/10 shadow-[0_4px_30px_rgba(94,91,255,0.03)]' 
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex-shrink-0 z-[60]">
            <Link 
              to="/" 
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="hover-target flex items-center gap-3 group"
            >
              {/* Actual Company Logo Image */}
              <img 
                src="/logo.png" 
                alt="Lumiora Logo" 
                className="w-9 h-9 object-contain group-hover:rotate-[360deg] transition-transform duration-700" 
              />
              <span className="text-xl font-bold tracking-[0.25em] bg-gradient-to-r from-[#5E5BFF] to-[#A855F7] bg-clip-text text-transparent group-hover:from-[#A855F7] group-hover:to-[#5E5BFF] transition-all duration-500 font-logo uppercase">
                LUMIORA
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => {
                    if (link.href === '/' && location.pathname === '/') {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="text-sm font-semibold text-stone-600 hover:text-[#5E5BFF] transition-colors hover-target relative group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#5E5BFF] transition-all duration-300 group-hover:w-full" />
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="text-sm font-semibold text-stone-600 hover:text-[#5E5BFF] transition-colors hover-target relative group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#5E5BFF] transition-all duration-300 group-hover:w-full" />
                </a>
              )
            ))}
            
            <button 
              onClick={onOpenPlanner}
              className="px-6 py-2.5 text-white rounded-full font-bold transition-all duration-300 hover-target ml-2 text-sm cursor-none hover:scale-105 active:scale-95 flex items-center gap-1 group/btn"
              style={{
                background: 'linear-gradient(135deg, #5E5BFF 0%, #7B68FF 100%)',
                boxShadow: '0 4px 20px rgba(94,91,255,0.22)',
              }}
            >
              Start Your Project
              <span className="group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden z-[60]">
            <button 
              className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 hover-target"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <motion.span 
                animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-6 h-px bg-stone-900 block transition-all"
              />
              <motion.span 
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-px bg-stone-900 block transition-all"
              />
              <motion.span 
                animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-6 h-px bg-stone-900 block transition-all"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-[#FCFCFC] flex flex-col justify-center items-center"
          >
            <div className="flex flex-col items-center gap-8 text-3xl font-bold tracking-tight">
              {navLinks.map((link, i) => (
                link.isRoute ? (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 + 0.2 }}
                  >
                    <Link
                      to={link.href}
                      onClick={(e) => {
                        setMenuOpen(false);
                        if (link.href === '/' && location.pathname === '/') {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="hover:text-[#5E5BFF] transition-colors text-3xl font-bold tracking-tight text-stone-900"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 + 0.2 }}
                    onClick={(e) => {
                      setMenuOpen(false);
                      handleAnchorClick(e, link.href);
                    }}
                    className="hover:text-[#5E5BFF] transition-colors text-stone-900"
                  >
                    {link.name}
                  </motion.a>
                )
              ))}
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 px-8 py-4 rounded-full text-xl hover-target cursor-none text-white font-bold"
                style={{
                  background: 'linear-gradient(135deg, #5E5BFF 0%, #7B68FF 100%)',
                  boxShadow: '0 4px 20px rgba(94,91,255,0.22)',
                }}
                onClick={() => {
                  setMenuOpen(false);
                  onOpenPlanner();
                }}
              >
                Start Your Project →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
