import { DoorRoom, StageLevel, ResourceLink } from '../types';

export const ROOMS: DoorRoom[] = [
  {
    id: 1,
    name: 'The Typing Gym',
    subtitle: 'Build touch typing speed, accuracy, and finger dexterity',
    color: '#8b5cf6', // Purple
    icon: 'Keyboard',
    getLinks: (): ResourceLink[] => [
      {
        title: 'Pixel Type - 8-Bit Typing Arcade',
        url: 'https://masyor.github.io/Pixel-Type/',
        description: '⭐ Featured Game! Master touch-typing with custom retro 8-bit visual stages, speed drills, and real-time WPM scoring.',
        badge: '⭐ Featured Game',
        iconType: 'Gamepad2'
      },
      {
        title: 'TypingTest Trainer',
        url: 'https://www.typingtest.com/trainer/',
        description: 'Interactive touch typing course & speed exercises.',
        badge: 'Top Rated',
        iconType: 'Zap'
      },
      {
        title: 'TypingStudy Lesson 1',
        url: 'https://www.typingstudy.com/lesson/1',
        description: 'Structured layout lessons for finger positioning.',
        badge: 'Beginner',
        iconType: 'BookOpen'
      },
      {
        title: 'EdClub Typing Jungle',
        url: 'https://www.edclub.com/sportal/program-3.game',
        description: 'Gamified typing arcade & skill mastery levels.',
        badge: 'Arcade',
        iconType: 'Gamepad2'
      },
      {
        title: 'Keybr Practice',
        url: 'https://www.keybr.com/',
        description: 'Smart adaptive typing engine based on error frequency.',
        badge: 'Adaptive',
        iconType: 'Cpu'
      }
    ]
  },
  {
    id: 2,
    name: 'The Exam Hall',
    subtitle: 'Official Academic IELTS Mock Tests & Reading Simulations',
    color: '#e11d48', // Crimson Red
    icon: 'GraduationCap',
    getLinks: (stage: StageLevel): ResourceLink[] => {
      if (stage === 'GEP 11A') {
        return [
          {
            title: 'IELTS Academic Test 16 Practice',
            url: 'https://www.essentialenglish.review/ielts-academic-16',
            description: 'GEP 11A Standard Academic Practice Tests & Solutions.',
            badge: 'Stage GEP 11A',
            iconType: 'FileText'
          }
        ];
      } else if (stage === 'GEP 11B') {
        return [
          {
            title: 'IELTS Academic Test 17 Practice',
            url: 'https://www.essentialenglish.review/ielts-academic-17',
            description: 'GEP 11B Advanced Practice Modules & Timer Drills.',
            badge: 'Stage GEP 11B',
            iconType: 'FileText'
          }
        ];
      } else {
        // GEP 12
        return [
          {
            title: 'IELTS Academic Test 18 Practice',
            url: 'https://www.essentialenglish.review/ielts-academic-18',
            description: 'GEP 12 Core Academic Exam Simulation Set.',
            badge: 'Stage GEP 12',
            iconType: 'FileText'
          },
          {
            title: 'EngNovate IELTS Prep Platform',
            url: 'https://engnovate.com/ielts/',
            description: 'Interactive IELTS practice tests & instant AI feedback.',
            badge: 'GEP 12 Extra',
            iconType: 'Sparkles'
          },
          {
            title: 'Mini-IELTS Reading Vault',
            url: 'https://mini-ielts.com/reading',
            description: 'Short targeted reading passages & answer keys.',
            badge: 'Reading Hub',
            iconType: 'BookMarked'
          }
        ];
      }
    }
  },
  {
    id: 3,
    name: 'The Listening Café',
    subtitle: 'Relax, listen to English audio tracks, & type lyrics',
    color: '#059669', // Emerald Green
    icon: 'Headphones',
    getLinks: (): ResourceLink[] => [
      {
        title: 'LyricsTyping',
        url: 'https://lyricstyping.com/',
        description: 'Type along to popular songs to train rhythm & ear.',
        badge: 'Music',
        iconType: 'Music'
      },
      {
        title: 'LyricsType',
        url: 'https://lyricstype.com/',
        description: 'Fast music-based transcription practice.',
        badge: 'Rhythm',
        iconType: 'Radio'
      },
      {
        title: 'Mini-IELTS Listening Practice',
        url: 'https://mini-ielts.com/listening',
        description: 'Real exam audio clips, accent training, & transcripts.',
        badge: 'Exam Audio',
        iconType: 'Volume2'
      }
    ]
  },
  {
    id: 4,
    name: 'The Strategy Media Center',
    subtitle: 'Expert video tutorials, exam tips, & test taker guides',
    color: '#0284c7', // Sky Blue
    icon: 'Tv',
    getLinks: (): ResourceLink[] => [
      {
        title: 'IELTS by IDP Official Channel',
        url: 'https://www.youtube.com/c/ieltsbyidp',
        description: 'Official video guides, band score tips & live Q&A webinars.',
        badge: 'Official YouTube',
        iconType: 'Youtube'
      }
    ]
  },
  {
    id: 5,
    name: 'The Speaking Studio',
    subtitle: 'Interactive pronunciation, cue card prompts & fluency drills',
    color: '#d97706', // Warm Amber/Orange
    icon: 'Sparkles',
    getLinks: (): ResourceLink[] => [
      {
        title: 'IELTS Speaking Assistant & Cue Cards',
        url: 'https://mini-ielts.com/speaking',
        description: 'Practice real exam Part 1, 2, and 3 cue card prompts.',
        badge: 'Speaking',
        iconType: 'Sparkles'
      },
      {
        title: 'Essential English Vocabulary Review',
        url: 'https://www.essentialenglish.review/',
        description: 'Targeted academic vocabulary & pronunciation guides.',
        badge: 'Vocab',
        iconType: 'BookOpen'
      }
    ]
  }
];

/**
 * Calculates world X coordinate for any room modularly based on list order & hallway width.
 * Standard spacing is 260px between door centers starting at 180px.
 */
export function getRoomWorldPosition(room: DoorRoom, index: number, totalRooms: number): number {
  if (room.worldX !== undefined) return room.worldX;
  
  const doorSpacing = 260;
  const startOffset = 180;
  return startOffset + index * doorSpacing;
}

export function getCorridorWorldWidth(roomsCount: number): number {
  const doorSpacing = 260;
  const startOffset = 180;
  const endPadding = 240;
  return Math.max(1024, startOffset + (roomsCount - 1) * doorSpacing + endPadding);
}
