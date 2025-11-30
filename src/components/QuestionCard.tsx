import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Input } from './ui/input';
import NumberPad from './NumberPad';
import MatchQuestion from './MatchQuestion';

interface QuestionCardProps {
  question: string;
  options: string[];
  correctAnswer: string;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  timeLimit?: number;
  questionIndex: number;
  isPaused?: boolean;
  type?: 'multiple-choice' | 'fill-blank' | 'match';
  pairs?: { left: string; right: string; }[];
  difficulty?: 'simple' | 'medium' | 'hard';
  userXP?: number;
  onSkip?: () => void;
  onShowAnswer?: () => void;
  onRegenerateMatchQuestion?: (operations: string[]) => void;
}

const QuestionCard = ({ 
  question, 
  options, 
  correctAnswer, 
  onAnswer, 
  timeLimit = 30, 
  questionIndex, 
  isPaused = false,
  type = 'multiple-choice',
  pairs = [],
  difficulty = 'simple',
  userXP = 0,
  onSkip,
  onShowAnswer,
  onRegenerateMatchQuestion
}: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [answered, setAnswered] = useState(false);
  const [answerMode, setAnswerMode] = useState<'options' | 'type'>(difficulty === 'hard' ? 'type' : 'options');
  const [showingAnswer, setShowingAnswer] = useState(false);

  // Reset component state when question changes
  useEffect(() => {
    console.log('Question changed, resetting state for question:', questionIndex);
    setSelectedAnswer(null);
    setTypedAnswer('');
    setAnswered(false);
    setTimeLeft(timeLimit);
    setShowingAnswer(false);
    // Don't reset answerMode - keep user's preference
  }, [questionIndex, timeLimit]);

  useEffect(() => {
    if (timeLimit && timeLeft > 0 && !answered && !isPaused) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLimit && timeLeft === 0 && !answered) {
      handleAnswerSubmit('');
    }
  }, [timeLeft, answered, timeLimit, isPaused]);

  const handleAnswerSubmit = (answer: string) => {
    if (answered) return;
    
    console.log('Answer submitted:', answer);
    setAnswered(true);
    const isCorrect = answer === correctAnswer;
    console.log('Is correct:', isCorrect);
    
    // Show feedback for 1.5 seconds, then proceed
    setTimeout(() => {
      console.log('Calling onAnswer callback');
      onAnswer(answer, isCorrect);
    }, 1500);
  };

  const handleOptionAnswer = (answer: string) => {
    if (answered) return;
    
    console.log('Option answer selected:', answer);
    setSelectedAnswer(answer);
    handleAnswerSubmit(answer);
  };

  const handleTypedSubmit = () => {
    if (answered || !typedAnswer.trim()) return;
    
    console.log('Typed answer submitted:', typedAnswer);
    handleAnswerSubmit(typedAnswer);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTypedSubmit();
    }
  };

  const handleNumberPadClick = (number: string) => {
    if (!answered) {
      setTypedAnswer(prev => prev + number);
    }
  };

  const handleBackspace = () => {
    if (!answered) {
      setTypedAnswer(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (!answered) {
      setTypedAnswer('');
    }
  };

  const getOptionColor = (option: string) => {
    if (!answered) return 'bg-white/30 hover:bg-white/40 text-gray-800 dark:text-white';
    if (option === correctAnswer) return 'bg-green-500 text-white';
    if (option === selectedAnswer && option !== correctAnswer) return 'bg-red-500 text-white';
    return 'bg-gray-300 text-gray-600';
  };

  const getTypingInputColor = () => {
    if (!answered) return 'border-gray-300 dark:border-gray-600';
    if (typedAnswer.trim() === correctAnswer) return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    return 'border-red-500 bg-red-50 dark:bg-red-900/20';
  };

  const handleMatchAnswer = (isCorrect: boolean) => {
    if (answered) return;
    
    console.log('Match answer submitted:', isCorrect);
    setAnswered(true);
    
    setTimeout(() => {
      console.log('Calling onAnswer callback for match');
      onAnswer('', isCorrect);
    }, 1500);
  };

  const handleSkipClick = () => {
    if (userXP < 20 || answered) return;
    if (onSkip) {
      onSkip();
    }
  };

  const handleShowAnswerClick = () => {
    if (userXP < 20 || answered || showingAnswer) return;
    if (onShowAnswer) {
      setShowingAnswer(true);
      onShowAnswer();
      
      // Auto-advance after 4 seconds
      setTimeout(() => {
        handleAnswerSubmit(correctAnswer);
      }, 4000);
    }
  };

  const progressPercentage = timeLimit ? (timeLeft / timeLimit) * 100 : 100;
  const hasEnoughCoins = userXP >= 20;

  return (
    <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 animate-slide-up">
      {/* Timer - only show if timeLimit is provided */}
      {timeLimit && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">{timeLeft}s</span>
          </div>
          <div className="flex-1 mx-4 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                timeLeft > 10 ? 'bg-green-500' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Skip and Show Answer Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleSkipClick}
          disabled={!hasEnoughCoins || answered}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
            hasEnoughCoins && !answered
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>⏭️ Skip</span>
          <span className="text-xs">(20 coins)</span>
        </button>
        
        <button
          onClick={handleShowAnswerClick}
          disabled={!hasEnoughCoins || answered || showingAnswer}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
            hasEnoughCoins && !answered && !showingAnswer
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>👁️ Answer</span>
          <span className="text-xs">(20 coins)</span>
        </button>
      </div>

      {/* Show answer hint when revealed */}
      {showingAnswer && !answered && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-xl text-center">
          <div className="text-green-700 dark:text-green-300 font-semibold">
            Answer: {correctAnswer}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            Auto-advancing in 4 seconds...
          </div>
        </div>
      )}

      {/* Question */}
      <div className="text-center mb-8">
        {type === 'fill-blank' ? (
          <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {question.split('___').map((part, index) => (
              <span key={index}>
                {part}
                {index < question.split('___').length - 1 && (
                  <span className="inline-block min-w-[60px] mx-2 px-3 py-1 bg-white/40 dark:bg-gray-700/60 rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-500">
                    {(answerMode === 'options' ? selectedAnswer : typedAnswer) || '___'}
                  </span>
                )}
              </span>
            ))}
          </div>
        ) : (
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{question}</h2>
        )}
      </div>

      {/* Render based on question type */}
      {type === 'match' ? (
        <MatchQuestion 
          pairs={pairs} 
          onAnswer={handleMatchAnswer}
          onRegenerateQuestions={onRegenerateMatchQuestion}
          difficulty={difficulty}
        />
      ) : type === 'fill-blank' ? (
        <div>
          {/* Answer Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex">
              <button
                onClick={() => setAnswerMode('options')}
                disabled={answered}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  answerMode === 'options'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                } ${answered ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                Options
              </button>
              <button
                onClick={() => setAnswerMode('type')}
                disabled={answered}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  answerMode === 'type'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                } ${answered ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                Type
              </button>
            </div>
          </div>

          {/* Answer Input Based on Mode */}
          {answerMode === 'options' ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">Select Answer</h3>
              <div className="grid grid-cols-2 gap-3">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionAnswer(option)}
                    disabled={answered}
                    className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg ${getOptionColor(option)} ${
                      answered ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">Type Answer</h3>
              <div className="space-y-4">
                <Input
                  type="text"
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={answered}
                  placeholder="Enter the missing number..."
                  className={`text-center text-xl font-bold h-14 ${getTypingInputColor()}`}
                />
                
                <NumberPad
                  onNumberClick={handleNumberPadClick}
                  onBackspace={handleBackspace}
                  onClear={handleClear}
                />
                
                <button
                  onClick={handleTypedSubmit}
                  disabled={answered || !typedAnswer.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Answer Mode Toggle - only for multiple choice */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex">
              <button
                onClick={() => setAnswerMode('options')}
                disabled={answered}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  answerMode === 'options'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                } ${answered ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                Options
              </button>
              <button
                onClick={() => setAnswerMode('type')}
                disabled={answered}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  answerMode === 'type'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                } ${answered ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                Type
              </button>
            </div>
          </div>

          {/* Answer Input Based on Mode */}
          {answerMode === 'options' ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">Select Answer</h3>
              <div className="grid grid-cols-2 gap-3">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionAnswer(option)}
                    disabled={answered}
                    className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg ${getOptionColor(option)} ${
                      answered ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">Type Answer</h3>
              <div className="space-y-4">
                <Input
                  type="text"
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={answered}
                  placeholder="Enter your answer..."
                  className={`text-center text-xl font-bold h-14 ${getTypingInputColor()}`}
                />
                
                <NumberPad
                  onNumberClick={handleNumberPadClick}
                  onBackspace={handleBackspace}
                  onClear={handleClear}
                />
                
                <button
                  onClick={handleTypedSubmit}
                  disabled={answered || !typedAnswer.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionCard;
