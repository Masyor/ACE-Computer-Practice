import React, { useState } from 'react';
import { soundEngine } from '../utils/audio';
import { Coins, X, ShoppingBag } from 'lucide-react';

interface VendingItem {
  id: string;
  name: string;
  icon: string;
  type: 'speed' | 'coin' | 'tip' | 'cat_time' | 'cat_color';
  color?: string;
  description: string;
  effectText: string;
  caffeineValue?: number;
}

const BASE_VENDING_PRIZES: VendingItem[] = [
  {
    id: 'matcha_boba',
    name: 'Matcha Boba Energy Tea',
    icon: '🧋',
    type: 'speed',
    color: '#10b981',
    description: 'Refreshing iced boba brewed with high-grade green tea. Loaded with sugar and tea caffeine!',
    effectText: '⚡ SPEED BOOST! Walking speed increased for 30 seconds! (Caffeine +1)',
    caffeineValue: 1
  },
  {
    id: 'focus_coffee',
    name: 'Concentration Espresso',
    icon: '☕',
    type: 'speed',
    color: '#b45309',
    description: 'Double shot of dark roasted espresso brewed for study sessions. Extreme caffeine!',
    effectText: '⚡ HYPER ENERGY SPEED BOOST! 🪙 Found 1 lucky coin under the cup lid! (Caffeine +2)',
    caffeineValue: 2
  },
  {
    id: 'grammar_choco',
    name: 'Band 9 Grammar Chocolate',
    icon: '🍫',
    type: 'tip',
    color: '#8b5cf6',
    description: 'Rich dark chocolate wrapped in grammar rules. Instant sugar energy!',
    effectText: '⚡ SWEET ENERGY BOOST! 💡 GRAMMAR: "Complement" (completes) vs "Compliment" (praise)!',
    caffeineValue: 1
  },
  {
    id: 'vocab_soda',
    name: 'Sparkling Vocab Soda',
    icon: '🥤',
    type: 'tip',
    color: '#0284c7',
    description: 'Fizzy soda infused with academic collocations. High sugar speed boost!',
    effectText: '⚡ FIZZY SUGAR BOOST! 💡 VOCAB: Use "crucial" or "paramount" instead of "important"! (Caffeine +1)',
    caffeineValue: 1
  },
  {
    id: 'golden_pen',
    name: 'Golden Band 9 Fountain Pen',
    icon: '🖊️',
    type: 'speed',
    color: '#eab308',
    description: 'An engraved golden pen for essay writing. Inspires swift writing speed.',
    effectText: '⚡ INSPIRATION SPEED BOOST! 💡 WRITING TIP: Plan structure for 5 mins before writing! (0 Caffeine)'
  }
];

const CAT_VENDING_PRIZES: VendingItem[] = [
  {
    id: 'cat_yarn',
    name: 'Rainbow Yarn Ball',
    icon: '🧶',
    type: 'cat_time',
    description: 'A super bouncy, colorful woolen yarn ball that Whiskers absolutely loves!',
    effectText: '🐾 CAT PLAYTIME! Whiskers is overjoyed and will follow you for an extra 45 seconds!'
  },
  {
    id: 'cat_salmon',
    name: 'Premium Salmon Bites',
    icon: '🐟',
    type: 'cat_time',
    description: 'Delectable, organic freeze-dried salmon treats. Pure feline bliss!',
    effectText: '🐾 CAT TREAT! Whiskers purrs happily and follows you for an extra 45 seconds!'
  },
  {
    id: 'cat_dye_pink',
    name: 'Cosmic Pink Fur Dye',
    icon: '🧪',
    type: 'cat_color',
    color: '#ec4899',
    description: 'A magical potion that dyes your cat companion a mystical Cosmic Pink!',
    effectText: '🌈 NEON GLOW! Whiskers is now styled in a stylish Cosmic Pink fur coat!'
  },
  {
    id: 'cat_dye_blue',
    name: 'Midnight Blue Fur Dye',
    icon: '🧪',
    type: 'cat_color',
    color: '#3b82f6',
    description: 'A magical potion that dyes your cat companion a stunning Midnight Blue!',
    effectText: '🌈 NEON GLOW! Whiskers is now styled in a magical Midnight Blue fur coat!'
  },
  {
    id: 'cat_dye_green',
    name: 'Neon Green Fur Dye',
    icon: '🧪',
    type: 'cat_color',
    color: '#22c55e',
    description: 'A magical potion that dyes your cat companion a radiant Neon Green!',
    effectText: '🌈 NEON GLOW! Whiskers is now styled in a radioactive Neon Green fur coat!'
  },
  {
    id: 'cat_dye_purple',
    name: 'Galactic Purple Fur Dye',
    icon: '🧪',
    type: 'cat_color',
    color: '#a855f7',
    description: 'A magical potion that dyes your cat companion a beautiful Galactic Purple!',
    effectText: '🌈 NEON GLOW! Whiskers is now styled in a gorgeous Galactic Purple fur coat!'
  }
];

