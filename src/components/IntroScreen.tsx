import React, { useState, useEffect } from 'react';
import { PlayerCustomization, StageLevel } from '../types';
import { soundEngine } from '../utils/audio';
import { Sparkles, User, GraduationCap, ChevronRight, Check } from 'lucide-react';

interface IntroScreenProps {
  onComplete: (customization: PlayerCustomization) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const fullText = "Welcome to ACE Computer Practice!";
  const [typedText, setTypedText] = useState('');
  const [step, setStep] = useState<'text' | 'name' | 'stage' | 'avatar' | 'confirm'>('text');
  
  const [name, setName] = useState('Matt');
  const [stage, setStage] = useState<StageLevel>('GEP 11A');
  const [shirtColor, setShirtColor] = useState('#3b82f6'); // Blue
  const [hairColor, setHairColor] = useState('#fde047'); // Yellow/Blonde
  const [spriteStyle, setSpriteStyle] = useState<'classic' | 'modern' | 'academic'>('academic');
  const [hairStyle, setHairStyle] = useState<'short' | 'spiky' | 'ponytail' | 'bob' | 'curly'>('spiky');

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    setTypedText('');
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        soundEngine.playTextBlip();
        index++;
      } else {
        clearInterval(timer);
        setTypedText(fullText);
        setTimeout(() => setStep('name'), 600);
      }
    }, 45);

    return () => clearInterval(timer);
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    soundEngine.playSelect();
    setStep('stage');
  };

  const handleStageSelect = (selectedStage: StageLevel) => {
    soundEngine.playSelect();
    setStage(selectedStage);
    setStep('avatar');
  };

  const handleFinish = () => {
    soundEngine.playDoorChime();
    onComplete({
      name: name.trim() || 'Matt',
      stage,
      shirtColor,
      hairColor,
      spriteStyle,
      hairStyle
    });
  };

  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col justify-end p-4 md:p-8 scanlines overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto retro-box-gold p-6 md:p-8 rounded-lg relative my-auto">
        
        {/* Header Ribbon */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-600 border-2 border-amber-300 text-amber-100 px-6 py-1 font-pixel text-xs tracking-wider rounded shadow-md uppercase flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>ACE COMPUTER PRACTICE ADMISSION</span>
        </div>

        {/* Dialogue Box Area */}
        <div className="min-h-[70px] bg-amber-950/80 border-2 border-amber-800 p-4 rounded mb-6 flex items-center">
          <p className="font-pixel text-sm md:text-base text-amber-200 leading-relaxed tracking-wide">
            {step === 'text' ? typedText : fullText}
            {step === 'text' && <span className="inline-block w-2 h-4 bg-amber-300 ml-1 animate-pulse" />}
          </p>
        </div>

        {/* Step 1: Name Input */}
        {step === 'name' && (
          <form onSubmit={handleNameSubmit} className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-amber-300 font-silkscreen text-sm md:text-base">
              <User className="w-4 h-4" />
              <label htmlFor="student-name-input">What is your name?</label>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="student-name-input"
                type="text"
                maxLength={18}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter student name..."
                autoFocus
                className="flex-1 bg-slate-950 border-3 border-amber-700 focus:border-amber-400 text-amber-100 font-pixel text-sm p-3.5 rounded outline-none shadow-inner"
              />
              <button
                type="submit"
                className="retro-button font-pixel text-xs text-amber-100 px-6 py-3.5 rounded flex items-center justify-center gap-2 font-bold cursor-pointer"
              >
                <span>NEXT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Level Stage Selector */}
        {step === 'stage' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-amber-300 font-silkscreen text-sm md:text-base">
              <GraduationCap className="w-4 h-4" />
              <span>What level are you studying?</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['GEP 11A', 'GEP 11B', 'GEP 12'] as StageLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleStageSelect(lvl)}
                  className={`retro-button p-4 rounded flex flex-col items-center justify-center gap-2 cursor-pointer transition-transform ${
                    stage === lvl ? 'scale-105 border-amber-200' : ''
                  }`}
                >
                  <span className="font-pixel text-sm text-amber-100">{lvl}</span>
                  <span className="font-silkscreen text-[10px] text-amber-200/80">
                    {lvl === 'GEP 11A' ? 'Foundations' : lvl === 'GEP 11B' ? 'Intermediate' : 'Advanced & IELTS'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Avatar Customization */}
        {step === 'avatar' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-silkscreen text-amber-300 text-sm">
                CUSTOMIZE STUDENT AVATAR
              </span>
              <span className="font-pixel text-xs text-amber-400">
                {name} ({stage})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-950/70 p-4 rounded border border-amber-900/60">
              
              {/* Preview Canvas */}
              <div className="flex flex-col items-center justify-center p-4 bg-amber-950/50 rounded border border-amber-800/80 min-h-[190px]">
                <div className="w-20 h-24 relative flex items-center justify-center pixelated scale-125">
                  {/* Pixel Art Sprite Preview */}
                  <div className="w-12 h-16 relative">
                    
                    {/* Hairstyle Render */}
                    {hairStyle === 'short' && (
                      <div className="absolute top-0 left-2 w-8 h-4 rounded-t" style={{ backgroundColor: hairColor }} />
                    )}
                    {hairStyle === 'spiky' && (
                      <>
                        <div className="absolute -top-1 left-2 w-2.5 h-3 rotate-[-12deg]" style={{ backgroundColor: hairColor }} />
                        <div className="absolute -top-2 left-4 w-3 h-4" style={{ backgroundColor: hairColor }} />
                        <div className="absolute -top-1 left-7 w-2.5 h-3 rotate-[12deg]" style={{ backgroundColor: hairColor }} />
                        <div className="absolute top-1 left-2 w-8 h-3" style={{ backgroundColor: hairColor }} />
                      </>
                    )}
                    {hairStyle === 'ponytail' && (
                      <>
                        <div className="absolute top-0 left-2 w-8 h-4 rounded-t" style={{ backgroundColor: hairColor }} />
                        <div className="absolute top-1 -right-1 w-3 h-5 rounded-r" style={{ backgroundColor: hairColor }} />
                      </>
                    )}
                    {hairStyle === 'bob' && (
                      <>
                        <div className="absolute top-0 left-1.5 w-9 h-4 rounded-t" style={{ backgroundColor: hairColor }} />
                        <div className="absolute top-3 left-1 w-2.5 h-6 rounded-b" style={{ backgroundColor: hairColor }} />
                        <div className="absolute top-3 right-1 w-2.5 h-6 rounded-b" style={{ backgroundColor: hairColor }} />
                      </>
                    )}
                    {hairStyle === 'curly' && (
                      <div className="absolute -top-1 left-1 w-10 h-5 rounded-full" style={{ backgroundColor: hairColor }} />
                    )}

                    {/* Face */}
                    <div className="absolute top-3 left-3 w-6 h-4 bg-amber-200 rounded-sm" />
                    <div className="absolute top-4 left-4 w-1 h-1 bg-slate-900" />
                    <div className="absolute top-4 left-7 w-1 h-1 bg-slate-900" />
                    
                    {/* Torso & Uniform Style Details */}
                    <div className="absolute top-7 left-2 w-8 h-5 rounded-sm" style={{ backgroundColor: shirtColor }}>
                      {spriteStyle === 'classic' && (
                        <>
                          <div className="absolute top-0 left-2.5 w-3 h-1.5 bg-white" />
                          <div className="absolute top-1 left-3.5 w-1 h-3 bg-red-600" />
                        </>
                      )}
                      {spriteStyle === 'modern' && (
                        <>
                          <div className="absolute top-0.5 left-2 w-1 h-3 bg-white/80" />
                          <div className="absolute top-0.5 right-2 w-1 h-3 bg-white/80" />
                          <div className="absolute bottom-0.5 left-2 w-4 h-1.5 bg-black/20 rounded-t" />
                        </>
                      )}
                      {spriteStyle === 'academic' && (
                        <>
                          <div className="absolute top-0 left-2 w-4 h-5 bg-slate-900/60" />
                          <div className="absolute top-1 left-3 w-2 h-2 bg-amber-400 rounded-full" />
                          <div className="absolute top-3 left-1.5 w-1 h-1 bg-amber-300" />
                          <div className="absolute top-3 right-1.5 w-1 h-1 bg-amber-300" />
                        </>
                      )}
                    </div>

                    {/* Legs */}
                    <div className="absolute top-12 left-3 w-2.5 h-4 bg-slate-900" />
                    <div className="absolute top-12 left-6 w-2.5 h-4 bg-slate-900" />
                  </div>
                </div>
                <span className="font-pixel text-[10px] text-amber-300 mt-2">{name} ({spriteStyle.toUpperCase()})</span>
              </div>

              {/* Controls */}
              <div className="space-y-2.5">
                <div>
                  <label className="block font-silkscreen text-[10px] text-amber-200 mb-1">
                    Uniform Color
                  </label>
                  <div className="flex gap-1.5">
                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#0284c7', '#fb82d6'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setShirtColor(color)}
                        className={`w-6 h-6 rounded border-2 cursor-pointer ${
                          shirtColor === color ? 'border-amber-200 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-silkscreen text-[10px] text-amber-200 mb-1">
                    Hair Color
                  </label>
                  <div className="flex gap-1.5">
                    {['#fde047', '#451a03', '#18181b', '#b91c1c', '#ea580c', '#38bdf8', '#fb82d6'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setHairColor(color)}
                        className={`w-6 h-6 rounded border-2 cursor-pointer ${
                          hairColor === color ? 'border-amber-200 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-silkscreen text-[10px] text-amber-200 mb-1">
                    Hairstyle Option
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {(['short', 'spiky', 'ponytail', 'bob', 'curly'] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setHairStyle(style)}
                        className={`px-2 py-0.5 text-[8px] font-pixel rounded cursor-pointer capitalize ${
                          hairStyle === style
                            ? 'bg-amber-400 text-amber-950 font-bold'
                            : 'bg-amber-950 text-amber-300 border border-amber-800 hover:border-amber-600'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-silkscreen text-[10px] text-amber-200 mb-1">
                    Uniform Style
                  </label>
                  <div className="flex gap-1">
                    {(['classic', 'modern', 'academic'] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setSpriteStyle(style)}
                        className={`px-2 py-0.5 text-[8px] font-pixel rounded cursor-pointer capitalize ${
                          spriteStyle === style
                            ? 'bg-amber-500 text-amber-950 font-bold'
                            : 'bg-amber-950 text-amber-300 border border-amber-800 hover:border-amber-600'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full retro-button font-pixel text-sm text-amber-100 py-4 rounded flex items-center justify-center gap-2 cursor-pointer tracking-wider shadow-lg"
            >
              <Check className="w-5 h-5 text-amber-300" />
              <span>START EXPLORING COMPUTER LAB</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
