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
  { href: '#histoire', label: 'Histoire' },
  { href: '#fonctionnalites', label: 'Fonctionnalités' },
  { href: '#demo', label: 'Démo' },
  { href: '#simulateur', label: 'Simulateur' },
  { href: '#faq', label: 'FAQ' },
];

export default function Navbar({ onOpenWizard }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const backofficeLoginUrl = getBackofficeLoginUrl();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
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

  const solid = scrolled || mobileMenuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 border-b ${
        solid
          ? 'bg-[#07110f]/85 backdrop-blur-md border-white/[0.06]'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto h-16 px-5 sm:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5" aria-label="Naforo, accueil">
          <Image
            src="/images/logo.png"
            alt=""
            width={28}
            height={28}
            className="object-contain"
            priority
          />
          <span className="font-display text-[17px] font-semibold tracking-tight text-white">
            Naforo
          </span>
        </a>

        {/* Liens desktop */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13.5px] text-white/65 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions desktop */}
        <div className="hidden md:flex items-center gap-5">
          <a
            href={backofficeLoginUrl}
            className="text-[13.5px] text-white/65 hover:text-white transition-colors"
          >
            Connexion
          </a>
          <button
            onClick={handleCtaClick}
            className="h-9 px-4 rounded-full bg-white text-[#07110f] text-[13.5px] font-medium hover:bg-white/90 transition-colors cursor-pointer"
          >
            Créer mon agence
          </button>
        </div>

        {/* Mobile */}
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="md:hidden -mr-2 p-2 text-white/80 hover:text-white"
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
            className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-[#07110f] px-5 pt-4 pb-8 flex flex-col"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-4 text-lg text-white/85 border-b border-white/[0.06]"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-auto flex flex-col gap-3">
              <a
                href={backofficeLoginUrl}
                className="h-12 rounded-full border border-white/15 text-white text-[15px] flex items-center justify-center"
              >
                Connexion
              </a>
              <button
                onClick={handleCtaClick}
                className="h-12 rounded-full bg-white text-[#07110f] text-[15px] font-medium"
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
