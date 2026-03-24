import React from 'react';
import { User, Smartphone, Mail, Hash, Cake, Save } from 'lucide-react';

const MatriculaTab = () => {
  return (
    <div className="space-y-8">
      {/* Membership Card - Credit Card Style */}
      <div className="max-w-[500px] mx-auto w-full aspect-[1.6/1] bg-gradient-to-br from-indigo-900 via-fusion-primary to-fusion-accent/40 rounded-[2rem] p-8 relative overflow-hidden shadow-2xl group border border-white/20">
        {/* Chips and Holograms */}
        <div className="absolute top-8 left-8 w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-lg opacity-80" />
        <div className="absolute top-8 right-8 text-4xl font-heading font-black italic italic uppercase tracking-tighter opacity-20 italic">FUSION</div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 rotate-12" />

        <div className="h-full flex flex-col justify-end">
          <div className="mb-8">
            <span className="block text-[10px] uppercase font-black italic italic tracking-[0.3em] text-white/60 mb-1">Status da Matrícula</span>
            <p className="text-lg font-bold tracking-widest text-fusion-accent">Membro Ativo</p>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <span className="block text-[10px] uppercase font-black italic italic tracking-[0.3em] text-white/60 mb-1">Membro</span>
              <p className="text-2xl font-heading font-bold italic italic uppercase italic tracking-tighter">Arthur Silveira</p>
            </div>
            <div className="text-right">
              <span className="block text-[10px] uppercase font-black italic italic tracking-[0.3em] text-white/60 mb-1">ID Fusion</span>
              <p className="font-mono font-bold">#29482-A</p>
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
            <label className="text-[10px] uppercase font-black italic italic tracking-widest text-white/40">Telefone / WhatsApp</label>
            <div className="relative">
              <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input type="text" defaultValue="(11) 99999-9999" className="input-field w-full pl-12" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black italic italic tracking-widest text-white/40">E-mail de Contato</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input type="email" defaultValue="arthur@example.com" className="input-field w-full pl-12" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black italic italic tracking-widest text-white/40">CPF (Não editável)</label>
            <div className="relative">
              <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10" />
              <input type="text" value="***.***.***-**" disabled className="input-field w-full pl-12 bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed text-white/30" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black italic italic tracking-widest text-white/40">Data de Nascimento</label>
            <div className="relative">
              <Cake size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10" />
              <input type="text" value="23/05/1995" disabled className="input-field w-full pl-12 bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed text-white/30" />
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
