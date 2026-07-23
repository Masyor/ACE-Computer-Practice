import React from 'react';
import { PlayerCustomization } from '../types';
import { Volume2, VolumeX, LogOut, School, Lock, Cat, Coins } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HeaderBarProps {
  player: PlayerCustomization;
  coins: number;
  catPetTimer: number; // 0 if inactive
  isMuted: boolean;
  onToggleMute: () => void;
  onLogout: () => void;
  onOpenQuiz: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  player,
  coins,
  catPetTimer,
  isMuted,
  onToggleMute,
  onLogout,
  onOpenQuiz
}) => {
  return (
    <header className="bg-amber-950/95 border-b-4 border-amber-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg z-20">
      
      {/* Title & Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-amber-800 border-2 border-amber-500 flex items-center justify-center text-amber-200 shadow">
          <School className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-pixel text-xs md:text-sm text-amber-200 tracking-wide">
            ACE COMPUTER PRACTICE
          </h1>
          <p className="font-silkscreen text-[10px] text-amber-400/80">
            Helping you prepare for the computer delivered IELTS
          </p>
        </div>
      </div>

      {/* Corridor HUD Badges: Student, Coins, Cat Pet */}
      <div className="flex flex-wrap items-center gap-2.5 bg-amber-900/60 border-2 border-amber-700/80 px-3 py-1.5 rounded-lg shadow-inner">
        {/* Student Name */}
        <div className="flex flex-col">
          <span className="font-silkscreen text-[9px] text-amber-300/80 uppercase">
            STUDENT
          </span>
          <span className="font-pixel text-xs text-amber-100">
            {player.name}
          </span>
        </div>

        <div className="h-6 w-px bg-amber-700/80 mx-0.5" />

        {/* Stage Level */}
        <div className="flex flex-col">
          <span className="font-silkscreen text-[9px] text-amber-300/80 uppercase">
            STAGE LEVEL
          </span>
          <div 
            title="Stage level locked for this session. Log out to choose another level."
            className="bg-amber-950 border border-amber-600/80 text-amber-300 font-pixel text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-inner"
          >
            <Lock className="w-2.5 h-2.5 text-amber-400" />
            <span>{player.stage}</span>
          </div>
        </div>

        <div className="h-6 w-px bg-amber-700/80 mx-0.5" />

        {/* Coins Badge */}
        <div 
          title="Collect coins in the hallway floor! Use 1 coin at the Vending Machine for snacks and boosts!"
          className="flex items-center gap-1.5 bg-amber-950 border-2 border-yellow-500/80 px-2.5 py-1 rounded-md text-amber-300 font-pixel text-xs shadow animate-pulse"
        >
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span>{coins} COINS</span>
        </div>

        {/* Cat Companion Status */}
        <button
          onClick={() => {
            soundEngine.playSelect();
            onOpenQuiz();
          }}
          title={catPetTimer > 0 ? "Whiskers the Cat is purring! Click to open Mini-Quiz" : "Score 3+ on the Mini-Quiz to recruit Whiskers the Pixel Cat!"}
          className={`flex items-center gap-1.5 border-2 px-2.5 py-1 rounded-md font-pixel text-[10px] transition-transform hover:scale-105 cursor-pointer ${
            catPetTimer > 0 
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md' 
              : 'bg-amber-950 border-amber-700 text-amber-400 opacity-90'
          }`}
        >
          <Cat className={`w-3.5 h-3.5 ${catPetTimer > 0 ? 'text-emerald-400 animate-bounce' : 'text-amber-500'}`} />
          {catPetTimer > 0 ? (
            <span>🐱 CAT: {Math.floor(catPetTimer / 60)}:{String(catPetTimer % 60).padStart(2, '0')}</span>
          ) : (
            <span>🐱 RECRUIT CAT [QUIZ]</span>
          )}
        </button>

      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            soundEngine.playSelect();
            onOpenQuiz();
          }}
          title="Open IELTS Mini-Quiz Kiosk to earn coins & Whiskers the Cat!"
          className="bg-purple-900 hover:bg-purple-800 border-2 border-purple-500 px-3 py-2 rounded font-pixel text-[10px] text-purple-200 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow"
        >
          <span>🎯 MINI-QUIZ</span>
        </button>

        <button
          onClick={onToggleMute}
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
          className="p-2 bg-amber-900/80 hover:bg-amber-800 border-2 border-amber-600 rounded text-amber-200 cursor-pointer transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        <button
          onClick={() => {
            soundEngine.playClose();
            onLogout();
          }}
          title="Log out and reset application to introduction screen"
          className="bg-red-900 hover:bg-red-800 border-2 border-red-500 px-3 py-2 rounded font-pixel text-[10px] text-red-100 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow"
        >
          <LogOut className="w-3.5 h-3.5 text-red-200" />
          <span>LOG OUT</span>
        </button>
      </div>

    </header>
  );
};
