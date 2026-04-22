import React, { useState, useRef, useEffect, useCallback } from "react";
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
  CheckCircle2,
  Newspaper,
  MessageSquare,
  Send,
  ArrowUpCircle,
  ArrowDownCircle,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Invest } from "./views/Invest";
import { InvestFlow, ALL_ASSETS } from "./views/InvestFlow";
import { Cryptos } from "./views/Cryptos";
import { MobenPoints } from "./views/MobenPoints";

// Exchange rate (USD to MAD baseline)
const USD_MAD_RATE = 10.15;
const EXCHANGE_RATE = 10.85; // EUR to MAD

// Daily News Pool (50+ Headlines for April 22, 2026)
const BLOOMBERG_DAILY_POOL = [
  { id: 1, ticker: "NVDA", title: "NVIDIA annoncerait des revenus record pour le T1 2026 portés par l'IA générative.", category: "Tech" },
  { id: 2, ticker: "FED", title: "Powell suggère un maintien des taux face à une inflation résiliente.", category: "Économie" },
  { id: 3, ticker: "BTC", title: "Le Bitcoin franchit la barre des 72 000 USD alors que l'adoption institutionnelle s'accélère.", category: "Crypto" },
  { id: 4, ticker: "AAPL", title: "Apple Vision Pro 2 : Des rumeurs de lancement pour fin 2026 boostent l'action.", category: "Tech" },
  { id: 5, ticker: "HYPE", title: "Hyperliquid (HYPE) devient l'échange décentralisé numéro 1 par volume quotidien.", category: "Crypto" },
  { id: 6, ticker: "BCE", title: "Lagarde : La zone euro montre des signes de reprise plus forts que prévu.", category: "Économie" },
  { id: 7, ticker: "TSLA", title: "Tesla Robotaxi : Musk promet un déploiement massif à San Francisco d'ici juillet.", category: "Tech" },
  { id: 8, ticker: "SOL", title: "Solana dépasse Ethereum en termes de transactions actives mensuelles.", category: "Crypto" },
  { id: 9, ticker: "AMZN", title: "Amazon Web Services investit 15 milliards USD au Maroc pour son nouveau hub africain.", category: "Tech" },
  { id: 10, ticker: "MSFT", title: "Microsoft Copilot atteint 500 millions d'utilisateurs actifs quotidiens.", category: "Tech" },
  { id: 11, ticker: "OIL", title: "Le Brent se stabilise à 88$ suite aux tensions persistantes au Moyen-Orient.", category: "Énergie" },
  { id: 12, ticker: "ETH", title: "Ethereum : La mise à jour 'Pectra' est prévue pour le mois prochain.", category: "Crypto" },
  { id: 13, ticker: "GOOGL", title: "Google DeepMind annonce une percée majeure dans le repliement des protéines.", category: "Tech" },
  { id: 14, ticker: "GOLD", title: "L'Or atteint un nouveau sommet historique, valeur refuge face à l'incertitude.", category: "Marchés" },
  { id: 15, ticker: "META", title: "Meta lance Llama 4 : Des performances surpassant GPT-5 selon les premiers tests.", category: "Tech" },
  { id: 16, ticker: "RHM", title: "Rheinmetall revoit ses prévisions de bénéfices à la hausse suite aux commandes de l'OTAN.", category: "Défense" },
  { id: 17, ticker: "BNB", title: "Binance annonce une nouvelle initiative de conformité réglementaire mondiale.", category: "Crypto" },
  { id: 18, ticker: "USD", title: "Le dollar se renforce face au dirham sur fond de différentiel de taux.", category: "Forex" },
  { id: 19, ticker: "JPB", title: "JPMorgan prévoit une croissance de 3.5% pour l'économie marocaine en 2026.", category: "Économie" },
  { id: 20, ticker: "ASML", title: "ASML : Les exportations de machines EUV vers l'Asie tirent la croissance.", category: "Tech" },
  { id: 21, ticker: "NFLX", title: "Netflix gagne 10 millions d'abonnés au T1 grâce à son offre avec publicité.", category: "Média" },
  { id: 22, ticker: "DIS", title: "Disney+ devient enfin rentable au niveau opérationnel ce trimestre.", category: "Média" },
  { id: 23, ticker: "OPEC", title: "L'OPEP+ prolonge les coupes de production jusqu'à la fin de l'été.", category: "Énergie" },
  { id: 24, ticker: "AI", title: "La régulation de l'IA : L'ONU adopte une charte mondiale pour une IA éthique.", category: "Tech" },
  { id: 25, ticker: "MAR", title: "Maroc Telecom : Déploiement massif de la 5G dans les grandes villes du Royaume.", category: "Tech" },
  { id: 26, ticker: "WMT", title: "Walmart utilise des drones pour 40% de ses livraisons urbaines aux USA.", category: "Retail" },
  { id: 27, ticker: "MC", title: "Mastercard lance une solution de paiement biométrique par le regard.", category: "Fintech" },
  { id: 28, ticker: "V", title: "Visa enregistre une hausse de 15% des paiements transfrontaliers.", category: "Fintech" },
  { id: 29, ticker: "REIT", title: "L'immobilier commercial montre des signes de stabilisation après 3 ans de baisse.", category: "Immo" },
  { id: 30, ticker: "AVGO", title: "Broadcom annonce un nouveau processeur pour les serveurs IA.", category: "Tech" },
  { id: 31, ticker: "PYPL", title: "PayPal lance son propre stablecoin sur le réseau Hyperliquid.", category: "Fintech" },
  { id: 32, ticker: "TME", title: "Tencent Music : Les revenus d'abonnement bondissent de 30%.", category: "Média" },
  { id: 33, ticker: "BABA", title: "Alibaba Cloud réduit ses prix de 50% pour gagner des parts de marché en Europe.", category: "Tech" },
  { id: 34, ticker: "JD", title: "JD.com déploie son propre modèle d'IA pour la logistique intelligente.", category: "Tech" },
  { id: 35, ticker: "NKE", title: "Nike : Succès massif de la collection 'Hyper-Reflective' pour les JO 2026.", category: "Luxe" },
  { id: 36, ticker: "LVMH", title: "Bernard Arnault nomme son plus jeune fils à la tête de TAG Heuer.", category: "Luxe" },
  { id: 37, ticker: "OR", title: "L'Oréal mise sur la technologie épigénétique pour sa nouvelle gamme de soins.", category: "Luxe" },
  { id: 38, ticker: "SAN", title: "Sanofi annonce des résultats positifs pour son vaccin universel contre la grippe.", category: "Santé" },
  { id: 39, ticker: "PFE", title: "Pfizer développe une pilule unique contre les maladies cardio-vasculaires.", category: "Santé" },
  { id: 40, ticker: "MRK", title: "Merck acquiert une biotech spécialisée dans l'immunothérapie pour 4 milliards $.", category: "Santé" },
  { id: 41, ticker: "ABB", title: "Airbnb lance une option de location de manoirs historiques en Europe.", category: "Tech" },
  { id: 42, ticker: "UBER", title: "Uber annonce un partenariat avec Waymo pour des taxis autonomes à Londres.", category: "Tech" },
  { id: 43, ticker: "ABNB", title: "Airbnb enregistre un record de réservations pour l'été 2026.", category: "Tech" },
  { id: 44, ticker: "SPOT", title: "Spotify atteint 800 millions d'utilisateurs actifs mensuels.", category: "Média" },
  { id: 45, ticker: "SHOP", title: "Shopify lance un outil d'IA pour créer des sites e-commerce en 5 minutes.", category: "Tech" },
  { id: 46, ticker: "CRM", title: "Salesforce intègre Slack GPT à tous ses services d'entreprise.", category: "Tech" },
  { id: 47, ticker: "ADBE", title: "Adobe Firefly Video : La génération de vidéo par IA est désormais disponible.", category: "Tech" },
  { id: 48, ticker: "SNOW", title: "Snowflake annonce une intégration profonde avec NVIDIA NeMo.", category: "Tech" },
  { id: 49, ticker: "SQ", title: "Block (Square) intègre le Bitcoin comme monnaie de règlement par défaut.", category: "Fintech" },
  { id: 50, ticker: "INTC", title: "Intel annonce ses processeurs 1.8nm pour fin 2026.", category: "Tech" },
];

