import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  FileText, 
  GraduationCap, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronLeft,
  Loader2 
} from 'lucide-react';
import { MarkdownView } from './MarkdownView';
import { Flashcard, QuizQuestion } from '../types';

export const StudyStudio: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [studyLevel, setStudyLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [activeTab, setActiveTab] = useState<'tutor' | 'quiz' | 'flashcards' | 'notes'>('tutor');
  const [isLoading, setIsLoading] = useState(false);
  const [tutorContent, setTutorContent] = useState<string | null>(null);

  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: '1',
      question: 'What is Time Complexity (Big O) of Binary Search?',
      answer: 'O(log n) because the search space is halved in each step.',
      hint: 'Think about divide and conquer'
    },
    {
      id: '2',
      question: 'What is the difference between SQL and NoSQL?',
      answer: 'SQL is relational, schema-enforced, and ACID compliant. NoSQL is non-relational, flexible schema, and horizontally scalable.',
      hint: 'Relational vs Document-based'
    },
    {
      id: '3',
      question: 'What is an API (Application Programming Interface)?',
      answer: 'A structured set of protocols that allows different software applications to communicate and exchange data seamlessly.',
      hint: 'Messenger between systems'
    }
  ]);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q1',
      question: 'Which data structure follows the First-In, First-Out (FIFO) principle?',
      options: ['Stack', 'Queue', 'Binary Tree', 'Hash Map'],
      correctIndex: 1,
      explanation: 'A Queue works on FIFO (First-In, First-Out), like a line of people waiting.'
    },
    {
      id: 'q2',
      question: 'In HTTP, which status code indicates "Unauthorized"?',
      options: ['200', '404', '401', '500'],
      correctIndex: 2,
      explanation: '401 specifically denotes Unauthorized, requiring authentication credentials.'
    },
    {
      id: 'q3',
      question: 'Which CSS property creates a flexbox container?',
      options: ['display: flex;', 'position: absolute;', 'float: left;', 'display: grid;'],
      correctIndex: 0,
      explanation: 'Setting "display: flex;" enables the CSS Flexible Box layout module.'
    }
  ]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const handleGenerateStudyMaterial = async (type: 'tutor' | 'quiz' | 'flashcards' | 'notes') => {
    if (!topic.trim()) return;
    setIsLoading(true);

    try {
      const prompt = `Topic: "${topic}". Target Level: ${studyLevel.toUpperCase()}.
Task: Generate high-quality ${type} material.
${type === 'quiz' ? 'Provide 4 multiple choice questions with 4 options each, indicating the correct answer and a concise explanation.' : ''}
${type === 'flashcards' ? 'Provide 4 interactive flashcard question/answer pairs.' : ''}
${type === 'tutor' ? 'Provide an intuitive master tutor explanation breaking down core intuition, practical analogies, and step-by-step concepts.' : ''}
${type === 'notes' ? 'Provide concise, high-yield revision notes and cheatsheet summaries.' : ''}`;

      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          studyMode: true,
          studyLevel,
          personality: 'teacher'
        })
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunkStr = decoder.decode(value);
          const lines = chunkStr.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.text) fullText += parsed.text;
              } catch (e) {}
            }
          }
        }
      }

      setTutorContent(fullText);
    } catch (err) {
      console.error('Study generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuizOption = (questionId: string, optionIdx: number) => {
    if (showQuizResults) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>STUDY MENTOR & ACADEMIC STUDIO</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-4xl text-slate-100">
          Personalized AI Tutor & Quiz Engine
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Master any subject with tailored explanations, interactive flashcards, exam preparation quizzes, and rapid chapter notes.
        </p>
      </div>

      {/* Topic & Level Controls Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0f1420] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <BookOpen className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter subject or concept (e.g. Object Oriented Programming, Thermodynamics, Calculus)"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Difficulty Level Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
            {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setStudyLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  studyLevel === lvl
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleGenerateStudyMaterial(activeTab)}
            disabled={isLoading || !topic.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/20 disabled:opacity-40 transition"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isLoading ? 'Generating...' : 'Learn Now'}</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
          <button
            onClick={() => setActiveTab('tutor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'tutor'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>AI Tutor Explanation</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'quiz'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interactive MCQ Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'flashcards'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Flashcards Deck</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'notes'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Revision Cheatsheet</span>
          </button>
        </div>
      </div>

      {/* Main Content Area based on Tab */}
      <div className="space-y-6">
        {/* Flashcards View */}
        {activeTab === 'flashcards' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Card {currentCardIdx + 1} of {flashcards.length}</span>
              <span>Click card to reveal answer</span>
            </div>

            {/* 3D Flip Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer min-h-[220px] rounded-2xl bg-gradient-to-br from-[#131a2b] to-[#0c121e] border border-indigo-500/30 p-8 shadow-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:border-indigo-400/60"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                  {isFlipped ? 'ANSWER' : 'QUESTION'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 mt-3 leading-relaxed">
                  {isFlipped ? flashcards[currentCardIdx].answer : flashcards[currentCardIdx].question}
                </h3>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800/80">
                <span>{flashcards[currentCardIdx].hint && !isFlipped ? `Hint: ${flashcards[currentCardIdx].hint}` : ''}</span>
                <span className="flex items-center gap-1 text-indigo-400">
                  <RotateCw className="w-3.5 h-3.5" /> Flip Card
                </span>
              </div>
            </div>

            {/* Card Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentCardIdx(prev => (prev > 0 ? prev - 1 : flashcards.length - 1));
                }}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentCardIdx(prev => (prev < flashcards.length - 1 ? prev + 1 : 0));
                }}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-xs text-indigo-300 font-semibold transition"
              >
                Next Card <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Interactive Quiz View */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Practice Exam & Concept Check</h3>
                <p className="text-xs text-slate-400">Select answers and click "Check Answers" to grade yourself</p>
              </div>
              <button
                onClick={() => setShowQuizResults(!showQuizResults)}
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition shadow-lg shadow-indigo-500/20"
              >
                {showQuizResults ? 'Reset Quiz' : 'Check Answers'}
              </button>
            </div>

            <div className="space-y-4">
              {quizQuestions.map((q, qIdx) => (
                <div key={q.id} className="p-5 rounded-2xl bg-[#0f1420] border border-slate-800 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    <h4 className="text-sm sm:text-base font-semibold text-slate-100">{q.question}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[q.id] === optIdx;
                      const isCorrect = q.correctIndex === optIdx;

                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                      if (showQuizResults) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-red-950/40 border-red-500 text-red-300';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-indigo-500/20 border-indigo-500 text-indigo-200 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectQuizOption(q.id, optIdx)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs text-left transition ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {showQuizResults && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {showQuizResults && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showQuizResults && (
                    <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl text-xs text-indigo-300">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Tutor / Notes View */}
        {(activeTab === 'tutor' || activeTab === 'notes') && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f1420] border border-slate-800 shadow-2xl">
            {tutorContent ? (
              <MarkdownView content={tutorContent} />
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-3">
                <BookOpen className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm">Enter a topic above and click "Learn Now" to generate structured master tutor material.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
