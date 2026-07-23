import { useState, useEffect } from 'react';
import { DoorRoom, PlayerCustomization } from './types';
import { IntroScreen } from './components/IntroScreen';
import { HeaderBar } from './components/HeaderBar';
import { GameCanvas } from './components/GameCanvas';
import { RoomModal } from './components/RoomModal';
import { QuizModal } from './components/QuizModal';
import { VendingModal } from './components/VendingModal';
import { soundEngine } from './utils/audio';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeRoom, setActiveRoom] = useState<DoorRoom | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Corridor Interactive HUD States
  const [coins, setCoins] = useState(2); // Start with 2 coins
  const [catPetTimer, setCatPetTimer] = useState(0); // Countdown in seconds
  const [speedBoostTimer, setSpeedBoostTimer] = useState(0); // Speed boost in seconds

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showVendingModal, setShowVendingModal] = useState(false);

  const [player, setPlayer] = useState<PlayerCustomization>({
    name: 'Matt',
    stage: 'GEP 11A',
    shirtColor: '#3b82f6',
    hairColor: '#fde047',
    spriteStyle: 'academic'
  });

  // Countdown timer for Cat Companion and Speed Boost
  useEffect(() => {
    const timer = setInterval(() => {
      setCatPetTimer(prev => {
        if (prev === 1) {
          soundEngine.playMeow();
        }
        return prev > 0 ? prev - 1 : 0;
      });

      setSpeedBoostTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleIntroComplete = (customization: PlayerCustomization) => {
    setPlayer(customization);
    setShowIntro(false);
  };

  const handleLogout = () => {
    soundEngine.playClose();
    setActiveRoom(null);
    setShowQuizModal(false);
    setShowVendingModal(false);
    setShowIntro(true);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleAddCoins = (amount: number) => {
    setCoins(prev => Math.max(0, prev + amount));
  };

  const handleRewardCat = () => {
    setCatPetTimer(120); // 2 minutes of Whiskers following player
    soundEngine.playMeow();
  };

  const handleTriggerSpeedBoost = () => {
    setSpeedBoostTimer(30); // 30 seconds speed boost
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-pixel select-none overflow-x-hidden">
      
      {/* Top Navigation HUD */}
      <HeaderBar
        player={player}
        coins={coins}
        catPetTimer={catPetTimer}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onLogout={handleLogout}
        onOpenQuiz={() => setShowQuizModal(true)}
      />

      {/* Main Game Screen */}
      <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        
        {/* Pokémon Style Intro Overlay */}
        {showIntro && (
          <IntroScreen onComplete={handleIntroComplete} />
        )}

        {/* 2D Top-Down HTML5 Canvas Corridor */}
        <GameCanvas
          playerCustomization={player}
          coins={coins}
          catPetTimer={catPetTimer}
          speedBoostTimer={speedBoostTimer}
          onAddCoins={handleAddCoins}
          onOpenRoom={(room) => setActiveRoom(room)}
          onOpenQuiz={() => setShowQuizModal(true)}
          onOpenVending={() => setShowVendingModal(true)}
          isPaused={showIntro || activeRoom !== null || showQuizModal || showVendingModal}
        />

        {/* Room Collisions & External Resource Modal */}
        {activeRoom && (
          <RoomModal
            room={activeRoom}
            stage={player.stage}
            onClose={() => setActiveRoom(null)}
          />
        )}

        {/* Mini-Quiz Modal */}
        {showQuizModal && (
          <QuizModal
            onClose={() => setShowQuizModal(false)}
            onRewardCat={handleRewardCat}
            onRewardCoins={(amt) => handleAddCoins(amt)}
          />
        )}

        {/* Vending Machine Modal */}
        {showVendingModal && (
          <VendingModal
            coins={coins}
            onDeductCoin={() => handleAddCoins(-1)}
            onAddCoin={(amt) => handleAddCoins(amt)}
            onTriggerSpeedBoost={handleTriggerSpeedBoost}
            onClose={() => setShowVendingModal(false)}
          />
        )}

      </main>

    </div>
  );
}
