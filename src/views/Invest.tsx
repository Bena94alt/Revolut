import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Globe, ChevronRight, BarChart3, Newspaper, 
  TrendingUp, TrendingDown, Briefcase, FileText, Activity, PieChart,
  ArrowUpRight, ArrowDownRight, Users
} from 'lucide-react';

const springTransition = { type: "spring", stiffness: 400, damping: 25 };

const initialStocks = [
  { id: 'nvda', symbol: 'NVDA', bg: 'bg-[#76b900] text-white', short: 'NV' },
  { id: 'aapl', symbol: 'AAPL', bg: 'bg-white text-black', short: '' },
  { id: 'nflx', symbol: 'NFLX', bg: 'bg-[#E50914] text-white', short: 'N' },
  { id: 'rhm', symbol: 'RHM', bg: 'bg-[#0033A0] text-white', short: 'RH' },
  { id: 'tsla', symbol: 'TSLA', bg: 'bg-[#e2231a] text-white', short: 'T' },
  { id: 'amzn', symbol: 'AMZN', bg: 'bg-[#131921] text-[#FF9900]', short: 'a' }
];

const BLOOMBERG_HEADLINES = [
  "La Fed maintient ses taux, les marchés Tech réagissent positivement.",
  "NVIDIA dépasse les prévisions de croissance au T1, l'action grimpe.",
  "Le Brent se stabilise après l'annonce de l'OPEP+.",
  "Les investisseurs se tournent vers l'Or face à l'incertitude globale.",
  "Amazon annonce un investissement record dans ses centres de données IA.",
  "Tesla : Elon Musk annonce une nouvelle architecture logicielle pour le FSD.",
  "Bourse : Les marchés asiatiques clôturent en hausse après les PMI.",
  "Google : Alphabet teste de nouveaux modèles de monétisation pour YouTube.",
  "Microsoft dépasse les attentes de revenus grâce au Cloud Azure.",
  "Meta : Zuckerberg mise sur les lunettes connectées AR pour 2025.",
  "Netflix : Croissance record du nombre d'abonnés grâce au partage de compte payant.",
  "Rheinmetall : Les commandes d'armement atteignent un niveau historique en Europe.",
  "Pétrole : Les tensions au Moyen-Orient poussent le baril au-dessus de 85$.",
  "Or : Nouveau sommet historique atteint face à la faiblesse du dollar."
];

