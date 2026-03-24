import React, { useState } from 'react';
import { Home, CreditCard, ClipboardList, User, Bell, LogOut, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InicioTab from './tabs/InicioTab';
import PagamentoTab from './tabs/PagamentoTab';
import MatriculaTab from './tabs/MatriculaTab';
import PerfilTab from './tabs/PerfilTab';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { id: 'inicio', label: 'Início', icon: Home },
  { id: 'pagamento', label: 'Pagamento', icon: CreditCard },
  { id: 'matricula', label: 'Matrícula', icon: ClipboardList },
  { id: 'perfil', label: 'Perfil', icon: User },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case 'inicio': return <InicioTab />;
      case 'pagamento': return <PagamentoTab />;
      case 'matricula': return <MatriculaTab />;
      case 'perfil': return <PerfilTab />;
      default: return <InicioTab />;
    }
  };

  return (
    <div className="min-h-screen bg-fusion-bg flex flex-col md:flex-row text-fusion-text">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-fusion-card border-r border-white/5 h-screen sticky top-0">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-fusion-primary rounded-xl flex items-center justify-center shadow-fusion-purple-glow">
              <span className="text-xl font-bold italic italic">F</span>
            </div>
            <span className="text-xl font-heading font-bold uppercase tracking-tight">Fusion Portal</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all group",
                activeTab === item.id 
                  ? "bg-fusion-primary text-white shadow-fusion-purple-glow" 
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(activeTab === item.id ? "text-fusion-accent" : "group-hover:text-fusion-accent transition-colors")} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/40 hover:bg-red-500/10 hover:text-red-500 transition-all font-medium">
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0 relative overflow-x-hidden">
        {/* Top Bar */}
        <header className="p-6 md:p-8 flex justify-between items-center sticky top-0 bg-fusion-bg/80 backdrop-blur-lg z-30">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Olá, Arthur 👋</h2>
            <p className="text-xs md:text-sm text-white/40">Seja bem-vindo de volta!</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors relative">
              <Bell size={20} className="text-white/60" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-fusion-accent rounded-full border-2 border-fusion-bg shadow-fusion-glow" />
            </button>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-fusion-primary to-purple-800 flex items-center justify-center font-bold text-lg shadow-fusion-purple-glow">
              AS
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] h-16 bg-fusion-card/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-around px-2 shadow-2xl z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "p-3 rounded-full transition-all relative overflow-hidden",
              activeTab === item.id 
                ? "text-fusion-accent scale-110" 
                : "text-white/40"
            )}
          >
            <item.icon size={24} />
            {activeTab === item.id && (
              <motion.div 
                layoutId="navTab"
                className="absolute inset-0 bg-white/5 rounded-full -z-10"
                transition={{ type: 'spring', bounce: 0.3 }}
              />
            )}
          </button>
        ))}
        <button className="p-3 text-red-500/60 font-bold">
          <LogOut size={24} />
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
