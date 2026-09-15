import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_QUESTIONS } from '../../data/curriculumData';
import {
  Swords,
  Users,
  Trophy,
  Zap,
  Flame,
  ArrowRight,
  Share2,
  CheckCircle2,
  Clock,
  RotateCcw
} from 'lucide-react';

export const SochBattle: React.FC = () => {
  const { addToast } = useApp();

  const [battleState, setBattleState] = useState<'lobby' | 'in_battle' | 'results'>('lobby');
  const [battleQuestions, setBattleQuestions] = useState(ALL_QUESTIONS.slice(0, 5));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [friendLinkCopied, setFriendLinkCopied] = useState(false);

  // Battle round countdown
  useEffect(() => {
    if (battleState !== 'in_battle') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setBattleState('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Bot opponent answering simulation
    const botInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        setBotScore(prev => prev + 1);
      }
    }, 4500);

    return () => {
      clearInterval(timer);
      clearInterval(botInterval);
    };
  }, [battleState]);

  const handleStartBattle = () => {
    setUserScore(0);
    setBotScore(0);
    setCurrentIdx(0);
    setTimeLeft(60);
    setBattleState('in_battle');
  };

  const handleAnswer = (optionId: string) => {
    const q = battleQuestions[currentIdx];
    if (optionId === q.correctAnswer) {
      setUserScore(prev => prev + 1);
    }

    if (currentIdx < battleQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setBattleState('results');
    }
  };

  const handleCopyBattleLink = () => {
    navigator.clipboard.writeText('https://app.nextsoch.com/battle/join?code=SOCH-8821');
    setFriendLinkCopied(true);
    addToast('Battle invite link copied to clipboard!', 'success');
    setTimeout(() => setFriendLinkCopied(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {battleState === 'lobby' && (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
              <Swords className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Soch Battle Arena
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              5-question speed sprints on NCERT Biology & Chemistry. Test your recall under pressure and conquer the leaderboards.
            </p>
          </div>

          {/* Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instant Matchmaking */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display">
                  Quick Sprint Match
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Get paired instantly against another aspirant for a rapid 60-second challenge on Cell Biology.
                </p>
              </div>

              <button
                onClick={handleStartBattle}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-xs"
              >
                <span>Find Match & Battle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Challenge a Friend */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display">
                  Challenge a Study Partner
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Generate a custom battle room code and share via WhatsApp or Telegram with your batchmate.
                </p>
              </div>

              <button
                onClick={handleCopyBattleLink}
                className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>{friendLinkCopied ? 'Link Copied!' : 'Copy Challenge Link'}</span>
              </button>
            </div>
          </div>

          {/* Active Squads Strip */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                  NEET 2025 Top 100 Squad
                </h4>
                <p className="text-[11px] text-slate-500">4 / 5 members active today · Collective 18-day streak</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Rank #42</span>
          </div>
        </div>
      )}

      {battleState === 'in_battle' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {/* Battle Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            {/* User score */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                You
              </div>
              <div>
                <div className="text-xs text-slate-400">Score</div>
                <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 font-display">
                  {userScore}
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{timeLeft}s</span>
            </div>

            {/* Opponent score */}
            <div className="flex items-center space-x-3 text-right">
              <div>
                <div className="text-xs text-slate-400">Aman (Kota)</div>
                <div className="text-lg font-extrabold text-rose-600 dark:text-rose-400 font-display">
                  {botScore}
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Question {currentIdx + 1} of {battleQuestions.length}
            </span>
            <p className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
              {battleQuestions[currentIdx].questionText}
            </p>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {battleQuestions[currentIdx].options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt.id)}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 transition flex items-start space-x-3"
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {battleState === 'results' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {userScore >= botScore ? 'Victory! 🏆' : 'Good Fight! ⚔️'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              You scored {userScore} correct vs Aman's {botScore}.
            </p>
          </div>

          <div className="flex justify-center space-x-3 pt-2">
            <button
              onClick={handleStartBattle}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rematch</span>
            </button>
            <button
              onClick={() => setBattleState('lobby')}
              className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition"
            >
              Back to Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
