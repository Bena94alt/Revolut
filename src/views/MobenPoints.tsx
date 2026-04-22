import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Hexagon, Star, MapPin } from 'lucide-react';

const springTransition = { type: "spring", stiffness: 400, damping: 25 };

export function MobenPoints({ setCurrentView }: any) {
  const [activeTab, setActiveTab] = useState('Boutique');

  // 20 Entreprises utiles au quotidien
  const brands = [
    { name: 'Zara', offer: '5% Cashback', color: '#000000', logo: 'Z' },
    { name: 'UberEats', offer: '10% de réduction', color: '#06C167', logo: 'UE' },
    { name: 'Carrefour', offer: 'Bonus x2 pts', color: '#003896', logo: 'C' },
    { name: 'Netflix', offer: '1 mois offert', color: '#E50914', logo: 'N' },
    { name: 'Amazon', offer: 'Livraison Prioritaire', color: '#FF9900', logo: 'A' },
    { name: 'Starbucks', offer: 'Boisson offerte', color: '#00704A', logo: 'S' },
    { name: 'H&M', offer: '15% sur tout', color: '#CC0000', logo: 'HM' },
    { name: 'Decathlon', offer: '500 pts = 5€', color: '#0082C3', logo: 'D' },
    { name: 'Marjane', offer: 'Offre exclusive', color: '#0055A4', logo: 'M' },
    { name: 'Glovo', offer: 'Livraison gratuite', color: '#FFC244', logo: 'G' },
    { name: 'Spotify', offer: '3 mois Premium', color: '#1DB954', logo: 'S' },
    { name: 'Airbnb', offer: 'Crédit voyage', color: '#FF5A5F', logo: 'AB' },
    { name: 'Nike', offer: 'Accès exclusif', color: '#000000', logo: 'NK' },
    { name: 'Shell', offer: 'Remise carburant', color: '#FBCE07', logo: 'SH' },
    { name: 'IKEA', offer: 'Carte cadeau 20€', color: '#0051BA', logo: 'I' },
    { name: 'Adidas', offer: 'Ventes privées', color: '#000000', logo: 'AD' },
    { name: 'Lacoste', offer: 'Personnalisation', color: '#004526', logo: 'L' },
    { name: 'McDonald\'s', offer: 'Menu Offert', color: '#FFBC0D', logo: 'MC' },
    { name: 'Fnac', offer: 'Remise Adhérent', color: '#E1B000', logo: 'F' },
    { name: 'Apple', offer: 'Protection Moben', color: '#555555', logo: 'AP' },
  ];

  const flights = [
    { id: 'paris', city: 'Paris', points: '15 000', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400' },
    { id: 'london', city: 'Londres', points: '12 000', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=400' },
    { id: 'tokyo', city: 'Tokyo', points: '25 000', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=400' },
  ];

  const luxuryHotels = [
    { name: 'Four Seasons', stars: 5, loc: 'Bora Bora', img: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=300' },
    { name: 'The Ritz-Carlton', stars: 5, loc: 'Maldives', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=300' },
    { name: 'Aman Resorts', stars: 5, loc: 'Kyoto', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=300' },
    { name: 'Burj Al Arab', stars: 7, loc: 'Dubaï', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=300' },
    { name: 'Rosewood', stars: 5, loc: 'Saint-Barth', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=300' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col w-full min-h-full bg-black pb-32">
      {/* Header & Balance */}
      <div className="px-4 pt-4 text-white">
        <div className="flex items-center justify-between mb-8">
           <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-[12px]">MB</div>
           <div className="flex-1 mx-3 bg-white/5 h-10 rounded-full flex items-center px-4">
              <Search size={16} className="text-white/40" />
              <input type="text" placeholder="Rechercher..." className="bg-transparent text-[14px] ml-2 outline-none text-white w-full" />
           </div>
           <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
              <Hexagon size={18} className="text-blue-500" />
           </div>
        </div>

        <div className="flex flex-col items-center mb-8">
           <span className="text-[12px] font-bold text-white/40 uppercase tracking-widest mb-1">MobenPoints</span>
           <div className="flex items-center gap-2">
              <span className="text-5xl font-black text-white tracking-tighter">1 250</span>
              <Hexagon size={28} className="text-blue-500 fill-blue-500/20" />
           </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-white/5 mb-8 justify-center">
           {['Boutique', 'Vols', 'Hôtels'].map((tab) => (
             <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[14px] font-bold relative cursor-pointer outline-none ${activeTab === tab ? 'text-white' : 'text-white/40'}`}
             >
                {tab}
                {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500" />}
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'Boutique' && (
          <motion.div key="boutique" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="px-4 grid grid-cols-2 gap-4">
            {brands.map((brand, i) => (
              <div key={i} className="bg-white/5 rounded-3xl p-4 border border-white/5 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg" style={{ backgroundColor: brand.color }}>
                  {brand.logo}
                </div>
                <div>
                  <p className="text-white font-bold text-[15px]">{brand.name}</p>
                  <p className="text-blue-400 font-bold text-[11px]">{brand.offer}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'Vols' && (
          <motion.div key="vols" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="px-4 space-y-4">
            {flights.map((flight) => (
              <div key={flight.id} className="relative h-40 rounded-3xl overflow-hidden group">
                <img src={flight.img} alt={flight.city} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                <div className="absolute inset-y-0 left-6 flex flex-col justify-center">
                  <h3 className="text-2xl font-black text-white">{flight.city}</h3>
                  <p className="text-white/70 font-bold">Dès {flight.points} pts</p>
                </div>
                <button className="absolute right-6 bottom-6 bg-white text-black h-10 px-4 rounded-full font-bold text-[13px] active:scale-95 transition-transform">Réserver</button>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'Hôtels' && (
          <motion.div key="hotels" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4">
              {luxuryHotels.map((hotel, i) => (
                <div key={i} className="shrink-0 w-64 bg-white/5 rounded-3xl overflow-hidden border border-white/5">
                  <img src={hotel.img} alt={hotel.name} className="h-32 w-full object-cover" />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-white font-bold text-[15px]">{hotel.name}</h3>
                      <div className="flex items-center text-yellow-500"><Star size={12} fill="currentColor" /> <span className="text-[12px] ml-1">{hotel.stars}</span></div>
                    </div>
                    <div className="flex items-center text-white/40 text-[12px]"><MapPin size={12} className="mr-1" /> {hotel.loc}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="px-4">
              <h2 className="text-white font-bold text-[17px] mb-4">Destinations de rêve</h2>
              <div className="grid grid-cols-2 gap-4">
                {['Maldives', 'Santorin', 'Courchevel', 'Bali'].map(dest => (
                  <div key={dest} className="h-24 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 font-bold text-white cursor-pointer active:scale-95 transition-transform">{dest}</div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
