import React, { useState } from 'react';
import { soundEngine } from '../utils/audio';
import { Coins, X, Sparkles, ShoppingBag, Zap, Coffee, BookOpen, PenTool } from 'lucide-react';

interface VendingItem {
  id: string;
  name: string;
  icon: string;
  type: 'speed' | 'coin' | 'tip';
  color: string;
  description: string;
  effectText: string;
}

const VENDING_PRIZES: VendingItem[] = [
  {
    id: 'matcha_boba',
    name: 'Matcha Boba Energy Tea',
    icon: '🧋',
    type: 'speed',
    color: '#10b981',
    description: 'Refreshing iced boba brewed with high-grade green tea.',
    effectText: '⚡ SPEED BOOST! Walking speed increased for 30 seconds!'
  },
  {
    id: 'focus_coffee',
    name: 'IELTS Concentration Espresso',
    icon: '☕',
    type: 'coin',
    color: '#b45309',
    description: 'Dark roasted espresso brewed for late night study sessions.',
    effectText: '🪙 LUCKY COIN! You found 1 extra coin tucked under the cup lid!'
  },
  {
    id: 'grammar_choco',
    name: 'Band 9 Grammar Chocolate',
    icon: '🍫',
    type: 'tip',
    color: '#8b5cf6',
    description: 'Rich dark chocolate wrapped in grammar rules.',
    effectText: '💡 GRAMMAR TIP: "Complement" (completes something) vs "Compliment" (praise)!'
  },
  {
    id: 'vocab_soda',
    name: 'Sparkling Vocab Soda',
    icon: '🥤',
    type: 'tip',
    color: '#0284c7',
    description: 'Fizzy soda infused with high-level academic collocations.',
    effectText: '💡 VOCAB TIP: Replace "important" with "crucial", "paramount", or "imperative"!'
  },
  {
    id: 'golden_pen',
    name: 'Golden Band 9 Fountain Pen',
    icon: '🖊️',
    type: 'speed',
    color: '#eab308',
    description: 'An engraved golden pen for essay writing.',
    effectText: '⚡ SPEED BOOST & TASK 2 TIP: Spend 5 mins planning structure before writing!'
  }
];

interface VendingModalProps {
  coins: number;
  onDeductCoin: () => void;
  onAddCoin: (amount: number) => void;
  onTriggerSpeedBoost: () => void;
  onClose: () => void;
}

export const VendingModal: React.FC<VendingModalProps> = ({
  coins,
  onDeductCoin,
  onAddCoin,
  onTriggerSpeedBoost,
  onClose
}) => {
  const [dispensedItem, setDispensedItem] = useState<VendingItem | null>(null);
  const [isVending, setIsVending] = useState(false);

  const handleBuy = () => {
    if (coins < 1 || isVending) return;

    setIsVending(true);
    soundEngine.playVending();
    onDeductCoin();

    setTimeout(() => {
      const prize = VENDING_PRIZES[Math.floor(Math.random() * VENDING_PRIZES.length)];
      setDispensedItem(prize);
      setIsVending(false);

      if (prize.type === 'speed') {
        onTriggerSpeedBoost();
      } else if (prize.type === 'coin') {
        onAddCoin(1);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-4 border-blue-600 rounded-2xl max-w-md w-full p-6 font-pixel shadow-2xl relative animate-in fade-in zoom-in-95 text-center">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClose();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="w-16 h-16 bg-blue-950 border-2 border-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl shadow-lg">
          🥤
        </div>

        <h2 className="text-base md:text-lg text-blue-200 font-bold mb-1">
          STUDENT VENDING MACHINE
        </h2>
        <p className="text-[10px] text-blue-400/80 font-silkscreen mb-4">
          Vend snacks, energy drinks & band boost tips!
        </p>

        {/* Coin Status */}
        <div className="inline-flex items-center gap-2 bg-slate-950 border-2 border-amber-500 px-4 py-2 rounded-xl mb-6 shadow-inner">
          <Coins className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span className="text-xs text-amber-300 font-bold">YOUR COINS: {coins}</span>
        </div>

        {/* Dispensed Item Area */}
        {dispensedItem ? (
          <div className="bg-slate-950/90 border-2 border-emerald-500 p-5 rounded-2xl mb-6 animate-in zoom-in-90 duration-200">
            <div className="text-4xl mb-2 animate-bounce">{dispensedItem.icon}</div>
            <h3 className="text-sm font-bold text-emerald-300 mb-1">{dispensedItem.name.toUpperCase()}</h3>
            <p className="text-xs text-slate-300 font-sans mb-3">{dispensedItem.description}</p>
            <div className="bg-emerald-950 border border-emerald-700 p-3 rounded-xl text-xs text-emerald-200 font-sans font-semibold">
              {dispensedItem.effectText}
            </div>
          </div>
        ) : isVending ? (
          <div className="bg-slate-950/90 border-2 border-blue-500 p-6 rounded-2xl mb-6 text-blue-300">
            <div className="text-3xl mb-2 animate-spin">⚙️</div>
            <p className="text-xs font-pixel animate-pulse">VENDING SNACK... CLUNK!</p>
          </div>
        ) : (
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl mb-6 text-xs text-slate-400 font-sans">
            Insert 1 coin collected from the corridor floor to vend a surprise snack or boost item!
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {coins >= 1 ? (
            <button
              disabled={isVending}
              onClick={handleBuy}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold font-pixel text-xs rounded-xl border-2 border-blue-300 shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{dispensedItem ? "VEND ANOTHER (1 COIN)" : "INSERT 1 COIN & VEND 🥤"}</span>
            </button>
          ) : (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 font-sans">
              🔒 Requires 1 Coin! Walk around the hallway floor to find shiny golden coins! 🪙
            </div>
          )}

          <button
            onClick={() => {
              soundEngine.playClose();
              onClose();
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-pixel text-xs rounded-xl border border-slate-600 cursor-pointer mt-1"
          >
            Walk Away
          </button>
        </div>

      </div>
    </div>
  );
};
