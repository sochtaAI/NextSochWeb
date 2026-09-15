import React, { useState } from 'react';
import { SOURCE_APPLICABILITY_MATRICES } from '../../data/academicContentData';
import {
  X,
  ShieldCheck,
  BookOpen,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';

interface SourceApplicabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedExamId?: string;
}

export const SourceApplicabilityModal: React.FC<SourceApplicabilityModalProps> = ({
  isOpen,
  onClose,
  selectedExamId,
}) => {
  const [activeExamId, setActiveExamId] = useState<string>(
    selectedExamId || 'NEET'
  );

  if (!isOpen) return null;

  const currentMatrix =
    SOURCE_APPLICABILITY_MATRICES.find(m => m.examId === activeExamId) ||
    SOURCE_APPLICABILITY_MATRICES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div
        id="source-applicability-modal"
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                Prescribed Authority & Source Matrix
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Official Syllabus Ground Truth
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Which Books Are Actually Prescribed For Your Exam?
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Exam Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/60 px-6 gap-2 overflow-x-auto">
          {SOURCE_APPLICABILITY_MATRICES.map(mat => (
            <button
              key={mat.examId}
              onClick={() => setActiveExamId(mat.examId)}
              className={`py-3 px-4 text-xs font-bold transition whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
                mat.examId === currentMatrix.examId
                  ? 'border-blue-600 text-blue-700 dark:text-blue-400 font-bold'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              {mat.examName} ({mat.examId})
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Authority Info Banner */}
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/40 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <div className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wide">
                Prescribed Authority: {currentMatrix.authority}
              </div>
              <p className="text-xs text-blue-950 dark:text-blue-100 leading-relaxed">
                NEXT SOCH strictly aligns with the official syllabus published by {currentMatrix.authority}. We never invent topics or rely on unofficial coaching speculation.
              </p>
            </div>
          </div>

          {/* Applicable Subjects and Prescribed Sources */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Prescribed Subject Curricula & Rationalization Status ({currentMatrix.syllabusVersion})
            </h3>

            <div className="space-y-4">
              {currentMatrix.applicableSubjects.map((subj, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {subj.subjectName}
                      </h4>
                      <span className="text-[11px] px-2 py-0.5 rounded font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {subj.role === 'primary_ncert' ? 'Primary NCERT Mandate' : 'Problem Bank Reference'}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Weightage: {subj.weightage}
                    </span>
                  </div>

                  {/* Prescribed Sources */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                      Official Prescribed Books:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {subj.prescribedSources.map((src, sIdx) => (
                        <li
                          key={sIdx}
                          className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200/80 dark:border-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-2"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span>{src}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rationalized Status */}
                  <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <strong className="font-semibold">Rationalization Nuance: </strong>
                      <span>{subj.rationalizedStatus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Banner */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-2">
            <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
              Academic Standard Operating Procedure
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              In high-stakes competitive entrance examinations, answer key challenge disputes are resolved strictly according to the official prescribed NCERT source text lines. Private reference textbooks and coaching module assertions are never accepted as authority by the examination bodies.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            NEXT SOCH Prescribed Curriculum Integrity Standard
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white transition"
          >
            Close Source Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
