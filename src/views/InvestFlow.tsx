import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Check, TrendingUp, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

const springTransition = { type: "spring", stiffness: 400, damping: 25 };

const CATEGORIES = ['Tech', 'Énergies', 'Crypto', 'Métaux précieux', 'ETF', 'Immobilier', 'Luxe'];

export const ALL_ASSETS = [
  { id: 'nvda', name: 'NVIDIA', type: 'Tech', risk: 'high', apy: 22.5, price: 8250, icon: 'NV', bg: 'bg-[#76b900] text-white' },
  { id: 'aapl', name: 'Apple', type: 'Tech', risk: 'low', apy: 8.2, price: 1850, icon: '', bg: 'bg-white text-black' },
  { id: 'msft', name: 'Microsoft', type: 'Tech', risk: 'low', apy: 9.5, price: 4200, icon: 'MS', bg: 'bg-[#00a4ef] text-white' },
  { id: 'tsla', name: 'Tesla', type: 'Tech', risk: 'high', apy: 18.0, price: 1750, icon: 'T', bg: 'bg-[#e2231a] text-white' },
  { id: 'amzn', name: 'Amazon', type: 'Tech', risk: 'medium', apy: 12.0, price: 1850, icon: 'a', bg: 'bg-[#131921] text-[#FF9900]' },
  { id: 'btc', name: 'Bitcoin', type: 'Crypto', risk: 'high', apy: 45.0, price: 680000, icon: '₿', bg: 'bg-[#F7931A] text-white' },
  { id: 'eth', name: 'Ethereum', type: 'Crypto', risk: 'high', apy: 38.0, price: 35000, icon: 'Ξ', bg: 'bg-[#627EEA] text-white' },
  { id: 'sol', name: 'Solana', type: 'Crypto', risk: 'high', apy: 55.0, price: 1450, icon: 'S', bg: 'bg-[#14F195] text-black' },
  { id: 'xrp', name: 'XRP', type: 'Crypto', risk: 'high', apy: 28.0, price: 6.5, icon: '✕', bg: 'bg-[#23292F] text-white' },
  { id: 'gold', name: 'Or', type: 'Métaux précieux', risk: 'low', apy: 4.5, price: 2350, icon: 'AU', bg: 'bg-[#FFD700] text-black' },
  { id: 'silver', name: 'Argent', type: 'Métaux précieux', risk: 'medium', apy: 6.0, price: 28, icon: 'AG', bg: 'bg-[#C0C0C0] text-black' },
  { id: 'sp500', name: 'S&P 500', type: 'ETF', risk: 'medium', apy: 10.5, price: 5200, icon: 'SP', bg: 'bg-blue-800 text-white' },
  { id: 'nasdaq', name: 'NASDAQ', type: 'ETF', risk: 'medium', apy: 14.2, price: 18500, icon: 'NQ', bg: 'bg-indigo-600 text-white' },
  { id: 'cac40', name: 'CAC 40', type: 'ETF', risk: 'medium', apy: 7.8, price: 8100, icon: 'C4', bg: 'bg-blue-600 text-white' },
  { id: 'xom', name: 'Exxon', type: 'Énergies', risk: 'medium', apy: 6.5, price: 120, icon: 'XOM', bg: 'bg-red-600 text-white' },
  { id: 'bp', name: 'BP', type: 'Énergies', risk: 'medium', apy: 5.8, price: 38, icon: 'BP', bg: 'bg-green-600 text-white' },
  { id: 'lvmh', name: 'LVMH', type: 'Luxe', risk: 'low', apy: 9.0, price: 850, icon: 'LV', bg: 'bg-black text-white' },
  { id: 'hermes', name: 'Hermès', type: 'Luxe', risk: 'low', apy: 11.0, price: 2300, icon: 'HR', bg: 'bg-orange-500 text-white' },
  { id: 'reit1', name: 'Realty Inc', type: 'Immobilier', risk: 'low', apy: 6.8, price: 55, icon: 'O', bg: 'bg-teal-600 text-white' },
  { id: 'reit2', name: 'Vanguard RE', type: 'Immobilier', risk: 'low', apy: 7.2, price: 85, icon: 'VNQ', bg: 'bg-red-800 text-white' }
];

