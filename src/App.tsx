import React, { useState, useRef } from 'react';
import {
  Camera,
  Search,
  BarChart3,
  CalendarDays,
  Plus,
  ArrowLeftRight,
  Landmark,
  MoreHorizontal,
  Bitcoin,
  Hexagon,
  BatteryFull,
  SignalHigh,
  ChevronLeft,
  ArrowDown,
  Settings,
  Copy,
  Share,
  ShieldCheck,
  Clock
} from 'lucide-react';

// Exchange rate
const EXCHANGE_RATE = 10.77;

// Formatter utility
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Global Financial State
  const [balances, setBalances] = useState({
    MAD: 0.01,
    EUR: 0.00
  });
  
  // Tracks the currently visible account on the Dashboard slider
  const [activeAccount, setActiveAccount] = useState<'MAD' | 'EUR'>('MAD');

  // Logic functions
  const addMoney = (amount: number, currency: 'MAD' | 'EUR') => {
    setBalances(prev => ({
      ...prev,
      [currency]: prev[currency] + amount
    }));
  };

  const transferMoney = (sourceCurrency: 'MAD' | 'EUR', amount: number) => {
    const targetCurrency = sourceCurrency === 'MAD' ? 'EUR' : 'MAD';
    let convertedAmount = 0;
    
    if (sourceCurrency === 'EUR') {
      convertedAmount = amount * EXCHANGE_RATE;
    } else {
      convertedAmount = amount / EXCHANGE_RATE;
    }

    setBalances(prev => ({
      ...prev,
      [sourceCurrency]: prev[sourceCurrency] - amount,
      [targetCurrency]: prev[targetCurrency] + convertedAmount
    }));
  };

  return (
    <div className="min-h-screen bg-[#051025] flex items-center justify-center font-sans selection:bg-blue-500/30">
      {/* Mobile frame simulator */}
      <div className="w-full h-[100dvh] sm:w-[360px] sm:h-[740px] sm:rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden bg-gradient-to-b from-[#0A1530] to-[#050A1A] text-white flex flex-col sm:border-[8px] sm:border-[#1c2b43] leading-normal">
        
        {/* StatusBar (iOS) */}
        <div className="flex justify-between items-center px-6 pt-5 pb-2 text-[14px] font-semibold tracking-wide z-10 relative">
          <span>09:58</span>
          <div className="flex items-center gap-1.5">
            <SignalHigh size={16} className="stroke-[2.5]" />
            <span>5G</span>
            <BatteryFull size={20} className="stroke-[2] opacity-90" />
          </div>
        </div>

        {/* Dynamic Screen Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col relative w-full h-full">
          {currentView === 'dashboard' && (
            <Dashboard 
              setCurrentView={setCurrentView} 
              balances={balances}
              activeAccount={activeAccount}
              setActiveAccount={setActiveAccount}
            />
          )}
          {currentView === 'add_money' && (
            <AddMoney 
              setCurrentView={setCurrentView} 
              activeAccount={activeAccount}
              currentBalance={balances[activeAccount]}
              onAddMoney={addMoney}
            />
          )}
          {currentView === 'transfer' && (
            <Transfer 
              setCurrentView={setCurrentView} 
              balances={balances}
              onTransfer={transferMoney}
            />
          )}
          {currentView === 'bank_details' && (
            <BankDetails 
              setCurrentView={setCurrentView} 
              activeAccount={activeAccount}
            />
          )}
        </div>

        {/* Bottom Navigation Bar - Only on Dashboard */}
        {currentView === 'dashboard' && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#0A1530]/90 backdrop-blur-md border-t border-white/5 pt-2.5 pb-6 px-2 flex justify-around items-end z-20">
            <div className="flex flex-col items-center cursor-pointer w-16 text-white relative gap-[4px] pt-1.5">
              <div className="absolute -top-[10px] w-10 h-1 bg-[#3b82f6] rounded-b-[4px]"></div>
              <div className="h-[24px] flex items-center justify-center">
                <span className="font-bold text-[22px] leading-none tracking-tight">R</span>
              </div>
              <span className="text-[10px] tracking-wide">Accueil</span>
            </div>
            
            <div className="flex flex-col items-center cursor-pointer w-16 text-[#64748b] hover:text-white transition gap-[4px] pt-1.5">
              <BarChart3 size={24} className="stroke-[2]" />
              <span className="text-[10px] tracking-wide">Investir</span>
            </div>
            
            <div className="flex flex-col items-center cursor-pointer w-16 text-[#64748b] hover:text-white transition gap-[4px] pt-1.5">
              <ArrowLeftRight size={24} className="stroke-[2]" />
              <span className="text-[10px] tracking-wide">Virements</span>
            </div>
            
            <div className="flex flex-col items-center cursor-pointer w-16 text-[#64748b] hover:text-white transition gap-[4px] pt-1.5">
              <Bitcoin size={24} className="stroke-[2]" />
              <span className="text-[10px] tracking-wide">Cryptos</span>
            </div>
            
            <div className="flex flex-col items-center cursor-pointer w-16 text-[#64748b] hover:text-white transition gap-[4px] pt-1.5">
              <Hexagon size={24} className="stroke-[2]" />
              <span className="text-[10px] tracking-wide">MobenPoints</span>
            </div>

            {/* iOS Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[5px] bg-white/80 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* SCREEN 1: DASHBOARD                                                        */
/* ========================================================================== */
function Dashboard({ setCurrentView, balances, activeAccount, setActiveAccount }: any) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const slideIndex = Math.round(scrollLeft / width);
    setActiveAccount(slideIndex === 0 ? 'MAD' : 'EUR');
  };

  // Keep pagination to 4 dots but highlight based on activeAccount (0=MAD, 1=EUR)
  const renderDots = () => {
    const activeIndex = activeAccount === 'MAD' ? 0 : 1;
    return [0, 1, 2, 3].map((dot) => (
      <div 
        key={dot} 
        className={`w-[6px] h-[6px] rounded-full transition-colors duration-300 ${dot === activeIndex ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'bg-white/20'}`}
      ></div>
    ));
  };

  return (
    <div className="pb-[100px] flex flex-col pt-2 animate-in fade-in duration-300">
      {/* Main Search Container */}
      <div className="grid grid-cols-[40px_1fr_32px] items-center px-4 gap-3">
        <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563eb] to-[#3b82f6] flex items-center justify-center shadow-md">
          <Camera size={20} className="text-white relative top-[1px]" />
        </button>
        
        <div className="h-10 bg-white/10 backdrop-blur-md rounded-[20px] flex items-center px-3">
          <Search size={16} className="text-[#94a3b8] mr-2" />
          <input
            type="text"
            placeholder="Rechercher"
            className="bg-transparent border-none outline-none w-full text-[14px] font-medium text-white placeholder-[#94a3b8]"
            readOnly
          />
        </div>

        <div className="flex flex-col gap-1">
          <button className="w-8 h-8 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center">
            <BarChart3 size={14} className="text-white" />
          </button>
          <button className="w-8 h-8 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center">
            <CalendarDays size={14} className="text-white" />
          </button>
        </div>
      </div>

      {/* Main Balance Section */}
      <div className="mt-8 flex flex-col items-center">
        {/* Pagination Dots */}
        <div className="flex gap-[6px] mb-3">
          {renderDots()}
        </div>

        {/* Swipeable Accounts UI */}
        <div 
          ref={scrollContainerRef}
          className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide py-2"
          onScroll={handleScroll}
        >
          {/* Slide 1: MAD */}
          <div className="w-full shrink-0 snap-center flex flex-col items-center px-4">
            <p className="text-[13px] text-white/70 font-medium tracking-wide mb-1">
              Adam Benabdelhak - MAD
            </p>
            <div className="flex items-baseline justify-center mb-6">
              <span className="text-[52px] font-bold tracking-tight leading-none text-white whitespace-nowrap">
                {formatMoney(balances.MAD)}
              </span>
              <span className="text-[26px] font-medium tracking-wide text-white/50 ml-1.5">MAD</span>
            </div>
            <button className="px-5 py-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm transition text-white rounded-[20px] text-[13px] font-medium border border-white/5">
              Comptes et Portefeuilles
            </button>
          </div>

          {/* Slide 2: EUR */}
          <div className="w-full shrink-0 snap-center flex flex-col items-center px-4 pt-1 !ms-0">
            <p className="text-[13px] text-white/70 font-medium tracking-wide mb-1">
              Adam Benabdelhak - EUR
            </p>
            <div className="flex items-baseline justify-center mb-6">
              <span className="text-[52px] font-bold tracking-tight leading-none text-white whitespace-nowrap">
                {formatMoney(balances.EUR)}
              </span>
              <span className="text-[26px] font-medium tracking-wide text-white/50 ml-1.5">EUR</span>
            </div>
            <button className="px-5 py-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm transition text-white rounded-[20px] text-[13px] font-medium border border-white/5">
              Comptes et Portefeuilles
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex justify-around px-4 mt-8 mb-4">
        <div className="flex flex-col items-center gap-2 group w-[80px] cursor-pointer" onClick={() => setCurrentView('add_money')}>
          <button className="w-[56px] h-[56px] rounded-full bg-[#1c2b43] border border-white/5 flex items-center justify-center transition hover:bg-[#2a3c5a]">
            <Plus size={24} className="text-[#3b82f6]" />
          </button>
          <span className="text-[11px] font-medium text-white/80 text-center leading-tight">
            Ajouter de l'argent
          </span>
        </div>
        
        <div className="flex flex-col items-center gap-2 group w-[80px] cursor-pointer" onClick={() => setCurrentView('transfer')}>
          <button className="w-[56px] h-[56px] rounded-full bg-[#1c2b43] border border-white/5 flex items-center justify-center transition hover:bg-[#2a3c5a]">
            <ArrowLeftRight size={22} className="text-[#3b82f6]" />
          </button>
          <span className="text-[11px] font-medium text-white/80 text-center leading-tight">
            Entre mes comptes
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 group w-[80px] cursor-pointer" onClick={() => setCurrentView('bank_details')}>
          <button className="w-[56px] h-[56px] rounded-full bg-[#1c2b43] border border-white/5 flex items-center justify-center transition hover:bg-[#2a3c5a]">
            <Landmark size={22} className="text-[#3b82f6]" />
          </button>
          <span className="text-[11px] font-medium text-white/80 text-center leading-tight">
            Informations
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 group w-[80px] cursor-pointer">
          <button className="w-[56px] h-[56px] rounded-full bg-[#1c2b43] border border-white/5 flex items-center justify-center transition hover:bg-[#2a3c5a]">
            <MoreHorizontal size={24} className="text-[#3b82f6]" />
          </button>
          <span className="text-[11px] font-medium text-white/80 text-center leading-tight">
            Plus
          </span>
        </div>
      </div>

      {/* Transactions List Placeholder */}
      <div className="mx-5 mt-6">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-[16px] font-semibold text-white">Transactions</h3>
          <button className="text-[#3b82f6] text-[13px] font-medium">Tout afficher</button>
        </div>
        <div className="flex flex-col items-center justify-center py-10 bg-[#1c2B43]/50 rounded-[24px] border border-white/5">
          <p className="text-[13px] text-[#94a3b8]">Aucune transaction récente</p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* SCREEN 2: ADD MONEY                                                        */
/* ========================================================================== */
function AddMoney({ setCurrentView, activeAccount, currentBalance, onAddMoney }: any) {
  const [inputVal, setInputVal] = useState('100');

  const handleConfirm = () => {
    const amount = parseFloat(inputVal.replace(',', '.'));
    if (!isNaN(amount) && amount > 0) {
      onAddMoney(amount, activeAccount);
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300 relative">
      {/* Header */}
      <div className="flex items-center px-4 pt-2 pb-4">
        <button onClick={() => setCurrentView('dashboard')} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <div className="flex-1 text-center pr-10">
          <h2 className="text-[16px] font-semibold text-white leading-tight">Ajouter de l'argent</h2>
          <p className="text-[12px] text-white/50 font-medium">Solde : {formatMoney(currentBalance)} {activeAccount}</p>
        </div>
      </div>

      {/* Center Amount Input */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-10">
        <div className="flex items-baseline justify-center px-4 w-full">
          <input 
            type="text"
            inputMode="decimal"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full text-center bg-transparent border-none outline-none text-[64px] font-bold tracking-tight text-white placeholder-white/30"
            placeholder="0"
          />
          <span className="text-[32px] font-semibold text-white/70 ml-2 relative shrink-0">{activeAccount}</span>
        </div>
        
        {/* Payment Method Selector */}
        <button className="mt-8 flex items-center gap-2 bg-[#1c2b43] hover:bg-[#2a3c5a] border border-white/10 rounded-full px-5 py-2.5 transition">
          <div className="bg-white text-black rounded px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-0.5">
            <svg viewBox="0 0 384 512" className="w-[10px] h-[10px]" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 47.1-.8 81.2-82.6 81.2-82.6-43.1-15.6-59.8-59.5-59.8-105.7M249.4 72.3c4.6-21.2-12.8-50.5-38.3-64.3-11.4 34.3-43.2 59-67.6 59-4 22.8 13.9 50 39.8 63 11-34.5 45.4-56.1 66.1-57.7"/></svg>
            Pay
          </div>
          <span className="text-[13px] font-semibold text-white">Apple Pay · {activeAccount}</span>
          <ArrowDown size={14} className="text-white/50 ml-1" />
        </button>
      </div>

      {/* Footer Area */}
      <div className="px-5 pb-8 pt-4">
        <p className="text-center text-[12px] text-white/50 font-medium mb-4">Arrivée · Généralement instantanée</p>
        <button 
          onClick={handleConfirm}
          className="w-full bg-white hover:bg-gray-100 transition text-black h-14 rounded-[24px] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
        >
          <span className="font-bold text-[16px]">Confirmer le dépôt</span>
        </button>
      </div>
      
      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[5px] bg-white/80 rounded-full"></div>
    </div>
  );
}

/* ========================================================================== */
/* SCREEN 3: TRANSFER BETWEEN ACCOUNTS                                        */
/* ========================================================================== */
function Transfer({ setCurrentView, balances, onTransfer }: any) {
  const [source, setSource] = useState<'EUR' | 'MAD'>('EUR');
  const [amountStr, setAmountStr] = useState<string>('');
  const [step, setStep] = useState<'input' | 'confirm'>('input');
  
  const target = source === 'EUR' ? 'MAD' : 'EUR';
  const amount = parseFloat(amountStr.replace(',', '.')) || 0;
  
  // Calculate Target Amount
  const targetAmount = source === 'EUR' ? amount * EXCHANGE_RATE : amount / EXCHANGE_RATE;

  const handleFlip = () => {
    setSource(target);
    setAmountStr(''); // Reset input on flip for clarity
    setStep('input');
  };

  const handleAction = () => {
    if (step === 'input') {
      if (amount > 0) setStep('confirm');
    } else {
      onTransfer(source, amount);
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300 relative">
      <div className="flex items-center px-4 pt-2 pb-2">
        <button 
          onClick={() => step === 'confirm' ? setStep('input') : setCurrentView('dashboard')} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <div className="flex-1 text-center pr-10">
          <h2 className="text-[16px] font-semibold text-white leading-tight">Transférez de l'argent</h2>
          <p className="text-[12px] text-[#3b82f6] font-medium mt-0.5">1 EUR = {EXCHANGE_RATE} MAD</p>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="relative">
          {/* Source Block */}
          <div className="bg-[#1c2b43] rounded-t-[20px] p-5 pb-8 flex items-center justify-between border border-white/5 border-b-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-opacity-20 border border-white/10 flex items-center justify-center text-[16px] overflow-hidden">
                {source === 'EUR' ? '🇪🇺' : '🇲🇦'}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-[15px] text-white">{source}</span>
                <ArrowDown size={14} className="text-white/50" />
              </div>
            </div>
            <div className="text-right w-1/2">
              <div className="flex items-center justify-end font-bold text-[22px] text-white gap-1 w-full relative">
                 <input
                   type="text"
                   inputMode="decimal"
                   placeholder="0"
                   value={amountStr}
                   onChange={(e) => {
                     setAmountStr(e.target.value);
                     setStep('input');
                   }}
                   className="bg-transparent border-none outline-none w-full text-right placeholder-white/30 truncate" 
                   style={{ width: amountStr.length ? `${amountStr.length}ch` : '1ch' }}
                 />
              </div>

              <p className="text-[12px] mt-1 pr-1 text-white/40">
                Solde: {formatMoney(balances[source])} {source}
              </p>
            </div>
          </div>
          
          {/* Center Flip Button */}
          <div 
             onClick={handleFlip}
             className="absolute top-1/2 left-6 -translate-y-1/2 w-10 h-10 rounded-full bg-[#3b82f6] border-[4px] border-[#0A1530] flex items-center justify-center z-10 shadow-[0_4px_12px_rgba(59,130,246,0.3)] cursor-pointer hover:scale-105 transition"
          >
            <ArrowDown size={18} className="text-white" />
          </div>

          {/* Target Block */}
          <div className="bg-[#2a3c5a] rounded-b-[20px] p-5 pt-8 flex items-center justify-between border border-white/5 border-t-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-opacity-20 border border-white/10 flex items-center justify-center text-[16px] overflow-hidden">
                {target === 'EUR' ? '🇪🇺' : '🇲🇦'}
              </div>
              <div className="flex items-center gap-1 pl-[2px]">
                <span className="font-semibold text-[15px] text-white">{target}</span>
                <ArrowDown size={14} className="text-white/50" />
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className={`text-[22px] font-bold inline-flex items-baseline ${amount > 0 ? 'text-[#3b82f6]' : 'text-white/30'}`}>
                {amount > 0 ? '+' : ''}{formatMoney(targetAmount)}
              </span>
              <p className="text-[12px] text-white/40 mt-1">
                Solde: {formatMoney(balances[target])} {target}
              </p>
            </div>
          </div>
        </div>

        {/* Note Input */}
        <div className="mt-4 bg-[#1c2b43] rounded-[16px] h-[52px] flex items-center px-4 border border-white/5">
          <input
            type="text"
            placeholder="Ajouter une note"
            className="bg-transparent border-none outline-none w-full text-[14px] font-medium text-white placeholder-[#94a3b8]"
          />
        </div>
      </div>

      {/* Footer Area */}
      <div className="mt-auto px-4 pb-8 flex items-center gap-3">
        <button className="w-[52px] h-[52px] rounded-full bg-[#1c2b43] border border-white/5 flex items-center justify-center shrink-0">
          <Settings size={22} className="text-[#94a3b8]" />
        </button>
        <button 
          onClick={handleAction}
          className={`flex-1 transition font-semibold h-[52px] rounded-[24px] text-[15px] active:scale-[0.98]
            ${step === 'confirm' && amount > 0 
              ? 'bg-[#3b82f6] hover:bg-blue-600 text-white shadow-lg' 
              : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
        >
          {step === 'confirm' ? 'Confirmer le transfert' : 'Vérifier le change'}
        </button>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[5px] bg-white/80 rounded-full"></div>
    </div>
  );
}

/* ========================================================================== */
/* SCREEN 4: BANK DETAILS                                                     */
/* ========================================================================== */
function BankDetails({ setCurrentView, activeAccount }: any) {
  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300 relative">
      {/* Header */}
      <div className="flex flex-col px-4 pt-2 pb-4">
        <div className="flex items-center">
          <button onClick={() => setCurrentView('dashboard')} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0">
            <ChevronLeft size={24} className="text-white" />
          </button>
          <div className="flex-1 pr-10 flex justify-center">
             <div className="bg-[#1c2b43] rounded-full flex items-center gap-2 px-3 py-1.5 border border-white/5">
                <span className="text-[12px] leading-none">{activeAccount === 'EUR' ? '🇪🇺' : '🇲🇦'}</span>
                <span className="text-[13px] font-medium">{activeAccount === 'EUR' ? 'Euro' : 'Dirham'}</span>
             </div>
          </div>
        </div>
        <h2 className="text-[22px] font-bold text-white mt-4 ml-1">Coordonnées bancaires</h2>
      </div>

      <div className="px-4 pb-16 flex-1 overflow-y-auto scrollbar-hide">
        {/* Main Info Card */}
        <div className="bg-[#1c2b43] rounded-[24px] p-5 border border-white/5 flex flex-col gap-6">
          <InfoRow label="Bénéficiaire" value="Adam Benabdelhak" />
          <InfoRow label="IBAN" value={activeAccount === 'EUR' ? "FR76 1234 5678 9012 3456 7890 123" : "MA03 0000 0000 0000 0000 0000 000"} />
          <InfoRow label="BIC" value={activeAccount === 'EUR' ? "REVOFRXX" : "MOBEMAMX"} />
          <InfoRow label="Adresse de la banque" value="Revolut Bank UAB, Succursale Française, 12 rue de la Paix, 75002 Paris" />
        </div>

        {/* Share Button */}
        <button className="w-full mt-4 bg-transparent border-[1.5px] border-white/20 hover:bg-white/5 transition text-white font-semibold py-3.5 rounded-[24px] text-[14px] flex items-center justify-center gap-2">
          <Share size={18} className="text-white" />
          Partager les informations
        </button>

        {/* Info Blocks */}
        <div className="mt-6 flex flex-col gap-4 px-2">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-[#1c2b43] flex items-center justify-center shrink-0">
              <ShieldCheck size={16} className="text-[#3b82f6]" />
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-white">Vos fonds sont protégés</h4>
              <p className="text-[12px] text-[#94a3b8] leading-snug mt-0.5">Votre argent est protégé jusqu'à 100 000 € par le système de garantie des dépôts.</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-[#1c2b43] flex items-center justify-center shrink-0">
              <Clock size={16} className="text-[#3b82f6]" />
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-white">Délais de transfert</h4>
              <p className="text-[12px] text-[#94a3b8] leading-snug mt-0.5">Les virements SEPA réguliers prennent généralement de 1 à 2 jours ouvrables.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[5px] bg-white/80 rounded-full"></div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-start border-b border-white/5 pb-5 last:border-0 last:pb-0">
      <div className="flex-1 pr-4">
        <p className="text-[12px] font-medium text-[#94a3b8] mb-1">{label}</p>
        <p className="text-[14px] font-semibold text-[#3b82f6] break-all">{value}</p>
      </div>
      <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition flex items-center justify-center shrink-0 mt-1">
        <Copy size={14} className="text-white" />
      </button>
    </div>
  );
}
