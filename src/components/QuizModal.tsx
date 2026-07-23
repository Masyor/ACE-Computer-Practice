import React, { useState } from 'react';
import { soundEngine } from '../utils/audio';
import { Sparkles, Trophy, CheckCircle2, XCircle, RotateCcw, X, Cat } from 'lucide-react';

interface Question {
  id: number;
  category: 'Vocabulary' | 'Speaking' | 'Reading' | 'Grammar' | 'Listening';
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const QUESTION_BANK: Question[] = [
  {
    id: 1,
    category: 'Vocabulary',
    question: "Which Academic Task 2 collocation is most formal and natural?",
    options: [
      "Substantially increase",
      "Deeply increase",
      "Bigly increase",
      "Strongly increase"
    ],
    correctIdx: 0,
    explanation: "'Substantially increase' is an excellent Band 8+ academic collocation!"
  },
  {
    id: 2,
    category: 'Speaking',
    question: "In Speaking Part 2, how should you use your 1-minute preparation time?",
    options: [
      "Write out full sentences word for word",
      "Jot down key keywords, bullet points & connective ideas",
      "Close your eyes and wait silently",
      "Ask the examiner to read the cue card aloud"
    ],
    correctIdx: 1,
    explanation: "Keywords and quick bullet points help you speak fluently without reading from a script!"
  },
  {
    id: 3,
    category: 'Grammar',
    question: "Choose the grammatically correct sentence for countable items:",
    options: [
      "There were less errors in the second draft.",
      "There were fewer errors in the second draft.",
      "There were little errors in the second draft.",
      "There were least errors in the second draft."
    ],
    correctIdx: 1,
    explanation: "Use 'fewer' for countable nouns like 'errors' and 'less' for uncountable nouns!"
  },
  {
    id: 4,
    category: 'Reading',
    question: "What is the recommended strategy for 'Matching Headings' questions?",
    options: [
      "Read the headings first, then skim paragraphs for main topic ideas",
      "Read every single word in the passage before looking at headings",
      "Guess based purely on paragraph lengths",
      "Skip all headings and do them last without reading"
    ],
    correctIdx: 0,
    explanation: "Understanding heading keywords before skimming paragraph topic sentences saves crucial time!"
  },
  {
    id: 5,
    category: 'Listening',
    question: "In computer-delivered IELTS Listening, how many times is each recording played?",
    options: [
      "Twice",
      "Three times",
      "Only once",
      "Unlimited times"
    ],
    correctIdx: 2,
    explanation: "Audio plays ONLY ONCE in IELTS Listening! Focus closely and write answers directly."
  },
  {
    id: 6,
    category: 'Vocabulary',
    question: "Select the best academic synonym for 'important':",
    options: [
      "Crucial / Vital",
      "Gigantic",
      "Superb",
      "Heavy duty"
    ],
    correctIdx: 0,
    explanation: "'Crucial', 'vital', and 'paramount' are high-scoring academic replacements for 'important'."
  },
  {
    id: 7,
    category: 'Grammar',
    question: "Which linking phrase is best for contrasting two arguments in Writing Task 2?",
    options: [
      "Conversely, on the other hand",
      "In the same boat",
      "More and more",
      "Like I said"
    ],
    correctIdx: 0,
    explanation: "'Conversely' and 'On the other hand' are formal discourse markers ideal for Task 2 essays."
  },
  {
    id: 8,
    category: 'Listening',
    question: "In IELTS Listening, if you hear '0171 394 2026', how is the double digit sequence '00' or '22' typically spoken?",
    options: [
      "As 'double oh' or 'double two'",
      "As 'two times zero' and 'two times two'",
      "As 'zero zero' and 'two two' strictly",
      "Examiners never use repeating consecutive numbers"
    ],
    correctIdx: 0,
    explanation: "Speakers routinely use natural expressions like 'double oh' or 'double two'. Listen closely!"
  },
  {
    id: 9,
    category: 'Vocabulary',
    question: "Which of these formal academic verbs means to make a problem or bad situation worse?",
    options: [
      "Exacerbate",
      "Alleviate",
      "Mitigate",
      "Ameliorate"
    ],
    correctIdx: 0,
    explanation: "'Exacerbate' means to worsen something. 'Alleviate', 'mitigate', and 'ameliorate' all mean to make better or ease!"
  },
  {
    id: 10,
    category: 'Reading',
    question: "What is the precise definition of 'Skimming' in the IELTS Reading module?",
    options: [
      "Reading quickly to get a general overview of main ideas",
      "Reading slowly to analyze every single word and punctuation",
      "Skipping the first and last paragraphs entirely without looking",
      "Searching exclusively for specific numbers, names, or dates"
    ],
    correctIdx: 0,
    explanation: "Skimming is reading rapidly for the main theme or gist. Scanning is searching for specific details like names or dates."
  },
  {
    id: 11,
    category: 'Reading',
    question: "For Academic Writing Task 1 (describing graphs/data), which of the following is incorrect?",
    options: [
      "Writing a personal opinion or explanation for why you think the data changed",
      "Providing a clear, cohesive overview paragraph summarizing main trends",
      "Using accurate approximations (e.g., 'just under half')",
      "Using a varied vocabulary to describe increments and declines"
    ],
    correctIdx: 0,
    explanation: "Academic Task 1 requires objective description. Never speculate or write personal opinions!"
  },
  {
    id: 12,
    category: 'Speaking',
    question: "If you do not understand a word the examiner uses in Speaking Part 3, what should you do?",
    options: [
      "Politely ask the examiner to clarify or rephrase the question",
      "Remain completely silent and wait for the test to end",
      "Guess what the word means and speak about a random topic",
      "Frown and repeat the word back to them repeatedly"
    ],
    correctIdx: 0,
    explanation: "In Speaking Part 3, you can absolutely ask for clarification! It is a natural conversational skill."
  },
  {
    id: 13,
    category: 'Grammar',
    question: "Complete the sentence with the correct subjunctive verb form: 'It is essential that every candidate ________ their passport on test day.'",
    options: [
      "present",
      "presents",
      "presented",
      "will present"
    ],
    correctIdx: 0,
    explanation: "The subjunctive mood uses the base form of the verb ('present') after expressions of urgency or necessity like 'It is essential that...'"
  }
];

interface QuizModalProps {
  onClose: () => void;
  onRewardCat: (score: number) => void;
  onRewardCoins: (amount: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  onClose,
  onRewardCat,
  onRewardCoins
}) => {
  // Select 3 random questions
  const [questions] = useState<Question[]>(() => {
    return [...QUESTION_BANK].sort(() => Math.random() - 0.5).slice(0, 3);
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOpt !== null) return; // Prevent double clicking
    setSelectedOpt(idx);
    setShowExplanation(true);

    if (idx === currentQ.correctIdx) {
      soundEngine.playSelect();
      setScore(prev => prev + 1);
    } else {
      soundEngine.playClose();
    }
  };

  const handleNext = () => {
    soundEngine.playSelect();
    setSelectedOpt(null);
    setShowExplanation(false);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
      if (score >= 2) {
        soundEngine.playQuizSuccess();
        onRewardCat(score);
        onRewardCoins(2);
      } else {
        onRewardCoins(1); // consolation coin
      }
    }
  };

