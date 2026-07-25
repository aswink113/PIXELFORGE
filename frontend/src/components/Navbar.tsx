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

  const navLinks = [
    { name: 'Home', href: '/', isRoute: true },
    { name: 'Work', href: '/work', isRoute: true },
    { name: 'Services', href: '#services', isRoute: false },
    { name: 'About', href: '#about', isRoute: false },
    { name: 'Our Team', href: '/team', isRoute: true },
    { name: 'Blog', href: '/blog', isRoute: true },
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
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5' : 'py-6 bg-transparent'
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
              className="hover-target flex items-center gap-1.5"
            >
              <img src="/logo.jpeg" alt="PIXELFORGE Logo" className="h-10 w-auto object-contain mix-blend-screen" />
              <span className="text-xl font-bold tracking-wider text-gradient font-heading">PIXELFORGE</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors hover-target relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors hover-target relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full" />
                </a>
              )
            ))}
            <button 
              onClick={onOpenPlanner}
              className="px-6 py-2.5 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 rounded-full font-medium transition-all duration-300 hover-target ml-4 text-sm"
            >
              Let's Talk
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden z-[60] w-10 h-10 flex flex-col justify-center items-center gap-1.5 hover-target"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <motion.span 
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-6 h-px bg-white block transition-all"
            />
            <motion.span 
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-px bg-white block transition-all"
            />
            <motion.span 
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-6 h-px bg-white block transition-all"
            />
          </button>
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
            className="fixed inset-0 z-40 bg-[#050505] flex flex-col justify-center items-center"
          >
            <div className="flex flex-col items-center gap-8 text-3xl font-bold tracking-tight">
              {navLinks.map((link, i) => (
                link.isRoute ? (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-blue-500 transition-colors text-3xl font-bold tracking-tight"
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
                    transition={{ delay: i * 0.1 + 0.3 }}
                    onClick={(e) => {
                      setMenuOpen(false);
                      handleAnchorClick(e, link.href);
                    }}
                    className="hover:text-blue-500 transition-colors"
                  >
                    {link.name}
                  </motion.a>
                )
              ))}
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 px-8 py-4 bg-white text-black rounded-full text-xl"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenPlanner();
                }}
              >
                Let's Talk
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
