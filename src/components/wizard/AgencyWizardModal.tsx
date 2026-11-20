'use client';

import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import { registerAgency } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';
import { getBackofficeDashboardUrl, getBackofficeLoginUrl } from '@/lib/config';

interface AgencyWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEP_META = [
  {
    num: 1 as const,
    short: 'Structure',
    title: 'Créer votre espace agence',
    subtitle: 'Renseignez les informations de votre structure · 3 mois d’essai offerts.',
  },
  {
    num: 2 as const,
    short: 'Responsable',
    title: 'Vos coordonnées',
    subtitle: 'Ces informations serviront pour votre accès administrateur.',
  },
  {
    num: 3 as const,
    short: 'Sécurité',
    title: 'Sécuriser votre compte',
    subtitle: 'Définissez votre mot de passe et vos canaux d’encaissement.',
  },
];

const CITIES = [
  'Abidjan - Cocody',
  'Abidjan - Marcory',
  'Abidjan - Plateau',
  'Abidjan - Riviera / Bingerville',
  'Abidjan - Yopougon',
  'Yamoussoukro',
  'Bouaké',
  'San Pedro',
  'Autre ville / Diaspora',
];

const UNIT_RANGES = [
  { id: '1-10', label: '1 – 10 lots' },
  { id: '11-50', label: '11 – 50 lots' },
  { id: '51-200', label: '51 – 200 lots' },
  { id: '200+', label: '200+ lots' },
];

const PAYMENT_OPTIONS = [
  { id: 'wave', label: 'Wave' },
  { id: 'orange_money', label: 'Orange Money' },
  { id: 'mtn_money', label: 'MTN MoMo' },
  { id: 'bank_transfer', label: 'Virement' },
];

const inputClass =
  'w-full h-11 px-3.5 rounded-xl border border-[#d6d6d0] bg-white text-[14px] text-[#14221e] placeholder:text-[#9ca3af] focus:border-[#01362a] focus:ring-2 focus:ring-[#01362a]/10 outline-none transition-all';

const labelClass = 'block text-[13px] font-medium text-[#14221e] mb-1.5';