  const handleRetry = () => {
    soundEngine.playSelect();
    setCurrentIdx(0);
    setSelectedOpt(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-4 border-amber-600 rounded-2xl max-w-xl w-full p-6 font-pixel shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClose();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 border-b-2 border-amber-800/80 pb-3">
          <div className="w-12 h-12 bg-amber-950 border-2 border-amber-500 rounded-xl flex items-center justify-center text-amber-300 shadow-md">
            <Cat className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-sm md:text-base text-amber-200 font-bold tracking-wide">
              IELTS MINI-QUIZ KIOSK
            </h2>
            <p className="text-[10px] text-amber-400/80 font-silkscreen">
              Score 2+ / 3 to recruit Whiskers the Pixel Cat!
            </p>
          </div>
        </div>

        {!isFinished ? (
          <div>
            {/* Progress & Category */}
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="bg-amber-950 border border-amber-700 text-amber-300 px-2.5 py-1 rounded text-[10px]">
                QUESTION {currentIdx + 1} OF {questions.length}
              </span>
              <span className="bg-purple-950 border border-purple-700 text-purple-300 px-2.5 py-1 rounded text-[10px]">
                {currentQ.category}
              </span>
              <span className="text-amber-300 text-[10px]">
                SCORE: {score}/{questions.length}
              </span>
            </div>

            {/* Question Text */}
            <div className="bg-slate-950/90 border-2 border-amber-900 p-4 rounded-xl mb-4 text-xs md:text-sm text-slate-100 font-sans leading-relaxed">
              {currentQ.question}
            </div>

            {/* Options */}
            <div className="space-y-2 mb-4">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = "bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200";
                
                if (selectedOpt !== null) {
                  if (idx === currentQ.correctIdx) {
                    btnStyle = "bg-emerald-900/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-500/50";
                  } else if (idx === selectedOpt) {
                    btnStyle = "bg-red-900/90 border-red-400 text-red-100";
                  } else {
                    btnStyle = "bg-slate-800/50 border-slate-700 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOpt !== null}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3 rounded-xl border-2 font-sans text-xs md:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {selectedOpt !== null && idx === currentQ.correctIdx && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {selectedOpt !== null && idx === selectedOpt && idx !== currentQ.correctIdx && (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next */}
            {showExplanation && (
              <div className="bg-amber-950/80 border border-amber-700/80 p-3 rounded-xl mb-4 text-xs font-sans text-amber-200 animate-in fade-in duration-200">
                <p className="font-bold text-amber-300 mb-1 font-pixel text-[10px]">EXPLANATION:</p>
                <p>{currentQ.explanation}</p>
              </div>
            )}

            {selectedOpt !== null && (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-amber-950 font-bold font-pixel text-xs rounded-xl border-2 border-amber-300 shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{currentIdx + 1 < questions.length ? "NEXT QUESTION ►" : "VIEW RESULTS 🏆"}</span>
              </button>
            )}
          </div>
        ) : (
          /* Results Screen */
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-amber-950 border-4 border-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-xl animate-bounce">
              {score >= 2 ? '🐱' : '📚'}
            </div>

            <h3 className="text-base md:text-lg text-amber-200 font-bold mb-2">
              {score >= 2 ? "QUIZ PASSED! WHISKERS JOINED YOU!" : "GOOD ATTEMPT!"}
            </h3>

            <p className="text-xs text-amber-300 mb-4 font-sans">
              You scored <strong className="text-amber-100 font-pixel">{score} out of 3</strong>!
            </p>

            {score >= 2 ? (
              <div className="bg-emerald-950/80 border-2 border-emerald-600 p-4 rounded-xl mb-6 text-xs text-emerald-200 font-sans space-y-2">
                <p className="font-pixel text-[10px] text-emerald-300 flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  REWARDS UNLOCKED!
                </p>
                <p>🐾 <strong>Whiskers the Pixel Cat</strong> is now following you in the corridor for 2 minutes!</p>
                <p>🪙 Earned <strong>+2 Bonus Coins</strong> for the Vending Machine!</p>
              </div>
            ) : (
              <div className="bg-amber-950/80 border border-amber-700 p-4 rounded-xl mb-6 text-xs text-amber-200 font-sans space-y-2">
                <p>Score 2 or higher to recruit Whiskers!</p>
                <p>🪙 Here is <strong>1 Consolation Coin</strong> for practicing!</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleRetry}
                className="w-full sm:w-auto px-5 py-3 bg-amber-600 hover:bg-amber-500 text-amber-950 font-pixel text-xs rounded-xl border-2 border-amber-300 shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>TRY AGAIN</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClose();
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-xs rounded-xl border border-slate-600 cursor-pointer"
              >
                RETURN TO CORRIDOR
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
