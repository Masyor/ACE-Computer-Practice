import { DoorRoom, StageLevel, ResourceLink } from '../types';

export const ROOMS: DoorRoom[] = [
  {
    id: 1,
    name: 'The Typing Gym',
    signLabel: 'Typing',
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
        title: 'IELTS Speed Racer',
        url: 'https://masyor.github.io/IELTS-Speed-Racer',
        description: '⭐ Featured Game! Fast-paced typing race to sharpen your speed, accuracy, and reflexes.',
        badge: '⭐ Featured Game',
        iconType: 'Zap'
      }
    ]
  },
  {
    id: 2,
    name: 'The Vocab & Practice Hall',
    signLabel: 'Vocab & Exam',
    subtitle: 'Master essential IELTS vocabulary with driving arcade drills, practice sets & mock exams',
    color: '#e11d48', // Crimson Red
    icon: 'GraduationCap',
    getLinks: (stage: StageLevel): ResourceLink[] => {
      const generalExamLinks: ResourceLink[] = [
      {
        title: 'IELTS Driver',
        url: 'https://masyor.github.io/IELTS-Driver',
        description: '⭐ Featured App! Improve your vocabulary while testing your driving skills.',
        badge: '⭐ Featured App',
        iconType: 'Sparkles'
      },
        {
          title: 'Mini-IELTS Practice Vault',
          url: 'https://mini-ielts.com/',
          description: 'Free comprehensive collection of authentic IELTS practice test sets.',
          badge: 'Top Portal',
          iconType: 'Zap'
        },
        {
          title: 'IELTS Online Tests Portal',
          url: 'https://ieltsonlinetests.com/',
          description: 'Full-length computer-delivered mock tests with instant score analysis.',
          badge: 'Mock Exam',
          iconType: 'Globe'
        }
      ];

      if (stage === 'GEP 11A') {
        return [
          {
            title: 'IELTS Academic Test 16 Practice',
            url: 'https://www.essentialenglish.review/ielts-academic-16',
            description: 'GEP 11A Standard Academic Practice Tests & Solutions.',
            badge: 'Stage GEP 11A',
            iconType: 'FileText'
          },
          ...generalExamLinks
        ];
      } else if (stage === 'GEP 11B') {
        return [
          {
            title: 'IELTS Academic Test 17 Practice',
            url: 'https://www.essentialenglish.review/ielts-academic-17',
            description: 'GEP 11B Advanced Practice Modules & Timer Drills.',
            badge: 'Stage GEP 11B',
            iconType: 'FileText'
          },
          ...generalExamLinks
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
          ...generalExamLinks,
          {
            title: 'EngNovate IELTS Prep Platform',
            url: 'https://engnovate.com/ielts/',
            description: 'Interactive IELTS practice tests & instant AI feedback.',
            badge: 'GEP 12 Extra',
            iconType: 'Sparkles'
          }
        ];
      }
    }
  },
  {
    id: 3,
    name: 'Tips',
    signLabel: 'Tips',
    subtitle: 'Expert video tutorials, exam strategies, & test taker guides',
    color: '#0284c7', // Sky Blue
    icon: 'Tv',
    getLinks: (): ResourceLink[] => [
      {
        title: 'Stay Healthy!',
        url: 'https://masyor.github.io/ACE-IELTS-Study-Pet/',
        description: '⭐ Featured App! Help a cute owl to get ready for their IELTS test.',
        badge: '⭐ Featured App',
        iconType: 'Sparkles'
      },
      {
        title: 'IELTS by IDP Official Channel',
        url: 'https://www.youtube.com/c/ieltsbyidp',
        description: 'Official video guides, band score tips & live Q&A webinars.',
        badge: 'Official Video',
        iconType: 'Youtube'
      },
      {
        title: 'IELTS Advantage Prep Strategies',
        url: 'https://www.ieltsadvantage.com/',
        description: 'Comprehensive band 7+ strategies for all four modules.',
        badge: 'Top Guide',
        iconType: 'Zap'
      },
      {
        title: 'Take IELTS by British Council',
        url: 'https://takeielts.britishcouncil.org/take-ielts/prepare',
        description: 'Official study advice, test format advice & candidate tips.',
        badge: 'Official',
        iconType: 'BookMarked'
      }
    ]
  },
  {
    id: 4,
    name: 'Listening',
    signLabel: 'Listening',
    subtitle: 'Exam audio clips, accent training, lyrics typing & rhythm drills',
    color: '#059669', // Emerald Green
    icon: 'Headphones',
    getLinks: (): ResourceLink[] => [
      {
        title: 'Mini-IELTS Listening Practice',
        url: 'https://mini-ielts.com/listening',
        description: 'Real exam audio clips, accent training, & instant transcripts.',
        badge: 'Exam Audio',
        iconType: 'Volume2'
      },
      {
        title: 'IELTS Online Tests - Listening',
        url: 'https://ieltsonlinetests.com/ielts-exam-library?skill=listening',
        description: 'Full audio listening test simulations with computer-style interface.',
        badge: 'Mock Tests',
        iconType: 'Headphones'
      },
      {
        title: 'LyricsTyping',
        url: 'https://lyricstyping.com/',
        description: 'Type along to popular songs to train rhythm & ear recognition.',
        badge: 'Music Drill',
        iconType: 'Music'
      },
      {
        title: 'LyricsType',
        url: 'https://lyricstype.com/',
        description: 'Fast music-based transcription practice.',
        badge: 'Rhythm',
        iconType: 'Radio'
      }
    ]
  },
  {
    id: 5,
    name: 'Speaking',
    signLabel: 'Speaking',
    subtitle: 'Interactive pronunciation, cue card prompts & fluency drills',
    color: '#d97706', // Warm Amber/Orange
    icon: 'Sparkles',
    getLinks: (): ResourceLink[] => [
      {
        title: 'Mini-IELTS Speaking Vault',
        url: 'https://mini-ielts.com/speaking',
        description: 'Practice real exam Part 1, 2, and 3 cue card prompts & model answers.',
        badge: 'Cue Cards',
        iconType: 'Sparkles'
      },
      {
        title: 'IELTS Online Tests - Speaking',
        url: 'https://ieltsonlinetests.com/ielts-exam-library?skill=speaking',
        description: 'Interactive speaking simulator with sample recordings & candidate responses.',
        badge: 'Simulations',
        iconType: 'Volume2'
      },
      {
        title: 'Essential English Vocabulary Review',
        url: 'https://www.essentialenglish.review/',
        description: 'Targeted academic vocabulary & pronunciation guides.',
        badge: 'Vocab',
        iconType: 'BookOpen'
      }
    ]
  },
  {
    id: 6,
    name: 'Reading',
    signLabel: 'Reading',
    subtitle: 'Passage speed drills, question types, & timed reading practice',
    color: '#2563eb', // Royal Blue
    icon: 'BookOpen',
    getLinks: (): ResourceLink[] => [
      {
        title: 'Mini-IELTS Reading Vault',
        url: 'https://mini-ielts.com/reading',
        description: 'Short targeted reading passages & answer keys for quick skill drills.',
        badge: 'Top Practice',
        iconType: 'BookMarked'
      },
      {
        title: 'IELTS Online Tests - Reading',
        url: 'https://ieltsonlinetests.com/ielts-exam-library?skill=reading',
        description: 'Computer-delivered IELTS reading mock exams with explanations.',
        badge: 'Mock Tests',
        iconType: 'BookOpen'
      },
      {
        title: 'IELTS Flex Reading Drills',
        url: 'https://ieltsflex.com/',
        description: 'Interactive reading passages with question-by-question breakdown.',
        badge: 'Interactive',
        iconType: 'Cpu'
      }
    ]
  },
  {
    id: 7,
    name: 'Writing',
    signLabel: 'Writing',
    subtitle: 'Task 1 data descriptions & Task 2 essay prompts, templates & samples',
    color: '#ca8a04', // Golden Yellow
    icon: 'FileText',
    getLinks: (): ResourceLink[] => [
      {
        title: 'ACE Writing Practice',
        url: 'https://script.google.com/macros/s/AKfycbypLhYxTlrluyp3bnH11QQhFjKXSY-P8ioIOw4fg0r7IaaF-XyamCjgOo76YBor4WQ/exec',
        description: '⭐ Featured App! PRactice your IELTS writing in an authentic test environment.',
        badge: '⭐ Featured App',
        iconType: 'BookOpen'
      },
      {
        title: 'Mini-IELTS Writing Vault',
        url: 'https://mini-ielts.com/writing',
        description: 'Real IELTS Task 1 & Task 2 writing topics with Band 8/9 model essays.',
        badge: 'Prompts & Samples',
        iconType: 'FileText'
      },
      {
        title: 'IELTS Online Tests - Writing',
        url: 'https://ieltsonlinetests.com/ielts-exam-library?skill=writing',
        description: 'Computer-delivered writing practice with timer & word counter.',
        badge: 'Simulations',
        iconType: 'FileText'
      },
      {
        title: 'IELTS Advantage Writing Guide',
        url: 'https://www.ieltsadvantage.com/writing/',
        description: 'Step-by-step essay structure guides, cohesion tips & Band 9 vocabulary.',
        badge: 'Templates & Guides',
        iconType: 'Sparkles'
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