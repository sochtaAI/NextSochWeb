import React from 'react';
import { useApp } from '../../context/AppContext';
import { CHAPTERS } from '../../data/curriculumData';
import { X, Share2, Flame, CheckCircle2, TrendingUp, Sparkles, Copy, Send } from 'lucide-react';

export const ShareCardModal: React.FC = () => {
  const { isShareModalOpen, setIsShareModalOpen, userProgress, examGoal, addToast } = useApp();

  if (!isShareModalOpen) return null;

  const currentChapter =
    CHAPTERS.find(c => c.id === userProgress.lastStudied.chapterId) || CHAPTERS[0];

  const answeredIds = Object.keys(userProgress.answeredQuestions);
  const totalSolved = answeredIds.length;
  const correctCount = answeredIds.filter(id => userProgress.answeredQuestions[id].isCorrect).length;
  const accuracy = totalSolved > 0 ? Math.round((correctCount / totalSolved) * 100) : 100;

  const handleCopyText = () => {
    const text = `🔥 Rahul's NEXT SOCH Study Update:\nStreak: ${userProgress.streakDays} Days\nExam: ${examGoal}\nChapter: ${currentChapter.title} (Page ${userProgress.lastStudied.pageNumber})\nQuestions Solved: ${totalSolved} (Accuracy: ${accuracy}%)\n\nStudying on NEXT SOCH — Padhai Ki Next Soch!`;
    navigator.clipboard.writeText(text);
    addToast('Progress text copied to clipboard!', 'success');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🔥 Rahul's NEXT SOCH Study Update:\nStreak: ${userProgress.streakDays} Days\nExam: ${examGoal}\nChapter: ${currentChapter.title} (Page ${userProgress.lastStudied.pageNumber})\nQuestions Solved: ${totalSolved} (Accuracy: ${accuracy}%)\n\nStudying on NEXT SOCH — Padhai Ki Next Soch!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Share Study Progress Card
            </h3>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Progress Card to Share */}
        <div className="p-6">
          <div
            id="shareable-progress-card"
            className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white border border-indigo-800 shadow-xl space-y-5"
          >
            {/* Card Brand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xs">
                  NS
                </div>
                <div>
                  <div className="text-xs font-black tracking-wider font-display">NEXT SOCH</div>
                  <div className="text-[9px] text-indigo-300">Padhai Ki Next Soch</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-bold border border-indigo-400/30">
                {examGoal.replace('_', ' ')}
              </span>
            </div>

            {/* Student Persona */}
            <div>
              <div className="text-xs text-indigo-300">Student Profile</div>
              <div className="text-lg font-extrabold font-display">Rahul Sharma</div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                ✦ {userProgress.personality}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-indigo-900/80">
              <div className="p-2.5 rounded-xl bg-white/5 text-center">
                <div className="text-[10px] text-indigo-300">Streak</div>
                <div className="text-base font-extrabold flex items-center justify-center space-x-0.5 text-amber-400 font-display">
                  <span>{userProgress.streakDays}</span>
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 text-center">
                <div className="text-[10px] text-indigo-300">Questions</div>
                <div className="text-base font-extrabold text-white font-display">
                  {totalSolved}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 text-center">
                <div className="text-[10px] text-indigo-300">Accuracy</div>
                <div className="text-base font-extrabold text-emerald-400 font-display">
                  {accuracy}%
                </div>
              </div>
            </div>

            {/* Active Chapter */}
            <div className="text-[11px] bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between">
              <span className="truncate pr-2">
                📖 {currentChapter.title} (Page {userProgress.lastStudied.pageNumber})
              </span>
              <span className="text-emerald-400 font-bold shrink-0">In Progress</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-2">
            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Share to WhatsApp / Telegram</span>
            </button>

            <button
              onClick={handleCopyText}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Progress Text</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
