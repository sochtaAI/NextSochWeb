import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Send, Bot, User, Loader2, BookOpen, AlertCircle } from 'lucide-react';

export const AiTutorModal: React.FC = () => {
  const {
    isAiModalOpen,
    setIsAiModalOpen,
    aiInitialPrompt,
    setAiInitialPrompt,
    examGoal,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<
    Array<{ sender: 'user' | 'ai'; text: string; time: string }>
  >([
    {
      sender: 'ai',
      text: `Hello Rahul! I am your NEXT SOCH AI Study Mentor. I am grounded in NCERT textbooks and tuned for ${examGoal}. Ask me to clarify any statement, explain option traps, or build memory mnemonics!`,
      time: 'Just now',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // When initial prompt is passed from Question or Reader
  useEffect(() => {
    if (aiInitialPrompt && isAiModalOpen) {
      handleSendMessage(aiInitialPrompt);
      setAiInitialPrompt('');
    }
  }, [aiInitialPrompt, isAiModalOpen]);

  if (!isAiModalOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg = {
      sender: 'user' as const,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          examGoal,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: data.explanation || 'No response generated.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      console.error('AI chat error:', err);
      // Helpful fallback message with NCERT reasoning
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `[NCERT Study Tip]: In competitive exams like ${examGoal}, questions test subtle differentiations. For example, Matthias Schleiden studied plants in 1838, while Theodore Schwann (1839) studied animal cells and discovered plasma membrane and the unique presence of cell wall in plants. Virchow added 'Omnis cellula-e cellula' in 1855. Note: Configure GEMINI_API_KEY in the environment for unlimited live AI explanations!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'Explain the difference between Schleiden and Schwann',
    'How do I memorize the 52% protein and 40% lipid ratio in RBC membrane?',
    'Why is Mesosome called the prokaryotic mitochondria?',
    'Give a mnemonic for the stages of prophase I',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl h-[600px] max-h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                NEXT SOCH AI Study Mentor
              </h3>
              <p className="text-[11px] text-slate-500">
                Tuned for {examGoal.replace('_', ' ')} · NCERT Grounded
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${
                m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs whitespace-pre-line'
                }`}
              >
                {m.text}
                <div
                  className={`text-[10px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-indigo-600 dark:text-indigo-400 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing NCERT source lines and formulating explanation...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompt Pills */}
        <div className="px-6 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 overflow-x-auto flex items-center space-x-2">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 rounded-lg text-[11px] text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask anything from NCERT, request memory tricks, or clarify concepts..."
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            disabled={!inputMessage.trim() || isLoading}
            onClick={() => handleSendMessage()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-40 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
