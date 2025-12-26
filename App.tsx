
import React, { useState } from 'react';
import { QuizConfig, Question, Flashcard, Mode, Language } from './types';
import { generateContent } from './geminiService';
import QuizSetup from './components/QuizSetup';
import QuizGame from './components/QuizGame';
import ResultView from './components/ResultView';
import FlashcardView from './components/FlashcardView';
import Footer from './components/Footer';

type Screen = 'setup' | 'quiz' | 'flashcard' | 'results';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('setup');
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartSession = async (quizConfig: QuizConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateContent(quizConfig);
      setConfig(quizConfig);
      
      if (quizConfig.mode === Mode.FLASHCARD) {
        if (!result.flashcards || result.flashcards.length === 0) {
          throw new Error("No flashcards could be generated from this content.");
        }
        setFlashcards(result.flashcards);
        setScreen('flashcard');
      } else {
        if (!result.questions || result.questions.length === 0) {
          throw new Error("No questions could be generated from this content.");
        }
        setQuestions(result.questions);
        setScreen('quiz');
        setUserAnswers({});
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishQuiz = (answers: Record<number, string>) => {
    setUserAnswers(answers);
    setScreen('results');
  };

  const handleRestart = () => {
    setScreen('setup');
    setQuestions([]);
    setFlashcards([]);
    setConfig(null);
    setUserAnswers({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={handleRestart} style={{ cursor: 'pointer' }}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <h1 className="text-xl font-black text-gray-800 tracking-tight">
              Trắc nghiệm <span className="text-indigo-600">kiến thức</span>
            </h1>
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
            {config?.language === Language.EN ? 'Learning Platform' : 'Ứng dụng học tập'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {screen === 'setup' && (
          <QuizSetup onStart={handleStartSession} isLoading={isLoading} />
        )}

        {screen === 'quiz' && config && (
          <QuizGame 
            questions={questions} 
            config={config} 
            onFinish={handleFinishQuiz}
            onExit={handleRestart}
          />
        )}

        {screen === 'flashcard' && config && (
          <FlashcardView 
            flashcards={flashcards} 
            language={config.language} 
            onExit={handleRestart}
          />
        )}

        {screen === 'results' && config && (
          <ResultView 
            questions={questions} 
            userAnswers={userAnswers} 
            language={config.language} 
            onRestart={handleRestart}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
