import React, { useState, useRef, useEffect } from 'react';
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
  Clock,
  ChevronRight,
  Coins,
  Link as LinkIcon,
  HandCoins,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Invest } from './views/Invest';

// Exchange rate
const EXCHANGE_RATE = 10.77;

// Formatter utility
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const formatMoneyParts = (amount: number) => {
  const parts = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).formatToParts(amount);
  
  const integerPart = parts.filter(p => p.type === 'integer' || p.type === 'group').map(p => p.value).join('');
  const decimalPart = parts.filter(p => ['decimal', 'fraction'].includes(p.type)).map(p => p.value).join('');
  return { integerPart, decimalPart };
};

const springTransition = { type: "spring", stiffness: 400, damping: 17 };

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
        <div className="flex justify-between items-center px-6 pt-5 pb-2 text-[14px] font-semibold tracking-wide z-10 relative bg-[#0A1530]">
          <span>09:58</span>
          <div className="flex items-center gap-1.5">
            <SignalHigh size={16} className="stroke-[2.5]" />
            <span>5G</span>
            <BatteryFull size={20} className="stroke-[2] opacity-90" />
          </div>
        </div>

        {/* Dynamic Screen Content */}
        <div className="flex-1 overflow-hidden relative w-full h-full">
          {/* Base Layer: Dashboard */}
          <div className="absolute inset-0 overflow-y-auto scrollbar-hide pb-[80px]">
            <AnimatePresence mode="popLayout">
              {currentView === 'dashboard' && (
                <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  <Dashboard 
                    setCurrentView={setCurrentView} 
                    balances={balances}
                    activeAccount={activeAccount}
                    setActiveAccount={setActiveAccount}
                  />
                </motion.div>
              )}
              {currentView === 'invest' && (
                <motion.div key="invest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full absolute inset-0 bg-[#0A1530]">
                  <Invest />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {currentView !== 'dashboard' && currentView !== 'invest' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-[#050A1A]/80 backdrop-blur-sm"
                onClick={() => setCurrentView('dashboard')}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentView === 'patrimoine_comptes' && (
              <PatrimoineComptes 
                key="patrimoine"
                setCurrentView={setCurrentView} 
                balances={balances}
              />
            )}
            {currentView === 'add_money' && (
              <AddMoney 
                key="add_money"
                setCurrentView={setCurrentView} 
                activeAccount={activeAccount}
                currentBalance={balances[activeAccount]}
                onAddMoney={addMoney}
              />
            )}
            {currentView === 'transfer' && (
              <Transfer 
                key="transfer"
                setCurrentView={setCurrentView} 
                balances={balances}
                onTransfer={transferMoney}
              />
            )}
            {currentView === 'bank_details' && (
              <BankDetails 
                key="bank_details"
                setCurrentView={setCurrentView} 
                activeAccount={activeAccount}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation Bar */}
        <AnimatePresence>
        {['dashboard', 'invest'].includes(currentView) && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute bottom-0 left-0 right-0 bg-[#0A1530]/90 backdrop-blur-md border-t border-white/5 pt-2.5 pb-6 px-2 flex justify-around items-end z-20"
          >
            <div 
              onClick={() => setCurrentView('dashboard')}
              className={`flex flex-col items-center cursor-pointer w-16 relative gap-[4px] pt-1.5 transition ${currentView === 'dashboard' ? 'text-white' : 'text-[#64748b] hover:text-white'}`}
            >
              {currentView === 'dashboard' && <div className="absolute -top-[10px] w-10 h-1 bg-[#3b82f6] rounded-b-[4px]"></div>}
              <div className="h-[24px] flex items-center justify-center">
                <span className="font-bold text-[22px] leading-none tracking-tight">R</span>
              </div>
              <span className="text-[10px] tracking-wide">Accueil</span>
            </div>
            
            <div 
              onClick={() => setCurrentView('invest')}
              className={`flex flex-col items-center cursor-pointer w-16 relative gap-[4px] pt-1.5 transition ${currentView === 'invest' ? 'text-white' : 'text-[#64748b] hover:text-white'}`}
            >
              {currentView === 'invest' && <div className="absolute -top-[10px] w-10 h-1 bg-[#3b82f6] rounded-b-[4px]"></div>}
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
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* SCREEN 1: DASHBOARD                                                        */
/* ========================================================================== */
function Dashboard({ setCurrentView, balances, activeAccount, setActiveAccount }: any) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [rates, setRates] = useState({
    GBP: { val: 11.20, pct: 0.08 },
    USD: { val: 10.15, pct: 0.24 }
  });

  useEffect(() => {
    // Simulate real-time market fluctuations
    const interval = setInterval(() => {
      setRates(prev => ({
        GBP: { 
          val: prev.GBP.val + (Math.random() * 0.02 - 0.01), 
          pct: prev.GBP.pct + (Math.random() * 0.02 - 0.01) 
        },
        USD: { 
          val: prev.USD.val + (Math.random() * 0.02 - 0.01), 
          pct: prev.USD.pct + (Math.random() * 0.02 - 0.01) 
        }
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const slideIndex = Math.round(scrollLeft / width);
    setActiveAccount(slideIndex === 0 ? 'MAD' : 'EUR');
  };

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
    <div className="flex flex-col pt-2 w-full">
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

      <div className="mt-8 flex flex-col items-center">
        <div className="flex gap-[6px] mb-3">
          {renderDots()}
        </div>

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
              <span className="text-[40px] font-bold tracking-tight leading-none text-white whitespace-nowrap">
                {formatMoneyParts(balances.MAD).integerPart}
              </span>
              <span className="text-[20px] font-medium tracking-wide text-white/50 ml-0.5">{formatMoneyParts(balances.MAD).decimalPart} <span className="ml-1">MAD</span></span>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              transition={springTransition}
              onClick={() => setCurrentView('patrimoine_comptes')}
              className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition text-white rounded-[20px] text-[13px] font-medium border border-white/5"
            >
              Comptes et Portefeuilles
            </motion.button>
          </div>

          {/* Slide 2: EUR */}
          <div className="w-full shrink-0 snap-center flex flex-col items-center px-4 pt-1">
            <p className="text-[13px] text-white/70 font-medium tracking-wide mb-1">
              Adam Benabdelhak - EUR
            </p>
            <div className="flex items-baseline justify-center mb-6">
              <span className="text-[40px] font-bold tracking-tight leading-none text-white whitespace-nowrap">
                {formatMoneyParts(balances.EUR).integerPart}
              </span>
              <span className="text-[20px] font-medium tracking-wide text-white/50 ml-0.5">{formatMoneyParts(balances.EUR).decimalPart} <span className="ml-1">EUR</span></span>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              transition={springTransition}
              onClick={() => setCurrentView('patrimoine_comptes')}
              className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition text-white rounded-[20px] text-[13px] font-medium border border-white/5"
            >
              Comptes et Portefeuilles
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex justify-around px-4 mt-8 mb-4">
        <motion.div 
          whileTap={{ scale: 0.95 }}
          transition={springTransition}
          className="flex flex-col items-center gap-2 group w-[80px] cursor-pointer" 
          onClick={() => setCurrentView('add_money')}
        >
          <button className="w-[56px] h-[56px] rounded-full bg-[#1c2b43] border border-white/5 flex items-center justify-center transition group-hover:bg-[#2a3c5a] shadow-[0_4px_12px_rgba(0,0,0,0.2)] text-[#3b82f6]">
            <Plus size={24} />
          </button>
          <span className="text-[11px] font-medium text-white/80 text-center leading-tight">
            Ajouter de l'argent
          </span>
        </motion.div>
        
        <motion.div 
          whileTap={{ scale: 0.95 }}
          transition={springTransition}
          className="flex flex-col items-center gap-2 group w-[80px] cursor-pointer" 
          onClick={() => setCurrentView('transfer')}
        >
          <button className="w-[56px] h-[56px] rounded-full bg-[#1c2b43] border border-white/5 flex items-center justify-center transition group-hover:bg-[#2a3c5a] shadow-[0_4px_12px_rgba(0,0,0,0.2)] text-[#3b82f6]">
            <ArrowLeftRight size={22} />
          </button>
          <span className="text-[11px] font-medium text-white/80 text-center leading-tight">
            Entre mes comptes
          </span>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.95 }}
          transition={springTransition}
          className="flex flex-col items-center gap-2 group w-[80px] cursor-pointer" 
          onClick={() => setCurrentView('bank_details')}
        >
          <button className="w-[56px] h-[56px] rounded-full bg-[#1c2b43] border border-white/5 flex items-center justify-center transition group-hover:bg-[#2a3c5a] shadow-[0_4px_12px_rgba(0,0,0,0.2)] text-[#3b82f6]">
            <Landmark size={22} />
          </button>
          <span className="text-[11px] font-medium text-white/80 text-center leading-tight">
            Informations
          </span>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.95 }}
          transition={springTransition}
          className="flex flex-col items-center gap-2 group w-[80px] cursor-pointer"
        >
          <button className="w-[56px] h-[56px] rounded-full bg-[#1c2b43] border border-white/5 flex items-center justify-center transition group-hover:bg-[#2a3c5a] shadow-[0_4px_12px_rgba(0,0,0,0.2)] text-[#3b82f6]">
            <MoreHorizontal size={24} />
          </button>
          <span className="text-[11px] font-medium text-white/80 text-center leading-tight">
            Plus
          </span>
        </motion.div>
      </div>

        {/* Dépenses du mois Section */}
        <div className="px-4 mt-6">
           <div className="bg-[#1c2b43] rounded-[24px] p-5 border border-white/5 shadow-lg">
              <h3 className="text-[13px] font-medium text-[#94a3b8] mb-1">Dépenses du mois</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold text-white tracking-tight leading-none">27 832</span>
                <span className="text-2xl font-medium text-white/50 ml-0.5">,00 MAD</span>
              </div>
              
              {/* Progress Bar with markers */}
              <div className="relative pt-2">
                <div className="w-full flex h-[4px] gap-[2px]">
                   {Array.from({ length: 30 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`flex-1 rounded-full ${i < 21 ? 'bg-white' : 'bg-white/20'}`}
                      ></div>
                   ))}
                </div>
                <div className="flex justify-between w-full mt-2 text-[10px] text-white/50 font-medium">
                  <span>1</span>
                  <span>6</span>
                  <span>11</span>
                  <span>16</span>
                  <span>21</span>
                  <span>26</span>
                  <span>30</span>
                </div>
              </div>
           </div>
        </div>

      {/* Liste de surveillance Section */}
      <div className="px-4 mt-6 pb-6">
         <div className="flex items-center text-[#94a3b8] font-semibold text-[13px] mb-3 px-1 cursor-pointer w-max">
            Liste de surveillance <ChevronRight size={14} className="ml-0.5 relative top-[1px]" />
         </div>
          <div className="bg-[#1c2b43] rounded-[24px] px-2 py-2 border border-white/5 shadow-lg flex flex-col">
            <MarketRow 
              icon="🇬🇧" 
              name="Livre sterling" 
              pair="GBP à MAD" 
              value={`${formatMoneyParts(rates.GBP.val).integerPart}${formatMoneyParts(rates.GBP.val).decimalPart} MAD`} 
              pct={rates.GBP.pct} 
            />
            <MarketRow 
              icon="🇺🇸" 
              name="Dollar américain" 
              pair="USD à MAD" 
              value={`${formatMoneyParts(rates.USD.val).integerPart}${formatMoneyParts(rates.USD.val).decimalPart} MAD`} 
              pct={rates.USD.pct} 
              isLast
            />
         </div>
      </div>
    </div>
  );
}

function MarketRow({ icon, name, pair, value, pct, isLast }: any) {
  const isPositive = pct >= 0;
  return (
    <div className={`flex justify-between items-center px-3 py-3 border-b border-white/5 ${isLast ? 'border-0' : ''}`}>
       <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/[0.03] flex items-center justify-center text-[18px]">
             {icon}
          </div>
          <div className="flex flex-col">
             <span className="text-[14px] font-semibold text-white">{name}</span>
             <span className="text-[12px] text-[#94a3b8]">{pair}</span>
          </div>
       </div>
       <div className="flex flex-col items-end">
          <motion.span 
            key={value}
            initial={{ color: isPositive ? "#4ade80" : "#f87171" }}
            animate={{ color: "#ffffff" }}
            transition={{ duration: 0.8 }}
            className="text-[14px] font-bold text-white"
          >
            {value}
          </motion.span>
          <motion.span 
            key={pct}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className={`text-[12px] font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}
          >
             {isPositive ? '+' : ''}{pct.toFixed(2)}%
          </motion.span>
       </div>
    </div>
  );
}

/* ========================================================================== */
/* SCREEN: PATRIMOINE & COMPTES (+ Cartes)                                    */
/* ========================================================================== */
function PatrimoineComptes({ setCurrentView, balances }: any) {
  const totalMAD = balances.MAD + (balances.EUR * EXCHANGE_RATE);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardData, setActiveCardData] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const slideIndex = Math.round(scrollLeft / width);
    setActiveCardData(slideIndex);
  };

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="absolute inset-0 flex flex-col h-full bg-gradient-to-b from-[#0A1530] to-[#050A1A] z-40"
    >
      {/* Header */}
      <div className="flex items-center px-4 pt-2 pb-2">
        <button 
          onClick={() => setCurrentView('dashboard')} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0 z-10"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-6 -mt-12">
        {/* Gestion des Cartes (Horizontal Slider) */}
        <div className="mt-2 mb-8">
          <div className="flex items-center text-[#94a3b8] font-semibold text-[13px] mb-3 px-5 cursor-pointer w-max pl-[60px] pt-2">
            Cartes <ChevronRight size={14} className="ml-0.5 relative top-[1px]" />
          </div>
          <div 
             ref={scrollContainerRef}
             onScroll={handleScroll}
             className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-5 gap-4 pb-2"
          >
            <CardItem styleType="white" name="Adam Benabdelhak" number="**6927" type="Physique" fullNumber="4000 1234 5678 6927" expiry="12/28" cvv="123" />
            <CardItem styleType="dark" name="Éphémère" number="**1234" type="Virtuelle" fullNumber="4111 0000 1111 1234" expiry="05/26" cvv="000" />
            <CardItem styleType="premium" name="Premium" number="**9999" type="Originale" fullNumber="4242 4242 4242 9999" expiry="09/29" cvv="420" />
          </div>
          {/* Card Pagination Dots */}
          <div className="flex justify-center gap-1.5 mt-2">
            {[0, 1, 2].map((dot) => (
               <div key={dot} className={`w-[6px] h-[6px] rounded-full transition-colors duration-300 ${dot === activeCardData ? 'bg-white' : 'bg-white/20'}`}></div>
            ))}
          </div>
        </div>

        {/* Patrimoine Total Center */}
        <div className="px-4 text-center mt-2 mb-6">
          <div className="flex items-center justify-center text-[#94a3b8] font-semibold text-[13px] mb-1 cursor-pointer">
            Patrimoine total <ChevronRight size={14} className="ml-0.5 relative top-[1px]" />
          </div>
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-bold tracking-tight text-white whitespace-nowrap">
              {formatMoneyParts(totalMAD).integerPart}
            </span>
            <span className="text-2xl font-medium text-white/60 ml-0.5">{formatMoneyParts(totalMAD).decimalPart} <span className="ml-1">MAD</span></span>
          </div>
        </div>

        {/* Patrimoine List rows */}
        <div className="px-4">
          <motion.div 
             initial="hidden"
             animate="visible"
             variants={{
               hidden: { opacity: 0 },
               visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
             }}
             className="bg-[#1c2b43] rounded-[24px] p-2 border border-white/5 flex flex-col shadow-lg"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <PatrimoineRow 
                icon={<Coins size={20} className="text-[#3b82f6]" />} 
                iconBg="bg-[#3b82f6]/10"
                label="Espèces" 
                subValue={`${formatMoney(totalMAD)} MAD`} 
              />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <PatrimoineRow 
                icon={<HandCoins size={20} className="text-[#eab308]" />} 
                iconBg="bg-[#eab308]/10"
                label="Prêt" 
                subValue="Obtenez un prêt allant jusqu'à..." 
              />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <PatrimoineRow 
                icon={<BarChart3 size={20} className="text-[#3b82f6]" />} 
                iconBg="bg-[#3b82f6]/10"
                label="Investir" 
                subValue="Investir dès 1 MAD" 
              />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <PatrimoineRow 
                icon={<Bitcoin size={20} className="text-[#a855f7]" />} 
                iconBg="bg-[#a855f7]/10"
                label="Cryptos" 
                subValue="0,00 MAD" 
              />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <PatrimoineRow 
                icon={<LinkIcon size={20} className="text-[#06b6d4]" />} 
                iconBg="bg-[#06b6d4]/10"
                label="Lié(s)" 
                subValue="Liez des comptes externes" 
                isLast
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function PatrimoineRow({ icon, iconBg, label, subValue, isLast }: any) {
  return (
    <div className={`flex items-center justify-between p-3 border-b border-white/5 ${isLast ? 'border-0' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <div className="flex flex-col">
           <span className="text-[15px] font-semibold text-white tracking-wide">{label}</span>
           <span className="text-[13px] text-[#94a3b8]">{subValue}</span>
        </div>
      </div>
    </div>
  );
}

function CardItem({ styleType, name, number, type, fullNumber, expiry, cvv }: any) {
  const [isFlipped, setIsFlipped] = useState(false);

  let bgClass = '';
  let textClass = 'text-white';
  
  if (styleType === 'white') { 
    bgClass = 'bg-[#f8f9fa] shadow-sm text-black border-[3px] border-[#e2e8f0]'; 
    textClass = 'text-black'; 
  } else if (styleType === 'dark') { 
    bgClass = 'bg-[#18233A] border border-[#a5b9fc]/20 text-white'; 
  } else if (styleType === 'premium') { 
    bgClass = 'bg-gradient-to-br from-[#8A2387] via-[#E94057] to-[#F27121] text-white shadow-lg shadow-[#8A2387]/20 border border-white/10'; 
  }

  return (
    <div 
      className="shrink-0 w-full sm:w-[280px] h-[170px] snap-center cursor-pointer group"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className="relative w-full h-full transition-transform duration-500 ease-in-out"
        style={{ 
          transformStyle: 'preserve-3d', 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
        }}
      >
        {/* Front Face */}
        <div 
          className={`absolute inset-0 rounded-[24px] p-5 flex flex-col justify-between overflow-hidden ${bgClass} ${textClass}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex justify-between items-start z-10 relative">
            <div className="font-extrabold tracking-widest text-[14px] italic opacity-90">MOBEN</div>
            <span className="text-[11px] uppercase font-bold px-2 py-0.5 bg-black/10 rounded-[8px] backdrop-blur-md border border-white/10">{type}</span>
          </div>
          <div className="flex flex-col z-10 relative">
            <div className="font-mono tracking-[0.2em] text-[16px] opacity-80 mb-2">{number}</div>
            <div className="flex justify-between items-end">
              <span className="text-[14px] font-semibold truncate pr-2 opacity-90">{name}</span>
              <div className="italic font-bold text-[20px] opacity-90">VISA</div>
            </div>
          </div>
          {styleType === 'premium' && (
             <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] bg-white/10 rounded-full blur-[30px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          )}
        </div>

        {/* Back Face */}
        <div 
          className={`absolute inset-0 rounded-[24px] p-5 flex flex-col justify-between overflow-hidden ${bgClass} ${textClass}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Magnetic Stripe */}
          <div className="w-full h-10 bg-black/30 absolute top-6 left-0"></div>
          
          <div className="pt-12 flex flex-col gap-2 relative z-10 mt-1">
            <div className="flex items-center justify-end bg-white/20 px-3 py-1 rounded text-right">
               <span className="text-[10px] uppercase font-bold mr-2 opacity-70">CVV</span>
               <span className="font-mono text-[13px]">{cvv}</span>
            </div>
            <div className="flex flex-col mt-0.5">
               <span className="font-mono text-[15px] opacity-90 tracking-widest">{fullNumber}</span>
               <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] uppercase opacity-70">Exp</span>
                  <span className="font-mono text-[12px] opacity-90">{expiry}</span>
               </div>
            </div>
          </div>
          {styleType === 'premium' && (
             <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] bg-white/10 rounded-full blur-[30px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          )}
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
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="absolute inset-0 flex flex-col h-full bg-[#051025] z-40"
    >
      <div className="flex items-center px-4 pt-4 pb-4">
        <button onClick={() => setCurrentView('dashboard')} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <div className="flex-1 text-center pr-10">
          <h2 className="text-[16px] font-semibold text-white leading-tight">Ajouter de l'argent</h2>
          <p className="text-[12px] text-white/50 font-medium mt-0.5">Solde : {formatMoney(currentBalance)} {activeAccount}</p>
        </div>
      </div>

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
          <span className="text-[32px] font-semibold text-white/70 ml-2 relative shrink-0">
            <span className="text-[32px] font-semibold text-white/70">{activeAccount}</span>
          </span>
        </div>
        
        <button className="mt-8 flex items-center gap-2 bg-[#1c2b43] hover:bg-[#2a3c5a] border border-white/10 rounded-full px-5 py-2.5 transition">
          <div className="bg-white text-black rounded px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-0.5">
            <svg viewBox="0 0 384 512" className="w-[10px] h-[10px]" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 47.1-.8 81.2-82.6 81.2-82.6-43.1-15.6-59.8-59.5-59.8-105.7M249.4 72.3c4.6-21.2-12.8-50.5-38.3-64.3-11.4 34.3-43.2 59-67.6 59-4 22.8 13.9 50 39.8 63 11-34.5 45.4-56.1 66.1-57.7"/></svg>
            Pay
          </div>
          <span className="text-[13px] font-semibold text-white">Apple Pay · {activeAccount}</span>
          <ArrowDown size={14} className="text-white/50 ml-1" />
        </button>
      </div>

      <div className="px-5 pb-10 pt-4">
        <p className="text-center text-[12px] text-white/50 font-medium mb-4">Arrivée · Généralement instantanée</p>
        <button 
          onClick={handleConfirm}
          className="w-full bg-white hover:bg-gray-100 transition text-black h-14 rounded-[24px] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
        >
          <span className="font-bold text-[16px]">Confirmer le dépôt</span>
        </button>
      </div>
    </motion.div>
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
  
  const targetAmount = source === 'EUR' ? amount * EXCHANGE_RATE : amount / EXCHANGE_RATE;

  const handleFlip = () => {
    setSource(target);
    setAmountStr(''); 
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
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="absolute inset-0 flex flex-col h-full bg-[#051025] z-40"
    >
      <div className="flex items-center px-4 pt-4 pb-2">
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
          
          <div 
             onClick={handleFlip}
             className="absolute top-1/2 left-6 -translate-y-1/2 w-10 h-10 rounded-full bg-[#3b82f6] border-[4px] border-[#0A1530] flex items-center justify-center z-10 shadow-[0_4px_12px_rgba(59,130,246,0.3)] cursor-pointer hover:scale-105 transition"
          >
            <ArrowDown size={18} className="text-white" />
          </div>

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

        <div className="mt-4 bg-[#1c2b43] rounded-[16px] h-[52px] flex items-center px-4 border border-white/5">
          <input
            type="text"
            placeholder="Ajouter une note"
            className="bg-transparent border-none outline-none w-full text-[14px] font-medium text-white placeholder-[#94a3b8]"
          />
        </div>
      </div>

      <div className="mt-auto px-4 pb-10 flex items-center gap-3">
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
    </motion.div>
  );
}

/* ========================================================================== */
/* SCREEN 4: BANK DETAILS                                                     */
/* ========================================================================== */
function BankDetails({ setCurrentView, activeAccount }: any) {
  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="absolute inset-0 flex flex-col h-full bg-[#051025] z-40"
    >
      <div className="flex flex-col px-4 pt-4 pb-4 bg-[#0A1530]">
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
        <div className="bg-[#1c2b43] rounded-[24px] p-5 border border-white/5 flex flex-col gap-6 mt-4">
          <InfoRow label="Bénéficiaire" value="Adam Benabdelhak" />
          <InfoRow label="IBAN" value={activeAccount === 'EUR' ? "FR76 1234 5678 9012 3456 7890 123" : "MA03 0000 0000 0000 0000 0000 000"} />
          <InfoRow label="BIC" value={activeAccount === 'EUR' ? "REVOFRXX" : "MOBEMAMX"} />
          <InfoRow label="Adresse de la banque" value="Revolut Bank UAB, Succursale Française, 12 rue de la Paix, 75002 Paris" />
        </div>

        <button className="w-full mt-4 bg-transparent border-[1.5px] border-white/20 hover:bg-white/5 transition text-white font-semibold py-3.5 rounded-[24px] text-[14px] flex items-center justify-center gap-2">
          <Share size={18} className="text-white" />
          Partager les informations
        </button>

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
    </motion.div>
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
