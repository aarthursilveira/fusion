import React from 'react';
import { Calendar, Package, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card p-6 border-white/5 flex flex-col gap-2 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-${color}-500/20 transition-all duration-300`} />
    <div className="flex items-center gap-3 text-white/40 mb-1">
      <Icon size={18} />
      <span className="text-xs uppercase tracking-widest font-bold">{label}</span>
    </div>
    <span className="text-xl font-bold">{value}</span>
  </div>
);

const InicioTab = () => {
  return (
    <div className="space-y-8">
      {/* Hero Status Card */}
      <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-fusion-primary to-purple-800 shadow-fusion-glow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-fusion-accent/20 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-black italic uppercase italic tracking-tighter mb-4">Arthur Silveira</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-fusion-accent/20 border border-fusion-accent/30 rounded-full w-fit">
              <CheckCircle2 size={16} className="text-fusion-accent" />
              <span className="text-fusion-accent text-sm font-bold uppercase tracking-wider">Ativo</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white/60 text-xs uppercase tracking-widest">Matrícula #29482</span>
            <span className="text-2xl font-heading font-bold italic italic uppercase italic">Fusion Black Edition</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Calendar} label="Vencimento" value="20/Abr/2026" color="purple" />
        <StatCard icon={Package} label="Plano Atual" value="Anual Black" color="green" />
        <StatCard icon={TrendingUp} label="Próx. Cobrança" value="R$ 99,90" color="blue" />
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6 md:p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Clock size={20} className="text-fusion-primary" />
          Pagamentos Recentes
        </h3>
        <div className="space-y-4">
          {[
            { date: '20 Mar', desc: 'Mensalidade Março', price: '99,90', status: 'pago' },
            { date: '20 Fev', desc: 'Mensalidade Fevereiro', price: '99,90', status: 'pago' },
            { date: '20 Jan', desc: 'Mensalidade Janeiro', price: '99,90', status: 'pago' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-fusion-primary/10 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-fusion-primary uppercase italic italic">{item.date.split(' ')[1]}</span>
                  <span className="text-lg font-bold">{item.date.split(' ')[0]}</span>
                </div>
                <div>
                  <p className="font-medium">{item.desc}</p>
                  <p className="text-xs text-white/40">NextFit API Gateway</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">R$ {item.price}</p>
                <span className="text-[10px] text-fusion-accent font-black italic italic uppercase tracking-wider">● Pago</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InicioTab;