const TICKERS = ["NVDA", "AAPL", "AMZN", "TSLA", "NFLX", "MSFT", "META", "GOOGL", "BRENT", "GOLD", "RHM"];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function Invest({ setCurrentView }: any) {
  const [stocks, setStocks] = useState(initialStocks.map(s => ({ ...s, pct: (Math.random() * 5 - 1) })));
  const [activeNews, setActiveNews] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const refreshBloombergNews = () => {
    setIsUpdating(true);
    
    // Pick 5-7 random headlines
    const count = getRandomInt(5, 7);
    const shuffled = [...BLOOMBERG_HEADLINES].sort(() => 0.5 - Math.random());
    const selectedHeadlines = shuffled.slice(0, count);
    
    const newNews = selectedHeadlines.map((headline, index) => {
      // Random ticker from the pool
      const ticker = TICKERS[getRandomInt(0, TICKERS.length - 1)];
      // Random percentage
      const pct = (Math.random() * 8 - 4).toFixed(2);
      
      // Relative timestamps
      let timeText = "À l'instant";
      if (index === 1) timeText = "il y a 5 min";
      if (index === 2) timeText = "il y a 12 min";
      if (index === 3) timeText = "il y a 20 min";
      if (index > 3) timeText = `il y a ${index * 8} min`;

      return {
        id: Math.random(),
        title: headline,
        ticker,
        pct,
        time: timeText,
      };
    });

    setActiveNews(newNews);
    
    // Visual feedback duration
    setTimeout(() => setIsUpdating(false), 2000);
  };

  useEffect(() => {
    // Initial load
    refreshBloombergNews();

    // Refresh every 20 minutes (1200000 ms)
    const newsInterval = setInterval(() => {
      refreshBloombergNews();
    }, 1200000);

    const stockInterval = setInterval(() => {
      setStocks(prev => prev.map(s => {
        const diff = (Math.random() * 0.1 - 0.05);
        return { ...s, pct: s.pct + diff };
      }));
    }, 2000);

    return () => {
      clearInterval(newsInterval);
      clearInterval(stockInterval);
    };
  }, []);

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
      className="flex flex-col w-full min-h-full bg-transparent"
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
        <h1 className="text-[28px] font-bold text-white mb-1.5 leading-tight tracking-tight">Développez votre<br/>patrimoine</h1>
        <p className="text-[13px] text-[#94a3b8] mb-5 font-medium">Investissez dès aujourd'hui, dès 1 MAD</p>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          transition={springTransition}
          onClick={() => setCurrentView('invest_flow')}
          className="w-full bg-[#2a3c5a] hover:bg-[#324564] border border-white/10 text-white font-semibold rounded-[24px] h-[52px] text-[14px] transition shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
        >
          Investir
        </motion.button>
      </div>

      {/* Popular Assets (Stock Tracking) */}
      <div className="mt-8 px-4">
        <h2 className="text-[14px] font-semibold text-white mb-4">Les premiers achats les plus populaires</h2>
        <div className="flex gap-3 mb-5">
           <button className="bg-white text-black px-5 py-1.5 rounded-[20px] text-[13px] font-bold active:scale-95 transition shadow-sm">Actions</button>
           <button className="bg-[#1c2b43] text-white/70 px-5 py-1.5 rounded-[20px] text-[13px] font-semibold active:scale-95 transition hover:bg-[#2a3c5a]">ETF</button>
        </div>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-y-5 gap-x-3"
        >
           {stocks.map((stock, i) => {
             const isPos = stock.pct >= 0;
             return (
               <motion.div 
                 key={stock.symbol} 
                 variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                 whileTap={{ scale: 0.92 }}
                 transition={springTransition}
                 className="flex flex-col items-center cursor-pointer group"
               >
                  <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center text-[18px] font-bold mb-2 shadow-lg border border-white/10 transition-transform group-hover:scale-105 ${stock.bg}`}>
                     {stock.short}
                  </div>
                  <span className="text-white font-semibold text-[13px] mb-0 tracking-wide">{stock.symbol}</span>
                  <motion.div 
                    key={stock.pct}
                    initial={{ color: isPos ? "#4ade80" : "#f87171" }}
                    animate={{ color: isPos ? "#4ade80" : "#f87171" }}
                    transition={{ duration: 0.5 }}
                    className={`flex items-center gap-0.5 text-[11px] font-semibold ${isPos ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {isPos ? <ArrowUpRight size={10} strokeWidth={3}/> : <ArrowDownRight size={10} strokeWidth={3}/>}
                    {Math.abs(stock.pct).toFixed(2)}%
                  </motion.div>
               </motion.div>
             )
           })}
        </motion.div>
      </div>

      {/* Produits */}
      <div className="mt-8 px-4">
         <h2 className="text-[15px] font-semibold text-[#94a3b8] mb-3">Produits</h2>
         <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
            {products.map(prod => (
              <motion.div 
                key={prod.name}
                whileTap={{ scale: 0.95 }}
                transition={springTransition}
                className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group"
              >
                 <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-lg border border-white/10 transition-transform group-hover:scale-105 ${prod.color}`}>
                   {prod.icon}
                 </div>
                 <span className="text-[11px] font-medium text-white/80">{prod.name}</span>
              </motion.div>
            ))}
         </div>
      </div>

      {/* Actifs les plus volatils */}
      <div className="mt-8 px-4">
         <div className="flex justify-between items-center mb-3">
             <h2 className="text-[15px] font-semibold text-[#94a3b8]">Actifs les plus volatils</h2>
             <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center cursor-pointer">
               <ChevronRight size={14} className="text-white/50"/>
             </div>
         </div>
         <div className="flex gap-3 mb-3">
            <button className="bg-[#1c2b43] text-white px-5 py-1.5 rounded-[20px] text-[13px] font-semibold border border-white/5">Hausses</button>
            <button className="text-white/50 px-5 py-1.5 rounded-[20px] text-[13px] font-semibold hover:bg-white/5 transition">Baisses</button>
         </div>
         <div className="flex flex-col">
            <VolatilityRow symbol="CMPS" name="COMPASS Pathways" price="12.34" pct={52.55} iconText="C" color="bg-indigo-500" />
            <VolatilityRow symbol="CAR" name="Avis Budget Group" price="145.22" pct={15.20} iconText="A" color="bg-red-500" />
            <VolatilityRow symbol="INV" name="Investec" price="4.50" pct={12.44} iconText="I" color="bg-zinc-700" />
         </div>
      </div>

      {/* Les plus échangés */}
      <div className="mt-8 px-4">
         <h2 className="text-[15px] font-semibold text-[#94a3b8] mb-3">Les plus échangées</h2>
         <div className="flex flex-col bg-[#1c2b43] rounded-[24px] border border-white/5 p-1 shadow-lg">
           <CommodityRow symbol="XAU:CFD" name="Or" price="2 345,60" pct={-0.12} buyPct={51} icon="🥇" isLast={false} />
           <CommodityRow symbol="BRENT:CFD" name="Pétrole brut brent" price="82,40" pct={1.05} buyPct={70} icon="🛢️" isLast={true} />
         </div>
      </div>

      {/* Actualités */}
      <div className="mt-8 px-4 mb-8">
         <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setCurrentView('news_feed')}>
             <h2 className="text-[17px] font-bold text-white tracking-tight">Actualités</h2>
             <span className="text-[13px] text-[#3b82f6] font-semibold pr-1 hover:text-blue-400 transition-colors">Tout afficher</span>
         </div>
         <div className="flex flex-col gap-4">
             <AnimatePresence mode="popLayout">
               {activeNews.map(n => (
                 <NewsCard 
                   key={n.id}
                   ticker={n.ticker} 
                   pct={n.pct} 
                   title={n.title} 
                   time={n.time}
                 />
               ))}
             </AnimatePresence>
         </div>
      </div>

      {/* Bottom spacing for nav bar */}
      <div className="h-[90px]"></div>
    </motion.div>
  );
}

function VolatilityRow({ symbol, name, price, pct, iconText, color }: any) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-between py-3 border-b border-white/5 cursor-pointer group"
    >
      <div className="flex items-center gap-3">
         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-[15px] shadow-sm transition-transform group-hover:scale-105 ${color}`}>
           {iconText}
         </div>
         <div className="flex flex-col">
            <span className="text-[14px] font-bold text-white tracking-wide leading-tight">{symbol}</span>
            <span className="text-[12px] text-[#94a3b8] font-medium">{name}</span>
         </div>
      </div>
      <div className="flex flex-col items-end">
         <span className="text-[14px] font-bold text-white leading-tight">{price} MAD</span>
         <span className="text-[12px] font-bold text-green-400">+{pct.toFixed(2)}%</span>
      </div>
    </motion.div>
  );
}

function CommodityRow({ symbol, name, price, pct, buyPct, icon, isLast }: any) {
  const isPos = pct >= 0;
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className={`flex flex-col py-3 px-3 ${isLast ? '' : 'border-b border-white/5'} cursor-pointer`}
    >
       <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
             <div className="w-[36px] h-[36px] rounded-full bg-white/5 flex items-center justify-center text-[18px]">
               {icon}
             </div>
             <div className="flex flex-col">
                <span className="text-[14px] font-bold text-white tracking-wide leading-tight">{symbol}</span>
                <span className="text-[12px] text-[#94a3b8] font-medium">{name}</span>
             </div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[14px] font-bold text-white leading-tight">${price}</span>
             <span className={`text-[12px] font-bold ${isPos ? 'text-green-400' : 'text-red-400'}`}>
               {isPos ? '+' : ''}{pct.toFixed(2)}%
             </span>
          </div>
       </div>
       <div className="flex flex-col gap-1.5 pl-[48px]">
          <div className="flex justify-between text-[10px] font-bold text-white/50 uppercase tracking-wider">
             <span>{buyPct}% Achats</span>
             <span>{100 - buyPct}% Ventes</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden flex shadow-inner">
             <div className="h-full bg-green-500 rounded-l-full" style={{ width: `${buyPct}%` }}></div>
             <div className="h-full bg-red-500 rounded-r-full" style={{ width: `${100 - buyPct}%` }}></div>
          </div>
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

       {/* Decorative subtle pulse logic gradient */}
       <div className="absolute top-0 right-0 w-[120px] h-full bg-gradient-to-l from-[#3b82f6]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  );
}