const INITIAL_MARKET_STATE = {
  prices: {
    btc: 72450.00 * USD_MAD_RATE,
    hype: 42.50 * USD_MAD_RATE,
    sol: 165.00 * USD_MAD_RATE,
    eth: 3450.00 * USD_MAD_RATE,
    bnb: 605.00 * USD_MAD_RATE,
    usdt: 1.00 * USD_MAD_RATE,
    nvda: 950.00 * USD_MAD_RATE,
    aapl: 172.00 * USD_MAD_RATE,
    msft: 425.00 * USD_MAD_RATE,
    tsla: 168.00 * USD_MAD_RATE,
    amzn: 188.00 * USD_MAD_RATE,
    nflx: 625.00 * USD_MAD_RATE,
    rhm: 545.00 * USD_MAD_RATE,
  },
  dailyOpens: {
    btc: 71200.00 * USD_MAD_RATE,
    hype: 38.20 * USD_MAD_RATE,
    sol: 158.00 * USD_MAD_RATE,
    eth: 3390.00 * USD_MAD_RATE,
    bnb: 598.00 * USD_MAD_RATE,
    usdt: 1.00 * USD_MAD_RATE,
    nvda: 925.00 * USD_MAD_RATE,
    aapl: 170.00 * USD_MAD_RATE,
    msft: 420.00 * USD_MAD_RATE,
    tsla: 172.00 * USD_MAD_RATE, // Opening higher, maybe down since open
    amzn: 185.00 * USD_MAD_RATE,
    nflx: 610.00 * USD_MAD_RATE,
    rhm: 530.00 * USD_MAD_RATE,
  }
};

// Formatter utility
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const INITIAL_CONTACTS = [
  {
    id: 1,
    name: "Ghali Berrada",
    initials: "GB",
    bg: "bg-blue-500",
    transaction: "Vous avez envoyé 80 MAD",
    date: "Hier",
    type: "sent",
    amount: "80",
  },
  {
    id: 2,
    name: "Kamil Lahlou",
    initials: "KL",
    bg: "bg-teal-500",
    transaction: "Vous a envoyé 150 MAD",
    date: "2 jours",
    type: "received",
    amount: "150",
  },
  {
    id: 3,
    name: "Ghita Benjelloun",
    initials: "GB",
    bg: "bg-orange-500",
    transaction: "Vous avez envoyé 45 MAD",
    date: "Lundi",
    type: "sent",
    amount: "45",
  },
  {
    id: 4,
    name: "Abdellah Karim",
    initials: "AK",
    bg: "bg-purple-500",
    transaction: "Vous avez envoyé 200 MAD",
    date: "5 janv.",
    type: "sent",
    amount: "200",
  },
  {
    id: 5,
    name: "Adam Benabdelhak",
    initials: "AB",
    bg: "bg-[#3b82f6]",
    transaction: "Vous a envoyé 10 MAD",
    date: "24 déc.",
    type: "received",
    amount: "10",
  },
];

const formatMoneyParts = (amount: number) => {
  const parts = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).formatToParts(amount);

  const integerPart = parts
    .filter((p) => p.type === "integer" || p.type === "group")
    .map((p) => p.value)
    .join("");
  const decimalPart = parts
    .filter((p) => ["decimal", "fraction"].includes(p.type))
    .map((p) => p.value)
    .join("");
  return { integerPart, decimalPart };
};