export default function AgencyWizardModal({ isOpen, onClose }: AgencyWizardModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1
  const [organizationName, setOrganizationName] = useState('');
  const [agencyType, setAgencyType] = useState('agence_agreee');
  const [city, setCity] = useState('Abidjan - Cocody');
  const [customCity, setCustomCity] = useState('');
  const [unitRange, setUnitRange] = useState('11-50');

  // Step 2
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Step 3
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([
    'wave',
    'orange_money',
    'mtn_money',
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, loading, onClose]);

  const passwordScore = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  if (!isOpen) return null;

  const resolvedCity =
    city === 'Autre ville / Diaspora' && customCity.trim() ? customCity.trim() : city;

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (organizationName.trim().length < 2) {
      setError('Veuillez renseigner le nom de votre agence.');
      return;
    }
    setError(null);
    trackEvent('wizard_step_1_completed', {
      organizationName,
      agencyType,
      city: resolvedCity,
      unitRange,
    });
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError('Le prénom et le nom doivent contenir au moins 2 caractères chacun.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Veuillez renseigner une adresse email valide.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 8) {
      setError('Veuillez renseigner un numéro de téléphone ou WhatsApp valide.');
      return;
    }
    setError(null);
    trackEvent('wizard_step_2_completed', { email, phone });
    setStep(3);
  };

  const handleSubmitAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passwordScore < 4) {
      setError(
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!termsAccepted) {
      setError("Veuillez accepter les conditions générales d'utilisation.");
      return;
    }

    setLoading(true);
    trackEvent('agency_creation_submitted', { organizationName, email });

    try {
      const result = await registerAgency({
        firstName,
        lastName,
        email,
        phone,
        organizationName,
        password,
        role: 'admin',
        city: resolvedCity,
        agencyType,
        unitRange,
        paymentMethods,
      });

      trackEvent('agency_creation_success', {
        organizationId: result.data?.organization?.id,
      });

      if (result.data?.accessToken) {
        localStorage.setItem('accessToken', result.data.accessToken);
        localStorage.setItem('refreshToken', result.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      setStep(4);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la création de l'agence. Veuillez vérifier vos informations.";
      trackEvent('agency_creation_failed', { error: message });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToBackoffice = () => {
    trackEvent('redirected_to_backoffice');
    window.location.href = getBackofficeDashboardUrl();
  };

  const currentMeta = step < 4 ? STEP_META[step - 1] : null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#14221e]/55 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[#fafaf8] w-full max-w-[490px] rounded-2xl border border-[#e0e0da] shadow-[0_24px_60px_-15px_rgba(20,34,30,0.22)] overflow-hidden my-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wizard-title"
      >
        {/* En-tête épuré */}
        <div className="px-6 pt-6 pb-5 sm:px-8 sm:pt-7 border-b border-[#ecece7] bg-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              {step < 4 && (
                <div className="flex items-center gap-2 text-[12px] text-[#6b7280] mb-1.5">
                  <span>Étape {step} sur 3</span>
                  <span>&middot;</span>
                  <span>{currentMeta?.short}</span>
                </div>
              )}
              <h2
                id="wizard-title"
                className="text-xl sm:text-[22px] font-semibold tracking-tight text-[#14221e]"
              >
                {currentMeta ? currentMeta.title : 'Votre espace est prêt'}
              </h2>
              <p className="text-[13px] text-[#5e5b53] mt-1">
                {currentMeta
                  ? currentMeta.subtitle
                  : `Un code de vérification a été envoyé à ${email}.`}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="-mr-1.5 -mt-1 p-1.5 rounded-lg text-[#6b7280] hover:text-[#14221e] hover:bg-[#f2f2f1] transition-colors cursor-pointer disabled:opacity-40"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>

          {step < 4 && (
            <div className="mt-5 grid grid-cols-3 gap-1.5">
              {STEP_META.map((item) => {
                const isDone = item.num < step;
                const isCurrent = item.num === step;
                return (
                  <button
                    key={item.num}
                    type="button"
                    disabled={!isDone || loading}
                    onClick={() => {
                      if (isDone) {
                        setError(null);
                        setStep(item.num);
                      }
                    }}
                    className={`h-1 rounded-full transition-colors ${
                      isDone || isCurrent ? 'bg-[#01362a]' : 'bg-[#e5e5e0]'
                    } ${isDone ? 'cursor-pointer' : 'cursor-default'}`}
                    aria-label={`Étape ${item.num} : ${item.short}`}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Corps du formulaire */}
        <div className="px-6 py-6 sm:px-8 sm:py-7">
          {error && (
            <div className="mb-5 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px]">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ÉTAPE 1 */}
            {step === 1 && (
              <motion.form
                key="step-1"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.16 }}
                onSubmit={handleNextStep1}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="org-name" className={labelClass}>
                    Nom de l&apos;agence ou raison sociale
                  </label>
                  <input
                    id="org-name"
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Ex: Cabinet Immobilier de la Lagune"
                    className={inputClass}
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="agency-type" className={labelClass}>
                      Type de structure
                    </label>
                    <select
                      id="agency-type"
                      value={agencyType}
                      onChange={(e) => setAgencyType(e.target.value)}
                      className={inputClass}
                    >
                      <option value="agence_agreee">Agence immobilière</option>
                      <option value="gestionnaire_independant">Gestionnaire indépendant</option>
                      <option value="proprietaire_bailleur">Propriétaire bailleur</option>
                      <option value="syndic">Syndic de copropriété</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="agency-city" className={labelClass}>
                      Ville / zone principale
                    </label>
                    <select
                      id="agency-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={inputClass}
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {city === 'Autre ville / Diaspora' && (
                  <div>
                    <label htmlFor="custom-city" className={labelClass}>
                      Précisez votre ville ou pays
                    </label>
                    <input
                      id="custom-city"
                      type="text"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="Ex: Paris, Dakar, Grand-Bassam..."
                      className={inputClass}
                    />
                  </div>
                )}

                <div>
                  <span className={labelClass}>Nombre de lots gérés</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {UNIT_RANGES.map((item) => {
                      const active = unitRange === item.id;
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setUnitRange(item.id)}
                          className={`h-10 rounded-xl text-[12.5px] font-medium border transition-colors cursor-pointer ${
                            active
                              ? 'border-[#01362a] bg-[#01362a] text-white'
                              : 'border-[#d6d6d0] bg-white text-[#3a3a3a] hover:border-[#01362a]/50'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-11 rounded-full bg-[#01362a] hover:bg-[#024c3b] text-white text-[14px] font-medium transition-colors cursor-pointer"
                  >
                    Continuer
                  </button>
                </div>
              </motion.form>
            )}

            {/* ÉTAPE 2 */}
            {step === 2 && (
              <motion.form
                key="step-2"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.16 }}
                onSubmit={handleNextStep2}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="first-name" className={labelClass}>
                      Prénom
                    </label>
                    <input
                      id="first-name"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Koffi"
                      className={inputClass}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label htmlFor="last-name" className={labelClass}>
                      Nom
                    </label>
                    <input
                      id="last-name"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Kouamé"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="pro-email" className={labelClass}>
                    Email professionnel
                  </label>
                  <input
                    id="pro-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="direction@votre-agence.ci"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="pro-phone" className={labelClass}>
                    Téléphone / WhatsApp
                  </label>
                  <input
                    id="pro-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+225 0777099450"
                    className={inputClass}
                  />
                  <p className="text-[12px] text-[#6b7280] mt-1">
                    Compatible numéros ivoiriens et internationaux (diaspora).
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setStep(1);
                    }}
                    className="h-11 px-5 rounded-full border border-[#d6d6d0] bg-white text-[13.5px] font-medium text-[#3a3a3a] hover:border-[#14221e] transition-colors cursor-pointer"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-11 rounded-full bg-[#01362a] hover:bg-[#024c3b] text-white text-[14px] font-medium transition-colors cursor-pointer"
                  >
                    Continuer
                  </button>
                </div>
              </motion.form>
            )}

            {/* ÉTAPE 3 */}
            {step === 3 && (
              <motion.form
                key="step-3"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.16 }}
                onSubmit={handleSubmitAgency}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="admin-password" className={labelClass}>
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 caractères"
                      className={`${inputClass} pr-10`}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#14221e] cursor-pointer"
                      aria-label={showPassword ? 'Masquer' : 'Afficher'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="mt-2 h-1 w-full rounded-full bg-[#e5e5e0] overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${(passwordScore / 4) * 100}%`,
                        backgroundColor: passwordScore === 4 ? '#01362a' : '#8c6239',
                      }}
                    />
                  </div>
                  <p className="text-[11.5px] text-[#6b7280] mt-1.5">
                    8 caractères minimum avec majuscule, minuscule, chiffre et caractère spécial.
                  </p>
                </div>

                <div>
                  <label htmlFor="confirm-password" className={labelClass}>
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Répétez votre mot de passe"
                    className={inputClass}
                  />
                </div>

                <div>
                  <span className={labelClass}>Modes d&apos;encaissement souhaités</span>
                  <div className="flex flex-wrap gap-2">
                    {PAYMENT_OPTIONS.map((pm) => {
                      const active = paymentMethods.includes(pm.id);
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() =>
                            setPaymentMethods((prev) =>
                              prev.includes(pm.id)
                                ? prev.filter((x) => x !== pm.id)
                                : [...prev, pm.id]
                            )
                          }
                          className={`px-3.5 h-9 rounded-full text-[12.5px] font-medium border transition-colors cursor-pointer ${
                            active
                              ? 'border-[#01362a] bg-[#01362a] text-white'
                              : 'border-[#d6d6d0] bg-white text-[#3a3a3a] hover:border-[#01362a]/50'
                          }`}
                        >
                          {pm.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer text-[12.5px] text-[#5e5b53] pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 accent-[#01362a]"
                  />
                  <span>
                    J&apos;accepte les conditions générales d&apos;utilisation et la politique de
                    confidentialité de Naforo.
                  </span>
                </label>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setStep(2);
                    }}
                    disabled={loading}
                    className="h-11 px-5 rounded-full border border-[#d6d6d0] bg-white text-[13.5px] font-medium text-[#3a3a3a] hover:border-[#14221e] transition-colors cursor-pointer"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-11 rounded-full bg-[#01362a] hover:bg-[#024c3b] text-white text-[14px] font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    <span>{loading ? 'Création en cours...' : 'Créer mon compte'}</span>
                  </button>
                </div>
              </motion.form>
            )}

            {/* ÉTAPE 4 */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3 text-[#01362a]">
                  <CheckCircle2 size={24} />
                  <span className="text-[15px] font-semibold">
                    Bienvenue sur Naforo, {organizationName}
                  </span>
                </div>

                <div className="rounded-xl border border-[#e5e5e0] bg-white divide-y divide-[#efefe9] text-[13px]">
                  <div className="px-4 py-2.5 flex justify-between gap-2">
                    <span className="text-[#6b7280]">Agence</span>
                    <span className="font-medium text-[#14221e]">{organizationName}</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between gap-2">
                    <span className="text-[#6b7280]">Zone</span>
                    <span className="font-medium text-[#14221e]">{resolvedCity}</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between gap-2">
                    <span className="text-[#6b7280]">Responsable</span>
                    <span className="font-medium text-[#14221e]">
                      {firstName} {lastName}
                    </span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between gap-2">
                    <span className="text-[#6b7280]">Email</span>
                    <span className="font-medium text-[#14221e]">{email}</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between gap-2">
                    <span className="text-[#6b7280]">Essai</span>
                    <span className="font-medium text-[#01362a]">3 mois offerts</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={handleGoToBackoffice}
                    className="flex-1 h-11 rounded-full bg-[#01362a] hover:bg-[#024c3b] text-white text-[14px] font-medium transition-colors cursor-pointer"
                  >
                    Accéder au Backoffice
                  </button>
                  <a
                    href={getBackofficeLoginUrl()}
                    className="h-11 px-5 rounded-full border border-[#d6d6d0] bg-white text-[13.5px] font-medium text-[#14221e] hover:border-[#14221e] inline-flex items-center justify-center transition-colors"
                  >
                    Connexion
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
