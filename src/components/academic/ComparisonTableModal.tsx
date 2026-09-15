import React, { useState } from 'react';
import { ComparisonTable } from '../../types';
import {
  X,
  Table as TableIcon,
  CheckCircle2,
  Sparkles,
  Flame,
  ArrowRightLeft,
  BookOpen
} from 'lucide-react';

interface ComparisonTableModalProps {
  tables: ComparisonTable[];
  activeTableId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ComparisonTableModal: React.FC<ComparisonTableModalProps> = ({
  tables,
  activeTableId,
  isOpen,
  onClose,
}) => {
  const [selectedTableId, setSelectedTableId] = useState<string>(
    activeTableId || (tables.length > 0 ? tables[0].id : '')
  );

  if (!isOpen || tables.length === 0) return null;

  const currentTable = tables.find(t => t.id === selectedTableId) || tables[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div
        id="comparison-table-modal"
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Concept Contrast Matrix
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                High-Yield Side-by-Side Comparison
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {currentTable.title}
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

        {/* Table Selector Pills if multiple */}
        {tables.length > 1 && (
          <div className="px-6 py-2.5 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
              Available Tables:
            </span>
            {tables.map(table => (
              <button
                key={table.id}
                onClick={() => setSelectedTableId(table.id)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                  table.id === currentTable.id
                    ? 'bg-teal-600 text-white font-semibold shadow-sm'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {table.title.split('—')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100/90 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold border-b border-gray-200 dark:border-gray-700">
                  <th className="p-3.5 w-1/4 uppercase tracking-wider text-[11px] text-gray-600 dark:text-gray-300">
                    Parameter
                  </th>
                  <th className="p-3.5 w-1/3 bg-sky-50/60 dark:bg-sky-950/30 text-sky-900 dark:text-sky-300 font-bold text-sm">
                    {currentTable.conceptA}
                  </th>
                  <th className="p-3.5 w-1/3 bg-teal-50/60 dark:bg-teal-950/30 text-teal-900 dark:text-teal-300 font-bold text-sm">
                    {currentTable.conceptB}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {currentTable.rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/70 dark:hover:bg-gray-800/50 transition"
                  >
                    <td className="p-3.5 font-semibold text-gray-900 dark:text-gray-100 bg-gray-50/40 dark:bg-gray-900/30">
                      {row.parameter}
                      {row.examNote && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 font-normal">
                          <Flame className="w-3 h-3 text-amber-500 flex-shrink-0" />
                          <span>{row.examNote}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-gray-800 dark:text-gray-200 leading-relaxed bg-sky-50/20 dark:bg-sky-950/10">
                      {row.valueA}
                    </td>
                    <td className="p-3.5 text-gray-800 dark:text-gray-200 leading-relaxed bg-teal-50/20 dark:bg-teal-950/10">
                      {row.valueB}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200/70 dark:border-teal-800/40 text-xs text-teal-900 dark:text-teal-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>
              Tip: Examiners frequently test Assertion-Reason questions by flipping parameter values between these two concepts!
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            NEXT SOCH Academic Matrices · Senior Faculty Verified
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white transition"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
