import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Calculator from './components/Calculator';
import Footer from './components/Footer';
import { GaugeIcon, HistoryIcon, CalculatorIcon } from './components/icons/NavigationIcons';
import { initDB } from './services/db';

type View = 'dashboard' | 'history' | 'calculator';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');

  useEffect(() => {
    initDB();
  }, []);

  const renderView = () => {
    switch (view) {
      case 'history':
        return <History />;
      case 'calculator':
        return <Calculator />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  const NavItem: React.FC<{
    targetView: View;
    icon: React.ReactNode;
    label: string;
  }> = ({ targetView, icon, label }) => {
    const isActive = view === targetView;
    return (
      <button
        onClick={() => setView(targetView)}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 group ${
          isActive ? 'text-sky-400' : 'text-slate-400 hover:text-sky-300'
        }`}
      >
        <div className={`relative p-1 rounded-full transition-colors ${isActive ? 'bg-sky-400/20' : ''}`}>
           {icon}
        </div>
        <span className="text-xs mt-1">{label}</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-900 font-sans">
      <main className="flex-1 overflow-y-auto pb-24">
        {renderView()}
        <Footer />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-950/70 backdrop-blur-lg border-t border-slate-700/50 flex justify-around items-center z-50">
        <NavItem targetView="dashboard" icon={<GaugeIcon />} label="Speedometer" />
        <NavItem targetView="history" icon={<HistoryIcon />} label="History" />
        <NavItem targetView="calculator" icon={<CalculatorIcon />} label="Calculator" />
      </nav>
    </div>
  );
};

export default App;