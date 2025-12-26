
import React, { useState } from 'react';
import { Flashcard, Language } from '../types';

interface FlashcardViewProps {
  flashcards: Flashcard[];
  language: Language;
  onExit: () => void;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ flashcards, language, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const isVi = language === Language.VI;

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const currentCard = flashcards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-indigo-600 font-black tracking-widest text-sm uppercase">FLASHCARD MODE</h2>
          <p className="text-gray-400 text-xs font-bold uppercase mt-1">
            {isVi ? 'Thẻ số' : 'Card'} {currentIndex + 1} / {flashcards.length}
          </p>
        </div>
        <button 
          onClick={onExit}
          className="bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 p-2 rounded-xl border border-gray-100 transition shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-gray-100 h-1.5 rounded-full mb-10 overflow-hidden">
        <div 
          className="bg-indigo-500 h-full transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
        />
      </div>

      {/* Flip Card Container */}
      <div 
        className="relative w-full aspect-[4/3] sm:aspect-[3/2] cursor-pointer group perspective-2000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full duration-700 preserve-3d transform-gpu ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front Side */}
          <div className="absolute inset-0 backface-hidden bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
            <div className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6">
              FRONT
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-gray-800 leading-tight">
              {currentCard.front}
            </h3>
            <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-30 group-hover:opacity-60 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">{isVi ? 'Chạm để lật' : 'Tap to flip'}</span>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 backface-hidden bg-gray-900 border border-gray-800 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center rotate-y-180 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-400"></div>
            <div className="bg-white/10 text-indigo-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6">
              BACK
            </div>
            <p className="text-white text-lg md:text-2xl font-medium leading-relaxed max-w-lg">
              {currentCard.back}
            </p>
            <div className="absolute bottom-10 text-white/20 text-[10px] font-bold uppercase tracking-widest">
              {isVi ? 'Chạm để quay lại' : 'Tap to go back'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-12 flex justify-center items-center gap-8">
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          disabled={currentIndex === 0}
          className="w-16 h-16 bg-white border border-gray-100 rounded-2xl shadow-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all transform active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="bg-gray-100 px-6 py-2 rounded-full font-black text-gray-400 text-xs tracking-widest">
          {Math.round(((currentIndex + 1) / flashcards.length) * 100)}%
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          disabled={currentIndex === flashcards.length - 1}
          className="w-16 h-16 bg-indigo-600 border border-indigo-500 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center hover:bg-indigo-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all transform active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-2000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  );
};

export default FlashcardView;
