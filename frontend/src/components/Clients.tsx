import { useEffect, useState, useMemo } from 'react';
import { getClientLogos, type ClientLogo } from '../utils/db';

export const Clients = () => {
  const [logos, setLogos] = useState<ClientLogo[]>([]);

  useEffect(() => {
    const loadedLogos = getClientLogos();
    console.log("Clients Component - Loaded Logos on Mount:", loadedLogos);
    setLogos(loadedLogos);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pf_client_logos') {
        const updatedLogos = getClientLogos();
        console.log("Clients Component - Storage updated, loaded new logos:", updatedLogos);
        setLogos(updatedLogos);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // We duplicate logos in a randomized order to ensure a seamless, non-repetitive loop
  const row1 = useMemo(() => {
    if (logos.length === 0) return [];
    const shuffled = [...logos].sort(() => 0.5 - Math.random());
    return [...shuffled, ...shuffled, ...shuffled, ...shuffled];
  }, [logos]);

  const row2 = useMemo(() => {
    if (logos.length === 0) return [];
    const shuffled = [...logos].sort(() => 0.5 - Math.random());
    return [...shuffled, ...shuffled, ...shuffled, ...shuffled];
  }, [logos]);

  const row3 = useMemo(() => {
    if (logos.length === 0) return [];
    const shuffled = [...logos].sort(() => 0.5 - Math.random());
    return [...shuffled, ...shuffled, ...shuffled, ...shuffled];
  }, [logos]);

  return (
    <section id="clients" className="py-20 bg-transparent overflow-hidden border-y border-black/[0.02]">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ac-wave {
          0%, 100% {
            transform: translateY(-24px);
          }
          50% {
            transform: translateY(24px);
          }
        }
        .animate-ac-wave {
          animation: ac-wave 6s ease-in-out infinite;
        }
        .animate-marquee-fast {
          animation: marquee 30s linear infinite !important;
        }
        .animate-marquee-reverse-fast {
          animation: marquee-reverse 30s linear infinite !important;
        }
      `}} />
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#5E5BFF]">
          Partnership
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] mt-3 tracking-tight font-heading">
          Our Trusted Clients
        </h2>
      </div>

      {/* 3-Row Infinite Marquee Container - Pull rows closer together to overlap */}
      {logos.length > 0 ? (
        <div className="flex flex-col -space-y-6 md:-space-y-8 py-8 relative">
          
          {/* Row 1: Scrolling Left to Right (Phase 0) */}
          <div className="relative w-full flex overflow-hidden py-4">
            {/* Left/Right Faders for depth */}
            <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#FCFCFC] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#FCFCFC] to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-32 md:gap-40 py-2 animate-marquee-reverse-fast" style={{ width: 'max-content' }}>
              {row1.map((logo, i) => (
                <div 
                  key={`r1-${logo.id}-${i}`} 
                  className="flex-shrink-0 h-12 md:h-14 flex items-center justify-center transition-all duration-300 hover:scale-110 group animate-ac-wave"
                  style={{ animationDelay: `${0 + (i * -0.6)}s` }}
                >
                  <img 
                    src={logo.logoUrl} 
                    alt={logo.name} 
                    className="h-full w-auto object-contain max-w-[140px] opacity-75 group-hover:opacity-100 transition-all duration-300" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Scrolling Right to Left (Phase 120 deg = 2s delay) */}
          <div className="relative w-full flex overflow-hidden py-4">
            <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#FCFCFC] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#FCFCFC] to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-32 md:gap-40 py-2 animate-marquee-fast" style={{ width: 'max-content' }}>
              {row2.map((logo, i) => (
                <div 
                  key={`r2-${logo.id}-${i}`} 
                  className="flex-shrink-0 h-12 md:h-14 flex items-center justify-center transition-all duration-300 hover:scale-110 group animate-ac-wave"
                  style={{ animationDelay: `${-2 + (i * -0.6)}s` }}
                >
                  <img 
                    src={logo.logoUrl} 
                    alt={logo.name} 
                    className="h-full w-auto object-contain max-w-[140px] opacity-75 group-hover:opacity-100 transition-all duration-300" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: Scrolling Left to Right (Phase 240 deg = 4s delay) */}
          <div className="relative w-full flex overflow-hidden py-4">
            <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#FCFCFC] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#FCFCFC] to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-32 md:gap-40 py-2 animate-marquee-reverse-fast" style={{ width: 'max-content' }}>
              {row3.map((logo, i) => (
                <div 
                  key={`r3-${logo.id}-${i}`} 
                  className="flex-shrink-0 h-12 md:h-14 flex items-center justify-center transition-all duration-300 hover:scale-110 group animate-ac-wave"
                  style={{ animationDelay: `${-4 + (i * -0.6)}s` }}
                >
                  <img 
                    src={logo.logoUrl} 
                    alt={logo.name} 
                    className="h-full w-auto object-contain max-w-[140px] opacity-75 group-hover:opacity-100 filter drop-shadow-[0_2px_6px_rgba(94,91,255,0.06)] group-hover:drop-shadow-[0_4px_10px_rgba(94,91,255,0.2)] transition-all duration-300" 
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="max-w-md mx-auto px-6 py-12 text-center border border-dashed border-[#5E5BFF]/20 rounded-2xl bg-white/5 backdrop-blur-sm">
          <p className="text-sm text-gray-500">
            No client logos uploaded yet. Add client logos in the Admin portal to display them here.
          </p>
        </div>
      )}
    </section>
  );
};
