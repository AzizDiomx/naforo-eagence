'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import DiasporaStorySection from '@/components/sections/DiasporaStorySection';
import CoreFeatures from '@/components/sections/CoreFeatures';
import InteractiveDemo from '@/components/sections/InteractiveDemo';
import AiCopilotSection from '@/components/sections/AiCopilotSection';
import SimulatorRoi from '@/components/sections/SimulatorRoi';
import Testimonials from '@/components/sections/Testimonials';
import SecurityCompliance from '@/components/sections/SecurityCompliance';
import FaqSection from '@/components/sections/FaqSection';
import CtaBanner from '@/components/sections/CtaBanner';
import Footer from '@/components/layout/Footer';
import AgencyWizardModal from '@/components/wizard/AgencyWizardModal';
import { trackEvent } from '@/lib/analytics';
import { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  useEffect(() => {
    trackEvent('landing_view');

    // Support direct opening via URL param ?creer-agence=true or hash
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('creer-agence') === 'true' || window.location.hash === '#creer-agence') {
        setIsWizardOpen(true);
        trackEvent('wizard_opened', { source: 'url_param' });
      }
    }
  }, []);

  const handleOpenWizard = () => {
    setIsWizardOpen(true);
    trackEvent('wizard_opened', { source: 'user_action' });
  };

  const handleCloseWizard = () => {
    setIsWizardOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F172A] selection:bg-[#013E37] selection:text-white">
      <Toaster position="top-right" />
      
      {/* Persistent Navigation */}
      <Navbar onOpenWizard={handleOpenWizard} />

      {/* Main Showcase Flow */}
      <main className="flex-1">
        <HeroSection onOpenWizard={handleOpenWizard} />
        <DiasporaStorySection onOpenWizard={handleOpenWizard} />
        <CoreFeatures onOpenWizard={handleOpenWizard} />
        <InteractiveDemo onOpenWizard={handleOpenWizard} />
        <AiCopilotSection onOpenWizard={handleOpenWizard} />
        <SimulatorRoi onOpenWizard={handleOpenWizard} />
        <Testimonials />
        <SecurityCompliance />
        <FaqSection />
        <CtaBanner onOpenWizard={handleOpenWizard} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Integrated 3-Minute Agency Creation Wizard Modal */}
      <AgencyWizardModal isOpen={isWizardOpen} onClose={handleCloseWizard} />
    </div>
  );
}
