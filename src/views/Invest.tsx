import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Globe, ChevronRight, BarChart3, TrendingUp, TrendingDown, 
  Briefcase, FileText, Activity, PieChart, ArrowUpRight, ArrowDownRight, Newspaper
} from 'lucide-react';
import { ALL_ASSETS } from './InvestFlow';

const springTransition = { type: "spring", stiffness: 400, damping: 25 };

const initialStocks = [
  { id: 'nvda', symbol: 'NVDA', bg: 'bg-[#76b900] text-white', short: 'NV' },
  { id: 'aapl', symbol: 'AAPL', bg: 'bg-white text-black', short: '' },
  { id: 'nflx', symbol: 'NFLX', bg: 'bg-[#E50914] text-white', short: 'N' },
  { id: 'rhm', symbol: 'RHM', bg: 'bg-[#0033A0] text-white', short: 'RH' },
  { id: 'tsla', symbol: 'TSLA', bg: 'bg-[#e2231a] text-white', short: 'T' },
  { id: 'amzn', symbol: 'AMZN', bg: 'bg-[#131921] text-[#FF9900]', short: 'a' }
];

export function Invest({ setCurrentView, marketState, newsFeed, investments }: any) {
  const stockList = initialStocks.map(s => {
    const livePrice = (marketState.prices as any)[s.id] || 0;
    const dailyOpen = (marketState.dailyOpens as any)[s.id] || livePrice;
    const pct = ((livePrice - dailyOpen) / dailyOpen) * 100;
    return { ...s, price: livePrice, pct };
  });

  const investmentList = Object.entries(investments || {}).map(([id, data]: any) => {
    const asset = ALL_ASSETS.find(a => a.id === id);
    const livePrice = (marketState.prices as any)[id] || asset?.price || 0;
    const dailyOpen = (marketState.dailyOpens as any)[id] || livePrice;
    const profit = ((livePrice - dailyOpen) / dailyOpen) * 100;
    const value = (data.quantity * livePrice).toFixed(2);
    
    return {
      symbol: asset?.icon || '?',
      name: asset?.name || 'Inconnu',
      shares: data.quantity.toFixed(4),
      value: value,
      profit: profit.toFixed(2),
      isPos: profit >= 0
    };
  });

  const products = [
    { name: "Actions", icon: <TrendingUp size={20} className="text-white"/>, color: "bg-[#3b82f6]" },
    { name: "ETF", icon: <PieChart size={20} className="text-white"/>, color: "bg-[#eab308]" },
    { name: "Obligations", icon: <FileText size={20} className="text-white"/>, color: "bg-[#8b5cf6]" },
    { name: "Robo-Advisor", icon: <Activity size={20} className="text-white"/>, color: "bg-[#0ea5e9]" },
    { name: "CFD", icon: <Briefcase size={20} className="text-white"/>, color: "bg-[#f43f5e]" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col w-full min-h-full bg-transparent overflow-y-auto scrollbar-hide pb-32"
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-4 pt-2 pb-2 mt-2">
         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-[11px] text-white shadow-sm shrink-0">AB</div>
         <div className="flex-1 mx-3 bg-[#1c2b43] h-9 rounded-full flex items-center px-3 border border-white/5">
            <Search size={14} className="text-white/50" />
            <input type="text" placeholder="Rechercher actions, ETF..." className="bg-transparent text-[13px] ml-2 outline-none text-white w-full placeholder-white/30" />
         </div>
         <div className="flex gap-2 shrink-0">
             <div className="w-9 h-9 rounded-full bg-[#1c2b43] border border-white/5 flex items-center justify-center cursor-pointer hover:bg-[#2a3c5a] transition relative overflow-hidden">
                <BarChart3 size={16} className="text-white relative z-10" />
             </div>
             <div className="w-9 h-9 rounded-full bg-[#1c2b43] border border-white/5 flex items-center justify-center cursor-pointer hover:bg-[#2a3c5a] transition">
                <Globe size={16} className="text-white" />
             </div>
         </div>
      </div>

      {/* Hero Section */}
      <div className="px-4 mt-4">
        <h1 className="text-[28px] font-bold text-white mb-1.5 leading-tight tracking-tight shadow-blue-500/20">Développez votre<br/>patrimoine</h1>
        <p className="text-[13px] text-[#94a3b8] mb-5 font-medium">Investissez dès aujourd'hui, dès 1 MAD</p>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          transition={springTransition}
          onClick={() => setCurrentView('invest_flow')}
          className="w-full bg-[#3b82f6] hover:bg-blue-600 border border-white/10 text-white font-bold rounded-[24px] h-[52px] text-[15px] transition shadow-[0_10px_20px_rgba(59,130,246,0.25)]"
        >
          Investir Maintenant
        </motion.button>
      </div>

      {/* NOUVELLE SECTION : MES ACTIONS */}
      {investmentList.length > 0 && (
        <div className="px-4 mt-8">
          <h2 className="text-[17px] font-bold text-white mb-4">Mes Actions</h2>
          <div className="space-y-3">
            {investmentList.map((inv, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1c2b43] p-4 rounded-[24px] border border-white/5 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-[14px]">
                    {inv.symbol}
                  </div>
                  <div>
                    <p className="text-white font-bold text-[15px]">{inv.name}</p>
                    <p className="text-white/40 text-[12px]">{inv.shares} actions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-[15px]">{inv.value} MAD</p>
                  <p className={`${inv.isPos ? 'text-green-400' : 'text-red-400'} text-[12px] font-bold`}>
                    {inv.isPos ? '+' : ''}{inv.profit}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Assets (Stock Tracking) */}
      <div className="mt-8 px-4">
        <h2 className="text-[14px] font-semibold text-white mb-4 uppercase tracking-widest opacity-60">Les plus populaires</h2>
        <motion.div className="grid grid-cols-3 gap-y-5 gap-x-3">
           {stockList.map((stock) => {
             const isPos = stock.pct >= 0;
             return (
               <motion.div 
                 key={stock.symbol} 
                 whileTap={{ scale: 0.92 }}
                 className="flex flex-col items-center cursor-pointer group"
               >
                  <div className={`w-[56px] h-[56px] rounded-[18px] flex items-center justify-center text-[18px] font-bold mb-2 shadow-lg border border-white/10 transition-transform group-hover:scale-105 ${stock.bg}`}>
                     {stock.short}
                  </div>
                  <span className="text-white font-bold text-[13px] mb-0 tracking-tight">{stock.symbol}</span>
                  <div className={`flex items-center gap-0.5 text-[11px] font-black ${isPos ? 'text-green-400' : 'text-red-400'}`}>
                    {isPos ? <ArrowUpRight size={10} strokeWidth={3}/> : <ArrowDownRight size={10} strokeWidth={3}/>}
                    {Math.abs(stock.pct).toFixed(2)}%
                  </div>
               </motion.div>
             )
           })}
        </motion.div>
      </div>

      {/* Actifs les plus volatils */}
      <div className="mt-10 px-4">
         <div className="flex justify-between items-center mb-3">
             <h2 className="text-[15px] font-semibold text-[#94a3b8] uppercase tracking-wider">Actifs Volatils</h2>
             <ChevronRight size={16} className="text-white/30 cursor-pointer"/>
         </div>
         <div className="flex flex-col bg-[#1c2b43] rounded-[24px] border border-white/5 p-2 shadow-xl">
            <VolatilityRow symbol="CMPS" name="COMPASS Pathways" price="12.34" pct={52.55} iconText="C" color="bg-indigo-500" />
            <VolatilityRow symbol="CAR" name="Avis Budget Group" price="145.22" pct={15.20} iconText="A" color="bg-red-500" />
            <VolatilityRow symbol="INV" name="Investec" price="4.50" pct={12.44} iconText="I" color="bg-zinc-700" isLast={true} />
         </div>
      </div>

      {/* Actualités */}
      <div className="mt-10 px-4 mb-4">
         <div className="flex justify-between items-center mb-5 cursor-pointer" onClick={() => setCurrentView('news_feed')}>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <h2 className="text-[14px] font-black text-white tracking-widest uppercase">Bloomberg Intelligence</h2>
             </div>
             <span className="text-[11px] text-[#3b82f6] font-bold tracking-tight bg-blue-500/10 px-3 py-1 rounded-full">EN DIRECT</span>
         </div>
         <div className="flex flex-col gap-4">
             <AnimatePresence mode="popLayout">
               {newsFeed.slice(0, 3).map((n: any) => (
                 <NewsCard 
                   key={n.id}
                   ticker={n.ticker} 
                   pct={((Math.random() * 4) - 2).toFixed(2)} 
                   title={n.title} 
                   time="À L'INSTANT"
                 />
               ))}
             </AnimatePresence>
         </div>
      </div>
    </motion.div>
  );
}

function VolatilityRow({ symbol, name, price, pct, iconText, color, isLast }: any) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className={`flex items-center justify-between py-4 px-3 ${!isLast ? 'border-b border-white/5' : ''} cursor-pointer group`}
    >
      <div className="flex items-center gap-3">
         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-[15px] shadow-lg transition-transform group-hover:scale-105 ${color}`}>
           {iconText}
         </div>
         <div className="flex flex-col">
            <span className="text-[14px] font-bold text-white tracking-wide">{symbol}</span>
            <span className="text-[11px] text-[#94a3b8] font-medium">{name}</span>
         </div>
      </div>
      <div className="flex flex-col items-end">
         <span className="text-[14px] font-bold text-white tracking-tight">{price} MAD</span>
         <span className="text-[11px] font-black text-green-400">+{pct.toFixed(2)}%</span>
      </div>
    </motion.div>
  );
}

function NewsCard({ ticker, pct, title, time }: any) {
  const numericPct = parseFloat(pct);
  const isPos = numericPct >= 0;
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileTap={{ scale: 0.98 }}
      className="bg-[#1c2b43] rounded-[24px] p-5 flex flex-col gap-3 cursor-pointer border border-white/5 shadow-md group relative overflow-hidden"
    >
       <div className="flex justify-between items-start z-10">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-[#94a3b8] tracking-[0.15em] uppercase opacity-70">BLOOMBERG TERMINAL</span>
            <div className={`text-[10px] font-bold inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] w-fit ${isPos ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                {ticker} {isPos ? '+' : ''}{numericPct.toFixed(2)}%
            </div>
          </div>
          <span className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-tight opacity-50">{time}</span>
       </div>
       <h3 className="text-[14px] font-bold text-white leading-[1.4] line-clamp-2 group-hover:text-[#3b82f6] transition-colors z-10 pr-2">
         {title}
       </h3>
       <div className="absolute top-0 right-0 w-[120px] h-full bg-gradient-to-l from-[#3b82f6]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  );
}
