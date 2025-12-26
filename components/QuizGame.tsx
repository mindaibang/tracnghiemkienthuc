
import React, { useState } from 'react';
import { Question, QuizConfig, Mode, Language } from '../types';

interface QuizGameProps {
  questions: Question[];
  config: QuizConfig;
  onFinish: (answers: Record<number, string>) => void;
  onExit: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ questions, config, onFinish, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isPractice = config.mode === Mode.PRACTICE;
  const isVi = config.language === Language.VI;

  const handleSelectAnswer = (optionId: string) => {
    if (showFeedback && isPractice) return;

    setUserAnswers({ ...userAnswers, [currentIndex]: optionId });
    
    if (isPractice) {
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFeedback(false);
    } else {
      onFinish(userAnswers);
    }
  };

  const selectedAnswer = userAnswers[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black tracking-tight leading-none">
            {isPractice ? (isVi ? 'CHẾ ĐỘ ÔN THI' : 'PRACTICE MODE') : (isVi ? 'CHẾ ĐỘ THI THẬT' : 'EXAM MODE')}
          </h2>
          <p className="text-xs text-indigo-100 font-bold mt-1 opacity-80 uppercase tracking-widest">
            {isVi ? 'Câu hỏi' : 'Question'} {currentIndex + 1} / {questions.length}
          </p>
        </div>
        <button 
          onClick={onExit}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition"
          title={isVi ? 'Thoát' : 'Exit'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="w-full bg-indigo-100 h-1.5 overflow-hidden">
        <div 
          className="bg-indigo-400 h-full transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="p-8">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug mb-8">
          {currentQuestion.text}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            let optionStyles = "w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-4 ";
            
            if (selectedAnswer === option.id) {
              if (isPractice && showFeedback) {
                optionStyles += isCorrect ? "border-green-500 bg-green-50 text-green-900" : "border-red-500 bg-red-50 text-red-900";
              } else {
                optionStyles += "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md";
              }
            } else {
              if (isPractice && showFeedback && option.id === currentQuestion.correctAnswer) {
                optionStyles += "border-green-500 bg-green-50 text-green-900";
              } else {
                optionStyles += "border-gray-50 bg-gray-50 hover:border-indigo-100 hover:bg-indigo-50/30 text-gray-700";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                disabled={showFeedback && isPractice}
                className={optionStyles}
              >
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition ${selectedAnswer === option.id ? 'bg-indigo-500 text-white' : 'bg-white border-2 border-gray-100 text-gray-400'}`}>
                  {option.id}
                </span>
                <span className="flex-1 pt-1 font-medium">{option.text}</span>
              </button>
            );
          })}
        </div>

        {showFeedback && isPractice && (
          <div className={`mt-8 p-5 rounded-2xl border-l-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm font-black uppercase tracking-widest ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? (isVi ? 'Chính xác!' : 'Correct!') : (isVi ? 'Chưa đúng!' : 'Incorrect!')}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              <span className="font-bold">{isVi ? 'Giải thích:' : 'Explanation:'}</span> {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div className="mt-10">
          {(!isPractice || showFeedback) && selectedAnswer && (
            <button
              onClick={handleNext}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white font-black rounded-2xl transition shadow-xl transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{currentIndex === questions.length - 1 
                ? (isVi ? 'HOÀN THÀNH' : 'FINISH') 
                : (isVi ? 'CÂU TIẾP THEO' : 'NEXT QUESTION')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
