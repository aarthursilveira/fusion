import React, { useState } from 'react';
import { CreditCard, History, AlertCircle, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PagamentoTab = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-8">
      {/* Current/Next Bill */}
      <div className="glass-card p-10 border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-fusion-accent shadow-fusion-glow" />
        <div className="mb-6 w-20 h-20 bg-fusion-accent/10 rounded-full flex items-center justify-center text-fusion-accent shadow-[0_0_40px_rgba(109,191,71,0.1)]">
          <CreditCard size={40} />
        </div>
        <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-black italic italic mb-2">Próxima Fatura</p>
        <h2 className="text-5xl font-heading font-black italic italic uppercase italic mb-2 tracking-tighter">R$ 99,90</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full mb-8">
          <AlertCircle size={14} className="text-yellow-500" />
          <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-wider">Vence em 20 de Abril</span>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary px-12 py-4 text-lg shadow-[0_0_30px_rgba(109,191,71,0.3)] hover:shadow-[0_0_50px_rgba(109,191,71,0.5)]"
        >
          Pagar Agora
        </button>
      </div>

      {/* History Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <History size={20} className="text-fusion-primary" />
            Histórico Completo
          </h3>
          <span className="text-[10px] text-white/40 uppercase font-black italic italic tracking-widest">34 Transações</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-white/40 text-[10px] uppercase font-black italic italic tracking-widest">
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { date: '20/03/2026', desc: 'Mensalidade Março', price: '99,90', status: 'Pago' },
                { date: '20/02/2026', desc: 'Mensalidade Fevereiro', price: '99,90', status: 'Pago' },
                { date: '20/01/2026', desc: 'Mensalidade Janeiro', price: '99,90', status: 'Pago' },
                { date: '20/12/2025', desc: 'Mensalidade Dezembro', price: '99,90', status: 'Pago' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium">{row.date}</td>
                  <td className="px-6 py-4 text-white/60 text-sm">{row.desc}</td>
                  <td className="px-6 py-4 font-bold">R$ {row.price}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-fusion-accent/20 text-fusion-accent text-[10px] font-black italic italic uppercase italic rounded-full border border-fusion-accent/20">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               onClick={() => setShowModal(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card max-w-[400px] w-full p-8 relative z-10 border-white/10"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>
              <div className="text-center">
                <div className="w-16 h-16 bg-fusion-accent/10 rounded-full flex items-center justify-center text-fusion-accent mx-auto mb-6">
                  <ExternalLink size={30} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Pagamento Externo</h3>
                <p className="text-white/60 mb-8 leading-relaxed">
                  Para manter sua segurança, os pagamentos são processados diretamente pelo App oficial da **NextFit**.
                </p>
                <a 
                  href="https://nextfit.com.br" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-primary w-full gap-2"
                >
                  Abrir NextFit <ExternalLink size={18} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PagamentoTab;
