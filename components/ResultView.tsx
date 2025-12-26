
import React from 'react';
import { Question, Language } from '../types';

interface ResultViewProps {
  questions: Question[];
  userAnswers: Record<number, string>;
  language: Language;
  onRestart: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ questions, userAnswers, language, onRestart }) => {
  const isVi = language === Language.VI;
  const correctCount = questions.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.correctAnswer ? acc + 1 : acc;
  }, 0);

  const scorePercentage = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Summary Card */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {isVi ? 'Kết quả của bạn' : 'Your Quiz Result'}
        </h2>
        <div className="text-6xl font-black text-indigo-600 my-6">
          {scorePercentage}%
        </div>
        <p className="text-gray-600 text-lg mb-8">
          {isVi ? `Bạn trả lời đúng ${correctCount} trên tổng số ${questions.length} câu hỏi.` : `You got ${correctCount} out of ${questions.length} questions correct.`}
        </p>
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-lg"
        >
          {isVi ? 'Làm bài mới' : 'Try New Quiz'}
        </button>
      </div>

      {/* Detailed Review */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-800 px-2">
          {isVi ? 'Xem lại đáp án' : 'Review Answers'}
        </h3>
        {questions.map((q, idx) => {
          const userAnswer = userAnswers[idx];
          const isCorrect = userAnswer === q.correctAnswer;

          return (
            <div key={q.id} className="bg-white p-6 rounded-2xl shadow border border-gray-50">
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">{q.text}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {q.options.map(opt => {
                      const isUserSelected = userAnswer === opt.id;
                      const isCorrectOpt = q.correctAnswer === opt.id;
                      
                      let optStyle = "p-3 rounded-lg border text-sm flex items-start gap-2 ";
                      if (isCorrectOpt) optStyle += "bg-green-50 border-green-200 text-green-800 font-medium";
                      else if (isUserSelected && !isCorrect) optStyle += "bg-red-50 border-red-200 text-red-800";
                      else optStyle += "bg-gray-50 border-gray-100 text-gray-500";

                      return (
                        <div key={opt.id} className={optStyle}>
                          <span className="font-bold">{opt.id}.</span> {opt.text}
                          {isUserSelected && <span className="ml-auto text-xs font-bold uppercase tracking-widest">{isVi ? 'Bạn chọn' : 'Your pick'}</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-sm text-indigo-900 leading-relaxed">
                      <span className="font-bold">{isVi ? 'Giải thích:' : 'Explanation:'}</span> {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultView;
