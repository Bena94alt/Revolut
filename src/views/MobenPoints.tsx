import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, User, Hexagon, Plane, Hotel, ShoppingBag, 
  ChevronRight, MapPin, Ticket, Percent
} from 'lucide-react';

const springTransition = { type: "spring", stiffness: 400, damping: 25 };

export function MobenPoints({ setCurrentView }: any) {
  const destinations = [
    { 
      id: 'paris', 
      name: 'Paris', 
      points: '15 000', 
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop' 
    },
    { 
      id: 'london', 
      name: 'Londres', 
      points: '12 000', 
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop' 
    },
    { 
      id: 'tokyo', 
      name: 'Tokyo', 
      points: '25 000', 
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop' 
    },
  ];

  const offers = [
    {
      id: 'on',
      brand: 'On',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/On-logo.svg', // Placeholder for brand logo
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400&auto=format&fit=crop', // Modern running shoes
      text: "Jusqu'à 10% de cashback",
      bgColor: 'bg-white'
    },
    {
      id: 'levis',
      brand: "Levi's",
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Levi%27s_logo.svg', // Placeholder for brand logo
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400&auto=format&fit=crop', // Classic denim
      text: "Échangez 500 pts contre 15%",
      bgColor: 'bg-white'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col w-full min-h-full pb-32 bg-gradient-to-b from-[#0A1530] to-[#050A1A]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 mb-8">
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center cursor-pointer">
          <User size={20} className="text-white" />
        </div>
        <div className="flex-1 mx-3 bg-white/5 h-10 rounded-full flex items-center px-4 border border-white/5">
          <Search size={16} className="text-white/40" />
          <input type="text" placeholder="Rechercher des offres..." className="bg-transparent text-[14px] ml-2 outline-none text-white w-full placeholder-white/20" />
        </div>
        <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center cursor-pointer">
          <Hexagon size={20} className="text-[#3b82f6]" />
        </div>
      </div>

      {/* Points Balance */}
      <div className="px-4 text-center mb-10">
        <span className="text-[11px] font-black text-[#3b82f6] uppercase tracking-[2px] mb-2 block">MobenPoints</span>
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-[48px] font-black text-white tracking-tighter">1 250</h1>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 bg-gradient-to-tr from-[#3b82f6] to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <Hexagon size={24} className="text-white fill-white/20" />
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4 flex gap-2 mb-10 overflow-x-auto scrollbar-hide">
        <TabButton icon={<ShoppingBag size={18} />} label="Boutique" active />
        <TabButton icon={<Plane size={18} />} label="Vols" />
        <TabButton icon={<Hotel size={18} />} label="Hôtels" />
      </div>

      {/* Travel Section */}
      <div className="px-4 mb-10">
        <div className="flex justify-between items-end mb-5">
           <h2 className="text-[18px] font-bold text-white tracking-tight leading-tight">Évadez-vous avec<br/>vos points</h2>
           <span className="text-[13px] font-bold text-[#3b82f6]">Voir tout</span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          {destinations.map((dest) => (
            <motion.div 
              key={dest.id}
              whileTap={{ scale: 0.96 }}
              className="relative min-w-[160px] h-[220px] rounded-[24px] overflow-hidden shadow-xl border border-white/5"
            >
              <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-[18px] mb-0.5">{dest.name}</h3>
                <div className="flex items-center gap-1.5 text-white/70 text-[11px] font-bold uppercase tracking-wider">
                  <span>Dès {dest.points} pts</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Exclusive Offers Section */}
      <div className="px-4 mb-12">
        <h2 className="text-[18px] font-bold text-white mb-5 tracking-tight">Offres exclusives</h2>
        <div className="grid grid-cols-2 gap-4">
          {offers.map((offer, idx) => (
            <motion.div 
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-[28px] ${offer.bgColor} shadow-lg flex flex-col gap-3 group border border-white/5`}
            >
              <div className="flex justify-between items-center px-1">
                <div className="h-4 pointer-events-none opacity-80">
                  <span className="text-black font-black text-[12px] italic">{offer.brand}</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center">
                   <Percent size={12} className="text-black" />
                </div>
              </div>
              <div className="bg-[#f3f4f6] rounded-[20px] aspect-square overflow-hidden mb-1 border border-black/5">
                <img src={offer.image} alt={offer.brand} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="px-1">
                <p className="text-black font-bold text-[13px] leading-snug tracking-tight">{offer.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TabButton({ icon, label, active = false }: any) {
  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-bold transition-all whitespace-nowrap ${
        active 
          ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-500/20' 
          : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'
      }`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}
