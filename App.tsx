
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
  }> = ({ targetView, icon, label }) => (
    <button
      onClick={() => setView(targetView)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        view === targetView ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-300'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-900 font-sans">
      <main className="flex-1 overflow-y-auto pb-20">
        {renderView()}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 flex justify-around items-center z-50">
        <NavItem targetView="dashboard" icon={<GaugeIcon />} label="Speedometer" />
        <NavItem targetView="history" icon={<HistoryIcon />} label="History" />
        <NavItem targetView="calculator" icon={<CalculatorIcon />} label="Calculator" />
      </nav>
      <Footer />
    </div>
  );
};

export default App;
