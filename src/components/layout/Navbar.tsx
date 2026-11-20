'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { getBackofficeLoginUrl } from '@/lib/config';

interface NavbarProps {
  onOpenWizard: () => void;
}

const NAV_LINKS = [
  { href: '#', label: 'Accueil' },
  { href: '#histoire', label: 'Histoire' },
  { href: '#fonctionnalites', label: 'Fonctionnalités' },
  { href: '#demo', label: 'Démo' },
  { href: '#faq', label: 'FAQ' },
];

export default function Navbar({ onOpenWizard }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const backofficeLoginUrl = getBackofficeLoginUrl();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleCtaClick = () => {
    trackEvent('cta_nav_clicked');
    setMobileMenuOpen(false);
    onOpenWizard();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 border-b ${
        mobileMenuOpen
          ? 'bg-white border-[#e2e2dc]'
          : scrolled
          ? 'bg-white/95 backdrop-blur-md border-[#e2e2dc]'
          : 'bg-[#f4e9c8]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-[#dfd2ab] md:border-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto h-16 px-5 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Marque NAF0R0 */}
        <a href="#" className="flex items-center gap-2.5" aria-label="Naforo, accueil">
          <div className="w-8 h-8 rounded-lg bg-[#01362a] p-1 flex items-center justify-center shrink-0">
            <Image
              src="/images/logo.png"
              alt="Logo Naforo"
              width={26}
              height={26}
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden sm:inline font-display text-[15px] font-extrabold tracking-tight text-[#01362a]">
            NAFORO
          </span>
        </a>

        {/* Liens centraux sobres */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13.5px] font-medium text-[#3a3a3a] hover:text-[#01362a] hover:underline underline-offset-4 decoration-[#01362a] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions droite */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={backofficeLoginUrl}
            className="text-[13.5px] font-medium text-[#3a3a3a] hover:text-[#01362a] transition-colors"
          >
            Connexion
          </a>
          <button
            type="button"
            onClick={handleCtaClick}
            className="h-9 px-5 rounded-full bg-[#01362a] hover:bg-[#024c3b] text-white text-[13px] font-semibold transition-colors cursor-pointer"
          >
            Créer mon agence
          </button>
        </div>

        {/* Mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="md:hidden -mr-2 p-2 text-[#14221e]"
          aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden fixed inset-x-0 top-16 h-[calc(100dvh-4rem)] z-50 bg-white border-t border-[#e2e2dc] px-5 pt-4 pb-8 flex flex-col overflow-y-auto"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-4 text-lg text-[#14221e] border-b border-[#d8d8d4]"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-auto flex flex-col gap-3">
              <a
                href={backofficeLoginUrl}
                className="h-12 rounded-full border border-[#01362a]/25 text-[#01362a] text-[15px] font-medium flex items-center justify-center"
              >
                Connexion
              </a>
              <button
                type="button"
                onClick={handleCtaClick}
                className="h-12 rounded-full bg-[#01362a] text-white text-[15px] font-semibold"
              >
                Créer mon agence
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
