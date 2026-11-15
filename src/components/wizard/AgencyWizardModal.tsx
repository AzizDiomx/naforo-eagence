'use client';

import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  Phone,
  User,
  MapPin,
  Loader2,
  Eye,
  EyeOff,
  Globe,
} from 'lucide-react';
import { registerAgency } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';
import { getBackofficeDashboardUrl, getBackofficeLoginUrl } from '@/lib/config';

interface AgencyWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEP_META = [
  { num: 1 as const, short: 'Structure', title: 'Votre structure immobilière', subtitle: 'Renseignez les informations de votre agence ou patrimoine.' },
  { num: 2 as const, short: 'Responsable', title: 'Responsable & coordonnées', subtitle: 'Vos accès administrateur principal et contact direct.' },
  { num: 3 as const, short: 'Sécurité', title: 'Sécurisation & encaissements', subtitle: 'Définissez votre mot de passe et vos canaux de paiement.' },
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

const PAYMENT_OPTIONS = [
  { id: 'wave', label: "Wave Côte d'Ivoire" },
  { id: 'orange_money', label: 'Orange Money' },
  { id: 'mtn_money', label: 'MTN MoMo' },
  { id: 'bank_transfer', label: 'Virement bancaire' },
];

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

  // Lock body scroll & close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, loading, onClose]);

  const workspaceSlug = useMemo(() => {
    const cleaned = organizationName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return cleaned || 'mon-agence';
  }, [organizationName]);

  const passwordCriteria = useMemo(
    () => ({
      length: password.length >= 8,
      caseMix: /[A-Z]/.test(password) && /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password]
  );

  const passwordScore = useMemo(() => {
    if (!password) return 0;
    return Object.values(passwordCriteria).filter(Boolean).length;
  }, [password, passwordCriteria]);

  const strengthLabel = useMemo(() => {
    switch (passwordScore) {
      case 1:
        return { text: 'Faible', color: '#EF4444', width: '25%' };
      case 2:
        return { text: 'Moyen', color: '#F59E0B', width: '50%' };
      case 3:
        return { text: 'Robuste', color: '#2563EB', width: '75%' };
      case 4:
        return { text: 'Très sécurisé', color: '#059669', width: '100%' };
      default:
        return { text: 'Insuffisant', color: '#64748B', width: '10%' };
    }
  }, [passwordScore]);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  if (!isOpen) return null;

  const resolvedCity =
    city === 'Autre ville / Diaspora' && customCity.trim() ? customCity.trim() : city;

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (organizationName.trim().length < 2) {
      setError('Veuillez renseigner le nom de votre agence ou raison sociale.');
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
    if (!firstName.trim() || !lastName.trim()) {
      setError('Veuillez renseigner vos prénom et nom.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Veuillez renseigner une adresse email professionnelle valide.');
      return;
    }
    const digitsCount = phone.replace(/\D/g, '').length;
    if (digitsCount < 8) {
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

    if (passwordScore < 3) {
      setError(
        'Votre mot de passe doit contenir au moins 8 caractères, des majuscules/minuscules et un chiffre.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Le mot de passe et sa confirmation ne correspondent pas.');
      return;
    }

    if (!termsAccepted) {
      setError("Veuillez accepter les conditions générales d'utilisation pour continuer.");
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
      className="fixed inset-0 z-50 overflow-y-auto bg-[#020d0b]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden my-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wizard-title"
      >
        {/* Header sobre */}
        <div className="bg-[#071714] text-white px-6 py-6 sm:px-8 sm:py-7 relative border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="absolute top-5 right-5 text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer disabled:opacity-40"
            aria-label="Fermer la fenêtre"
          >
            <X size={19} />
          </button>

          <p className="text-[11px] font-semibold text-[#FFEFB3] uppercase tracking-wider mb-1.5">
            Essai gratuit 3 mois &bull; Sans carte bancaire
          </p>

          <h2 id="wizard-title" className="text-xl sm:text-2xl font-bold text-white font-display">
            {currentMeta ? currentMeta.title : 'Votre espace agence est prêt'}
          </h2>

          <p className="text-xs sm:text-sm text-white/65 mt-1">
            {currentMeta
              ? currentMeta.subtitle
              : 'Vos identifiants sont actifs. Accédez dès maintenant à votre tableau de bord.'}
          </p>

          {/* Stepper interactif */}
          {step < 4 && (
            <div className="mt-5 grid grid-cols-3 gap-2">
              {STEP_META.map((item) => {
                const isCurrent = item.num === step;
                const isDone = item.num < step;
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
                    className={`text-left group ${isDone ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div
                      className={`h-1 rounded-full mb-1.5 transition-colors ${
                        isDone
                          ? 'bg-[#10B981]'
                          : isCurrent
                          ? 'bg-[#FFEFB3]'
                          : 'bg-white/15'
                      }`}
                    />
                    <span
                      className={`text-[11px] font-medium flex items-center gap-1 ${
                        isCurrent
                          ? 'text-white'
                          : isDone
                          ? 'text-emerald-300 group-hover:underline'
                          : 'text-white/40'
                      }`}
                    >
                      {isDone && <Check size={11} />}
                      {item.num}. {item.short}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle size={17} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.form
                key="step-1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
                onSubmit={handleNextStep1}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                    Nom de l&apos;agence ou raison sociale *
                  </label>
                  <div className="relative">
                    <Building2
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      required
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="Ex: Cabinet Immobilier de la Lagune"
                      className="naforo-input pl-10"
                      autoFocus
                    />
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Globe size={12} className="text-[#059669] shrink-0" />
                    <span>
                      Identifiant espace :{' '}
                      <code className="px-1.5 py-0.5 rounded bg-slate-100 text-[#013E37] font-semibold">
                        {workspaceSlug}
                      </code>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                      Type de structure
                    </label>
                    <select
                      value={agencyType}
                      onChange={(e) => setAgencyType(e.target.value)}
                      className="naforo-input"
                    >
                      <option value="agence_agreee">Agence immobilière agréée</option>
                      <option value="gestionnaire_independant">Gestionnaire indépendant</option>
                      <option value="proprietaire_bailleur">Propriétaire bailleur</option>
                      <option value="syndic">Syndic de copropriété</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                      Ville / zone principale
                    </label>
                    <div className="relative">
                      <MapPin
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="naforo-input pl-10"
                      >
                        {CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {city === 'Autre ville / Diaspora' && (
                  <div>
                    <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                      Précisez votre ville ou pays
                    </label>
                    <input
                      type="text"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="Ex: Paris, Dakar, Grand-Bassam..."
                      className="naforo-input"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase mb-2">
                    Nombre approximatif de lots gérés
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: '1-10', label: '1 à 10 lots' },
                      { id: '11-50', label: '11 à 50 lots' },
                      { id: '51-200', label: '51 à 200 lots' },
                      { id: '200+', label: '200+ lots' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setUnitRange(item.id)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          unitRange === item.id
                            ? 'border-[#013E37] bg-[#e8f5f3] text-[#013E37] shadow-sm'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-primary-naforo w-full py-3.5 text-sm justify-center cursor-pointer"
                  >
                    <span>Continuer vers les coordonnées</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.form
                key="step-2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
                onSubmit={handleNextStep2}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                      Prénom *
                    </label>
                    <div className="relative">
                      <User
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Ex: Koffi"
                        className="naforo-input pl-10"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ex: Kouamé"
                      className="naforo-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                    Email professionnel *
                  </label>
                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="direction@votre-agence.ci"
                      className="naforo-input pl-10"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Identifiant de connexion à votre espace Backoffice.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                    Téléphone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: +225 0777099450 ou +33 6..."
                      className="naforo-input pl-10"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Compatible numéros ivoiriens (+225) et internationaux (diaspora).
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setStep(1);
                    }}
                    className="btn-secondary-naforo py-3 px-4 text-xs font-bold cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Retour</span>
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-naforo flex-1 py-3.5 text-sm justify-center cursor-pointer"
                  >
                    <span>Continuer vers la sécurité</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.form
                key="step-3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
                onSubmit={handleSubmitAgency}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                    Mot de passe administrateur *
                  </label>
                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 caractères"
                      className="naforo-input pl-10 pr-10"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label={showPassword ? 'Masquer' : 'Afficher'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Barre + critères interactifs */}
                  {password && (
                    <div className="mt-2.5 space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Niveau de sécurité :</span>
                        <span className="font-bold" style={{ color: strengthLabel.color }}>
                          {strengthLabel.text}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: strengthLabel.width,
                            backgroundColor: strengthLabel.color,
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-[11px]">
                        {[
                          { ok: passwordCriteria.length, label: '8 caractères minimum' },
                          { ok: passwordCriteria.caseMix, label: 'Majuscule & minuscule' },
                          { ok: passwordCriteria.number, label: 'Au moins 1 chiffre' },
                          { ok: passwordCriteria.special, label: '1 caractère spécial' },
                        ].map((c) => (
                          <div
                            key={c.label}
                            className={`flex items-center gap-1.5 ${
                              c.ok ? 'text-[#059669] font-medium' : 'text-slate-400'
                            }`}
                          >
                            <Check size={12} />
                            <span>{c.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Répétez votre mot de passe"
                      className="naforo-input pl-10"
                    />
                  </div>
                  {confirmPassword.length > 0 && (
                    <p
                      className={`text-[11px] mt-1 font-medium ${
                        passwordsMatch ? 'text-[#059669]' : 'text-red-500'
                      }`}
                    >
                      {passwordsMatch
                        ? 'Les mots de passe correspondent.'
                        : 'Les mots de passe ne correspondent pas encore.'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                    Modes d&apos;encaissement souhaités
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {PAYMENT_OPTIONS.map((pm) => {
                      const active = paymentMethods.includes(pm.id);
                      return (
                        <label
                          key={pm.id}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                            active
                              ? 'border-[#013E37] bg-[#e8f5f3]/60 text-[#013E37]'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPaymentMethods([...paymentMethods, pm.id]);
                              } else {
                                setPaymentMethods(paymentMethods.filter((x) => x !== pm.id));
                              }
                            }}
                            className="accent-[#013E37]"
                          />
                          <span className="font-medium">{pm.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 accent-[#013E37]"
                  />
                  <span>
                    J&apos;accepte les conditions générales d&apos;utilisation et la politique de
                    protection des données Naforo.
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
                    className="btn-secondary-naforo py-3 px-4 text-xs font-bold cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Retour</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary-naforo flex-1 py-3.5 text-sm justify-center shadow-lg cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Création en cours...</span>
                      </>
                    ) : (
                      <>
                        <Building2 size={16} />
                        <span>Créer mon compte agence</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="text-center py-3 space-y-5"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#e8f5f3] text-[#059669] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-[#013E37] font-display">
                    Bienvenue sur Naforo, {organizationName} !
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto mt-2 leading-relaxed">
                    Votre espace est prêt avec{' '}
                    <strong className="text-[#013E37]">3 mois d&apos;essai gratuit complet</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Agence :</span>
                    <strong className="text-[#0F172A]">{organizationName}</strong>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Zone :</span>
                    <strong className="text-[#0F172A]">{resolvedCity}</strong>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Administrateur :</span>
                    <strong className="text-[#0F172A]">
                      {firstName} {lastName}
                    </strong>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Email de connexion :</span>
                    <strong className="text-[#0F172A]">{email}</strong>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Offre :</span>
                    <strong className="text-[#059669]">3 mois offerts (sans carte)</strong>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleGoToBackoffice}
                    className="btn-primary-naforo flex-1 py-3.5 text-sm justify-center shadow-lg cursor-pointer"
                  >
                    <span>Accéder au Backoffice</span>
                    <ArrowRight size={16} />
                  </button>
                  <a
                    href={getBackofficeLoginUrl()}
                    className="btn-secondary-naforo py-3.5 px-5 text-sm justify-center font-semibold"
                  >
                    Page de connexion
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