const springTransition = { type: "spring", stiffness: 400, damping: 17 };

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [investments, setInvestments] = useState<
    Record<
      string,
      { totalInvestedMAD: number; quantity: number; assetId: string }
    >
  >({});
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [showSearch, setShowSearch] = useState(false);

  // MARKET ENGINE STATE
  const [marketState, setMarketState] = useState(INITIAL_MARKET_STATE);
  const [newsFeed, setNewsFeed] = useState<any[]>([]);

  // Initialize and rotate news
  const rotateNews = useCallback(() => {
    const shuffled = [...BLOOMBERG_DAILY_POOL].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5).map(n => ({
      ...n,
      id: Math.random(),
      timestamp: new Date(),
      image: `https://picsum.photos/seed/${n.ticker}/400/250`
    }));
    
    setNewsFeed(prev => {
      const updated = [...selected, ...prev].slice(0, 20);
      if (prev.length > 0) {
        toast.info("Alerte Bloomberg : De nouvelles actualités sont disponibles !", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          icon: <Newspaper className="text-blue-400" />
        });
      }
      return updated;
    });
  }, []);

  // Update prices logic
  useEffect(() => {
    const priceInterval = setInterval(() => {
      setMarketState(prev => {
        const newPrices = { ...prev.prices };
        Object.keys(newPrices).forEach(id => {
          const drift = 1 + (Math.random() * 0.0004 - 0.0002); // +/- 0.02%
          (newPrices as any)[id] *= drift;
        });
        return { ...prev, prices: newPrices };
      });
    }, 2000);

    const newsInterval = setInterval(rotateNews, 1200000); // 20 minutes
    rotateNews(); // Initial call

    return () => {
      clearInterval(priceInterval);
      clearInterval(newsInterval);
    };
  }, [rotateNews]);

  // Chat History State
  const [contactMessages, setContactMessages] = useState<Record<number, any[]>>(
    () => {
      const initial: Record<number, any[]> = {};
      INITIAL_CONTACTS.forEach((c) => {
        initial[c.id] = [
          {
            id: `init-${c.id}`,
            type: "transaction",
            amount: c.amount,
            date: c.date,
            sender: c.type === "sent" ? "me" : "them",
            status: "Réussie",
          },
        ];
      });
      return initial;
    },
  );

  // Global Financial State
  const [balances, setBalances] = useState({
    MAD: 0.01,
    EUR: 0.0,
    USD: 0.0,
    GBP: 0.0,
  });

  // Tracks the currently visible account on the Dashboard slider
  const [activeAccount, setActiveAccount] = useState<
    "MAD" | "EUR" | "USD" | "GBP"
  >("MAD");

  // Logic functions
  const addMoney = (
    amount: number,
    currency: "MAD" | "EUR" | "USD" | "GBP",
  ) => {
    setBalances((prev) => ({
      ...prev,
      [currency]: prev[currency] + amount,
    }));
  };

  const sendMessage = (contactId: number, message: any) => {
    setContactMessages((prev) => ({
      ...prev,
      [contactId]: [
        ...(prev[contactId] || []),
        { ...message, id: Date.now().toString(), timestamp: new Date() },
      ],
    }));

    // Update the contact list summary
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          let lastAction = "";
          if (message.type === "transaction") {
            lastAction =
              message.sender === "me"
                ? `Vous avez envoyé ${message.amount} MAD`
                : `Vous a envoyé ${message.amount} MAD`;
          } else {
            lastAction =
              message.sender === "me"
                ? `Vous: ${message.content}`
                : message.content;
          }
          return {
            ...c,
            transaction: lastAction,
            date: "Maintenant",
            amount: message.type === "transaction" ? message.amount : c.amount,
            type:
              message.type === "transaction"
                ? message.sender === "me"
                  ? "sent"
                  : "received"
                : c.type,
          };
        }
        return c;
      }),
    );

    // If it's a transaction sent by me, deduct balance
    if (message.type === "transaction" && message.sender === "me") {
      const amt = parseFloat(message.amount);
      if (!isNaN(amt)) {
        setBalances((prev) => ({
          ...prev,
          MAD: prev.MAD - amt,
        }));
      }
    }
  };

  const transferMoney = (sourceCurrency: "MAD" | "EUR", amount: number) => {
    const targetCurrency = sourceCurrency === "MAD" ? "EUR" : "MAD";
    let convertedAmount = 0;

    if (sourceCurrency === "EUR") {
      convertedAmount = amount * EXCHANGE_RATE;
    } else {
      convertedAmount = amount / EXCHANGE_RATE;
    }

    setBalances((prev) => ({
      ...prev,
      [sourceCurrency]: prev[sourceCurrency] - amount,
      [targetCurrency]: prev[targetCurrency] + convertedAmount,
    }));
  };

  return (
    <div className="min-h-screen bg-[#051025] flex items-center justify-center font-sans selection:bg-blue-500/30">
      <ToastContainer aria-label="Moben Notifications" />
      {/* Mobile frame simulator */}
      <div className="w-full h-[100dvh] sm:w-[360px] sm:h-[740px] sm:rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden bg-gradient-to-b from-[#0A1530] to-[#050A1A] text-white flex flex-col sm:border-[8px] sm:border-[#1c2b43] leading-normal overscroll-behavior-y-contain">
        {/* StatusBar (iOS) */}
        <div className="flex justify-between items-center px-6 pt-5 pb-2 text-[14px] font-semibold tracking-wide z-10 relative bg-[#0A1530]">
          <span>09:58</span>
          <div className="flex items-center gap-1.5 focus:outline-none">
            <SignalHigh size={16} className="stroke-[2.5]" />
            <span>5G</span>
            <BatteryFull size={20} className="stroke-[2] opacity-90" />
          </div>
        </div>

        {/* Dynamic Screen Content */}
        <div className="flex-1 overflow-hidden relative w-full h-full">
          {/* Base Layer: Dashboard */}
          <div className="absolute inset-0 overflow-y-auto scrollbar-hide pb-32">
            <AnimatePresence mode="popLayout">
              {currentView === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <Dashboard
                    setCurrentView={setCurrentView}
                    balances={balances}
                    activeAccount={activeAccount}
                    setActiveAccount={setActiveAccount}
                    investments={investments}
                    marketState={marketState}
                  />
                </motion.div>
              )}
              {currentView === "invest" && (
                <motion.div
                  key="invest"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full absolute inset-0 bg-[#0A1530]"
                >
                  <Invest 
                    setCurrentView={setCurrentView} 
                    marketState={marketState}
                    newsFeed={newsFeed}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {currentView !== "dashboard" &&
              currentView !== "invest" &&
              currentView !== "virements" &&
              currentView !== "cryptos" &&
              currentView !== "news_feed" &&
              currentView !== "invest_flow" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 bg-[#050A1A]/80 backdrop-blur-sm"
                  onClick={() => setCurrentView("dashboard")}
                />
              )}
          </AnimatePresence>

          <AnimatePresence>
            {currentView === "invest_flow" && (
              <InvestFlow
                key="invest_flow"
                setCurrentView={setCurrentView}
                setInvestments={setInvestments}
                marketState={marketState}
              />
            )}
            {currentView === "news_feed" && (
              <motion.div
                key="news_feed"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="h-full absolute inset-0 bg-[#0A1530] z-50 flex flex-col"
              >
                <div className="px-4 py-4 flex items-center border-b border-white/10 shrink-0">
                  <button
                    onClick={() => setCurrentView("invest")}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0"
                  >
                    <ChevronLeft size={24} className="text-white" />
                  </button>
                  <h2 className="text-[18px] font-bold text-white ml-2">
                    Actualités Moben
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-hide p-4 flex flex-col gap-4">
                  {newsFeed.map(news => (
                    <motion.div 
                      key={news.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#1c2b43] p-4 rounded-[24px] border border-white/5"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-blue-400 tracking-wider">BLOOMBERG • {news.category}</span>
                        <span className="text-[10px] text-white/40">il y a {Math.floor((new Date().getTime() - news.timestamp.getTime()) / 60000)}m</span>
                      </div>
                      <h3 className="text-white font-bold text-[15px] leading-tight mb-2">{news.title}</h3>
                      <div className="bg-[#0A1530] px-2 py-1 rounded-md w-fit">
                        <span className="text-[10px] font-bold text-white/60">{news.ticker}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {currentView === "patrimoine_comptes" && (
              <PatrimoineComptes
                key="patrimoine"
                setCurrentView={setCurrentView}
                balances={balances}
                investments={investments}
                marketState={marketState}
              />
            )}
            {currentView === "add_money" && (
              <AddMoney
                key="add_money"
                setCurrentView={setCurrentView}
                activeAccount={activeAccount}
                currentBalance={balances[activeAccount]}
                onAddMoney={addMoney}
              />
            )}
            {currentView === "transfer" && (
              <Transfer
                key="transfer"
                setCurrentView={setCurrentView}
                balances={balances}
                onTransfer={transferMoney}
              />
            )}
            {currentView === "virements" && (
              <Virements
                key="virements"
                setCurrentView={setCurrentView}
                setSelectedContact={setSelectedContact}
                contacts={contacts}
                onAddContactClick={() => setShowSearch(true)}
              />
            )}
            {currentView === "chat_view" && (
              <ChatView
                key="chat_view"
                setCurrentView={setCurrentView}
                contact={selectedContact}
                messages={
                  selectedContact ? contactMessages[selectedContact.id] : []
                }
                onSendMessage={sendMessage}
                balances={balances}
              />
            )}
            {currentView === "contact_transfer" && (
              <ContactTransfer
                key="contact_transfer"
                setCurrentView={setCurrentView}
                contact={selectedContact}
              />
            )}
            {currentView === "cryptos" && (
              <motion.div
                key="cryptos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full absolute inset-0 bg-[#050A1A] overflow-y-auto scrollbar-hide"
              >
                <Cryptos setCurrentView={setCurrentView} marketState={marketState} />
              </motion.div>
            )}
            {currentView === "points" && (
              <motion.div
                key="points"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full absolute inset-0 bg-[#050A1A] overflow-y-auto scrollbar-hide"
              >
                <MobenPoints setCurrentView={setCurrentView} />
              </motion.div>
            )}
            {currentView === "bank_details" && (
              <BankDetails
                key="bank_details"
                setCurrentView={setCurrentView}
                activeAccount={activeAccount}
              />
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showSearch && (
            <MobenTagSearch
              onClose={() => setShowSearch(false)}
              onAddContact={(newContact) => {
                setContacts((prev) => [newContact, ...prev]);
                setShowSearch(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* Bottom Navigation Bar */}
        <AnimatePresence>
          {["dashboard", "invest", "virements", "cryptos", "points"].includes(
            currentView,
          ) && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute bottom-0 left-0 right-0 bg-[#0A1530]/90 backdrop-blur-md border-t border-white/5 pt-2.5 pb-6 px-2 flex justify-around items-end z-20"
            >
              <div
                onClick={() => setCurrentView("dashboard")}
                className={`flex flex-col items-center cursor-pointer w-16 relative gap-[4px] pt-1.5 transition ${currentView === "dashboard" ? "text-white" : "text-[#64748b] hover:text-white"}`}
              >
                {currentView === "dashboard" && (
                  <div className="absolute -top-[10px] w-10 h-1 bg-[#3b82f6] rounded-b-[4px]"></div>
                )}
                <div className="h-[24px] flex items-center justify-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentView === "dashboard" ? "bg-gradient-to-br from-[#3b82f6] to-[#2563eb] shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-white/5"}`}
                  >
                    <span className="font-black text-[16px] leading-none tracking-tight text-white">
                      M
                    </span>
                  </div>
                </div>
                <span className="text-[10px] tracking-wide">Accueil</span>
              </div>

              <div
                onClick={() => setCurrentView("invest")}
                className={`flex flex-col items-center cursor-pointer w-16 relative gap-[4px] pt-1.5 transition ${currentView === "invest" ? "text-white" : "text-[#64748b] hover:text-white"}`}
              >
                {currentView === "invest" && (
                  <div className="absolute -top-[10px] w-10 h-1 bg-[#3b82f6] rounded-b-[4px]"></div>
                )}
                <BarChart3 size={24} className="stroke-[2]" />
                <span className="text-[10px] tracking-wide">Investir</span>
              </div>

              <div
                onClick={() => setCurrentView("virements")}
                className={`flex flex-col items-center cursor-pointer w-16 relative gap-[4px] pt-1.5 transition ${currentView === "virements" ? "text-white" : "text-[#64748b] hover:text-white"}`}
              >
                {currentView === "virements" && (
                  <div className="absolute -top-[10px] w-10 h-1 bg-[#3b82f6] rounded-b-[4px]"></div>
                )}
                <ArrowLeftRight size={24} className="stroke-[2]" />
                <span className="text-[10px] tracking-wide">Virements</span>
              </div>

              <div
                onClick={() => setCurrentView("cryptos")}
                className={`flex flex-col items-center cursor-pointer w-16 relative gap-[4px] pt-1.5 transition ${currentView === "cryptos" ? "text-white" : "text-[#64748b] hover:text-white"}`}
              >
                {currentView === "cryptos" && (
                  <div className="absolute -top-[10px] w-10 h-1 bg-[#3b82f6] rounded-b-[4px]"></div>
                )}
                <Bitcoin size={24} className="stroke-[2]" />
                <span className="text-[10px] tracking-wide">Cryptos</span>
              </div>

              <div
                onClick={() => setCurrentView("points")}
                className={`flex flex-col items-center cursor-pointer w-16 relative gap-[4px] pt-1.5 transition ${currentView === "points" ? "text-white" : "text-[#64748b] hover:text-white"}`}
              >
                {currentView === "points" && (
                  <div className="absolute -top-[10px] w-10 h-1 bg-[#3b82f6] rounded-b-[4px]"></div>
                )}
                <Hexagon size={24} className="stroke-[2]" />
                <span className="text-[10px] tracking-wide">Points</span>
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
// DASHBOARD VIEW
function Dashboard({
  setCurrentView,
  balances,
  activeAccount,
  setActiveAccount,
  investments,
  marketState,
}: any) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const portfolioScrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const [rates, setRates] = useState({
    GBP: { val: 11.2, pct: 0.08 },
    USD: { val: 10.15, pct: 0.24 },
  });

  useEffect(() => {
    // Simulate real-time market fluctuations
    const interval = setInterval(() => {
      setRates((prev) => ({
        GBP: {
          val: prev.GBP.val + (Math.random() * 0.02 - 0.01),
          pct: prev.GBP.pct + (Math.random() * 0.02 - 0.01),
        },
        USD: {
          val: prev.USD.val + (Math.random() * 0.02 - 0.01),
          pct: prev.USD.pct + (Math.random() * 0.02 - 0.01),
        },
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const slideIndex = Math.round(scrollLeft / width);
    const accounts: ("MAD" | "EUR" | "USD" | "GBP")[] = [
      "MAD",
      "EUR",
      "USD",
      "GBP",
    ];
    if (accounts[slideIndex]) {
      setActiveAccount(accounts[slideIndex]);
    }
  };

  const scrollToAccount = (index: number) => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: width * index,
        behavior: "smooth",
      });
    }
  };

  const handlePortfolioScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const slideIndex = Math.round(scrollLeft / width);
    setActiveSlide(slideIndex);
  };

  const renderDots = () => {
    const accounts: ("MAD" | "EUR" | "USD" | "GBP")[] = [
      "MAD",
      "EUR",
      "USD",
      "GBP",
    ];
    const activeIndex = accounts.indexOf(activeAccount);
    return [0, 1, 2, 3].map((dot) => (
      <div
        key={dot}
        onClick={() => scrollToAccount(dot)}
        className={`w-[6px] h-[6px] rounded-full transition-all duration-300 cursor-pointer ${dot === activeIndex ? "bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-white/20"}`}
      ></div>
    ));
  };

  return (
    <div className="flex flex-col pt-2 w-full pb-10">
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
        <div className="flex gap-[6px] mb-3">{renderDots()}</div>

        <div
          ref={scrollContainerRef}
          className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide py-2"
          onScroll={handleScroll}
        >
          {/* Slides: MAD, EUR, USD, GBP */}
          {(["MAD", "EUR", "USD", "GBP"] as const).map((curr) => (
            <div
              key={curr}
              className="w-full shrink-0 snap-center flex flex-col items-center px-4"
            >
              <p className="text-[13px] text-white/70 font-medium tracking-wide mb-1">
                Adam Benabdelhak - {curr}
              </p>
              <motion.div
                key={curr}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springTransition}
                className="flex items-baseline justify-center mb-6"
              >
                <span className="text-[40px] font-bold tracking-tight leading-none text-white whitespace-nowrap">
                  {formatMoneyParts(balances[curr]).integerPart}
                </span>
                <span className="text-[20px] font-medium tracking-wide text-white/70 ml-0.5">
                  <span className="opacity-70 text-[0.8em]">
                    {formatMoneyParts(balances[curr]).decimalPart}
                  </span>
                  <span className="ml-1 opacity-70 text-[0.8em]">{curr}</span>
                </span>
              </motion.div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={springTransition}
                onClick={() => setCurrentView("patrimoine_comptes")}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition text-white rounded-[20px] text-[13px] font-medium border border-white/5"
              >
                Comptes et Portefeuilles
              </motion.button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-around px-4 mt-8 mb-4">
        <motion.div
          whileTap={{ scale: 0.95 }}
          transition={springTransition}
          className="flex flex-col items-center gap-2 group w-[80px] cursor-pointer"
          onClick={() => setCurrentView("add_money")}
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
          onClick={() => setCurrentView("transfer")}
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
          onClick={() => setCurrentView("bank_details")}
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
          <h3 className="text-[13px] font-medium text-[#94a3b8] mb-1">
            Dépenses du mois
          </h3>
          <div className="flex items-baseline mb-6">
            <span className="text-5xl font-bold text-white tracking-tight leading-none">
              27 832
            </span>
            <span className="text-2xl font-medium text-white/50 ml-0.5">
              ,00 MAD
            </span>
          </div>

          {/* Progress Bar with markers */}
          <div className="relative pt-2">
            <div className="w-full flex h-[4px] gap-[2px]">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full ${i < 21 ? "bg-white" : "bg-white/20"}`}
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

      <div className="px-4 mt-6 pb-6">
        <div className="flex items-center text-[#94a3b8] font-semibold text-[13px] mb-3 px-1 cursor-pointer w-max gap-2">
          <span
            className={activeSlide === 0 ? "text-[#e2e8f0]" : "opacity-70"}
            onClick={() =>
              portfolioScrollRef.current?.scrollTo({
                left: 0,
                behavior: "smooth",
              })
            }
          >
            Liste de surveillance
          </span>
          {Object.keys(investments || {}).length > 0 && (
            <>
              <span className="text-[#94a3b8]">•</span>
              <span
                className={activeSlide === 1 ? "text-[#e2e8f0]" : "opacity-70"}
                onClick={() =>
                  portfolioScrollRef.current?.scrollTo({
                    left: portfolioScrollRef.current?.clientWidth,
                    behavior: "smooth",
                  })
                }
              >
                Mes Investissements
              </span>
            </>
          )}
        </div>

        <div
          ref={portfolioScrollRef}
          onScroll={handlePortfolioScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 -mx-4"
        >
          {/* SLIDE 1: Forex Market */}
          <div className="min-w-full snap-start pr-4 pb-4 px-4 overflow-hidden">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              <WatchlistCard
                icon="🇬🇧"
                name="GBP"
                value={`${formatMoneyParts(rates.GBP.val).integerPart}${formatMoneyParts(rates.GBP.val).decimalPart}`}
                pct={rates.GBP.pct}
              />
              <WatchlistCard
                icon="🇺🇸"
                name="USD"
                value={`${formatMoneyParts(rates.USD.val).integerPart}${formatMoneyParts(rates.USD.val).decimalPart}`}
                pct={rates.USD.pct}
              />
              <WatchlistCard
                icon="🇪🇺"
                name="EUR"
                value={`${formatMoneyParts(10.77).integerPart}${formatMoneyParts(10.77).decimalPart}`}
                pct={0.12}
              />
              <WatchlistCard
                icon="🇨🇭"
                name="CHF"
                value={`${formatMoneyParts(11.45).integerPart}${formatMoneyParts(11.45).decimalPart}`}
                pct={-0.05}
              />
              <div className="w-4 shrink-0"></div>
            </div>
          </div>

          {/* SLIDE 2: Personal Portfolio / Empty State */}
          <div className="min-w-full snap-start px-4">
            {Object.keys(investments || {}).length > 0 ? (
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pr-10 pb-2">
                {Object.entries(investments).map(([id, data]) => {
                  const asset = ALL_ASSETS.find((a) => a.id === id);
                  if (!asset) return null;
                  const investmentData = data as { quantity: number; totalInvestedMAD: number };
                  
                  // Use live price from marketState
                  const livePrice = (marketState.prices as any)[id] || asset.price;
                  const currentVal = investmentData.quantity * livePrice;
                  return (
                    <motion.div
                      key={id}
                      whileTap={{ scale: 0.98 }}
                      className="min-w-[85%] snap-center bg-[#1c2b43] rounded-[24px] p-5 border border-white/5 shadow-xl flex flex-col justify-between h-[160px]"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-[18px] ${asset.bg}`}
                          >
                            {asset.icon}
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-[15px]">
                              {asset.name}
                            </h4>
                          </div>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-[11px] font-bold ${asset.apy >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                        >
                          {asset.apy >= 0 ? "+" : ""}
                          {(asset.apy / 365).toFixed(2)}%
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-[#94a3b8] text-[11px] font-bold uppercase tracking-wider mb-1">
                          Valeur actuelle
                        </p>
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-1">
                            <span className="text-[24px] font-bold text-white tracking-tight">
                              {formatMoneyParts(currentVal).integerPart}
                            </span>
                            <span className="text-[14px] font-bold text-white/50">
                              {formatMoneyParts(currentVal).decimalPart} MAD
                            </span>
                          </div>
                          <p className="text-[#94a3b8] text-[12px] font-medium mt-0.5">
                            {investmentData.quantity.toFixed(3)} actions
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {/* End Spacer */}
                <div className="w-10 shrink-0"></div>
              </div>
            ) : (
              <div className="bg-[#1c2b43] rounded-[24px] p-6 border border-white/5 shadow-lg flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <BarChart3 size={28} className="text-[#3b82f6]" />
                </div>
                <h3 className="text-white font-bold text-[17px] mb-2">
                  Commencez à investir dès 1 MAD
                </h3>
                <p className="text-[#94a3b8] text-[13px] font-medium leading-relaxed mb-6 px-4">
                  Diversifiez votre patrimoine avec des actions, cryptos et
                  matières premières en quelques clics.
                </p>
                <button
                  onClick={() => setCurrentView("invest")}
                  className="w-full bg-[#3b82f6] transition h-12 rounded-[18px] font-bold text-[14px] text-white shadow-lg shadow-blue-500/20"
                >
                  Découvrir les actifs
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-4 gap-1.5">
          <div
            className={`h-[5px] rounded-full transition-all duration-300 ${activeSlide === 0 ? "w-4 bg-white" : "w-1.5 bg-white/20"}`}
          />
          <div
            className={`h-[5px] rounded-full transition-all duration-300 ${activeSlide === 1 ? "w-4 bg-white" : "w-1.5 bg-white/20"}`}
          />
        </div>
      </div>
    </div>
  );
}

function WatchlistCard({ icon, name, value, pct }: any) {
  const isPositive = pct >= 0;
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className="bg-[#1c2b43] rounded-[24px] p-4 border border-white/5 shadow-lg flex flex-col min-w-[140px] shrink-0"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[20px]">{icon}</span>
        <span
          className={`text-[11px] font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}
        >
          {isPositive ? "+" : ""}
          {pct.toFixed(2)}%
        </span>
      </div>
      <p className="text-[12px] font-bold text-[#94a3b8] mb-1">{name}/MAD</p>
      <p className="text-[16px] font-bold text-white">{value}</p>
    </motion.div>
  );
}

function MarketRow({
  icon,
  customIcon,
  iconBg,
  name,
  pair,
  value,
  pct,
  isLast,
}: any) {
  const isPositive = pct >= 0;
  return (
    <div
      className={`flex justify-between items-center px-3 py-3 border-b border-white/5 ${isLast ? "border-0" : ""}`}
    >
      <div className="flex items-center gap-3">
        {customIcon ? (
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold ${iconBg}`}
          >
            {customIcon}
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-white/[0.03] flex items-center justify-center text-[18px]">
            {icon}
          </div>
        )}
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
          className={`text-[12px] font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}
        >
          {isPositive ? "+" : ""}
          {pct.toFixed(2)}%
        </motion.span>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* SCREEN: PATRIMOINE & COMPTES (+ Cartes)                                    */
/* ========================================================================== */
function PatrimoineComptes({
  setCurrentView,
  balances,
  investments,
  marketState,
}: any) {
  const totalInvestedValue = Object.entries(investments || {}).reduce(
    (acc, [id, data]: [string, any]) => {
      const asset = ALL_ASSETS.find((a) => a.id === id);
      const livePrice = marketState?.prices?.[id] || asset?.price || 0;
      return acc + (data.quantity || 0) * livePrice;
    },
    0,
  );

  const cryptoInvestedValue = Object.entries(investments || {}).reduce(
    (acc, [id, data]: [string, any]) => {
      const asset = ALL_ASSETS.find((a) => a.id === id);
      if (asset?.type === "Crypto") {
        const livePrice = marketState?.prices?.[id] || asset?.price || 0;
        return acc + (data.quantity || 0) * livePrice;
      }
      return acc;
    },
    0,
  );

  const totalMAD =
    balances.MAD + balances.EUR * EXCHANGE_RATE + totalInvestedValue;
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
          onClick={() => setCurrentView("dashboard")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0 z-10"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-6 -mt-12">
        {/* Gestion des Cartes (Horizontal Slider) */}
        <div className="mt-2 mb-8">
          <div className="flex items-center text-[#94a3b8] font-semibold text-[13px] mb-3 px-5 cursor-pointer w-max pl-[60px] pt-2">
            Cartes{" "}
            <ChevronRight size={14} className="ml-0.5 relative top-[1px]" />
          </div>
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-5 gap-4 pb-2"
          >
            <CardItem
              styleType="white"
              name="Adam Benabdelhak"
              number="**6927"
              type="Physique"
              fullNumber="4000 1234 5678 6927"
              expiry="12/28"
              cvv="123"
            />
            <CardItem
              styleType="dark"
              name="Éphémère"
              number="**1234"
              type="Virtuelle"
              fullNumber="4111 0000 1111 1234"
              expiry="05/26"
              cvv="000"
            />
            <CardItem
              styleType="premium"
              name="Premium"
              number="**9999"
              type="Originale"
              fullNumber="4242 4242 4242 9999"
              expiry="09/29"
              cvv="420"
            />
          </div>
          {/* Card Pagination Dots */}
          <div className="flex justify-center gap-1.5 mt-2">
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                className={`w-[6px] h-[6px] rounded-full transition-colors duration-300 ${dot === activeCardData ? "bg-white" : "bg-white/20"}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Patrimoine Total Center */}
        <div className="px-4 text-center mt-2 mb-6">
          <div className="flex items-center justify-center text-[#94a3b8] font-semibold text-[13px] mb-1 cursor-pointer">
            Patrimoine total{" "}
            <ChevronRight size={14} className="ml-0.5 relative top-[1px]" />
          </div>
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-bold tracking-tight text-white whitespace-nowrap">
              {formatMoneyParts(totalMAD).integerPart}
            </span>
            <span className="text-2xl font-medium text-white/60 ml-0.5">
              {formatMoneyParts(totalMAD).decimalPart}{" "}
              <span className="ml-1">MAD</span>
            </span>
          </div>
        </div>

        {/* Patrimoine List rows */}
        <div className="px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="bg-[#1c2b43] rounded-[24px] p-2 border border-white/5 flex flex-col shadow-lg"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <PatrimoineRow
                icon={<Coins size={20} className="text-[#3b82f6]" />}
                iconBg="bg-[#3b82f6]/10"
                label="Espèces"
                subValue={`${formatMoney(totalMAD)} MAD`}
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <PatrimoineRow
                icon={<HandCoins size={20} className="text-[#eab308]" />}
                iconBg="bg-[#eab308]/10"
                label="Prêt"
                subValue="Obtenez un prêt allant jusqu'à..."
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <PatrimoineRow
                icon={<BarChart3 size={20} className="text-[#3b82f6]" />}
                iconBg="bg-[#3b82f6]/10"
                label="Investir"
                subValue={
                  totalInvestedValue > 0
                    ? `${formatMoney(totalInvestedValue)} MAD`
                    : "Investir dès 1 MAD"
                }
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <PatrimoineRow
                icon={<Bitcoin size={20} className="text-[#a855f7]" />}
                iconBg="bg-[#a855f7]/10"
                label="Cryptos"
                subValue={`${formatMoney(cryptoInvestedValue)} MAD`}
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
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
    <div
      className={`flex items-center justify-between p-3 border-b border-white/5 ${isLast ? "border-0" : ""}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold text-white tracking-wide">
            {label}
          </span>
          <span className="text-[13px] text-[#94a3b8]">{subValue}</span>
        </div>
      </div>
    </div>
  );
}

function CardItem({
  styleType,
  name,
  number,
  type,
  fullNumber,
  expiry,
  cvv,
}: any) {
  const [isFlipped, setIsFlipped] = useState(false);

  let bgClass = "";
  let textClass = "text-white";

  if (styleType === "white") {
    bgClass = "bg-[#f8f9fa] shadow-sm text-black border-[3px] border-[#e2e8f0]";
    textClass = "text-black";
  } else if (styleType === "dark") {
    bgClass = "bg-[#18233A] border border-[#a5b9fc]/20 text-white";
  } else if (styleType === "premium") {
    bgClass =
      "bg-gradient-to-br from-[#8A2387] via-[#E94057] to-[#F27121] text-white shadow-lg shadow-[#8A2387]/20 border border-white/10";
  }

  return (
    <div
      className="shrink-0 w-full sm:w-[280px] h-[170px] snap-center cursor-pointer group"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Face */}
        <div
          className={`absolute inset-0 rounded-[24px] p-5 flex flex-col justify-between overflow-hidden ${bgClass} ${textClass}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-start z-10 relative">
            <div className="font-extrabold tracking-widest text-[14px] italic opacity-90">
              MOBEN
            </div>
            <span className="text-[11px] uppercase font-bold px-2 py-0.5 bg-black/10 rounded-[8px] backdrop-blur-md border border-white/10">
              {type}
            </span>
          </div>
          <div className="flex flex-col z-10 relative">
            <div className="font-mono tracking-[0.2em] text-[16px] opacity-80 mb-2">
              {number}
            </div>
            <div className="flex justify-between items-end">
              <span className="text-[14px] font-semibold truncate pr-2 opacity-90">
                {name}
              </span>
              <div className="italic font-bold text-[20px] opacity-90">
                VISA
              </div>
            </div>
          </div>
          {styleType === "premium" && (
            <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] bg-white/10 rounded-full blur-[30px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          )}
        </div>

        {/* Back Face */}
        <div
          className={`absolute inset-0 rounded-[24px] p-5 flex flex-col justify-between overflow-hidden ${bgClass} ${textClass}`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* Magnetic Stripe */}
          <div className="w-full h-10 bg-black/30 absolute top-6 left-0"></div>

          <div className="pt-12 flex flex-col gap-2 relative z-10 mt-1">
            <div className="flex items-center justify-end bg-white/20 px-3 py-1 rounded text-right">
              <span className="text-[10px] uppercase font-bold mr-2 opacity-70">
                CVV
              </span>
              <span className="font-mono text-[13px]">{cvv}</span>
            </div>
            <div className="flex flex-col mt-0.5">
              <span className="font-mono text-[15px] opacity-90 tracking-widest">
                {fullNumber}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] uppercase opacity-70">Exp</span>
                <span className="font-mono text-[12px] opacity-90">
                  {expiry}
                </span>
              </div>
            </div>
          </div>
          {styleType === "premium" && (
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
function AddMoney({
  setCurrentView,
  activeAccount,
  currentBalance,
  onAddMoney,
}: any) {
  const [inputVal, setInputVal] = useState("100");

  const handleConfirm = () => {
    const amount = parseFloat(inputVal.replace(",", "."));
    if (!isNaN(amount) && amount > 0) {
      onAddMoney(amount, activeAccount);
      setCurrentView("dashboard");
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
        <button
          onClick={() => setCurrentView("dashboard")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <div className="flex-1 text-center pr-10">
          <h2 className="text-[16px] font-semibold text-white leading-tight">
            Ajouter de l'argent
          </h2>
          <p className="text-[12px] text-white/50 font-medium mt-0.5">
            Solde : {formatMoney(currentBalance)} {activeAccount}
          </p>
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
            <span className="text-[32px] font-semibold text-white/70">
              {activeAccount}
            </span>
          </span>
        </div>

        <button className="mt-8 flex items-center gap-2 bg-[#1c2b43] hover:bg-[#2a3c5a] border border-white/10 rounded-full px-5 py-2.5 transition">
          <div className="bg-white text-black rounded px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-0.5">
            <svg
              viewBox="0 0 384 512"
              className="w-[10px] h-[10px]"
              fill="currentColor"
            >
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 47.1-.8 81.2-82.6 81.2-82.6-43.1-15.6-59.8-59.5-59.8-105.7M249.4 72.3c4.6-21.2-12.8-50.5-38.3-64.3-11.4 34.3-43.2 59-67.6 59-4 22.8 13.9 50 39.8 63 11-34.5 45.4-56.1 66.1-57.7" />
            </svg>
            Pay
          </div>
          <span className="text-[13px] font-semibold text-white">
            Apple Pay · {activeAccount}
          </span>
          <ArrowDown size={14} className="text-white/50 ml-1" />
        </button>
      </div>

      <div className="px-5 pb-10 pt-4">
        <p className="text-center text-[12px] text-white/50 font-medium mb-4">
          Arrivée · Généralement instantanée
        </p>
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
  const [source, setSource] = useState<"EUR" | "MAD">("EUR");
  const [amountStr, setAmountStr] = useState<string>("");
  const [step, setStep] = useState<"input" | "confirm">("input");

  const target = source === "EUR" ? "MAD" : "EUR";
  const amount = parseFloat(amountStr.replace(",", ".")) || 0;

  const targetAmount =
    source === "EUR" ? amount * EXCHANGE_RATE : amount / EXCHANGE_RATE;

  const handleFlip = () => {
    setSource(target);
    setAmountStr("");
    setStep("input");
  };

  const handleAction = () => {
    if (step === "input") {
      if (amount > 0) setStep("confirm");
    } else {
      onTransfer(source, amount);
      setCurrentView("dashboard");
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
          onClick={() =>
            step === "confirm" ? setStep("input") : setCurrentView("dashboard")
          }
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <div className="flex-1 text-center pr-10">
          <h2 className="text-[16px] font-semibold text-white leading-tight">
            Transférez de l'argent
          </h2>
          <p className="text-[12px] text-[#3b82f6] font-medium mt-0.5">
            1 EUR = {EXCHANGE_RATE} MAD
          </p>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="relative">
          <div className="bg-[#1c2b43] rounded-t-[20px] p-5 pb-8 flex items-center justify-between border border-white/5 border-b-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-opacity-20 border border-white/10 flex items-center justify-center text-[16px] overflow-hidden">
                {source === "EUR" ? "🇪🇺" : "🇲🇦"}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-[15px] text-white">
                  {source}
                </span>
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
                    setStep("input");
                  }}
                  className="bg-transparent border-none outline-none w-full text-right placeholder-white/30 truncate"
                  style={{
                    width: amountStr.length ? `${amountStr.length}ch` : "1ch",
                  }}
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
                {target === "EUR" ? "🇪🇺" : "🇲🇦"}
              </div>
              <div className="flex items-center gap-1 pl-[2px]">
                <span className="font-semibold text-[15px] text-white">
                  {target}
                </span>
                <ArrowDown size={14} className="text-white/50" />
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span
                className={`text-[22px] font-bold inline-flex items-baseline ${amount > 0 ? "text-[#3b82f6]" : "text-white/30"}`}
              >
                {amount > 0 ? "+" : ""}
                {formatMoney(targetAmount)}
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
            ${
              step === "confirm" && amount > 0
                ? "bg-[#3b82f6] hover:bg-blue-600 text-white shadow-lg"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
        >
          {step === "confirm" ? "Confirmer le transfert" : "Vérifier le change"}
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
          <button
            onClick={() => setCurrentView("dashboard")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <div className="flex-1 pr-10 flex justify-center">
            <div className="bg-[#1c2b43] rounded-full flex items-center gap-2 px-3 py-1.5 border border-white/5">
              <span className="text-[12px] leading-none">
                {activeAccount === "EUR" ? "🇪🇺" : "🇲🇦"}
              </span>
              <span className="text-[13px] font-medium">
                {activeAccount === "EUR" ? "Euro" : "Dirham"}
              </span>
            </div>
          </div>
        </div>
        <h2 className="text-[22px] font-bold text-white mt-4 ml-1">
          Coordonnées bancaires
        </h2>
      </div>

      <div className="px-4 pb-16 flex-1 overflow-y-auto scrollbar-hide">
        <div className="bg-[#1c2b43] rounded-[24px] p-5 border border-white/5 flex flex-col gap-6 mt-4">
          <InfoRow label="Bénéficiaire" value="Adam Benabdelhak" />
          <InfoRow
            label="IBAN"
            value={
              activeAccount === "EUR"
                ? "FR76 1234 5678 9012 3456 7890 123"
                : "MA03 0000 0000 0000 0000 0000 000"
            }
          />
          <InfoRow
            label="BIC"
            value={activeAccount === "EUR" ? "REVOFRXX" : "MOBEMAMX"}
          />
          <InfoRow
            label="Adresse de la banque"
            value="Revolut Bank UAB, Succursale Française, 12 rue de la Paix, 75002 Paris"
          />
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
              <h4 className="text-[13px] font-semibold text-white">
                Vos fonds sont protégés
              </h4>
              <p className="text-[12px] text-[#94a3b8] leading-snug mt-0.5">
                Votre argent est protégé jusqu'à 100 000 € par le système de
                garantie des dépôts.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-[#1c2b43] flex items-center justify-center shrink-0">
              <Clock size={16} className="text-[#3b82f6]" />
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-white">
                Délais de transfert
              </h4>
              <p className="text-[12px] text-[#94a3b8] leading-snug mt-0.5">
                Les virements SEPA réguliers prennent généralement de 1 à 2
                jours ouvrables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start border-b border-white/5 pb-5 last:border-0 last:pb-0">
      <div className="flex-1 pr-4">
        <p className="text-[12px] font-medium text-[#94a3b8] mb-1">{label}</p>
        <p className="text-[14px] font-semibold text-[#3b82f6] break-all">
          {value}
        </p>
      </div>
      <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition flex items-center justify-center shrink-0 mt-1">
        <Copy size={14} className="text-white" />
      </button>
    </div>
  );
}

function Virements({
  setCurrentView,
  setSelectedContact,
  contacts,
  onAddContactClick,
}: any) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="absolute inset-0 flex flex-col h-full bg-[#051025] z-0 overflow-hidden"
    >
      <div className="px-5 pt-6 pb-2 relative z-10 bg-[#0A1530]">
        <div className="flex items-center mb-4">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <h2 className="text-[20px] font-bold text-white ml-2 flex-1 relative top-[1px]">
            Virements
          </h2>
        </div>
        {/* Search bar */}
        <div className="bg-[#1c2b43] rounded-[16px] flex items-center px-4 py-3 border border-white/5">
          <Search size={18} className="text-[#94a3b8] mr-3" />
          <input
            type="text"
            placeholder="Rechercher"
            className="bg-transparent border-none outline-none text-white text-[15px] w-full placeholder-[#94a3b8] font-medium"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-[100px] bg-[#0A1530]">
        <div className="px-5 py-4 cursor-pointer" onClick={onAddContactClick}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-[46px] h-[46px] rounded-full bg-[#3b82f6]/20 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6] shrink-0">
                <Plus size={22} className="stroke-[2.5]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-white font-semibold text-[15px]">
                  Ajouter vos contacts
                </h3>
                <p className="text-[#94a3b8] text-[13px]">
                  Pour des paiements rapides
                </p>
              </div>
            </div>
            <button className="bg-white/10 hover:bg-white/20 text-white text-[13px] font-semibold px-4 py-1.5 rounded-full transition">
              Continuer
            </button>
          </div>
        </div>

        <div className="px-5">
          <div className="h-[1px] w-full bg-white/5 mb-2 mt-1"></div>
          {contacts.map((contact: any) => (
            <motion.div
              whileTap={{ scale: 0.98 }}
              key={contact.id}
              onClick={() => {
                setSelectedContact(contact);
                setCurrentView("chat_view");
              }}
              className="flex items-center justify-between py-3.5 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className={`w-[46px] h-[46px] rounded-full flex items-center justify-center text-white text-[17px] font-semibold ${contact.bg}`}
                  >
                    {contact.initials}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] bg-[#0A1530] rounded-full flex items-center justify-center">
                    <div className="w-[16px] h-[16px] bg-white rounded-full flex items-center justify-center text-[#0A1530] text-[10px] font-extrabold pb-[0.5px]">
                      M
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-white font-semibold text-[15px]">
                    {contact.name}
                  </h3>
                  {contact.mobenTag ? (
                    <p className="text-[#3b82f6] text-[12px] font-medium leading-none mb-1">
                      @{contact.mobenTag}
                    </p>
                  ) : (
                    <p className="text-[#94a3b8] text-[13px]">
                      {contact.transaction}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-[#94a3b8] text-[12px] font-medium">
                {contact.date}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MobenTagSearch({
  onClose,
  onAddContact,
}: {
  onClose: () => void;
  onAddContact: (c: any) => void;
}) {
  const [query, setQuery] = useState("");

  // Logic: "Bena94alt" -> show Adam Benabdelhak
  const normalizedQuery = query.startsWith("@")
    ? query.slice(1).toLowerCase()
    : query.toLowerCase();
  const showResult = normalizedQuery === "bena94alt";

  const handleAdd = () => {
    onAddContact({
      id: Date.now(),
      name: "Adam Benabdelhak",
      initials: "AB",
      bg: "bg-[#3b82f6]",
      transaction: "Nouveau contact",
      date: "Aujourd'hui",
      mobenTag: "Bena94alt",
      type: "received",
      amount: "0",
    });
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="fixed inset-0 z-[60] bg-[#050A1A] flex flex-col"
    >
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center mb-6">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <h2 className="text-[18px] font-bold text-white ml-2 flex-1 text-center pr-10">
            Ajouter via MobenTag
          </h2>
        </div>

        <div className="bg-[#1c2b43] rounded-[20px] flex items-center px-5 py-4 border border-white/10 focus-within:border-[#3b82f6] transition shadow-lg">
          <span className="text-[#3b82f6] text-[20px] font-bold mr-1">@</span>
          <input
            autoFocus
            type="text"
            placeholder="Tag de votre ami"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-[18px] w-full font-semibold placeholder-white/20"
          />
        </div>

        <div className="mt-8">
          <p className="text-[#94a3b8] text-[13px] font-medium mb-4 px-1">
            RÉSULTATS
          </p>

          <AnimatePresence>
            {showResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1c2b43] rounded-[24px] p-5 border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-[20px] font-bold shadow-lg">
                    AB
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-[16px]">
                      Adam Benabdelhak
                    </h3>
                    <p className="text-[#3b82f6] text-[14px] font-medium">
                      @Bena94alt
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAdd}
                  className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white shadow-lg"
                >
                  <Plus size={24} strokeWidth={3} />
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 opacity-30">
                <Search size={48} className="text-white mb-3" />
                <p className="text-white font-medium text-[15px]">
                  Cherchez un MobenTag
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function ChatView({
  setCurrentView,
  contact,
  messages = [],
  onSendMessage,
  balances,
}: any) {
  const [msgText, setMsgText] = useState("");
  const [showKeypad, setShowKeypad] = useState(false);
  const [amountStr, setAmountStr] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!contact) return null;

  const handleSendText = () => {
    if (!msgText.trim()) return;
    onSendMessage(contact.id, {
      type: "text",
      content: msgText,
      sender: "me",
    });
    setMsgText("");
  };

  const handleSendMoney = () => {
    const amt = parseFloat(amountStr);
    if (isNaN(amt) || amt <= 0) return;

    // Check balance
    if (amt > balances.MAD) {
      alert("Solde insuffisant");
      return;
    }

    onSendMessage(contact.id, {
      type: "transaction",
      amount: amountStr,
      sender: "me",
      status: "Réussie",
      date: "Aujourd'hui",
    });

    setAmountStr("");
    setShowKeypad(false);
  };

  const addDigit = (digit: string) => {
    if (digit === "." && amountStr.includes(".")) return;
    if (amountStr === "0" && digit !== ".") {
      setAmountStr(digit);
    } else {
      setAmountStr((prev) => prev + digit);
    }
  };

  const deleteDigit = () => {
    setAmountStr((prev) => prev.slice(0, -1));
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="absolute inset-0 flex flex-col h-full bg-[#050A1A] z-40 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-4 flex items-center bg-[#050A1A]/80 backdrop-blur-md border-b border-white/5 relative z-20">
        <button
          onClick={() => setCurrentView("virements")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <div className="flex-1 flex flex-col items-center pr-10">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold relative ${contact.bg}`}
            >
              {contact.initials}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#050A1A] rounded-full"></div>
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white leading-none">
                {contact.name}
              </h2>
              <p className="text-[11px] text-green-500 font-medium mt-1 uppercase tracking-wider">
                En ligne
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth scrollbar-hide"
      >
        {messages.map((msg: any) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex flex-col ${msg.type === "transaction" ? "items-center" : msg.sender === "me" ? "items-end" : "items-start"}`}
          >
            {msg.type === "transaction" ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="bg-[#1c2b43] border border-white/10 rounded-[28px] p-5 flex flex-col items-center gap-3 shadow-xl max-w-[280px] w-full"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${msg.sender === "me" ? "bg-orange-500/20 text-orange-500" : "bg-green-500/20 text-green-500"}`}
                >
                  {msg.sender === "me" ? (
                    <ArrowUpCircle size={28} />
                  ) : (
                    <ArrowDownCircle size={28} />
                  )}
                </div>
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-[28px] font-bold text-white">
                      {msg.amount}
                    </span>
                    <span className="text-[14px] font-bold text-white/50">
                      MAD
                    </span>
                  </div>
                  <p className="text-[12px] font-semibold text-[#94a3b8] mt-0.5">
                    {msg.sender === "me" ? "Envoyé" : "Reçu"} •{" "}
                    {msg.status || "Réussie"}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div
                className={`max-w-[80%] rounded-[20px] px-4 py-3 text-[15px] font-medium leading-relaxed ${
                  msg.sender === "me"
                    ? "bg-[#3b82f6] text-white rounded-br-none shadow-lg shadow-blue-500/10"
                    : "bg-white/10 text-white rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            )}
            <span className="text-[10px] text-white/20 mt-1.5 font-medium uppercase tracking-tighter">
              {msg.date || "Maintenant"}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="px-4 pb-10 pt-2 bg-[#050A1A]">
        <div className="bg-[#1c2b43] rounded-[24px] flex items-center p-1.5 border border-white/5 shadow-lg">
          <button
            onClick={() => setShowKeypad(true)}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition"
          >
            <HandCoins size={22} className="text-[#3b82f6]" />
          </button>

          <input
            type="text"
            placeholder="Écrivez un message..."
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendText()}
            className="flex-1 bg-transparent border-none outline-none text-white px-3 text-[15px] placeholder-white/20 font-medium"
          />

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSendText}
            disabled={!msgText.trim()}
            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all ${
              msgText.trim()
                ? "bg-[#3b82f6] text-white"
                : "bg-white/5 text-white/20"
            }`}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>

      {/* Keypad Overlay */}
      <AnimatePresence>
        {showKeypad && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute inset-0 bg-[#050A1A] z-50 flex flex-col"
          >
            <div className="px-5 pt-6 flex items-center justify-between">
              <button
                onClick={() => setShowKeypad(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5"
              >
                <ChevronLeft size={24} />
              </button>
              <h3 className="text-white font-bold text-[17px]">
                Envoyer à {contact.name.split(" ")[0]}
              </h3>
              <div className="w-10 h-10"></div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center -mt-10">
              <div className="flex items-baseline gap-2 mb-2">
                <span
                  className={`text-[56px] font-bold tracking-tight ${amountStr.length > 0 ? "text-white" : "text-white/20"}`}
                >
                  {amountStr || "0"}
                </span>
                <span className="text-[24px] font-bold text-white/40">MAD</span>
              </div>
              <p className="text-[#94a3b8] text-[13px] font-medium bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                Solde: {formatMoney(balances.MAD)} MAD
              </p>
            </div>

            <div className="px-6 pb-8">
              <div className="grid grid-cols-3 gap-y-4 mb-8">
                {[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  ".",
                  "0",
                  "del",
                ].map((key) => (
                  <button
                    key={key}
                    onClick={() =>
                      key === "del" ? deleteDigit() : addDigit(key)
                    }
                    className="h-16 flex items-center justify-center text-[24px] font-semibold text-white active:bg-white/5 rounded-full transition"
                  >
                    {key === "del" ? <ChevronLeft size={28} /> : key}
                  </button>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMoney}
                disabled={!amountStr || parseFloat(amountStr) <= 0}
                className={`w-full h-[64px] rounded-[24px] font-bold text-[18px] transition-all ${
                  amountStr && parseFloat(amountStr) > 0
                    ? "bg-[#3b82f6] text-white shadow-lg shadow-blue-500/20"
                    : "bg-white/5 text-white/20"
                }`}
              >
                Envoyer {amountStr ? `${amountStr} MAD` : ""}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ContactTransfer({ setCurrentView, contact }: any) {
  const [amountStr, setAmountStr] = useState("");

  if (!contact) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="absolute inset-0 flex flex-col h-full bg-[#051025] z-50 text-white"
    >
      <div className="flex items-center px-4 pt-4 pb-2 relative z-10">
        <button
          onClick={() => setCurrentView("chat_view")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <div className="flex-1 text-center pr-10 flex flex-col items-center">
          <h2 className="text-[17px] font-bold leading-tight truncate px-2">
            {contact.name}
          </h2>
          <p className="text-[13px] text-[#94a3b8] font-medium mt-0.5">
            Envoyer de l'argent
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center -mt-20">
        <div
          className={`w-[84px] h-[84px] rounded-full flex items-center justify-center text-white text-[32px] font-semibold mb-6 shadow-lg ${contact.bg}`}
        >
          {contact.initials}
        </div>

        <div className="flex flex-col items-center justify-center relative">
          <div className="flex items-baseline justify-center font-bold text-[56px] tracking-tight gap-1.5 h-[64px]">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="bg-transparent border-none outline-none text-right placeholder-white/20 w-auto min-w-[1ch] flex-shrink-0"
              style={{
                width: amountStr.length ? `${amountStr.length}ch` : "1.2ch",
              }}
              autoFocus
            />
            <span className="text-[28px] relative -bottom-1">MAD</span>
          </div>
        </div>
        <div className="mt-8 bg-[#1c2b43] rounded-full px-5 py-2.5 text-[14px] text-white/80 font-medium border border-white/5">
          Ajouter une note
        </div>
      </div>

      <div className="px-5 pb-8 relative z-10">
        <motion.button
          whileTap={{ scale: 0.96 }}
          className={`w-full py-[18px] rounded-full font-semibold text-[16px] transition-all flex items-center justify-center gap-2 ${amountStr.length > 0 && parseFloat(amountStr) > 0 ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-white/5 text-[#94a3b8]"}`}
        >
          Continuer
        </motion.button>
      </div>
    </motion.div>
  );
}
