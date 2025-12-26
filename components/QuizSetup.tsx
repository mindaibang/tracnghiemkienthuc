
import React, { useState } from 'react';
import { QuizConfig, Language, Mode, Difficulty } from '../types';

interface QuizSetupProps {
  onStart: (config: QuizConfig) => void;
  isLoading: boolean;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStart, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'flashcard'>('quiz');
  const [config, setConfig] = useState<QuizConfig>({
    dataSource: '',
    isUrl: false,
    mode: Mode.PRACTICE,
    language: Language.VI,
    numberOfQuestions: 5,
    difficulty: Difficulty.MEDIUM,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.dataSource.trim()) return;
    
    // Ensure the mode matches the active tab if it was switched
    const finalConfig = {
      ...config,
      mode: activeTab === 'flashcard' ? Mode.FLASHCARD : config.mode === Mode.FLASHCARD ? Mode.PRACTICE : config.mode
    };
    onStart(finalConfig);
  };

  const isVi = config.language === Language.VI;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Tab Switcher */}
      <div className="flex bg-gray-50 border-b">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition ${activeTab === 'quiz' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          {isVi ? 'TAB 1: TRẮC NGHIỆM' : 'TAB 1: QUIZ'}
        </button>
        <button
          onClick={() => setActiveTab('flashcard')}
          className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition ${activeTab === 'flashcard' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          {isVi ? 'TAB 2: FLASHCARD' : 'TAB 2: FLASHCARD'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Language Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            {isVi ? 'Ngôn ngữ ứng dụng' : 'Application Language'}
          </label>
          <div className="flex gap-3">
            {[Language.VI, Language.EN].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setConfig({ ...config, language: lang })}
                className={`flex-1 py-3 rounded-xl border-2 font-bold transition ${config.language === lang ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-500 border-gray-100 hover:border-indigo-200'}`}
              >
                {lang === Language.VI ? 'Tiếng Việt (VI)' : 'English (EN)'}
              </button>
            ))}
          </div>
        </div>

        {/* Data Source Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            {isVi ? 'Nguồn dữ liệu đầu vào' : 'Input Data Source'}
          </label>
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setConfig({ ...config, isUrl: false })}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${!config.isUrl ? 'bg-indigo-50 text-indigo-700' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {isVi ? 'Văn bản / Tài liệu' : 'Text / Document'}
            </button>
            <button
              type="button"
              onClick={() => setConfig({ ...config, isUrl: true })}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${config.isUrl ? 'bg-indigo-50 text-indigo-700' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {isVi ? 'Đường dẫn (URL)' : 'Website URL'}
            </button>
          </div>
          {config.isUrl ? (
            <input
              type="url"
              placeholder="https://example.com/article"
              value={config.dataSource}
              onChange={(e) => setConfig({ ...config, dataSource: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              required
            />
          ) : (
            <textarea
              placeholder={isVi ? 'Dán nội dung trích xuất từ file Word/PDF hoặc văn bản của bạn vào đây...' : 'Paste text extracted from Word/PDF or your document content here...'}
              value={config.dataSource}
              onChange={(e) => setConfig({ ...config, dataSource: e.target.value })}
              className="w-full h-40 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition"
              required
            />
          )}
        </div>

        {/* Quiz Specific Modes */}
        {activeTab === 'quiz' && (
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              {isVi ? 'Chế độ trắc nghiệm' : 'Quiz Mode'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfig({ ...config, mode: Mode.PRACTICE })}
                className={`p-3 rounded-xl border-2 text-sm font-bold transition flex flex-col items-center gap-1 ${config.mode === Mode.PRACTICE ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-500'}`}
              >
                <span>{isVi ? 'PRACTICE MODE' : 'PRACTICE MODE'}</span>
                <span className="text-[10px] font-normal opacity-70">{isVi ? 'Có giải thích sau mỗi câu' : 'Feedback after each Q'}</span>
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, mode: Mode.EXAM })}
                className={`p-3 rounded-xl border-2 text-sm font-bold transition flex flex-col items-center gap-1 ${config.mode === Mode.EXAM ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-500'}`}
              >
                <span>{isVi ? 'EXAM MODE' : 'EXAM MODE'}</span>
                <span className="text-[10px] font-normal opacity-70">{isVi ? 'Chỉ xem kết quả cuối cùng' : 'Feedback at the end'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Common Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              {isVi ? 'Độ khó' : 'Difficulty'}
            </label>
            <select
              value={config.difficulty}
              onChange={(e) => setConfig({ ...config, difficulty: e.target.value as Difficulty })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-gray-700"
            >
              <option value={Difficulty.EASY}>{isVi ? 'Dễ (Easy)' : 'Easy'}</option>
              <option value={Difficulty.MEDIUM}>{isVi ? 'Trung bình (Medium)' : 'Medium'}</option>
              <option value={Difficulty.HARD}>{isVi ? 'Khó (Hard)' : 'Hard'}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              {activeTab === 'quiz' ? (isVi ? 'Số câu hỏi' : 'No. of Questions') : (isVi ? 'Số thẻ flashcard' : 'No. of Flashcards')}
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={config.numberOfQuestions}
              onChange={(e) => setConfig({ ...config, numberOfQuestions: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-gray-700"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl transition shadow-xl hover:shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-3 transform active:scale-95"
        >
          {isLoading ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{isVi ? 'ĐANG KHỞI TẠO...' : 'INITIALIZING...'}</span>
            </>
          ) : (
            <span>{isVi ? 'BẮT ĐẦU HỌC NGAY' : 'START LEARNING'}</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default QuizSetup;