export function InvestFlow({ setCurrentView, setInvestments, marketState }: any) {
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [amounts, setAmounts] = useState<Record<string, number>>({});

  const filteredAssets = useMemo(() => {
    if (selectedCategories.length === 0) return ALL_ASSETS.slice(0, 10);
    return ALL_ASSETS.filter(a => selectedCategories.includes(a.type));
  }, [selectedCategories]);

  const handleToggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleToggleAsset = (id: string) => {
    setSelectedAssets(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleAmountChange = (id: string, val: string) => {
    const num = parseFloat(val);
    setAmounts(prev => ({ ...prev, [id]: isNaN(num) ? 0 : num }));
  };

  const handleClose = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      setCurrentView('invest');
    }
  };

  // Step 3 metrics calculations
  const chosenAssets = ALL_ASSETS.filter(a => selectedAssets.includes(a.id));
  const totalInvested = (Object.values(amounts) as number[]).reduce((sum, val) => sum + (val || 0), 0);
  
  const estimatedReturnAnnual = chosenAssets.reduce((sum, asset) => {
    const amt = (amounts[asset.id] as number) || 0;
    return sum + (amt * (asset.apy / 100));
  }, 0);
  
  const estimatedMonthlyReturn = totalInvested > 0 ? (estimatedReturnAnnual / 12) : 0;
  
  // Risk weighting logic: Low=1, Medium=2, High=3
  let globalRiskScore = 0;
  if (totalInvested > 0) {
    const riskSum = chosenAssets.reduce((acc, asset) => {
      const amt = (amounts[asset.id] as number) || 0;
      let rVal = 1;
      if (asset.risk === 'medium') rVal = 2;
      if (asset.risk === 'high') rVal = 3;
      return acc + (amt * rVal);
    }, 0);
    globalRiskScore = riskSum / totalInvested;
  } else {
    const rawSum = chosenAssets.reduce((acc, a) => acc + (a.risk === 'high' ? 3 : a.risk === 'medium' ? 2 : 1), 0);
    globalRiskScore = chosenAssets.length ? rawSum / chosenAssets.length : 0;
  }

  const getRiskColor = (score: number) => {
    if (score < 1.6) return 'text-green-400 bg-green-400/10 border-green-400/30';
    if (score < 2.4) return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
    return 'text-red-400 bg-red-400/10 border-red-400/30';
  };
  
  const getRiskLabel = (score: number) => {
    if (score < 1.6) return 'Faible';
    if (score < 2.4) return 'Modéré';
    return 'Élevé';
  };

  const getHexColor = (risk: string) => {
    if (risk === 'low') return '#4ADE80';
    if (risk === 'medium') return '#FB923C';
    return '#F87171';
  };

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={springTransition}
      className="absolute inset-0 bg-[#050A1A] z-[60] flex flex-col"
    >
      <div className="px-4 py-4 flex items-center shrink-0">
        <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <div className="flex-1 px-4">
           {/* Steps indicator */}
           <div className="flex justify-center gap-2">
             {[1, 2, 3].map(i => (
               <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#3b82f6]' : i < step ? 'w-4 bg-[#3b82f6]/50' : 'w-4 bg-white/10'}`} />
             ))}
           </div>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {/* STEP 1: Questionnaire */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={springTransition}
              className="absolute inset-0 px-6 flex flex-col pt-8"
            >
              <h2 className="text-[26px] font-bold text-white leading-tight mb-2">Dans quels types d'actifs souhaitez-vous investir ?</h2>
              <p className="text-[#94a3b8] text-[14px] mb-8">Sélectionnez vos secteurs de prédilection pour personnaliser l'exploration basés sur vos intérêts.</p>
              
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map(cat => (
                  <motion.button 
                    key={cat}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleCategory(cat)}
                    className={`px-5 py-3 rounded-[20px] font-semibold text-[14px] transition-all border ${
                      selectedCategories.includes(cat) 
                        ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                        : 'bg-[#1c2b43] text-[#94a3b8] border-white/5 hover:bg-[#2a3c5a]'
                    }`}
                  >
                    {selectedCategories.includes(cat) && <Check size={16} className="inline mr-1.5 mb-0.5" />}
                    {cat}
                  </motion.button>
                ))}
              </div>

              <div className="mt-auto pb-8">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(2)}
                  disabled={selectedCategories.length === 0}
                  className={`w-full h-14 rounded-[24px] font-bold text-[16px] transition-all flex items-center justify-center ${
                    selectedCategories.length > 0 
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-gray-100' 
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  Continuer
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Bubble Map */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={springTransition}
              className="absolute inset-0 flex flex-col"
            >
              <div className="px-6 pt-4 shrink-0 shrink-0 z-10 bg-gradient-to-b from-[#050A1A] to-transparent pb-6">
                <h2 className="text-[22px] font-bold text-white text-center leading-tight">Exploration du marché</h2>
                <p className="text-[#94a3b8] text-[13px] text-center mt-1">Sélectionnez les actifs qui vous intéressent.</p>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-32">
                <div className="flex flex-wrap justify-center items-center gap-6 pt-10 min-h-[120%]">
                   {filteredAssets.map((asset, i) => {
                     const isSelected = selectedAssets.includes(asset.id);
                     
                     return (
                       <motion.div
                         key={asset.id}
                         animate={{ y: [0, -12, 0] }}
                         transition={{ 
                           duration: 3 + Math.random() * 2, 
                           repeat: Infinity, 
                           delay: Math.random() * 2,
                           ease: "easeInOut"
                         }}
                         onClick={() => handleToggleAsset(asset.id)}
                         className="relative flex flex-col items-center cursor-pointer group p-2"
                       >
                          <div className={`w-[76px] h-[76px] rounded-full flex items-center justify-center shadow-lg transition-all ${asset.bg} ${isSelected ? 'ring-4 ring-[#3b82f6] shadow-[0_0_25px_rgba(59,130,246,0.5)] scale-110' : 'group-hover:scale-105'}`}>
                             <svg className="absolute inset-0 w-full h-full rotate-[-90deg] pointer-events-none" viewBox="0 0 100 100">
                                <circle 
                                  cx="50" cy="50" r="47"
                                  fill="none"
                                  stroke={getHexColor(asset.risk)}
                                  strokeWidth="3"
                                  strokeDasharray="295"
                                  strokeDashoffset={isSelected ? "0" : "150"}
                                  strokeLinecap="round"
                                  className="transition-all duration-500 opacity-80"
                                />
                             </svg>
                             <span className="text-[20px] font-bold tracking-tight">{asset.icon}</span>
                          </div>
                          <span className={`mt-2 font-bold transition-all ${isSelected ? 'text-[#3b82f6] text-[14px]' : 'text-white/80 text-[13px]'}`}>
                            {asset.name}
                          </span>
                          <div className={`absolute top-[64px] bg-[#0A1530] border px-2 py-0.5 rounded-full flex flex-col items-center justify-center transition-all ${isSelected ? 'border-[#3b82f6] scale-110' : 'border-white/10'}`}>
                             <span className="text-[10px] font-bold text-white whitespace-nowrap opacity-90 leading-tight tracking-wide">
                                APY: ~{asset.apy}%
                             </span>
                          </div>
                       </motion.div>
                     )
                   })}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#050A1A] via-[#050A1A]/90 to-transparent">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(3)}
                  disabled={selectedAssets.length === 0}
                  className={`w-full h-14 rounded-[24px] font-bold text-[15px] transition-all flex items-center justify-center ${
                    selectedAssets.length > 0 
                      ? 'bg-[#3b82f6] hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  Continuer avec {selectedAssets.length} actif{selectedAssets.length > 1 ? 's' : ''}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Settings Checkout */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={springTransition}
              className="absolute inset-0 flex flex-col pb-6"
            >
              <div className="px-5 pt-2 pb-4 bg-[#0A1530] border-b border-white/5 z-10 shrink-0">
                 <div className="flex items-center justify-between bg-[#1c2b43] border border-white/10 rounded-[20px] p-4 shadow-lg mb-2">
                    <div className="flex flex-col">
                       <span className="text-[12px] text-[#94a3b8] font-semibold mb-1 flex items-center gap-1">
                          Risque Global <Info size={12}/>
                       </span>
                       <span className={`text-[14px] font-bold border px-2 py-0.5 rounded-md w-max ${getRiskColor(globalRiskScore)}`}>
                         {getRiskLabel(globalRiskScore)}
                       </span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[12px] text-[#94a3b8] font-semibold mb-1 flex items-center gap-1">
                          Gain mensuel est. <TrendingUp size={12} className="text-green-400"/>
                       </span>
                       <span className="text-[18px] font-bold text-white tracking-tight">
                         +{estimatedMonthlyReturn.toFixed(2)} <span className="opacity-50 text-[12px]">MAD</span>
                       </span>
                    </div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                 <h3 className="text-[15px] font-bold text-white mb-2">Répartition de l'investissement</h3>
                 {chosenAssets.map(asset => (
                   <div key={asset.id} className="bg-[#1c2b43] rounded-[20px] p-4 border border-white/5 flex items-center gap-4">
                      <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 ${asset.bg}`}>
                        <span className="font-bold text-[14px]">{asset.icon}</span>
                      </div>
                      <div className="flex-1 flex flex-col">
                         <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-white text-[14px]">{asset.name}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                               asset.risk === 'low' ? 'text-green-400 border-green-400/30' :
                               asset.risk === 'medium' ? 'text-orange-400 border-orange-400/30' :
                               'text-red-400 border-red-400/30'
                            }`}>
                               APY ~{asset.apy}%
                            </span>
                         </div>
                         <div className="relative">
                            <input 
                              type="number"
                              value={amounts[asset.id] || ''}
                              onChange={(e) => handleAmountChange(asset.id, e.target.value)}
                              placeholder="0"
                              className="w-full bg-[#050A1A] border border-white/10 rounded-xl h-12 px-4 text-white font-bold text-[16px] outline-none focus:border-[#3b82f6] transition"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 font-bold text-[14px]">MAD</span>
                         </div>
                      </div>
                   </div>
                 ))}
                 <div className="mt-4 p-4 border border-blue-500/30 bg-blue-500/10 rounded-[20px] relative overflow-hidden flex flex-col">
                    <h4 className="text-white font-bold text-[14px] mb-1">Moben Auto-Balance</h4>
                    <p className="text-[12px] text-blue-200/80 leading-snug">
                       L'investissement régulier sera ajusté dynamiquement pour maintenir ce profil de risque.
                    </p>
                 </div>
              </div>

              <div className="px-5 shrink-0 bg-[#0A1530] pt-2">
                 <div className="flex justify-between items-center mb-4 px-1">
                    <span className="text-[#94a3b8] font-medium text-[14px]">Total</span>
                    <span className="text-white font-bold text-[22px] tracking-tight">{totalInvested.toLocaleString()} <span className="text-[14px] opacity-50">MAD</span></span>
                 </div>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    disabled={totalInvested === 0}
                    onClick={() => {
                      setInvestments((prev: any) => {
                        const next = { ...prev };
                        Object.entries(amounts).forEach(([id, _madAmount]) => {
                          const madAmount = _madAmount as number;
                          if (madAmount <= 0) return;
                          
                          // Correct Share Calculation based on real-time marketState price
                          const livePrice = (marketState.prices as any)[id];
                          const asset = ALL_ASSETS.find(a => a.id === id);
                          const priceToUse = livePrice || asset?.price || 1;
                          const quantity = madAmount / priceToUse;
                          
                          if (next[id]) {
                            next[id] = {
                              ...next[id],
                              totalInvestedMAD: (next[id].totalInvestedMAD || 0) + madAmount,
                              quantity: (next[id].quantity || 0) + quantity
                            };
                          } else {
                            next[id] = {
                              assetId: id,
                              totalInvestedMAD: madAmount,
                              quantity: quantity
                            };
                          }
                        });
                        return next;
                      });
                      setCurrentView('dashboard');
                    }}
                    className={`w-full h-14 rounded-[24px] font-bold text-[16px] transition-all flex items-center justify-center gap-2 ${
                      totalInvested > 0 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                   {totalInvested > 0 ? (
                     <>
                        Confirmer l'investissement <CheckCircle2 size={20} />
                     </>
                   ) : "Saisissez un montant"}
                 </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
