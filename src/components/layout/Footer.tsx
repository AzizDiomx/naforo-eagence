'use client';

import Image from 'next/image';
import { ShieldCheck, Heart, Phone, Mail, MapPin } from 'lucide-react';
import { APP_CONFIG } from '@/lib/config';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#013E37] p-1.5 flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Naforo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="font-display font-extrabold text-xl text-white">
                Naforo
              </span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              La plateforme intelligente de gestion locative conçue pour les agences immobilières et propriétaires bailleurs en Côte d'Ivoire et en Afrique de l'Ouest.
            </p>

            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Système & Serveurs 100% Opérationnels</span>
            </div>
          </div>

          {/* Links: Produit */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 font-display">Produit</h4>
            <ul className="space-y-2.5">
              <li><a href="#fonctionnalites" className="hover:text-white transition-colors">Encaissements Wave & OM</a></li>
              <li><a href="#fonctionnalites" className="hover:text-white transition-colors">Quittances Certifiées QR</a></li>
              <li><a href="#fonctionnalites" className="hover:text-white transition-colors">Portail Propriétaires</a></li>
              <li><a href="#transformation" className="hover:text-white transition-colors">Naforo Copilot IA</a></li>
              <li><a href="#simulateur" className="hover:text-white transition-colors">Simulateur de Gains</a></li>
            </ul>
          </div>

          {/* Links: Légal & Conformité */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 font-display">Conformité</h4>
            <ul className="space-y-2.5">
              <li><span className="text-slate-400">Droit du bail OHADA</span></li>
              <li><span className="text-slate-400">Protection des Données (ARTCI)</span></li>
              <li><span className="text-slate-400">Chiffrement Bancaire AES-256</span></li>
              <li><span className="text-slate-400">Mentions Légales</span></li>
              <li><span className="text-slate-400">Politique de Confidentialité</span></li>
            </ul>
          </div>

          {/* Links: Contact Abidjan */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 font-display">Contact & Siège</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-[#059669] shrink-0 mt-0.5" />
                <span>Cocody Danga, Abidjan, Côte d'Ivoire</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-[#059669] shrink-0" />
                <a
                  href={`tel:${APP_CONFIG.contactPhone.replace(/\s+/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {APP_CONFIG.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-[#059669] shrink-0" />
                <a
                  href={`mailto:${APP_CONFIG.contactEmail}`}
                  className="hover:text-white transition-colors"
                >
                  {APP_CONFIG.contactEmail}
                </a>
              </li>
              <li className="pt-2">
                <span className="inline-block px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[11px] font-mono">
                  Devise officielle : XOF (FCFA)
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {currentYear} Naforo Technologies. Tous droits réservés.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck size={14} className="text-emerald-400" />
              Sécurité certifiée SSL 256 bits
            </span>
            <span>&bull;</span>
            <span>Conçu avec passion à Abidjan</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
