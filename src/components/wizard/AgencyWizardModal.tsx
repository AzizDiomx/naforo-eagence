'use client';

import { useState, useMemo } from 'react';
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
  ShieldCheck, 
  Loader2, 
  Sparkles,
  Eye,
  EyeOff,
  Zap,
  Building
} from 'lucide-react';
import { registerAgency } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';
import { getBackofficeDashboardUrl } from '@/lib/config';

interface AgencyWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgencyWizardModal({ isOpen, onClose }: AgencyWizardModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [organizationName, setOrganizationName] = useState('');
  const [agencyType, setAgencyType] = useState('agence_agreee');
  const [city, setCity] = useState('Abidjan - Cocody');
  const [unitRange, setUnitRange] = useState('11-50');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<string[]>(['wave', 'orange_money', 'mtn_money']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password Strength Checker
  const passwordCriteria = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const passwordScore = useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (passwordCriteria.length) s++;
    if (passwordCriteria.uppercase && passwordCriteria.lowercase) s++;
    if (passwordCriteria.number) s++;
    if (passwordCriteria.special) s++;
    return s;
  }, [password, passwordCriteria]);

  const strengthLabel = useMemo(() => {
    switch (passwordScore) {
      case 1:
        return { text: 'Très faible', color: '#EF4444', width: '25%' };
      case 2:
        return { text: 'Moyen', color: '#F59E0B', width: '50%' };
      case 3:
        return { text: 'Robuste', color: '#3B82F6', width: '75%' };
      case 4:
        return { text: 'Excellente sécurité', color: '#059669', width: '100%' };
      default:
        return { text: 'Insuffisant', color: '#64748B', width: '10%' };
    }
  }, [passwordScore]);

  if (!isOpen) return null;

  // Step 1 Validation
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationName.trim()) {
      setError("Veuillez renseigner le nom de votre agence ou raison sociale.");
      return;
    }
    setError(null);
    trackEvent('wizard_step_1_completed', { organizationName, agencyType, city, unitRange });
    setStep(2);
  };

  // Step 2 Validation
  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("Veuillez renseigner vos nom et prénom.");
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError("Veuillez renseigner une adresse email professionnelle valide.");
      return;
    }
    if (!phone.trim()) {
      setError("Veuillez renseigner votre numéro de téléphone / WhatsApp.");
      return;
    }
    setError(null);
    trackEvent('wizard_step_2_completed', { email, phone });
    setStep(3);
  };

  // Step 3 Submission
  const handleSubmitAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Le mot de passe et sa confirmation ne correspondent pas.");
      return;
    }

    if (passwordScore < 3) {
      setError("Veuillez choisir un mot de passe plus robuste (au moins 8 caractères avec majuscule, chiffre et caractère spécial).");
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
        city,
        unitRange,
        paymentMethods,
      });

      trackEvent('agency_creation_success', { organizationId: result.data?.organization?.id });

      // Save tokens in local storage so that redirecting to backoffice automatically logs them in!
      if (result.data?.accessToken) {
        localStorage.setItem('accessToken', result.data.accessToken);
        localStorage.setItem('refreshToken', result.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      setStep(4);
    } catch (err: any) {
      trackEvent('agency_creation_failed', { error: err.message });
      setError(err.message || "Erreur lors de la création de l'agence. Veuillez vérifier vos informations.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToBackoffice = () => {
    trackEvent('redirected_to_backoffice');
    window.location.href = getBackofficeDashboardUrl();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wizard-title"
      >
        
        {/* Header Bar */}
        <div className="bg-[#013E37] text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-label="Fermer la boîte de dialogue"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            <span className="text-[11px] font-bold text-[#FFEFB3] uppercase tracking-wider">
              CRÉATION DE COMPTE AGENCE &bull; ESSAI 3 MOIS OFFERT
            </span>
          </div>

          <h2 id="wizard-title" className="text-xl sm:text-2xl font-extrabold text-white font-display">
            {step === 1 && "Étape 1 : Votre agence immobilière"}
            {step === 2 && "Étape 2 : Responsable & Coordonnées"}
            {step === 3 && "Étape 3 : Sécurisation & Préférences"}
            {step === 4 && "Félicitations ! Votre agence est prête"}
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            {step === 1 && "Renseignez les détails de votre structure pour initialiser votre espace dédié."}
            {step === 2 && "Vos coordonnées professionnelles pour l'accès administrateur principal."}
            {step === 3 && "Définissez vos accès sécurisés et vos canaux de paiement souhaités."}
            {step === 4 && "Votre espace de gestion Naforo est configuré et disponible dès maintenant."}
          </p>

          {/* Progress Indicator */}
          {step < 4 && (
            <div className="mt-5 flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    s <= step ? 'bg-[#FFEFB3]' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 1 : INFOS DE L'AGENCE                                                */}
          {/* ========================================================================= */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                  NOM DE L'AGENCE OU RAISON SOCIALE *
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Building2 size={18} />
                  </div>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                    TYPE DE STRUCTURE
                  </label>
                  <select
                    value={agencyType}
                    onChange={(e) => setAgencyType(e.target.value)}
                    className="naforo-input"
                  >
                    <option value="agence_agreee">Agence immobilière agréée</option>
                    <option value="gestionnaire_independant">Gestionnaire indépendant</option>
                    <option value="proprietaire_bailleur">Propriétaire bailleur multi-biens</option>
                    <option value="syndic">Syndic de copropriété</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                    VILLE / COMMUNE PRINCIPALE
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <MapPin size={18} />
                    </div>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="naforo-input pl-10"
                    >
                      <option value="Abidjan - Cocody">Abidjan - Cocody</option>
                      <option value="Abidjan - Marcory">Abidjan - Marcory</option>
                      <option value="Abidjan - Plateau">Abidjan - Plateau</option>
                      <option value="Abidjan - Yopougon">Abidjan - Yopougon</option>
                      <option value="Yamoussoukro">Yamoussoukro</option>
                      <option value="Bouaké">Bouaké</option>
                      <option value="San Pedro">San Pedro</option>
                      <option value="Autre ville">Autre commune / ville</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase mb-2">
                  NOMBRE APPROXIMATIF DE LOTS GÉRÉS
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
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
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

              <div className="pt-3">
                <button
                  type="submit"
                  className="btn-primary-naforo w-full py-3.5 text-sm justify-center"
                >
                  <span>Continuer (Étape 2/3)</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 2 : INFOS DU RESPONSABLE                                             */}
          {/* ========================================================================= */}
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                    PRÉNOM DU RESPONSABLE *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ex: Seydou"
                      className="naforo-input pl-10"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                    NOM DE FAMILLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: Coulibaly"
                    className="naforo-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                  EMAIL PROFESSIONNEL *
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                  </div>
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
                  Sera utilisé pour vous connecter à votre tableau de bord.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                  NUMÉRO DE TÉLÉPHONE / WHATSAPP PRO *
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+225 07 00 00 00 00"
                    className="naforo-input pl-10"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Pour l'assistance et les alertes d'encaissement importantes.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary-naforo py-3 px-4 text-xs font-bold"
                >
                  <ArrowLeft size={14} />
                  <span>Retour</span>
                </button>
                <button
                  type="submit"
                  className="btn-primary-naforo flex-1 py-3.5 text-sm justify-center"
                >
                  <span>Continuer (Étape 3/3)</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 3 : MOT DE PASSE & PRÉFÉRENCES                                       */}
          {/* ========================================================================= */}
          {step === 3 && (
            <form onSubmit={handleSubmitAgency} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                  MOT DE PASSE ADMINISTRATEUR *
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 caractères"
                    className="naforo-input pl-10 pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Sécurité :</span>
                      <span className="font-bold" style={{ color: strengthLabel.color }}>
                        {strengthLabel.text}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{ width: strengthLabel.width, backgroundColor: strengthLabel.color }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                  CONFIRMER LE MOT DE PASSE *
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Répétez votre mot de passe"
                    className="naforo-input pl-10"
                  />
                </div>
              </div>

              {/* Payment Methods Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                  MODES D'ENCAISSEMENT SOUHAITÉS
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'wave', label: 'Wave Côte d\'Ivoire' },
                    { id: 'orange_money', label: 'Orange Money' },
                    { id: 'mtn_money', label: 'MTN MoMo' },
                    { id: 'bank_transfer', label: 'Virement bancaire' },
                  ].map((pm) => (
                    <label key={pm.id} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={paymentMethods.includes(pm.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPaymentMethods([...paymentMethods, pm.id]);
                          } else {
                            setPaymentMethods(paymentMethods.filter((x) => x !== pm.id));
                          }
                        }}
                        className="accent-[#013E37]"
                      />
                      <span className="font-medium text-slate-700">{pm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 accent-[#013E37]"
                  />
                  <span>
                    J'accepte les conditions générales d'utilisation et la politique de protection des données Naforo.
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="btn-secondary-naforo py-3 px-4 text-xs font-bold"
                >
                  <ArrowLeft size={14} />
                  <span>Retour</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-naforo flex-1 py-3.5 text-sm justify-center shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Initialisation de votre agence...</span>
                    </>
                  ) : (
                    <>
                      <Building2 size={16} />
                      <span>Créer mon compte agence gratuitement</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 4 : CÉLÉBRATION & REDIRECTION BACKOFFICE                             */}
          {/* ========================================================================= */}
          {step === 4 && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#e8f5f3] text-[#059669] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="badge-emerald mb-2">
                  <Sparkles size={13} /> ESPACE INITIALISÉ AVEC SUCCÈS
                </span>
                <h3 className="text-2xl font-extrabold text-[#013E37] font-display mt-2">
                  Bienvenue sur Naforo, {organizationName} !
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto mt-2 leading-relaxed">
                  Votre compte agence est prêt avec <strong className="text-[#013E37]">3 mois d’essai gratuit complet</strong>. Vos identifiants de connexion sont actifs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Agence :</span>
                  <strong className="text-[#0F172A]">{organizationName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Administrateur :</span>
                  <strong className="text-[#0F172A]">{firstName} {lastName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email de connexion :</span>
                  <strong className="text-[#0F172A]">{email}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Période d'essai :</span>
                  <strong className="text-[#059669]">3 mois offerts (Sans carte bancaire)</strong>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleGoToBackoffice}
                  className="btn-primary-naforo w-full py-4 text-sm justify-center shadow-xl hover:scale-[1.02] transition-transform"
                >
                  <span>Accéder à mon Tableau de Bord (Backoffice)</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
