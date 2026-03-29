import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Check, ArrowRight, ArrowLeft, CreditCard, ShieldCheck, User as UserIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const steps = [
  { id: 1, title: 'Dados Pessoais', icon: <UserIcon size={18} /> },
  { id: 2, title: 'Escolha seu Plano', icon: <CreditCard size={18} /> },
  { id: 3, title: 'Revisão', icon: <ShieldCheck size={18} /> }
];

const Cadastro = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({
    mode: 'onChange'
  });

  const formData = watch();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/member/available-plans`);
        if (res.ok) {
          const data = await res.json();
          setAvailablePlans(data);
        }
      } catch {
        // Fallback to mock data if API is unreachable
        setAvailablePlans([
          { id: 'p1', name: 'Plano Smart', price: 79.90, features: ['Acesso a 1 unidade', 'Horário livre'], duration: 'Mensal' },
          { id: 'p2', name: 'Plano Black', price: 99.90, features: ['Acesso a todas as unidades', 'Levar acompanhante', 'Cadeira de massagem'], duration: 'Anual' },
          { id: 'p3', name: 'Plano VIP', price: 149.90, features: ['Personal Trainer incluso 2x/semana', 'Acesso total', 'Brinde exclusivo'], duration: 'Semestral' },
        ]);
      }
    };
    fetchPlans();
  }, []);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const onSubmit = async (data) => {
    if (currentStep < 3) {
      if (currentStep === 2 && !selectedPlan) {
        alert('Por favor, selecione um plano.');
        return;
      }
      nextStep();
    } else {
      // Final step — call the real registration API
      setSubmitError('');
      setSubmitting(true);

      try {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            name: data.nome,
            email: data.email,
            password: data.senha,
            cpf: data.cpf,
            birthDate: data.nascimento,
            phone: data.telefone || '',
            planId: selectedPlan?.id,
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          if (result.errors) {
            setSubmitError(result.errors.map(e => e.msg).join('. '));
          } else {
            setSubmitError(result.message || 'Erro ao criar conta.');
          }
          return;
        }

        navigate('/login');
      } catch (err) {
        setSubmitError('Erro de conexão com o servidor.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-fusion-bg py-12 px-4 relative overflow-hidden flex flex-col items-center">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fusion-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-fusion-accent/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Progress Bar */}
      <div className="max-w-[520px] w-full mb-10 relative z-10">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  currentStep >= step.id 
                    ? "bg-fusion-primary border-fusion-primary text-white shadow-fusion-purple-glow" 
                    : "border-white/10 bg-white/5 text-white/30"
                )}
              >
                {currentStep > step.id ? <Check size={20} /> : step.icon}
              </div>
              <span className={cn(
                "text-[10px] mt-2 font-bold uppercase tracking-widest",
                currentStep >= step.id ? "text-fusion-primary" : "text-white/30"
              )}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-fusion-primary shadow-fusion-purple-glow"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-card max-w-[520px] w-full p-8 relative z-10 border-white/5"
        >
          {submitError && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-heading font-bold mb-6 text-fusion-primary uppercase italic">Dados Pessoais</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="floating-label-group">
                    <input {...register('nome', { required: true })} type="text" placeholder=" " className="input-field w-full" />
                    <label className="floating-label">Nome Completo</label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="floating-label-group">
                      <input {...register('cpf', { required: true, pattern: /^\d{11}$/ })} type="text" placeholder=" " className="input-field w-full" maxLength={11} />
                      <label className="floating-label">CPF (Apenas números)</label>
                      {errors.cpf && <span className="text-red-400 text-xs mt-1">CPF deve ter 11 dígitos</span>}
                    </div>
                    <div className="floating-label-group">
                      <input {...register('nascimento', { required: true })} type="date" placeholder=" " className="input-field w-full" />
                      <label className="floating-label">Data Nasc.</label>
                    </div>
                  </div>
                  <div className="floating-label-group">
                    <input {...register('telefone')} type="text" placeholder=" " className="input-field w-full" />
                    <label className="floating-label">Telefone / WhatsApp</label>
                  </div>
                  <div className="floating-label-group">
                    <input {...register('email', { required: true })} type="email" placeholder=" " className="input-field w-full" />
                    <label className="floating-label">E-mail</label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="floating-label-group">
                      <input {...register('senha', { required: true, minLength: 8 })} type="password" placeholder=" " className="input-field w-full" />
                      <label className="floating-label">Senha</label>
                      {errors.senha && <span className="text-red-400 text-xs mt-1">Mínimo 8 caracteres</span>}
                    </div>
                    <div className="floating-label-group">
                      <input {...register('confirmarSenha', { required: true })} type="password" placeholder=" " className="input-field w-full" />
                      <label className="floating-label">Confirmar Senha</label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-heading font-bold mb-6 text-fusion-primary uppercase italic">Escolha seu Plano</h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {availablePlans.map((plan) => (
                    <div 
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={cn(
                        "p-5 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col relative overflow-hidden",
                        selectedPlan?.id === plan.id 
                          ? "border-fusion-primary bg-fusion-primary/10 shadow-fusion-purple-glow" 
                          : "border-white/5 bg-white/5 hover:border-white/20"
                      )}
                    >
                      {selectedPlan?.id === plan.id && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-fusion-accent rounded-full flex items-center justify-center text-fusion-bg">
                          <Check size={14} strokeWidth={4} />
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold">{plan.name}</h3>
                          <p className="text-white/40 text-sm">{plan.duration}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-fusion-accent">R$ {plan.price.toFixed(2)}</span>
                          <p className="text-[10px] text-white/40">/mês</p>
                        </div>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {plan.features.map((f, i) => (
                          <li key={i} className="text-xs text-white/70 flex items-center gap-2">
                            <div className="w-1 h-1 bg-fusion-accent rounded-full" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-heading font-bold mb-6 text-fusion-primary uppercase italic">Revisão</h2>
                <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Nome</span>
                    <span className="font-bold">{formData.nome}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">E-mail</span>
                    <span className="font-bold">{formData.email}</span>
                  </div>
                  <div className="divider h-[1px] bg-white/10 w-full" />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Plano Selecionado</p>
                      <h3 className="text-lg font-bold text-fusion-accent">{selectedPlan?.name}</h3>
                    </div>
                    <span className="text-xl font-bold">R$ {selectedPlan?.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 cursor-pointer group">
                  <input type="checkbox" id="terms" required className="mt-1 accent-fusion-primary" />
                  <label htmlFor="terms" className="text-xs text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                    Li e aceito os <span className="text-fusion-primary underline">Termos de Uso</span> e a <span className="text-fusion-primary underline">Política de Privacidade</span> da Fusion Gym.
                  </label>
                </div>
              </div>
            )}

            <div className="mt-10 flex gap-4">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="btn-outline flex-1 gap-2">
                  <ArrowLeft size={18} /> Voltar
                </button>
              )}
              <button 
                type="submit" 
                className="btn-primary flex-1 gap-2 disabled:opacity-50"
                disabled={(currentStep === 1 && !isValid) || submitting}
              >
                {currentStep === 3 ? (submitting ? 'Criando conta...' : 'Finalizar Cadastro') : 'Continuar'}
                {currentStep < 3 && <ArrowRight size={18} />}
              </button>
            </div>
          </form>

          <Link to="/login" className="mt-6 block text-center text-xs text-white/40 hover:text-white/60">
            Já tem uma conta? <span className="text-fusion-accent font-bold">Faça login</span>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Cadastro;