interface VendingModalProps {
  coins: number;
  catActive: boolean;
  onDeductCoin: () => void;
  onAddCoin: (amount: number) => void;
  onTriggerSpeedBoost: (source?: 'sugar' | 'inspiration') => void;
  onAddCaffeine: (amount: number) => void;
  onAddCatTime: (seconds: number) => void;
  onChangeCatColor: (color: string) => void;
  onClose: () => void;
}

export const VendingModal: React.FC<VendingModalProps> = ({
  coins,
  catActive,
  onDeductCoin,
  onAddCoin,
  onTriggerSpeedBoost,
  onAddCaffeine,
  onAddCatTime,
  onChangeCatColor,
  onClose
}) => {
  const [dispensedItem, setDispensedItem] = useState<VendingItem | null>(null);
  const [isVending, setIsVending] = useState(false);

  const handleBuy = () => {
    if (coins < 10 || isVending) return;

    setIsVending(true);
    soundEngine.playVending();
    onDeductCoin();

    setTimeout(() => {
      // Build dynamic pool of prizes
      const pool: VendingItem[] = [...BASE_VENDING_PRIZES];

      // Only add dyes, toys, and food if the cat is actively following
      if (catActive) {
        const dyes = CAT_VENDING_PRIZES.filter(item => item.type === 'cat_color');
        pool.push(...dyes);
        const timeItems = CAT_VENDING_PRIZES.filter(item => item.type === 'cat_time');
        pool.push(...timeItems);
      }

      const prize = pool[Math.floor(Math.random() * pool.length)];
      setDispensedItem(prize);
      setIsVending(false);

      // Handle custom item actions
      if (prize.type === 'speed') {
        onTriggerSpeedBoost(prize.id === 'golden_pen' ? 'inspiration' : 'sugar');
        if (prize.caffeineValue) {
          onAddCaffeine(prize.caffeineValue);
        }
      } else if (prize.type === 'tip') {
        onTriggerSpeedBoost('sugar'); // Sugar high!
        if (prize.caffeineValue) {
          onAddCaffeine(prize.caffeineValue);
        }
      } else if (prize.id === 'focus_coffee') {
        onTriggerSpeedBoost('sugar');
        onAddCoin(1);
        onAddCaffeine(2);
      } else if (prize.type === 'cat_time') {
        onAddCatTime(45);
        soundEngine.playMeow();
      } else if (prize.type === 'cat_color') {
        if (prize.color) {
          onChangeCatColor(prize.color);
        }
        soundEngine.playMeow();
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
            Insert 10 coins collected from the corridor floor to vend a surprise snack or boost item!
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {coins >= 10 ? (
            <button
              disabled={isVending}
              onClick={handleBuy}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold font-pixel text-xs rounded-xl border-2 border-blue-300 shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{dispensedItem ? "VEND ANOTHER (10 COINS)" : "INSERT 10 COINS & VEND 🥤"}</span>
            </button>
          ) : (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 font-sans">
              🔒 Requires 10 Coins! Walk around the hallway floor to find shiny golden coins! 🪙
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
