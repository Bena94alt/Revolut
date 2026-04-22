import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, TrendingDown, ChevronRight, Search, 
  Info, ShieldCheck, Zap, CreditCard, GraduationCap, Sparkles, Globe
} from 'lucide-react';

const springTransition = { type: "spring", stiffness: 400, damping: 25 };

interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  logo: string;
  color: string;
}

const INITIAL_ASSETS: CryptoAsset[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 654231.42, change: 2.45, logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png', color: '#F7931A' },
  { id: 'hype', name: 'Hyperliquid', symbol: 'HYPE', price: 102.15, change: 12.84, logo: 'https://cdn.worldvectorlogo.com/logos/hypersonic-1.svg', color: '#6366f1' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', price: 1450.12, change: 5.12, logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png', color: '#14F195' },
  { id: 'eth', name: 'Ether', symbol: 'ETH', price: 34212.88, change: -1.24, logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png', color: '#627EEA' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', price: 10.12, change: 0.02, logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png', color: '#26A17B' },
  { id: 'bnb', name: 'BNB', symbol: 'BNB', price: 6214.55, change: 0.85, logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png', color: '#F3BA2F' }
];

const MOCK_TOP_POOL = [
  { symbol: 'MDT', change: 42.15, logo: 'https://assets.coingecko.com/coins/images/2237/small/MDT.png', name: 'Measurable Data' },
  { symbol: 'ABT', change: 35.82, logo: 'https://assets.coingecko.com/coins/images/2816/small/arcblock_logo.png', name: 'Arcblock' },
  { symbol: 'TRU', change: 28.44, logo: 'https://assets.coingecko.com/coins/images/13180/small/truefi-logo.png', name: 'TrueFi' },
  { symbol: 'UMA', change: 22.12, logo: 'https://assets.coingecko.com/coins/images/10951/small/UMA.png', name: 'UMA' },
  { symbol: 'WAXL', change: 18.95, logo: 'https://assets.coingecko.com/coins/images/23382/small/axelar.png', name: 'Axelar' },
  { symbol: 'LUNA', change: -15.42, logo: 'https://assets.coingecko.com/coins/images/8284/small/luna1.png', name: 'Terra' },
  { symbol: 'USTC', change: -12.18, logo: 'https://assets.coingecko.com/coins/images/11674/small/UST.png', name: 'TerraClassicUSD' },
  { symbol: 'F3', change: -10.55, logo: 'https://assets.coingecko.com/coins/images/31333/small/friendtech.png', name: 'Friend.tech' },
  { symbol: 'STRK', change: -8.42, logo: 'https://assets.coingecko.com/coins/images/31343/small/strk.png', name: 'Starknet' },
  { symbol: 'ARB', change: -7.12, logo: 'https://assets.coingecko.com/coins/images/16547/small/arbitrum.png', name: 'Arbitrum' }
];

export function Cryptos({ setCurrentView, marketState }: any) {
  const [activeTab, setActiveTab] = useState<'winners' | 'losers'>('winners');
  const [fiscalFlow, setFiscalFlow] = useState<'none' | 'question' | 'non_resident' | 'nif' | 'error'>('none');
  const [nifValue, setNifValue] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  
  const startNego = () => setFiscalFlow('question');
  const resetFiscal = () => {
    if (fiscalFlow === 'error') {
      setCurrentView('dashboard');
    }
    setFiscalFlow('none');
    setNifValue('');
    setIsValidating(false);
  };

  const handleValidateNif = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setFiscalFlow('error');
    }, 1200);
  };
  
  // Real-time assets derived from global marketState
  const assets: CryptoAsset[] = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: marketState.prices.btc, logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png', color: '#F7931A', change: 0 },
    { id: 'hype', name: 'Hyperliquid', symbol: 'HYPE', price: marketState.prices.hype, logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/hype.png', color: '#00D1FF', change: 0 },
    { id: 'sol', name: 'Solana', symbol: 'SOL', price: marketState.prices.sol, logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png', color: '#14F195', change: 0 },
    { id: 'eth', name: 'Ether', symbol: 'ETH', price: marketState.prices.eth, logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png', color: '#627EEA', change: 0 },
    { id: 'usdt', name: 'Tether', symbol: 'USDT', price: marketState.prices.usdt, logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png', color: '#26A17B', change: 0 },
    { id: 'bnb', name: 'BNB', symbol: 'BNB', price: marketState.prices.bnb, logo: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png', color: '#F3BA2F', change: 0 }
  ].map(a => {
    const livePrice = (marketState.prices as any)[a.id];
    const dailyOpen = (marketState.dailyOpens as any)[a.id] || livePrice;
    const change = ((livePrice - dailyOpen) / dailyOpen) * 100;
    return { ...a, price: livePrice, change };
  });

  const topPool = MOCK_TOP_POOL.map(m => ({
    ...m,
    change: m.change + (Math.random() * 0.2 - 0.1) // Slight drift for pool items
  }));

  const formatPrice = (val: number) => {
    const parts = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).formatToParts(val);

    const integer = parts
      .filter((p) => p.type === "integer" || p.type === "group" || p.type === "literal")
      .map((p) => p.value)
      .join("");
    const decimal = parts
      .filter((p) => ["decimal", "fraction"].includes(p.type))
      .map((p) => p.value)
      .join("");
    return { integer, decimal: decimal.replace(',', '') };
  };

  const winners = [...topPool].sort((a, b) => b.change - a.change).slice(0, 5);
  const losers = [...topPool].sort((a, b) => a.change - b.change).slice(0, 5);

  const renderHypeLogo = (size: number = 32) => (
    <div className="relative rounded-full overflow-hidden" style={{ width: size, height: size, background: 'linear-gradient(135deg, #00D1FF 0%, #0075FF 100%)' }}>
       <div className="absolute inset-0 flex items-center justify-center text-white font-black italic text-[14px]">H</div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col w-full min-h-full pb-32"
    >
      {/* Hero Section */}
      <div className="relative pt-6 pb-10 px-4 mt-2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-[#050A1A] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
             <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-[11px] text-white shadow-sm">AB</div>
             <div className="flex gap-2">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center cursor-pointer">
                   <Search size={16} className="text-white" />
                </div>
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center cursor-pointer">
                   <Info size={16} className="text-white" />
                </div>
             </div>
          </div>

          <h1 className="text-[28px] font-bold text-white mb-2 leading-tight tracking-tight">Lancez-vous dans les cryptos</h1>
          <p className="text-[14px] text-white/70 mb-6 leading-relaxed">Faites du trading dès 0 % de frais, selon votre abonnement.</p>
          
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={startNego}
            className="px-6 py-3 bg-[#3b82f6] hover:bg-blue-600 transition text-white rounded-[24px] text-[15px] font-bold border border-white/10 shadow-lg shadow-blue-500/20"
          >
            Commencer à négocier
          </motion.button>
        </div>
      </div>

      {/* Two Big Cards: BTC & HYPE */}
      <div className="px-4 grid grid-cols-2 gap-3 -mt-2 mb-8">
        {[assets[0], assets[1]].map((asset) => {
          const priceParts = formatPrice(asset.price);
          const isPos = asset.change >= 0;
          return (
            <motion.div 
              key={asset.id}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1c2b43] rounded-[24px] p-4 border border-white/5 shadow-xl flex flex-col gap-3 group"
            >
              <div className="flex justify-between items-center">
                {asset.id === 'hype' ? renderHypeLogo(32) : <img src={asset.logo} alt={asset.symbol} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />}
                <div className={`flex items-center gap-0.5 text-[11px] font-black ${isPos ? 'text-green-400' : 'text-red-400'}`}>
                  {isPos ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                  {Math.abs(asset.change).toFixed(2)}%
                </div>
              </div>
              <div>
                <h3 className="text-white font-black text-[14px] mb-1 tracking-tight">{asset.symbol}</h3>
                <div className="flex items-baseline overflow-hidden">
                  <span className="text-[18px] font-black text-white tracking-tighter truncate">{priceParts.integer}</span>
                  <span className="text-[10px] font-bold text-white/50 ml-0.5">,{priceParts.decimal}</span>
                </div>
              </div>
              <div className="h-6 w-full flex items-end gap-[2px] mt-1 pr-2 opacity-60">
                 {Array.from({ length: 12 }).map((_, i) => (
                   <div 
                    key={i} 
                    className={`flex-1 rounded-full transition-all duration-1000 ${isPos ? 'bg-green-400' : 'bg-red-400'}`}
                    style={{ height: `${20 + Math.random() * 80}%` }}
                   ></div>
                 ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Volatiles Section */}
      <div className="px-4 mb-10">
        <div className="flex justify-between items-center mb-5">
           <h2 className="text-[17px] font-bold text-white tracking-tight">Les plus volatiles &gt;</h2>
        </div>

        <div className="bg-[#1c2b43] p-1 rounded-full flex mb-6 border border-white/5 w-fit mx-auto">
           <button 
             onClick={() => setActiveTab('winners')}
             className={`px-6 py-2 rounded-full text-[13px] font-bold transition-all ${activeTab === 'winners' ? 'bg-[#2a3c5a] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
           >
             Les plus performants
           </button>
           <button 
             onClick={() => setActiveTab('losers')}
             className={`px-6 py-2 rounded-full text-[13px] font-bold transition-all ${activeTab === 'losers' ? 'bg-[#2a3c5a] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
           >
             Les moins performants
           </button>
        </div>

        <div className="flex justify-between items-center px-1">
           <AnimatePresence mode="wait">
             <motion.div 
               key={activeTab}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
               className="flex justify-between w-full"
             >
                {(activeTab === 'winners' ? winners : losers).map((v, idx) => {
                  const colors = [
                    'bg-[#4c1d95]', // Deep Purple
                    'bg-[#1e1b4b]', // Navy
                    'bg-[#0d9488]', // Teal
                    'bg-[#334155]', // Slate
                    'bg-[#4338ca]', // Indigo
                  ];
                  const bgColor = colors[idx % colors.length];
                  
                  return (
                    <div key={v.symbol} className="flex flex-col items-center gap-1.5 group cursor-pointer w-[60px]">
                       <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 border border-white/10`}>
                          <span className="text-white font-bold text-[15px] leading-none">{v.symbol.charAt(0)}</span>
                       </div>
                       <div className="flex flex-col items-center">
                          <span className="text-white font-bold text-[12px] tracking-tight">{v.symbol}</span>
                          <span className={`text-[10px] font-black ${v.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                             {v.change >= 0 ? '+' : ''}{v.change.toFixed(2)}%
                          </span>
                       </div>
                    </div>
                  );
                })}
             </motion.div>
           </AnimatePresence>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 mb-10">
        <h2 className="text-[17px] font-bold text-white tracking-tight mb-4">Fonctionnalités</h2>
        <div className="flex flex-col bg-[#1c2b43] rounded-[24px] border border-white/5 overflow-hidden shadow-xl">
           <FeatureRow icon={<Sparkles size={20} className="text-yellow-400" />} title="Staking" subtitle="Recevez jusqu'à 22,35 % APY." />
           <FeatureRow icon={<ShieldCheck size={20} className="text-blue-400" />} title="Stratégies" subtitle="Perfectionnez votre trading." />
           <FeatureRow icon={<CreditCard size={20} className="text-indigo-400" />} title="Carte crypto" subtitle="Dépensez sans frais." />
           <FeatureRow icon={<Zap size={20} className="text-cyan-400" />} title="Moben X" subtitle="Négociez comme un(e) pro." />
           <FeatureRow icon={<GraduationCap size={20} className="text-green-400" />} title="Apprendre" subtitle="Gagnez des MAD en cryptos." isLast={true} />
        </div>
      </div>

      {/* All Cryptos List */}
      <div className="px-4 pb-12">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-[17px] font-bold text-white tracking-tight">Toutes les cryptos &gt;</h2>
        </div>
        
        <div className="flex flex-col gap-1">
           {assets.map((asset) => {
              const priceParts = formatPrice(asset.price);
              const isPos = asset.change >= 0;
              return (
                <motion.div 
                   key={asset.id}
                   whileTap={{ scale: 0.98 }}
                   onClick={startNego}
                   className="flex items-center justify-between py-4 border-b border-white/5 cursor-pointer group"
                >
                   <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center p-2 shadow-sm group-hover:scale-105 transition-transform">
                         {asset.id === 'hype' ? renderHypeLogo(28) : <img src={asset.logo} alt={asset.symbol} className="w-full h-full object-contain" referrerPolicy="no-referrer" />}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[15px] font-bold text-white tracking-wide leading-tight group-hover:text-[#3b82f6] transition-colors">{asset.name}</span>
                         <span className="text-[12px] text-white/50 font-bold uppercase tracking-wider">{asset.symbol}</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <div className="flex items-baseline">
                         <span className="text-[15px] font-bold text-white tracking-tight">{priceParts.integer}</span>
                         <span className="text-[9px] font-bold text-white/50 ml-0.5">,{priceParts.decimal} MAD</span>
                      </div>
                      <div className={`flex items-center gap-0.5 text-[12px] font-bold mt-0.5 ${isPos ? 'text-green-400' : 'text-red-400'}`}>
                         {isPos ? <TrendingUp size={11} strokeWidth={3} /> : <TrendingDown size={11} strokeWidth={3} />}
                         {Math.abs(asset.change).toFixed(2)}%
                      </div>
                   </div>
                </motion.div>
              );
           })}
        </div>
      </div>

      {/* Fiscal Residency Flow Overlays */}
      <AnimatePresence>
        {fiscalFlow !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-[#050A1A]/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-[400px] bg-[#1c2b43] rounded-[32px] p-8 border border-white/10 shadow-2xl"
            >
              {fiscalFlow === 'question' && (
                <div className="flex flex-col gap-6 text-center">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Globe size={32} className="text-blue-400" />
                  </div>
                  <h2 className="text-[22px] font-bold text-white leading-tight">Êtes-vous résident fiscal français ?</h2>
                  <p className="text-white/60 text-[14px]">Cette information est requise par la réglementation européenne MiFID II.</p>
                  <div className="flex flex-col gap-3 mt-4">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFiscalFlow('nif')}
                      className="w-full h-14 bg-blue-600 rounded-[20px] text-white font-bold text-[16px] shadow-lg shadow-blue-900/20"
                    >
                      Oui
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFiscalFlow('non_resident')}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-[20px] text-white/70 font-bold text-[16px]"
                    >
                      Non
                    </motion.button>
                  </div>
                </div>
              )}

              {fiscalFlow === 'non_resident' && (
                <div className="flex flex-col gap-6 text-center">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Info size={32} className="text-red-400" />
                  </div>
                  <h2 className="text-[22px] font-bold text-white leading-tight">Inaccessible</h2>
                  <p className="text-white/70 text-[15px] leading-relaxed">
                    Désolé, Moben n'est actuellement disponible que pour les résidents fiscaux français.
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={resetFiscal}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-[20px] text-white font-bold text-[16px] mt-4"
                  >
                    Fermer
                  </motion.button>
                </div>
              )}

              {fiscalFlow === 'nif' && (
                <div className="flex flex-col gap-6">
                  <h2 className="text-[22px] font-bold text-white text-center leading-tight">Numéro d'Identifiant Fiscal (NIF)</h2>
                  <p className="text-white/60 text-[13px] text-center">Veuillez entrer votre NIF à 13 chiffres pour vérifier votre identité fiscale.</p>
                  
                  <div className="flex flex-col gap-2 mt-2">
                    <input 
                      type="text" 
                      value={nifValue}
                      onChange={(e) => setNifValue(e.target.value.replace(/\D/g, '').slice(0, 13))}
                      placeholder="Identifiant fiscal"
                      className="w-full h-14 bg-black/20 border border-white/10 rounded-[18px] px-5 text-white font-mono text-[18px] tracking-widest outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/10"
                    />
                    {isValidating && (
                      <p className="text-blue-400 text-[12px] font-bold animate-pulse text-center">Vérification en cours...</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 mt-4">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleValidateNif}
                      disabled={nifValue.length < 5 || isValidating}
                      className={`w-full h-14 rounded-[20px] font-bold text-[16px] transition-all ${nifValue.length < 5 ? 'bg-white/5 text-white/20' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'}`}
                    >
                      {isValidating ? 'Chargement...' : 'Valider'}
                    </motion.button>
                    <button onClick={resetFiscal} className="text-white/40 text-[13px] font-bold hover:text-white/60 transition">Annuler</button>
                  </div>
                </div>
              )}

              {fiscalFlow === 'error' && (
                <div className="flex flex-col gap-6 text-center">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ShieldCheck size={32} className="text-red-500" />
                  </div>
                  <h2 className="text-[22px] font-bold text-white leading-tight">Erreur de validation</h2>
                  <p className="text-[#EF4444] text-[15px] font-bold leading-relaxed px-2">
                    Le NIF saisi est invalide ou non reconnu par les services fiscaux.
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={resetFiscal}
                    className="w-full h-14 bg-blue-600 rounded-[20px] text-white font-bold text-[16px] mt-4 shadow-lg"
                  >
                    OK
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FeatureRow({ icon, title, subtitle, isLast = false }: any) {
  return (
    <motion.div 
      whileTap={{ scale: 0.99 }}
      className={`flex items-center justify-between p-5 hover:bg-white/5 transition cursor-pointer ${!isLast ? 'border-b border-white/5' : ''}`}
    >
      <div className="flex items-center gap-4">
         <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shadow-inner">
           {icon}
         </div>
         <div className="flex flex-col">
            <span className="text-[15px] font-bold text-white leading-tight">{title}</span>
            <span className="text-[12px] text-[#94a3b8] font-medium">{subtitle}</span>
         </div>
      </div>
      <ChevronRight size={18} className="text-white/20" />
    </motion.div>
  );
}
