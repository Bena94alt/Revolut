import React from 'react';
import { motion } from 'motion/react';
import { Search, Hexagon, Plane, ShoppingBag, ArrowRight, ChevronRight } from 'lucide-react';

const springTransition = { type: "spring", stiffness: 400, damping: 25 };

export function MobenPoints({ setCurrentView }: any) {
  const flights = [
    { id: 'paris', city: 'Paris', points: '15 000', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format&fit=crop' },
    { id: 'london', city: 'Londres', points: '12 000', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=400&auto=format&fit=crop' },
    { id: 'tokyo', city: 'Tokyo', points: '25 000', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col w-full min-h-full bg-transparent pb-32"
    >
      {/* Header & Balance */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-6">
           <div className="w-10 h-10 rounded-full bg-[#1c2b43] flex items-center justify-center border border-white/5 font-bold text-white text-[12px]">AB</div>
           <div className="flex-1 mx-3 bg-[#1c2b43] h-10 rounded-full flex items-center px-4 border border-white/5">
              <Search size={16} className="text-white/40" />
              <input type="text" placeholder="Rechercher des offres..." className="bg-transparent text-[14px] ml-2 outline-none text-white w-full" />
           </div>
           <div className="w-10 h-10 rounded-full bg-[#1c2b43] border border-white/5 flex items-center justify-center">
              <Hexagon size={18} className="text-[#3b82f6]" />
           </div>
        </div>

        <div className="flex flex-col items-center mb-8">
           <span className="text-[12px] font-bold text-white/50 uppercase tracking-widest mb-1">MobenPoints</span>
           <div className="flex items-center gap-2">
              <span className="text-5xl font-black text-white tracking-tighter">1 250</span>
              <Hexagon size={28} className="text-[#3b82f6] fill-[#3b82f6]/20" />
           </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-8 border-b border-white/5 mb-8 justify-center">
           {['Boutique', 'Vols', 'Hôtels'].map((tab, i) => (
             <div key={tab} className={`pb-3 text-[14px] font-bold relative cursor-pointer ${i === 1 ? 'text-white' : 'text-white/40'}`}>
                {tab}
                {i === 1 && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3b82f6]" />}
             </div>
           ))}
        </div>
      </div>

      {/* Section Vols (Paris, Londres, Tokyo) */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[17px] font-bold text-white">Évadez-vous avec vos points</h2>
          <ChevronRight size={20} className="text-white/30" />
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {flights.map((flight) => (
            <motion.div 
              key={flight.id}
              whileTap={{ scale: 0.95 }}
              transition={springTransition}
              className="relative shrink-0 w-[160px] h-[220px] rounded-[24px] overflow-hidden group cursor-pointer"
            >
              <img src={flight.img} alt={flight.city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-black text-[18px] leading-tight">{flight.city}</p>
                <p className="text-white/70 text-[12px] font-bold">Dès {flight.points} pts</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section Shopping Widgets (On & Levi's) */}
      <div className="px-4">
        <h2 className="text-[17px] font-bold text-white mb-4">Offres exclusives</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Widget On */}
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="bg-[#1c2b43] rounded-[28px] p-4 border border-white/5 flex flex-col gap-3 cursor-pointer shadow-lg"
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center self-start shadow-inner">
               <span className="text-black font-black text-[15px] italic">on</span>
            </div>
            <div className="h-[100px] w-full rounded-[16px] overflow-hidden bg-white/5">
               <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400&auto=format&fit=crop" alt="On Shoes" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-[14px]">On Running</span>
              <span className="text-[#3b82f6] font-bold text-[11px]">Jusqu'à 10% cashback</span>
            </div>
          </motion.div>

          {/* Widget Levi's */}
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="bg-[#1c2b43] rounded-[28px] p-4 border border-white/5 flex flex-col gap-3 cursor-pointer shadow-lg"
          >
            <div className="w-10 h-10 bg-[#e11d48] rounded-full flex items-center justify-center self-start shadow-inner">
               <span className="text-white font-black text-[10px] uppercase tracking-tighter">Levis</span>
            </div>
            <div className="h-[100px] w-full rounded-[16px] overflow-hidden bg-white/5">
               <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400&auto=format&fit=crop" alt="Levi's Denim" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-[14px]">Levi's</span>
              <span className="text-[#3b82f6] font-bold text-[11px]">500 pts = 15% remise</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
