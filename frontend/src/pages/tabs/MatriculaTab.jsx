import React, { useEffect, useState } from 'react';
import { User, Smartphone, Mail, Hash, Cake, Save } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const MatriculaTab = ({ userName }) => {
  const [plan, setPlan] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planRes, statusRes] = await Promise.all([
          fetch(`${API_BASE}/api/member/plan`, { credentials: 'include' }),
          fetch(`${API_BASE}/api/member/status`, { credentials: 'include' }),
        ]);
        if (planRes.ok) setPlan(await planRes.json());
        if (statusRes.ok) setStatus(await statusRes.json());
      } catch { /* silent */ }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Membership Card - Credit Card Style */}
      <div className="max-w-[500px] mx-auto w-full aspect-[1.6/1] bg-gradient-to-br from-indigo-900 via-fusion-primary to-fusion-accent/40 rounded-[2rem] p-8 relative overflow-hidden shadow-2xl group border border-white/20">
        {/* Chips and Holograms */}
        <div className="absolute top-8 left-8 w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-lg opacity-80" />
        <div className="absolute top-8 right-8 text-4xl font-heading font-black italic uppercase tracking-tighter opacity-20">FUSION</div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 rotate-12" />

        <div className="h-full flex flex-col justify-end">
          <div className="mb-8">
            <span className="block text-[10px] uppercase font-black italic tracking-[0.3em] text-white/60 mb-1">Status da Matrícula</span>
            <p className="text-lg font-bold tracking-widest text-fusion-accent">{status?.status || 'Carregando...'}</p>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <span className="block text-[10px] uppercase font-black italic tracking-[0.3em] text-white/60 mb-1">Membro</span>
              <p className="text-2xl font-heading font-bold italic uppercase tracking-tighter">{userName || 'Membro'}</p>
            </div>
            <div className="text-right">
              <span className="block text-[10px] uppercase font-black italic tracking-[0.3em] text-white/60 mb-1">Plano</span>
              <p className="font-mono font-bold">{plan?.name || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="glass-card p-6 md:p-8">
        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
          <User size={20} className="text-fusion-primary" />
          Dados Contratuais
        </h3>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black italic tracking-widest text-white/40">Telefone / WhatsApp</label>
            <div className="relative">
              <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input type="text" defaultValue="" placeholder="(00) 00000-0000" className="input-field w-full pl-12" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black italic tracking-widest text-white/40">E-mail de Contato</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input type="email" defaultValue="" placeholder="seu@email.com" className="input-field w-full pl-12" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black italic tracking-widest text-white/40">CPF (Não editável)</label>
            <div className="relative">
              <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10" />
              <input type="text" value="***.***.***-**" disabled className="input-field w-full pl-12 bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed text-white/30" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black italic tracking-widest text-white/40">Plano Contratado</label>
            <div className="relative">
              <Cake size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10" />
              <input type="text" value={plan ? `${plan.name} — R$ ${plan.price?.toFixed(2)}/mês` : '—'} disabled className="input-field w-full pl-12 bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed text-white/30" />
            </div>
          </div>

          <div className="md:col-span-2 pt-4">
            <button type="button" className="btn-primary w-full gap-2">
              <Save size={20} />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MatriculaTab;
