
import React from 'react';
import { Trophy, Clock, Target, Star } from 'lucide-react';

interface ResultCardProps {
  score: number;
  totalQuestions: number;
  timeTaken: number;
  onRestart: () => void;
  onHome: () => void;
}

const ResultCard = ({ score, totalQuestions, timeTaken, onRestart, onHome }: ResultCardProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getRating = () => {
    if (percentage >= 90) return { text: 'Excellent!', emoji: '🏆', color: 'from-yellow-400 to-orange-500' };
    if (percentage >= 70) return { text: 'Better!', emoji: '⭐', color: 'from-blue-400 to-purple-500' };
    if (percentage >= 50) return { text: 'Good!', emoji: '👍', color: 'from-green-400 to-blue-500' };
    return { text: 'Keep Trying!', emoji: '💪', color: 'from-gray-400 to-gray-600' };
  };

  const rating = getRating();

  return (
    <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 animate-bounce-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`w-24 h-24 bg-gradient-to-br ${rating.color} rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow`}>
          <span className="text-4xl">{rating.emoji}</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{rating.text}</h2>
        <p className="text-gray-600 dark:text-gray-300">Quiz Complete</p>
      </div>

      {/* Score Display */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-6 mb-6 text-white text-center">
        <div className="text-6xl font-bold mb-2">{percentage}%</div>
        <div className="text-lg opacity-90">{score} out of {totalQuestions} correct</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/30 dark:bg-gray-800/30 rounded-2xl p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <div className="text-sm text-gray-600 dark:text-gray-400">Time Taken</div>
          <div className="font-bold text-gray-800 dark:text-white">{Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, '0')}</div>
        </div>
        
        <div className="bg-white/30 dark:bg-gray-800/30 rounded-2xl p-4 text-center">
          <Target className="w-6 h-6 mx-auto mb-2 text-green-500" />
          <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
          <div className="font-bold text-gray-800 dark:text-white">{percentage}%</div>
        </div>
      </div>

      {/* XP Gained */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 mb-6 text-center">
        <Star className="w-6 h-6 mx-auto mb-2 text-white" />
        <div className="text-white font-bold">+{score * 10} XP Earned!</div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          Try Again
        </button>
        
        <button
          onClick={onHome}
          className="w-full bg-white/30 dark:bg-gray-800/30 text-gray-800 dark:text-white font-bold py-4 rounded-2xl hover:bg-white/40 transition-all duration-300 transform hover:scale-105"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
