import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DoorRoom, PlayerCustomization } from '../types';
import { ROOMS, getRoomWorldPosition, getCorridorWorldWidth } from '../data/rooms';
import { soundEngine } from '../utils/audio';
import { MoveUp, MoveDown, MoveLeft, MoveRight, ArrowRight, ArrowLeft } from 'lucide-react';

interface GameCanvasProps {
  playerCustomization: PlayerCustomization;
  coins: number;
  catPetTimer: number;
  speedBoostTimer: number;
  onAddCoins: (amount: number) => void;
  onOpenRoom: (room: DoorRoom) => void;
  onOpenQuiz: () => void;
  onOpenVending: () => void;
  isPaused: boolean;
}

// Helper to draw authentic 16-bit student sprites with uniform styles and hairstyles
function drawStudentSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dir: 'up' | 'down' | 'left' | 'right',
  animFrame: number,
  isMoving: boolean,
  hairColor: string,
  shirtColor: string,
  spriteStyle: 'classic' | 'modern' | 'academic',
  hairStyle: 'short' | 'spiky' | 'ponytail' | 'bob' | 'curly'
) {
  const w = 36;
  const h = 52;
  const bob = isMoving && (animFrame === 1 || animFrame === 3) ? -2 : 0;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h - 4, 16, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // 1. Hair Back layer (for bob or ponytail if turned)
  if (hairStyle === 'bob') {
    ctx.fillStyle = hairColor;
    ctx.fillRect(x + 4, y + 6 + bob, 28, 18);
  } else if (hairStyle === 'ponytail' && (dir === 'left' || dir === 'right')) {
    ctx.fillStyle = hairColor;
    const px = dir === 'left' ? x + 24 : x + 2;
    ctx.fillRect(px, y + 8 + bob, 8, 14);
  }

  // 2. Torso (Shirt / Jacket)
  ctx.fillStyle = shirtColor;
  ctx.fillRect(x + 8, y + 18 + bob, 20, 18);

  // Uniform Style Details on Torso
  if (dir !== 'up') {
    if (spriteStyle === 'classic') {
      // White collared shirt & Red Tie
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 14, y + 18 + bob, 8, 5);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(x + 17, y + 21 + bob, 2, 9);
    } else if (spriteStyle === 'modern') {
      // Hoodie strings & pouch
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 14, y + 19 + bob, 1.5, 7);
      ctx.fillRect(x + 20.5, y + 19 + bob, 1.5, 7);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(x + 11, y + 28 + bob, 14, 6);
    } else if (spriteStyle === 'academic') {
      // Formal Blazer overlay + gold buttons + crest badge
      ctx.fillStyle = '#0f172a'; // Dark blazer lapels
      ctx.fillRect(x + 10, y + 18 + bob, 4, 18);
      ctx.fillRect(x + 22, y + 18 + bob, 4, 18);
      ctx.fillStyle = '#fef08a'; // Gold buttons
      ctx.fillRect(x + 17, y + 24 + bob, 2, 2);
      ctx.fillRect(x + 17, y + 29 + bob, 2, 2);
      ctx.fillStyle = '#e11d48'; // Academy Crest Badge
      ctx.fillRect(x + 11, y + 22 + bob, 3, 3);
    }
  }

  // 3. Face Skin
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(x + 8, y + 8 + bob, 20, 10);

  // Eyes & Facial Direction
  ctx.fillStyle = '#0f172a';
  if (dir === 'right') {
    ctx.fillRect(x + 20, y + 12 + bob, 3, 3);
  } else if (dir === 'left') {
    ctx.fillRect(x + 11, y + 12 + bob, 3, 3);
  } else if (dir === 'down') {
    ctx.fillRect(x + 11, y + 12 + bob, 3, 3);
    ctx.fillRect(x + 20, y + 12 + bob, 3, 3);
  }

  // 4. Front Hairstyle
  ctx.fillStyle = hairColor;
  if (hairStyle === 'short') {
    ctx.fillRect(x + 6, y + bob, 24, 10);
    if (dir === 'down') ctx.fillRect(x + 6, y + 8 + bob, 4, 3);
  } else if (hairStyle === 'spiky') {
    // Spiky tufts
    ctx.fillRect(x + 6, y + 2 + bob, 24, 8);
    ctx.fillRect(x + 8, y - 4 + bob, 5, 7);
    ctx.fillRect(x + 15, y - 6 + bob, 6, 9);
    ctx.fillRect(x + 23, y - 4 + bob, 5, 7);
  } else if (hairStyle === 'ponytail') {
    ctx.fillRect(x + 6, y + bob, 24, 10);
    if (dir === 'down') {
      ctx.fillRect(x + 26, y + 4 + bob, 6, 12);
    }
  } else if (hairStyle === 'bob') {
    ctx.fillRect(x + 5, y + bob, 26, 8);
    ctx.fillRect(x + 4, y + 6 + bob, 6, 12);
    ctx.fillRect(x + 26, y + 6 + bob, 6, 12);
  } else if (hairStyle === 'curly') {
    ctx.beginPath();
    ctx.arc(x + 12, y + 4 + bob, 8, 0, Math.PI * 2);
    ctx.arc(x + 18, y + 2 + bob, 8, 0, Math.PI * 2);
    ctx.arc(x + 24, y + 4 + bob, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Pants & Legs
  ctx.fillStyle = '#1e3a8a';
  if (isMoving && animFrame % 2 === 1) {
    ctx.fillRect(x + 8, y + 36 + bob, 8, 12);
    ctx.fillRect(x + 20, y + 34 + bob, 8, 12);
  } else {
    ctx.fillRect(x + 10, y + 36 + bob, 7, 12);
    ctx.fillRect(x + 19, y + 36 + bob, 7, 12);
  }
}

interface NPCData {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  dir: 'up' | 'down' | 'left' | 'right';
  shirtColor: string;
  hairColor: string;
  spriteStyle: 'classic' | 'modern' | 'academic';
  hairStyle: 'short' | 'spiky' | 'ponytail' | 'bob' | 'curly';
  partnerData?: {
    name: string;
    shirtColor: string;
    hairColor: string;
    spriteStyle: 'classic' | 'modern' | 'academic';
    hairStyle: 'short' | 'spiky' | 'ponytail' | 'bob' | 'curly';
    dir: 'left' | 'right' | 'up' | 'down';
  };
  isWandering?: boolean;
  minX?: number;
  maxX?: number;
  speed?: number;
  isExaminer?: boolean;
  hasCat?: boolean;
  dialogues: string[];
  currentDialogueIdx: number;
}

export interface CorridorItem {
  id: string;
  name: string;
  type: 'game_console' | 'boba_tea' | 'study_notes' | 'coffee' | 'lucky_cat' | 'secret_scroll' | 'dictionary' | 'headphones' | 'pen' | 'drink' | 'highlighter' | 'watch' | string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  icon: string;
  tipText: string;
  link?: string;
  isSpecialModal?: boolean;
}

// Modular Corridor Item Templates generator with random positions and strict spacing
const ITEM_TEMPLATES: Omit<CorridorItem, 'x' | 'y'>[] = [
  {
    id: 'item_console',
    name: 'Retro Game Console',
    type: 'game_console',
    width: 28,
    height: 26,
    color: '#6d28d9',
    icon: '🎮',
    tipText: "Oh! Someone left a game console loaded with IELTS-Boy!",
    link: 'https://masyor.github.io/IELTS-Boy/',
    isSpecialModal: true
  },
  {
    id: 'item_boba',
    name: 'Taro Boba Milk Tea',
    type: 'boba_tea',
    width: 20,
    height: 22,
    color: '#a855f7',
    icon: '🧋',
    tipText: "🧋 Taro Boba Tea! 'Fewer' is for countable items; 'less' is for uncountable!"
  },
  {
    id: 'item_notes',
    name: 'Band 8 Vocab Binder',
    type: 'study_notes',
    width: 22,
    height: 18,
    color: '#3b82f6',
    icon: '📝',
    tipText: "📝 Band 8 Vocab: 'Paraphrase sentences using precise synonyms!'"
  },
  {
    id: 'item_coffee',
    name: 'Steaming Coffee Mug',
    type: 'coffee',
    width: 18,
    height: 18,
    color: '#b45309',
    icon: '☕',
    tipText: "☕ Hot Espresso! It might help you concentrate!"
  },
  {
    id: 'item_cat',
    name: 'Golden Lucky Cat',
    type: 'lucky_cat',
    width: 22,
    height: 24,
    color: '#eab308',
    icon: '🐱',
    tipText: "🐱 Waving Lucky Cat: 'Remember that fluency is an important part of speaking!'"
  },
  {
    id: 'item_scroll',
    name: 'IELTS Secret Tip Scroll',
    type: 'secret_scroll',
    width: 24,
    height: 18,
    color: '#f59e0b',
    icon: '📜',
    tipText: "📜 Secret Tip: Always spend 5 mins planning Task 2 essays before writing!"
  },
  {
    id: 'item_dictionary',
    name: 'Collocations Book',
    type: 'dictionary',
    width: 22,
    height: 20,
    color: '#059669',
    icon: '📖',
    tipText: "📖 Dictionary: Practice natural collocations like 'substantially increase'!"
  },
  {
    id: 'item_headphones',
    name: 'Listening Headset',
    type: 'headphones',
    width: 22,
    height: 20,
    color: '#ec4899',
    icon: '🎧',
    tipText: "🎧 Noise-Canceling Headset: 'Use the example at the start of the listening test to adjust your volume.'"
  },
  {
    id: 'item_pen',
    name: 'Band 9 Fountain Pen',
    type: 'pen',
    width: 20,
    height: 18,
    color: '#10b981',
    icon: '🖊️',
    tipText: "🖊️ Lucky Fountain Pen: 'Keep key vocabulary varied and natural!'"
  },
  {
    id: 'item_drink',
    name: 'IELTS Power Fuel',
    type: 'drink',
    width: 18,
    height: 22,
    color: '#ef4444',
    icon: '⚡',
    tipText: "⚡ Power Drink: 'Pace yourself in the 60-minute Reading module. Don't run out of energy!'"
  },
  {
    id: 'item_highlighter',
    name: 'Grammar Highlighter',
    type: 'highlighter',
    width: 20,
    height: 18,
    color: '#fde047',
    icon: '🖍️',
    tipText: "🖍️ Bright Highlighter: 'Highlight key information in Reading passages!'"
  },
  {
    id: 'item_watch',
    name: 'Exam Smart Watch',
    type: 'watch',
    width: 20,
    height: 20,
    color: '#06b6d4',
    icon: '⌚',
    tipText: "⌚ Smart Timer: 'Keep track of 20 mins for Writing Task 1!'"
  }
];

function generateModularItems(npcs: NPCData[] = []): CorridorItem[] {
  const items: CorridorItem[] = [];
  const MIN_ITEM_2D_DIST = 220; 
  const MIN_ITEM_X_DIST = 180;  
  const MIN_NPC_DIST = 100;      

  const MIN_X = 160;
  const MAX_X = 1750;
  const MIN_Y = 320; 
  const MAX_Y = 460; 

  // Clean, uncluttered corridor: spawn 2 or 3 items max
  const targetCount = Math.floor(2 + Math.random() * 2); // 2 or 3 items
  const templates = [...ITEM_TEMPLATES].sort(() => Math.random() - 0.5).slice(0, targetCount);

  templates.forEach((template) => {
    let bestX = -1;
    let bestY = -1;
    let highestMinScore = -1;

    // Attempt candidates that satisfy distance requirements
    for (let attempts = 0; attempts < 300; attempts++) {
      const candidateX = Math.floor(MIN_X + Math.random() * (MAX_X - MIN_X));
      const candidateY = Math.floor(MIN_Y + Math.random() * (MAX_Y - MIN_Y));

      // Calculate 2D distance to closest placed item
      let min2DItemDist = Number.MAX_VALUE;
      let minXItemDist = Number.MAX_VALUE;
      for (const placed of items) {
        const dist2D = Math.hypot((placed.x + placed.width / 2) - candidateX, (placed.y + placed.height / 2) - candidateY);
        const distX = Math.abs((placed.x + placed.width / 2) - candidateX);
        if (dist2D < min2DItemDist) min2DItemDist = dist2D;
        if (distX < minXItemDist) minXItemDist = distX;
      }

      // Calculate distance to closest NPC
      let minNPCDist = Number.MAX_VALUE;
      for (const npc of npcs) {
        const npcCenterX = npc.x + (npc.partnerData ? 32 : 16);
        const npcCenterY = npc.y + 20;
        const dist2D = Math.hypot(npcCenterX - candidateX, npcCenterY - candidateY);
        if (dist2D < minNPCDist) minNPCDist = dist2D;
      }

      if (min2DItemDist >= MIN_ITEM_2D_DIST && minXItemDist >= MIN_ITEM_X_DIST && minNPCDist >= MIN_NPC_DIST) {
        bestX = candidateX;
        bestY = candidateY;
        break;
      } else {
        const score = Math.min(min2DItemDist, minNPCDist * 2);
        if (score > highestMinScore) {
          highestMinScore = score;
          bestX = candidateX;
          bestY = candidateY;
        }
      }
    }

    items.push({
      ...template,
      x: bestX,
      y: bestY
    });
  });

  // Sort items by Y position so items higher up render behind items lower down
  items.sort((a, b) => a.y - b.y);

  // Permanent Vending Machine & Mini-Quiz Kiosk
  const permanentItems: CorridorItem[] = [
    {
      id: 'item_vending',
      name: 'Vending Machine',
      type: 'vending_machine',
      x: 830,
      y: 135,
      width: 44,
      height: 62,
      color: '#1e293b',
      icon: '🥤',
      tipText: "🥤 Vending Machine! Insert 1 Coin to vend snacks & band boost tips!",
      isSpecialModal: true
    },
    {
      id: 'item_quiz_kiosk',
      name: 'Mini-Quiz Kiosk',
      type: 'quiz_kiosk',
      x: 1090,
      y: 135,
      width: 42,
      height: 60,
      color: '#581c87',
      icon: '🐱',
      tipText: "🐱 IELTS Mini-Quiz Kiosk! Score 3+ out of 5 to recruit Whiskers the Pixel Cat!",
      isSpecialModal: true
    }
  ];

  return [...permanentItems, ...items];
}

// Function to generate slightly randomized NPC positions & outfits per session
const NPC_TEMPLATES: Omit<NPCData, 'x' | 'y' | 'minX' | 'maxX' | 'currentDialogueIdx'>[] = [
  {
    id: 'npc_speaking_pair',
    name: 'Emma & Lucas',
    role: 'IELTS Speaking Study Pair',
    dir: 'right',
    shirtColor: '#ef4444',
    hairColor: '#38bdf8',
    spriteStyle: 'classic',
    hairStyle: 'bob',
    partnerData: {
      name: 'Lucas',
      shirtColor: '#3b82f6',
      hairColor: '#fde047',
      spriteStyle: 'academic',
      hairStyle: 'spiky',
      dir: 'left'
    },
    dialogues: [
      "💬 Emma: 'For Speaking Part 2, use your 1-minute prep to make notes!'",
      "💬 Lucas: 'And don't panic if you make a mistake—just self-correct smoothly!'",
      "💬 Emma: 'Use a variety of connective words like furthermore, consequently, and on the other hand!'"
    ]
  },
  {
    id: 'npc_listening_group',
    name: 'Sophea & Dara',
    role: 'Listening & Music Group',
    dir: 'right',
    shirtColor: '#10b981',
    hairColor: '#ea580c',
    spriteStyle: 'modern',
    hairStyle: 'curly',
    partnerData: {
      name: 'Dara',
      shirtColor: '#8b5cf6',
      hairColor: '#18181b',
      spriteStyle: 'classic',
      hairStyle: 'short',
      dir: 'left'
    },
    dialogues: [
      "🎧 Sophea: 'LyricsTyping in Door 3 is super addictive for finger speed!'",
      "🎧 Dara: 'Watch out for spelling in Listening tests! Accommodation has double C and M.'",
      "🎧 Sophea: 'Predict sentence types before listening to the audio track!'"
    ]
  },
  {
    id: 'npc_typer_rithy',
    name: 'Rithy',
    role: '⚡ Wandering Speed Typer',
    dir: 'right',
    shirtColor: '#06b6d4',
    hairColor: '#fde047',
    spriteStyle: 'modern',
    hairStyle: 'spiky',
    isWandering: true,
    speed: 0.8,
    dialogues: [
      "⚡ Rithy: 'I just hit 88 WPM in the Typing Gym! Door 1 has great exercises.'",
      "⚡ Rithy: 'Focus on touch typing without looking down at the keyboard!'"
    ]
  },
  {
    id: 'npc_examiner',
    name: 'Mr. Harrison',
    role: '✨ Senior IELTS Examiner',
    dir: 'down',
    shirtColor: '#1e293b',
    hairColor: '#94a3b8',
    spriteStyle: 'academic',
    hairStyle: 'short',
    isExaminer: true,
    dialogues: [
      "✨ EXAMINER TIP: 'Coherence & Cohesion is 25% of your Writing mark. Use topic sentences!'",
      "✨ EXAMINER TIP: 'In Reading, always scan keywords in the questions before the text.'",
      "✨ EXAMINER TIP: 'Fluency means natural flow without awkward hesitations—keep going!'"
    ]
  },
  {
    id: 'npc_boba_vannak',
    name: 'Vannak',
    role: '🧋 Boba Student Legend',
    dir: 'left',
    shirtColor: '#f59e0b',
    hairColor: '#451a03',
    spriteStyle: 'modern',
    hairStyle: 'ponytail',
    dialogues: [
      "🧋 Vannak: 'Boba break! Remember to relax before your test'",
      "🧋 Vannak: 'Check out IDP Official channel in Door 4 for band score breakdowns!'"
    ]
  },
  {
    id: 'npc_kanya_cat',
    name: 'Kanya & Pixel Cat',
    role: '🐾 Cat Lover Student',
    dir: 'down',
    shirtColor: '#ec4899',
    hairColor: '#d97706',
    spriteStyle: 'classic',
    hairStyle: 'bob',
    hasCat: true,
    dialogues: [
      "🐱 Kanya: 'Meow! Pixel Cat says don't forget your passport or ID on test day!'",
      "🐾 Kanya: 'Take 5-minute typing breaks to keep your wrist relaxed!'"
    ]
  },
  {
    id: 'npc_grammar_pair',
    name: 'Chan & Bopha',
    role: '📚 Grammar Debate Pair',
    dir: 'right',
    shirtColor: '#3b82f6',
    hairColor: '#18181b',
    spriteStyle: 'academic',
    hairStyle: 'short',
    partnerData: {
      name: 'Bopha',
      shirtColor: '#ec4899',
      hairColor: '#38bdf8',
      spriteStyle: 'modern',
      hairStyle: 'ponytail',
      dir: 'left'
    },
    dialogues: [
      "📚 Chan: 'Is it 'different from' or 'different to'? 'Different from' is preferred in academic writing!'",
      "📚 Bopha: 'And remember: subject-verb agreement with collective nouns!'"
    ]
  },
  {
    id: 'npc_vocab_ninja',
    name: 'David',
    role: '⚡ Wandering Vocab Ninja',
    dir: 'left',
    shirtColor: '#8b5cf6',
    hairColor: '#fde047',
    spriteStyle: 'modern',
    hairStyle: 'spiky',
    isWandering: true,
    speed: 0.9,
    dialogues: [
      "⚡ David: 'Instead of 'very important', try using 'crucial', 'pivotal', or 'paramount'!'",
      "⚡ David: 'Avoid repeating the same word three times in one essay!'"
    ]
  },
  {
    id: 'npc_writing_coach',
    name: 'Ms. Evelyn',
    role: '✒️ IELTS Writing Specialist',
    dir: 'down',
    shirtColor: '#0f172a',
    hairColor: '#94a3b8',
    spriteStyle: 'academic',
    hairStyle: 'bob',
    dialogues: [
      "✒️ Ms. Evelyn: 'Always analyze the Task 1 chart labels and units carefully before describing trends!'",
      "✒️ Ms. Evelyn: 'In Task 2, make sure your position is clear throughout the entire essay.'"
    ]
  }
];

function generateRandomizedNPCs(): NPCData[] {
  const shirtColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
  const hairColors = ['#38bdf8', '#fde047', '#18181b', '#ea580c', '#451a03', '#94a3b8', '#d97706'];

  const getRandomColor = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const MIN_NPC_2D_DIST = 220;
  const MIN_NPC_X_DIST = 180;

  const MIN_X = 160;
  const MAX_X = 1750;
  const MIN_Y = 320;
  const MAX_Y = 440;

  // Clean, uncluttered corridor: spawn 3 or 4 NPCs max
  const targetCount = Math.floor(3 + Math.random() * 2); // 3 or 4 NPCs
  const selectedTemplates = [...NPC_TEMPLATES].sort(() => Math.random() - 0.5).slice(0, targetCount);

  const npcs: NPCData[] = [];

  selectedTemplates.forEach((template, index) => {
    let bestX = -1;
    let bestY = -1;
    let highestMinScore = -1;

    for (let attempts = 0; attempts < 300; attempts++) {
      const candidateX = Math.floor(MIN_X + Math.random() * (MAX_X - MIN_X));
      const candidateY = Math.floor(MIN_Y + Math.random() * (MAX_Y - MIN_Y));

      let min2DDist = Number.MAX_VALUE;
      let minXDist = Number.MAX_VALUE;

      for (const placed of npcs) {
        const placedCenterX = placed.x + (placed.partnerData ? 32 : 16);
        const placedCenterY = placed.y + 20;
        const candidateCenterX = candidateX + (template.partnerData ? 32 : 16);
        const candidateCenterY = candidateY + 20;

        const dist2D = Math.hypot(placedCenterX - candidateCenterX, placedCenterY - candidateCenterY);
        const distX = Math.abs(placedCenterX - candidateCenterX);

        if (dist2D < min2DDist) min2DDist = dist2D;
        if (distX < minXDist) minXDist = distX;
      }

      if (min2DDist >= MIN_NPC_2D_DIST && minXDist >= MIN_NPC_X_DIST) {
        bestX = candidateX;
        bestY = candidateY;
        break;
      } else {
        if (min2DDist > highestMinScore) {
          highestMinScore = min2DDist;
          bestX = candidateX;
          bestY = candidateY;
        }
      }
    }

    const shirtColor = template.isExaminer ? template.shirtColor : getRandomColor(shirtColors);
    const hairColor = template.isExaminer ? template.hairColor : getRandomColor(hairColors);

    const npc: NPCData = {
      ...template,
      id: `${template.id}_${index}_${Date.now()}`,
      x: bestX,
      y: bestY,
      shirtColor,
      hairColor,
      currentDialogueIdx: 0
    };

    if (npc.isWandering) {
      npc.minX = Math.max(80, bestX - 80);
      npc.maxX = Math.min(1150, bestX + 80);
    }

    if (npc.partnerData) {
      npc.partnerData = {
        ...npc.partnerData,
        shirtColor: getRandomColor(shirtColors),
        hairColor: getRandomColor(hairColors)
      };
    }

    npcs.push(npc);
  });

  // Sort by Y position for proper depth rendering
  npcs.sort((a, b) => a.y - b.y);

  return npcs;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  playerCustomization,
  coins,
  catPetTimer,
  speedBoostTimer,
  onAddCoins,
  onOpenRoom,
  onOpenQuiz,
  onOpenVending,
  isPaused
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Floor Coins State
  const floorCoinsRef = useRef<Array<{ id: string; x: number; y: number; active: boolean; respawnTimer: number }>>([
    { id: 'coin_1', x: 310, y: 340, active: true, respawnTimer: 0 },
    { id: 'coin_2', x: 570, y: 390, active: true, respawnTimer: 0 },
    { id: 'coin_3', x: 1350, y: 350, active: true, respawnTimer: 0 },
    { id: 'coin_4', x: 1610, y: 410, active: true, respawnTimer: 0 }
  ]);

  const catPosRef = useRef({ x: 90, y: 360 });
  const coinParticlesRef = useRef<Array<{ x: number; y: number; text: string; life: number }>>([]);

  // Randomized NPCs & Items on Initialization
  const npcsRef = useRef<NPCData[]>(generateRandomizedNPCs());
  const itemsRef = useRef<CorridorItem[]>(generateModularItems(npcsRef.current));

  const [nearbyNPC, setNearbyNPC] = useState<NPCData | null>(null);
  const [nearbyItem, setNearbyItem] = useState<CorridorItem | null>(null);

  const nearbyNPCRef = useRef<NPCData | null>(null);
  const nearbyItemRef = useRef<CorridorItem | null>(null);
  const nearbyRoomRef = useRef<DoorRoom | null>(null);

  const [showConsoleModal, setShowConsoleModal] = useState<boolean>(false);

  // Random Event State (Pixel Cat Dash / Confetti / Sparkles)
  const eventCatRef = useRef({
    active: false,
    x: -50,
    y: 420,
    speed: 5.5,
    timer: 0
  });

  const eventBannerRef = useRef<{ text: string; timer: number } | null>(null);

  // Player State
  const playerRef = useRef({
    x: 120,
    y: 350,
    width: 36,
    height: 52,
    speed: 4.2,
    dir: 'down' as 'up' | 'down' | 'left' | 'right',
    animFrame: 0,
    animTimer: 0,
    isMoving: false
  });

  const keysRef = useRef<{ [key: string]: boolean }>({});
  const touchKeysRef = useRef<{ [key: string]: boolean }>({});
  const [nearbyRoom, setNearbyRoom] = useState<DoorRoom | null>(null);

  // Step audio throttle
  const stepAudioTimerRef = useRef(0);

  // Helper to re-randomize both people (NPCs) and corridor items & positions
  const rerandomizeCorridor = useCallback(() => {
    const newNPCs = generateRandomizedNPCs();
    const newItems = generateModularItems(newNPCs);
    npcsRef.current = newNPCs;
    itemsRef.current = newItems;
    setNearbyNPC(null);
    setNearbyItem(null);
    nearbyNPCRef.current = null;
    nearbyItemRef.current = null;
  }, []);

  const handleOpenRoom = useCallback((room: DoorRoom) => {
    onOpenRoom(room);
    rerandomizeCorridor();
  }, [onOpenRoom, rerandomizeCorridor]);

  // Re-randomize when returning from a door menu (unpausing)
  const prevIsPausedRef = useRef(isPaused);
  useEffect(() => {
    if (prevIsPausedRef.current && !isPaused) {
      rerandomizeCorridor();
    }
    prevIsPausedRef.current = isPaused;
  }, [isPaused, rerandomizeCorridor]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        e.preventDefault(); // Stop page scrolling
      }
      keysRef.current[key] = true;

      const currentNPC = nearbyNPCRef.current;
      const currentItem = nearbyItemRef.current;
      const currentRoom = nearbyRoomRef.current;

      // Interact with Item (Vending, Quiz Kiosk, Console or Modular Items)
      if ((key === 'e' || key === ' ') && currentItem && !isPaused) {
        soundEngine.playSelect();
        if (currentItem.type === 'vending_machine') {
          onOpenVending();
        } else if (currentItem.type === 'quiz_kiosk') {
          onOpenQuiz();
        } else if (currentItem.isSpecialModal) {
          setShowConsoleModal(true);
        } else {
          eventBannerRef.current = {
            text: `✨ ${currentItem.tipText}`,
            timer: 180
          };
        }
      }
      // Talk to NPC if near
      else if ((key === 'e' || key === ' ') && currentNPC && !currentRoom && !isPaused) {
        soundEngine.playTextBlip();
        currentNPC.currentDialogueIdx = (currentNPC.currentDialogueIdx + 1) % currentNPC.dialogues.length;
        setNearbyNPC({ ...currentNPC });
      }
      // Press 'e' or Space to interact if near door
      else if ((key === 'e' || key === ' ') && currentRoom && !isPaused) {
        handleOpenRoom(currentRoom);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused, handleOpenRoom]);

  // Main Render & Physics Game Loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const p = playerRef.current;
    const worldWidth = getCorridorWorldWidth(ROOMS.length);

    // Movement Physics
    if (!isPaused) {
      p.speed = speedBoostTimer > 0 ? 4.8 : 3.2;
      p.isMoving = false;
      const combinedKeys = { ...keysRef.current, ...touchKeysRef.current };

      let dx = 0;
      let dy = 0;

      if (combinedKeys['arrowleft'] || combinedKeys['a'] || combinedKeys['left']) {
        dx -= p.speed;
        p.dir = 'left';
        p.isMoving = true;
      }
      if (combinedKeys['arrowright'] || combinedKeys['d'] || combinedKeys['right']) {
        dx += p.speed;
        p.dir = 'right';
        p.isMoving = true;
      }
      if (combinedKeys['arrowup'] || combinedKeys['w'] || combinedKeys['up']) {
        dy -= p.speed;
        p.dir = 'up';
        p.isMoving = true;
      }
      if (combinedKeys['arrowdown'] || combinedKeys['s'] || combinedKeys['down']) {
        dy += p.speed;
        p.dir = 'down';
        p.isMoving = true;
      }

      // Diagonal speed normalization
      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      p.x += dx;
      p.y += dy;

      // Map Bounds Collision in World Space
      const minX = 20;
      const maxX = worldWidth - p.width - 20;
      const minY = 200; // Top corridor wall boundary
      const maxY = canvas.height - p.height - 20;

      if (p.x < minX) p.x = minX;
      if (p.x > maxX) p.x = maxX;
      if (p.y < minY) p.y = minY;
      if (p.y > maxY) p.y = maxY;

      // Check Floor Coins Pickup Collision
      const now = Date.now();
      floorCoinsRef.current.forEach(c => {
        if (!c.active) {
          if (now > c.respawnTimer) {
            c.active = true;
          }
        } else {
          const dist = Math.hypot((p.x + p.width / 2) - c.x, (p.y + p.height / 2) - c.y);
          if (dist < 28) {
            c.active = false;
            c.respawnTimer = now + 12000;
            soundEngine.playCoin();
            onAddCoins(1);
            coinParticlesRef.current.push({
              x: c.x,
              y: c.y,
              text: '+1 COIN 🪙',
              life: 45
            });
          }
        }
      });

      // Step Sound & Animation Frame
      if (p.isMoving) {
        p.animTimer += 1;
        if (p.animTimer > 8) {
          p.animFrame = (p.animFrame + 1) % 4;
          p.animTimer = 0;
        }

        stepAudioTimerRef.current += 1;
        if (stepAudioTimerRef.current > 18) {
          soundEngine.playStep();
          stepAudioTimerRef.current = 0;
        }
      } else {
        p.animFrame = 0;
      }

      // Update NPC Wandering
      npcsRef.current.forEach(npc => {
        if (npc.isWandering && npc.minX !== undefined && npc.maxX !== undefined && npc.speed) {
          if (npc.dir === 'right') {
            npc.x += npc.speed;
            if (npc.x >= npc.maxX) npc.dir = 'left';
          } else {
            npc.x -= npc.speed;
            if (npc.x <= npc.minX) npc.dir = 'right';
          }
        }
      });

      // Check Door Proximity in World Space
      let foundRoom: DoorRoom | null = null;
      ROOMS.forEach((room, idx) => {
        const doorWorldX = getRoomWorldPosition(room, idx, ROOMS.length);
        const playerCenterX = p.x + p.width / 2;
        const dist = Math.abs(playerCenterX - doorWorldX);

        if (dist < 48 && p.y < 235) {
          foundRoom = room;
        }
      });

      if (foundRoom !== nearbyRoom) {
        setNearbyRoom(foundRoom);
      }
      nearbyRoomRef.current = foundRoom;

      // Check NPC Proximity
      let foundNPC: NPCData | null = null;
      const pCenterX = p.x + p.width / 2;
      const pCenterY = p.y + p.height / 2;

      npcsRef.current.forEach(npc => {
        const npcCenterX = npc.x + (npc.partnerData ? 34 : 18);
        const npcCenterY = npc.y + 26;
        const dist = Math.hypot(pCenterX - npcCenterX, pCenterY - npcCenterY);
        if (dist < (npc.partnerData ? 65 : 55)) {
          foundNPC = npc;
        }
      });

      if (foundNPC !== nearbyNPC) {
        setNearbyNPC(foundNPC);
      }
      nearbyNPCRef.current = foundNPC;

      // Check Modular Items Proximity
      let foundItem: CorridorItem | null = null;
      itemsRef.current.forEach(item => {
        const itemCenterX = item.x + item.width / 2;
        const itemCenterY = item.y + item.height / 2;
        const dist = Math.hypot(pCenterX - itemCenterX, pCenterY - itemCenterY);
        const maxDist = (item.type === 'vending_machine' || item.type === 'quiz_kiosk') ? 78 : 55;
        if (dist < maxDist) {
          foundItem = item;
        }
      });

      if (foundItem !== nearbyItem) {
        setNearbyItem(foundItem);
      }
      nearbyItemRef.current = foundItem;

      // Trigger door modal if stepped directly into door threshold
      if (foundRoom && p.y <= 202) {
        handleOpenRoom(foundRoom);
        p.y = 225; // Step back so modal doesn't re-trigger infinitely
      }
    }

    // Camera Calculation (Smooth Scrolling along World Width)
    let cameraX = p.x + p.width / 2 - canvas.width / 2;
    cameraX = Math.max(0, Math.min(worldWidth - canvas.width, cameraX));

    // --- DRAW SCENE ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-cameraX, 0); // Translate rendering by camera offset

    // 1. Top Wall (Bricks & Trim)
    ctx.fillStyle = '#2b1d14';
    ctx.fillRect(0, 0, worldWidth, 180);

    // Brick Texture lines
    ctx.strokeStyle = '#3e281c';
    ctx.lineWidth = 2;
    for (let y = 0; y < 180; y += 20) {
      const offset = (y / 20) % 2 === 0 ? 0 : 20;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(worldWidth, y);
      ctx.stroke();

      for (let x = offset; x < worldWidth; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 20);
        ctx.stroke();
      }
    }

    // Dado Rail & Gold Moldings
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(0, 180, worldWidth, 16);
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(0, 196, worldWidth, 4);

    // 2. Floor - Warm Oak Wooden Parquet
    ctx.fillStyle = '#6b4226';
    ctx.fillRect(0, 200, worldWidth, canvas.height - 200);

    // Parquet plank lines
    ctx.strokeStyle = '#54331c';
    ctx.lineWidth = 1.5;
    for (let y = 200; y < canvas.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(worldWidth, y);
      ctx.stroke();
    }
    for (let x = 0; x < worldWidth; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 200);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // 3. Draw Decorative Lantern Sconces spaced equidistant between doors
    const doorPositions = ROOMS.map((room, idx) => getRoomWorldPosition(room, idx, ROOMS.length));
    const lightPositions: number[] = [];
    if (doorPositions.length > 0) {
      // First light before Door 0 (halfway between start 0 and Door 0)
      lightPositions.push(Math.round(doorPositions[0] / 2));
      // Lights equidistant between adjacent pairs of doors
      for (let i = 0; i < doorPositions.length - 1; i++) {
        lightPositions.push(Math.round((doorPositions[i] + doorPositions[i + 1]) / 2));
      }
      // Last light after final Door (halfway between last door and worldWidth)
      lightPositions.push(Math.round((doorPositions[doorPositions.length - 1] + worldWidth) / 2));
    }

    lightPositions.forEach(wx => {
      // Lantern Glow
      const grad = ctx.createRadialGradient(wx, 60, 5, wx, 60, 45);
      grad.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
      grad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(wx, 60, 45, 0, Math.PI * 2);
      ctx.fill();

      // Wall Lantern Sconce
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(wx - 6, 50, 12, 20);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(wx - 4, 52, 8, 12);
    });

    // 3.5 Draw Floor Collectible Coins 🪙
    const now = Date.now();
    floorCoinsRef.current.forEach(c => {
      if (c.active) {
        const floatY = Math.sin((now + c.x * 2) / 180) * 2.5;
        const cy = c.y + floatY;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(c.x, c.y + 6, 7, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Outer Gold Coin
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(c.x, cy, 7, 0, Math.PI * 2);
        ctx.fill();

        // Inner Shimmer
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(c.x - 1, cy - 1, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#a16207';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('¢', c.x, cy + 3);
      }
    });

    // 4. Draw Modular Doors
    ROOMS.forEach((room, idx) => {
      const doorCenterX = getRoomWorldPosition(room, idx, ROOMS.length);
      const doorX = doorCenterX - 32;
      const doorY = 100;
      const doorW = 64;
      const doorH = 96;

      // Outer Frame
      ctx.fillStyle = '#5a3a1e';
      ctx.fillRect(doorX - 6, doorY - 6, doorW + 12, doorH + 6);
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(doorX - 3, doorY - 3, doorW + 6, doorH + 3);

      // Door Wooden Body
      ctx.fillStyle = '#3a200a';
      ctx.fillRect(doorX, doorY, doorW, doorH);

      // Door Panels (Inlaid Wood)
      ctx.fillStyle = '#4a2c11';
      ctx.fillRect(doorX + 8, doorY + 12, 20, 32);
      ctx.fillRect(doorX + 36, doorY + 12, 20, 32);
      ctx.fillRect(doorX + 8, doorY + 52, 20, 32);
      ctx.fillRect(doorX + 36, doorY + 52, 20, 32);

      // Door Knob
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(doorX + 10, doorY + 52, 4, 0, Math.PI * 2);
      ctx.fill();

      // Sign Plate Above Door
      const signText = (room.signLabel || room.name).toUpperCase();
      ctx.fillStyle = room.color;
      ctx.fillRect(doorX - 24, doorY - 40, doorW + 48, 28);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.strokeRect(doorX - 24, doorY - 40, doorW + 48, 28);

      ctx.fillStyle = '#ffffff';
      ctx.font = '8px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText(signText, doorX + doorW / 2, doorY - 22);
    });

    // 5. Draw Modular Corridor Items
    itemsRef.current.forEach(item => {
      const floatY = Math.sin((Date.now() + item.x * 2) / 250) * 2;
      const ix = item.x;
      const iy = item.y + floatY;

      // Item Glow / Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.ellipse(ix + item.width / 2, item.y + item.height, item.width / 2 + 4, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Render Item Body
      if (item.type === 'vending_machine') {
        // Vending Machine Chassis
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(ix, iy, item.width, item.height);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.strokeRect(ix, iy, item.width, item.height);

        // Header
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(ix + 4, iy + 4, item.width - 8, 12);
        ctx.fillStyle = '#ffffff';
        ctx.font = '7px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('SNACKS', ix + item.width / 2, iy + 13);

        // Glass Front Display
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.fillRect(ix + 6, iy + 18, item.width - 12, 26);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.strokeRect(ix + 6, iy + 18, item.width - 12, 26);

        // Cans & Items inside
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(ix + 10, iy + 22, 5, 8);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(ix + 18, iy + 22, 5, 8);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(ix + 26, iy + 22, 5, 8);

        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(ix + 10, iy + 32, 5, 8);
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(ix + 18, iy + 32, 5, 8);

        // Keypad & Tray
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(ix + 6, iy + 47, 10, 8);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(ix + 20, iy + 47, 18, 8);
      } else if (item.type === 'quiz_kiosk') {
        // Arcade Quiz Terminal
        ctx.fillStyle = '#581c87';
        ctx.fillRect(ix, iy, item.width, item.height);
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2;
        ctx.strokeRect(ix, iy, item.width, item.height);

        // Marquee
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(ix + 4, iy + 4, item.width - 8, 12);
        ctx.fillStyle = '#0f172a';
        ctx.font = '7px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('QUIZ', ix + item.width / 2, iy + 13);

        // Green Screen
        ctx.fillStyle = '#052e16';
        ctx.fillRect(ix + 6, iy + 18, item.width - 12, 22);
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ix + 6, iy + 18, item.width - 12, 22);

        ctx.fillStyle = '#4ade80';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🐱 🐾', ix + item.width / 2, iy + 33);

        // Controls
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(ix + 4, iy + 43, item.width - 8, 12);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(ix + 8, iy + 45, 4, 4);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(ix + 20, iy + 46, 3, 3);
        ctx.fillRect(ix + 26, iy + 46, 3, 3);
      } else if (item.type === 'game_console') {
        ctx.fillStyle = '#6d28d9'; // Purple Game Boy
        ctx.fillRect(ix, iy, item.width, item.height);
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(ix + 3, iy + 3, 22, 12);
        ctx.fillStyle = '#4ade80'; // Screen
        ctx.fillRect(ix + 5, iy + 5, 18, 8);
        ctx.fillStyle = '#ef4444'; // Red buttons
        ctx.fillRect(ix + 16, iy + 18, 4, 4);
      } else {
        ctx.fillStyle = item.color;
        ctx.fillRect(ix, iy, item.width, item.height);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(ix, iy, item.width, item.height);

        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.icon, ix + item.width / 2, iy + item.height - 4);
      }

      // Sparkle Effect
      ctx.fillStyle = '#fef08a';
      const sparkAngle = Date.now() / 300 + item.x;
      ctx.fillRect(ix + item.width / 2 + Math.cos(sparkAngle) * 14, iy + Math.sin(sparkAngle) * 6, 3, 3);

      // Item Tag Label
      ctx.fillStyle = '#fef08a';
      ctx.font = '7px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText(item.name.toUpperCase(), ix + item.width / 2, iy - 8);
    });

    // 6. Draw Corridor NPC Students & Study Groups
    npcsRef.current.forEach(npc => {
      // Draw Primary NPC Sprite
      drawStudentSprite(
        ctx,
        npc.x,
        npc.y,
        npc.dir,
        0,
        !!npc.isWandering,
        npc.hairColor,
        npc.shirtColor,
        npc.spriteStyle,
        npc.hairStyle
      );

      // Draw Partner Sprite if pair/group
      if (npc.partnerData) {
        drawStudentSprite(
          ctx,
          npc.x + 32,
          npc.y,
          npc.partnerData.dir,
          0,
          false,
          npc.partnerData.hairColor,
          npc.partnerData.shirtColor,
          npc.partnerData.spriteStyle,
          npc.partnerData.hairStyle
        );
      }

      // Pixel Cat for Kanya
      if (npc.hasCat) {
        const catX = npc.x + 38;
        const catY = npc.y + 32;
        ctx.fillStyle = '#ea580c'; // Ginger Cat
        ctx.fillRect(catX, catY, 14, 10);
        ctx.fillRect(catX + 2, catY - 5, 8, 6); // Head
        ctx.fillRect(catX + 2, catY - 8, 2, 3); // Left Ear
        ctx.fillRect(catX + 8, catY - 8, 2, 3); // Right Ear
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(catX + 4, catY - 3, 2, 2); // Eye
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(catX + 13, catY - 4, 3, 2); // Tail
      }

      const centerX = npc.x + (npc.partnerData ? 34 : 18);

      // NPC Role Label
      ctx.fillStyle = npc.isExaminer ? '#fef08a' : '#d1d5db';
      ctx.font = '7px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText(npc.role, centerX, npc.y - 8);
    });

    // 7. Draw Player Character
    drawStudentSprite(
      ctx,
      p.x,
      p.y,
      p.dir,
      p.animFrame,
      p.isMoving,
      playerCustomization.hairColor,
      playerCustomization.shirtColor,
      playerCustomization.spriteStyle,
      playerCustomization.hairStyle
    );

    // 7.5 Draw Pixel Cat Companion "Whiskers" Following Player
    if (catPetTimer > 0) {
      const catXRef = catPosRef.current;
      const targetCatX = p.dir === 'right' ? p.x - 28 : (p.dir === 'left' ? p.x + 36 : p.x - 14);
      const targetCatY = p.y + 14;

      catXRef.x += (targetCatX - catXRef.x) * 0.16;
      catXRef.y += (targetCatY - catXRef.y) * 0.16;

      const cx = catXRef.x;
      const cy = catXRef.y;
      const tailWiggle = Math.sin(now / 120) * 3;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(cx + 9, cy + 12, 9, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body (Ginger Fur)
      ctx.fillStyle = '#d97706';
      ctx.fillRect(cx, cy, 18, 11);

      // Chest Patch
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(cx + 3, cy + 4, 8, 5);

      // Head
      const headX = p.dir === 'left' ? cx - 4 : cx + 12;
      ctx.fillStyle = '#d97706';
      ctx.fillRect(headX, cy - 6, 10, 10);

      // Ears
      ctx.fillRect(headX, cy - 10, 3, 4);
      ctx.fillRect(headX + 7, cy - 10, 3, 4);
      ctx.fillStyle = '#f472b6'; // Pink inner ear
      ctx.fillRect(headX + 1, cy - 9, 1, 2);
      ctx.fillRect(headX + 8, cy - 9, 1, 2);

      // Eyes & Nose
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(headX + 2, cy - 3, 2, 2);
      ctx.fillRect(headX + 6, cy - 3, 2, 2);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(headX + 4, cy - 1, 2, 1);

      // Tail
      ctx.fillStyle = '#d97706';
      ctx.fillRect(cx - 4, cy + 2 + tailWiggle, 5, 3);

      // Whiskers Overhead Label
      ctx.fillStyle = '#4ade80';
      ctx.font = '7px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText(`🐾 WHISKERS (${catPetTimer}s)`, cx + 9, cy - 14);

      // Cute Purr Bubble
      if (Math.floor(now / 3500) % 3 === 0) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.fillRect(cx - 20, cy - 32, 60, 14);
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - 20, cy - 32, 60, 14);
        ctx.fillStyle = '#fef08a';
        ctx.font = '8px sans-serif';
        ctx.fillText('Purr... Meow!', cx + 10, cy - 22);
      }
    }

    // 8. Draw Random Event: Pixel Cat Dash 🐱
    const catEvt = eventCatRef.current;
    if (catEvt.active) {
      ctx.fillStyle = '#0f172a'; // Black Cat Body
      ctx.fillRect(catEvt.x, catEvt.y, 20, 12);
      ctx.fillRect(catEvt.x + 14, catEvt.y - 6, 8, 8); // Head
      ctx.fillStyle = '#fde047'; // Eyes
      ctx.fillRect(catEvt.x + 18, catEvt.y - 4, 2, 2);
      // Sparkle Tail Trails
      for (let i = 1; i <= 3; i++) {
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(catEvt.x - i * 8, catEvt.y + 2 + Math.sin(Date.now() / 100 + i) * 3, 4, 4);
      }
      ctx.fillStyle = '#fef08a';
      ctx.font = '7px "Press Start 2P"';
      ctx.fillText('🐾 Choco Dashed By!', catEvt.x + 10, catEvt.y - 12);
    }

    // 8.5 Draw Floating Particle Texts (+1 COIN 🪙)
    coinParticlesRef.current.forEach(pt => {
      if (pt.life > 0) {
        pt.y -= 0.6;
        pt.life -= 1;
        const opacity = Math.min(1, pt.life / 30);
        ctx.fillStyle = `rgba(254, 240, 138, ${opacity})`;
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(pt.text, pt.x, pt.y);
      }
    });
    coinParticlesRef.current = coinParticlesRef.current.filter(pt => pt.life > 0);

    // 9. --- GUARANTEED TOP LAYER: SPEECH BUBBLES ALWAYS RENDERED ON TOP OF EVERYTHING ELSE ---
    const currentActiveNPC = nearbyNPCRef.current;
    if (currentActiveNPC) {
      const dlgText = currentActiveNPC.dialogues[currentActiveNPC.currentDialogueIdx || 0];
      const centerX = currentActiveNPC.x + (currentActiveNPC.partnerData ? 34 : 18);
      const bubbleX = centerX;
      const bubbleY = currentActiveNPC.y - 34;

      ctx.font = 'bold 11px sans-serif';
      const textWidth = ctx.measureText(dlgText).width;
      const boxW = Math.max(220, textWidth + 30);
      const boxH = 32;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
      ctx.fillRect(bubbleX - boxW / 2, bubbleY - boxH, boxW, boxH);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(bubbleX - boxW / 2, bubbleY - boxH, boxW, boxH);

      // Pointer
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(bubbleX - 6, bubbleY);
      ctx.lineTo(bubbleX + 6, bubbleY);
      ctx.lineTo(bubbleX, bubbleY + 6);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(dlgText, bubbleX, bubbleY - 11);
    }

    // Draw Nearby Item Tip Bubble (On Top Layer)
    const currentActiveItem = nearbyItemRef.current;
    if (currentActiveItem && !currentActiveNPC) {
      const tipText = currentActiveItem.tipText;
      const bubbleX = currentActiveItem.x + currentActiveItem.width / 2;
      const bubbleY = currentActiveItem.y - 28;

      ctx.font = 'bold 11px sans-serif';
      const textWidth = ctx.measureText(tipText).width;
      const boxW = Math.max(200, textWidth + 28);
      const boxH = 30;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
      ctx.fillRect(bubbleX - boxW / 2, bubbleY - boxH, boxW, boxH);
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(bubbleX - boxW / 2, bubbleY - boxH, boxW, boxH);

      // Pointer
      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.moveTo(bubbleX - 6, bubbleY);
      ctx.lineTo(bubbleX + 6, bubbleY);
      ctx.lineTo(bubbleX, bubbleY + 6);
      ctx.fill();

      ctx.fillStyle = '#e9d5ff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tipText, bubbleX, bubbleY - 10);
    }

    ctx.restore(); // Restore context to draw camera-fixed HUD cues

    // 10. Corridor Extension Cue (Fixed Screen Coordinates)
    if (worldWidth > canvas.width) {
      const isNearRight = cameraX >= worldWidth - canvas.width - 40;
      const isNearLeft = cameraX <= 40;

      ctx.fillStyle = 'rgba(43, 29, 20, 0.9)';
      ctx.fillRect(canvas.width / 2 - 240, canvas.height - 38, 480, 26);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.strokeRect(canvas.width / 2 - 240, canvas.height - 38, 480, 26);

      ctx.fillStyle = '#fef08a';
      ctx.font = '8px "Press Start 2P"';
      ctx.textAlign = 'center';

      if (isNearLeft) {
        ctx.fillText('► EXTENDED CORRIDOR: WALK RIGHT FOR MORE DOORS ►', canvas.width / 2, canvas.height - 22);
      } else if (isNearRight) {
        ctx.fillText('◄ EXTENDED CORRIDOR: WALK LEFT FOR PREVIOUS ROOMS ◄', canvas.width / 2, canvas.height - 22);
      } else {
        ctx.fillText('◄ MOVE LEFT / RIGHT TO EXPLORE EXTENDED HALLWAY ►', canvas.width / 2, canvas.height - 22);
      }
    }

  }, [isPaused, nearbyRoom, playerCustomization, onOpenRoom]);

  // Animation Loop Effect
  useEffect(() => {
    let animId: number;
    const loop = () => {
      render();
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animId);
  }, [render]);

  // Touch controls helpers
  const handleTouchStart = (dir: string) => {
    touchKeysRef.current[dir] = true;
  };
  const handleTouchEnd = (dir: string) => {
    touchKeysRef.current[dir] = false;
  };

  const handleCanvasClick = () => {
    if (isPaused) return;
    if (nearbyItemRef.current) {
      soundEngine.playSelect();
      if (nearbyItemRef.current.type === 'vending_machine') {
        onOpenVending();
      } else if (nearbyItemRef.current.type === 'quiz_kiosk') {
        onOpenQuiz();
      } else if (nearbyItemRef.current.isSpecialModal) {
        setShowConsoleModal(true);
      } else {
        eventBannerRef.current = {
          text: `✨ ${nearbyItemRef.current.tipText}`,
          timer: 180
        };
      }
    } else if (nearbyNPCRef.current && !nearbyRoomRef.current) {
      soundEngine.playTextBlip();
      const npc = nearbyNPCRef.current;
      npc.currentDialogueIdx = (npc.currentDialogueIdx + 1) % npc.dialogues.length;
      setNearbyNPC({ ...npc });
    } else if (nearbyRoomRef.current) {
      handleOpenRoom(nearbyRoomRef.current);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full flex-1 flex flex-col items-center justify-center bg-slate-950 p-2 md:p-4 overflow-hidden">
      
      {/* Canvas */}
      <div className="relative border-4 border-amber-900 rounded-lg shadow-2xl overflow-hidden max-w-full">
        <canvas
          ref={canvasRef}
          width={1024}
          height={576}
          onClick={handleCanvasClick}
          className="w-full h-auto max-h-[80vh] aspect-[16/9] block pixelated bg-amber-950 cursor-pointer"
        />

        {/* Floating Direction Controls Banner */}
        <div className="absolute top-3 left-3 bg-amber-950/90 border-2 border-amber-700/80 px-3 py-1.5 rounded font-silkscreen text-[10px] text-amber-200 hidden sm:flex items-center gap-2 pointer-events-none shadow-md">
          <span className="font-pixel text-[9px] text-amber-400">CONTROLS:</span>
          <span>Arrow Keys / WASD to Move</span>
          <span>•</span>
          <span>[E] / Space to Interact</span>
        </div>
      </div>

      {/* Touch D-Pad & Action Buttons Overlay for Mobile Devices */}
      <div className="sm:hidden mt-3 flex items-center justify-between w-full max-w-md px-4">
        
        {/* D-Pad Grid */}
        <div className="grid grid-cols-3 gap-1.5 w-36 h-36 bg-amber-950/90 border-2 border-amber-700 p-1.5 rounded-xl shadow-lg">
          <div />
          <button
            onTouchStart={() => handleTouchStart('up')}
            onTouchEnd={() => handleTouchEnd('up')}
            onMouseDown={() => handleTouchStart('up')}
            onMouseUp={() => handleTouchEnd('up')}
            className="bg-amber-800 active:bg-amber-600 border border-amber-500 rounded flex items-center justify-center text-amber-100 font-pixel text-xs"
          >
            <MoveUp className="w-5 h-5" />
          </button>
          <div />

          <button
            onTouchStart={() => handleTouchStart('left')}
            onTouchEnd={() => handleTouchEnd('left')}
            onMouseDown={() => handleTouchStart('left')}
            onMouseUp={() => handleTouchEnd('left')}
            className="bg-amber-800 active:bg-amber-600 border border-amber-500 rounded flex items-center justify-center text-amber-100 font-pixel text-xs"
          >
            <MoveLeft className="w-5 h-5" />
          </button>
          <div className="bg-amber-900/50 rounded border border-amber-800 flex items-center justify-center text-[8px] font-pixel text-amber-400">
            PAD
          </div>
          <button
            onTouchStart={() => handleTouchStart('right')}
            onTouchEnd={() => handleTouchEnd('right')}
            onMouseDown={() => handleTouchStart('right')}
            onMouseUp={() => handleTouchEnd('right')}
            className="bg-amber-800 active:bg-amber-600 border border-amber-500 rounded flex items-center justify-center text-amber-100 font-pixel text-xs"
          >
            <MoveRight className="w-5 h-5" />
          </button>

          <div />
          <button
            onTouchStart={() => handleTouchStart('down')}
            onTouchEnd={() => handleTouchEnd('down')}
            onMouseDown={() => handleTouchStart('down')}
            onMouseUp={() => handleTouchEnd('down')}
            className="bg-amber-800 active:bg-amber-600 border border-amber-500 rounded flex items-center justify-center text-amber-100 font-pixel text-xs"
          >
            <MoveDown className="w-5 h-5" />
          </button>
          <div />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {nearbyItem && (
            <button
              onClick={() => {
                soundEngine.playSelect();
                if (nearbyItem.isSpecialModal) {
                  setShowConsoleModal(true);
                } else {
                  eventBannerRef.current = {
                    text: `✨ ${nearbyItem.tipText}`,
                    timer: 180
                  };
                }
              }}
              className="retro-button px-4 py-3 rounded-xl font-pixel text-xs text-purple-100 bg-purple-900 border-2 border-purple-400 shadow-xl"
            >
              {nearbyItem.icon} {nearbyItem.name.toUpperCase()}
            </button>
          )}

          {nearbyNPC && !nearbyRoom && (
            <button
              onClick={() => {
                soundEngine.playTextBlip();
                nearbyNPC.currentDialogueIdx = (nearbyNPC.currentDialogueIdx + 1) % nearbyNPC.dialogues.length;
                setNearbyNPC({ ...nearbyNPC });
              }}
              className="retro-button px-4 py-3 rounded-xl font-pixel text-xs text-sky-100 bg-sky-900 border-2 border-sky-400 shadow-xl"
            >
              TALK [E] 💬
            </button>
          )}

          {nearbyRoom && (
            <button
              onClick={() => handleOpenRoom(nearbyRoom)}
              className="retro-button px-5 py-3 rounded-xl font-pixel text-xs text-amber-100 bg-amber-900 border-2 border-amber-300 shadow-xl"
            >
              ENTER DOOR 🚪
            </button>
          )}
        </div>

      </div>

      {/* Dropped Game Console Popup Modal */}
      {showConsoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-4 border-purple-600 rounded-2xl max-w-md w-full p-6 text-center font-pixel shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            
            <div className="w-16 h-16 bg-purple-950 border-2 border-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg animate-bounce">
              🎮
            </div>

            <h2 className="text-base md:text-lg text-purple-200 font-bold mb-3 leading-snug">
              Oh! Someone left a game console here.
            </h2>

            <p className="text-xs text-purple-300/90 leading-relaxed mb-6 font-sans">
              It looks like a retro handheld console loaded with <strong className="text-purple-200 font-pixel">IELTS-Boy</strong>!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  soundEngine.playSelect();
                  window.open('https://masyor.github.io/IELTS-Boy/', '_blank', 'noopener,noreferrer');
                  setShowConsoleModal(false);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-pixel text-xs rounded-xl border-2 border-purple-300 shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>🎮 PLAY GAME</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClose();
                  setShowConsoleModal(false);
                }}
                className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-pixel text-xs rounded-xl border border-slate-600"
              >
                Walk Away
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
