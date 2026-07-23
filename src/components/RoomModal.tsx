import React, { useEffect } from 'react';
import { DoorRoom, StageLevel } from '../types';
import { soundEngine } from '../utils/audio';
import { 
  X, ExternalLink, Keyboard, GraduationCap, Headphones, Tv, 
  Zap, BookOpen, Gamepad2, Cpu, FileText, Sparkles, BookMarked, Music, Radio, Volume2, Youtube, ArrowRight, Lock
} from 'lucide-react';

interface RoomModalProps {
  room: DoorRoom;
  stage: StageLevel;
  onClose: () => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  room,
  stage,
  onClose
}) => {
  useEffect(() => {
    soundEngine.playDoorChime();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playClose();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const links = room.getLinks(stage);

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'Zap': return <Zap className="w-4 h-4 text-purple-400" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'Gamepad2': return <Gamepad2 className="w-4 h-4 text-emerald-400" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-sky-400" />;
      case 'FileText': return <FileText className="w-4 h-4 text-red-400" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-amber-300" />;
      case 'BookMarked': return <BookMarked className="w-4 h-4 text-cyan-400" />;
      case 'Music': return <Music className="w-4 h-4 text-pink-400" />;
      case 'Radio': return <Radio className="w-4 h-4 text-teal-400" />;
      case 'Volume2': return <Volume2 className="w-4 h-4 text-emerald-300" />;
      case 'Youtube': return <Youtube className="w-4 h-4 text-red-500" />;
      default: return <ExternalLink className="w-4 h-4 text-amber-300" />;
    }
  };

  const getRoomIcon = () => {
    switch (room.icon) {
      case 'Keyboard': return <Keyboard className="w-6 h-6 text-purple-300" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-red-300" />;
      case 'Headphones': return <Headphones className="w-6 h-6 text-emerald-300" />;
      case 'Tv': return <Tv className="w-6 h-6 text-sky-300" />;
      default: return <GraduationCap className="w-6 h-6 text-amber-300" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 scanlines animate-fadeIn">
      
      <div 
        className="w-full max-w-2xl retro-box-gold rounded-lg p-6 md:p-8 relative max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Prominent Easy-to-Click Retro Close Button */}
        <button
          onClick={() => {
            soundEngine.playClose();
            onClose();
          }}
          className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-500 border-3 border-amber-200 text-white w-10 h-10 rounded-full font-pixel text-sm flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110 active:scale-95"
          title="Close Modal (Esc)"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Room Header Banner */}
        <div className="flex items-start gap-4 pb-4 border-b-2 border-amber-800/80 mb-5">
          <div 
            className="w-14 h-14 rounded-lg flex items-center justify-center border-2 border-amber-400/80 shadow-inner shrink-0"
            style={{ backgroundColor: room.color + '33' }}
          >
            {getRoomIcon()}
          </div>

          <div className="flex-1 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-pixel text-xs text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-700">
                ROOM {room.id}
              </span>
              <h2 className="font-pixel text-base md:text-lg text-amber-100 tracking-wide">
                {room.name.toUpperCase()}
              </h2>
            </div>
            
            <p className="font-silkscreen text-xs text-amber-200/90 mt-1.5 leading-relaxed">
              {room.subtitle}
            </p>
          </div>
        </div>

        {/* Exam Hall Locked Stage Header */}
        {room.id === 2 && (
          <div className="bg-red-950/80 border-2 border-red-700/80 p-3 rounded-md mb-5 flex items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="font-silkscreen text-xs text-red-200">CURRICULUM STAGE:</span>
              <span className="font-pixel text-xs text-amber-300 bg-red-900 px-2 py-0.5 rounded border border-red-500 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                {stage}
              </span>
            </div>

            <span className="font-silkscreen text-[10px] text-amber-300/80 hidden sm:inline">
              (Log Out to switch stage)
            </span>
          </div>
        )}

        {/* Resources / External Links List */}
        <div className="space-y-3 overflow-y-auto pr-1 flex-1 max-h-[380px]">
          {links.map((link, idx) => {
            const isFeatured = link.badge?.toLowerCase().includes('featured') || link.badge?.includes('⭐');
            return (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEngine.playSelect()}
                className={`group block p-4 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-md ${
                  isFeatured 
                    ? 'bg-gradient-to-r from-amber-950/90 via-purple-950/90 to-amber-950/90 hover:from-amber-900 hover:to-purple-900 border-2 border-amber-400 hover:border-amber-300 ring-2 ring-amber-400/40 shadow-amber-500/10' 
                    : 'bg-amber-950/70 hover:bg-amber-900/90 border-2 border-amber-800 hover:border-amber-400'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded border mt-0.5 transition-colors ${
                      isFeatured 
                        ? 'bg-amber-950 border-amber-400 shadow-inner' 
                        : 'bg-slate-950 border-amber-700/60 group-hover:border-amber-400'
                    }`}>
                      {getIcon(link.iconType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-pixel text-xs transition-colors ${
                          isFeatured ? 'text-amber-100 font-bold' : 'text-amber-200 group-hover:text-amber-100'
                        }`}>
                          {link.title}
                        </h3>
                        {link.badge && (
                          <span className={`font-silkscreen text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                            isFeatured
                              ? 'bg-amber-400 text-amber-950 border border-amber-200 shadow-sm animate-pulse'
                              : 'bg-amber-500 text-amber-950'
                          }`}>
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className={`font-silkscreen text-xs mt-1.5 leading-relaxed ${
                        isFeatured ? 'text-amber-100/90' : 'text-slate-300'
                      }`}>
                        {link.description}
                      </p>
                      <span className={`inline-block font-vt323 text-xs mt-1 underline ${
                        isFeatured ? 'text-amber-300 font-bold' : 'text-amber-400/80'
                      }`}>
                        {link.url}
                      </span>
                    </div>
                  </div>

                  <div className={`flex items-center transition-transform group-hover:translate-x-1 shrink-0 pt-1 ${
                    isFeatured ? 'text-amber-300' : 'text-amber-400 group-hover:text-amber-200'
                  }`}>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-4 border-t border-amber-800/60 flex items-center justify-between text-xs font-silkscreen text-amber-300/80">
          <span>Target: External Link opens in new tab</span>
          <button
            onClick={() => {
              soundEngine.playClose();
              onClose();
            }}
            className="retro-button px-4 py-2 text-amber-100 rounded font-pixel text-[10px] cursor-pointer"
          >
            RESUME WALKING
          </button>
        </div>

      </div>
    </div>
  );
};
