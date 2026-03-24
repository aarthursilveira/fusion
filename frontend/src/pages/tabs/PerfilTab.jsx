import React from 'react';
import { Camera, User, Lock, Mail, Phone, LogOut } from 'lucide-react';

const PerfilTab = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Profile Header */}
      <div className="flex flex-col items-center">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-fusion-primary to-fusion-accent p-1 shadow-fusion-purple-glow">
            <div className="w-full h-full rounded-full bg-fusion-bg flex items-center justify-center font-black italic italic text-4xl overflow-hidden relative">
              AS
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera size={24} className="text-white" />
              </div>
            </div>
          </div>
          <button className="absolute bottom-0 right-0 w-10 h-10 bg-fusion-accent rounded-full flex items-center justify-center text-fusion-bg shadow-lg border-4 border-fusion-bg hover:scale-105 transition-transform">
            <Camera size={18} />
          </button>
        </div>
        <h2 className="mt-6 text-2xl font-bold">Arthur Silveira</h2>
        <p className="text-white/40 text-sm">Membro desde Janeiro 2024</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details */}
        <div className="glass-card p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-4">
            <User size={18} className="text-fusion-primary" />
            Informações da Conta
          </h3>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black italic italic tracking-widest text-white/40 mb-1">E-mail</span>
              <div className="flex items-center gap-2 text-white/80">
                <Mail size={14} className="text-white/20" />
                <span>arthur@example.com</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black italic italic tracking-widest text-white/40 mb-1">Telefone</span>
              <div className="flex items-center gap-2 text-white/80">
                <Phone size={14} className="text-white/20" />
                <span>(11) 99999-9999</span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="glass-card p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-4">
            <Lock size={18} className="text-fusion-primary" />
            Segurança
          </h3>
          
          <form className="space-y-4">
            <div className="floating-label-group">
              <input type="password" placeholder=" " className="input-field w-full text-sm" id="curr-pass" />
              <label htmlFor="curr-pass" className="floating-label">Senha Atual</label>
            </div>
            <div className="floating-label-group">
              <input type="password" placeholder=" " className="input-field w-full text-sm" id="new-pass" />
              <label htmlFor="new-pass" className="floating-label">Nova Senha</label>
            </div>
            <button type="button" className="btn-outline w-full text-sm py-2">
              Alterar Senha
            </button>
          </form>
        </div>
      </div>

      {/* Logout Mobile Only redundant but following instructions */}
      <button className="md:hidden w-full flex items-center justify-center gap-4 px-4 py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold border border-red-500/20 active:scale-95 transition-all">
        <LogOut size={20} />
        Encerrar Sessão
      </button>
    </div>
  );
};

export default PerfilTab;
