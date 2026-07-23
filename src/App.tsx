import { useState } from 'react';
import { DoorRoom, PlayerCustomization } from './types';
import { IntroScreen } from './components/IntroScreen';
import { HeaderBar } from './components/HeaderBar';
import { GameCanvas } from './components/GameCanvas';
import { RoomModal } from './components/RoomModal';
import { soundEngine } from './utils/audio';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeRoom, setActiveRoom] = useState<DoorRoom | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const [player, setPlayer] = useState<PlayerCustomization>({
    name: 'Alex',
    stage: 'GEP 11A',
    shirtColor: '#3b82f6',
    hairColor: '#fde047',
    spriteStyle: 'academic'
  });

  const handleIntroComplete = (customization: PlayerCustomization) => {
    setPlayer(customization);
    setShowIntro(false);
  };

  const handleLogout = () => {
    soundEngine.playClose();
    setActiveRoom(null);
    setShowIntro(true);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-pixel select-none overflow-x-hidden">
      
      {/* Top Navigation HUD */}
      <HeaderBar
        player={player}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onLogout={handleLogout}
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
          onOpenRoom={(room) => setActiveRoom(room)}
          isPaused={showIntro || activeRoom !== null}
        />

        {/* Room Collisions & External Resource Modal */}
        {activeRoom && (
          <RoomModal
            room={activeRoom}
            stage={player.stage}
            onClose={() => setActiveRoom(null)}
          />
        )}

      </main>

    </div>
  );
}
