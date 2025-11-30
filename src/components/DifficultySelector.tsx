
import React from 'react';

interface DifficultySelectorProps {
  selectedDifficulty: 'simple' | 'medium' | 'hard';
  onDifficultyChange: (difficulty: 'simple' | 'medium' | 'hard') => void;
}

const DifficultySelector = ({ selectedDifficulty, onDifficultyChange }: DifficultySelectorProps) => {
  const difficulties = [
    { id: 'simple', label: 'Simple', emoji: '😊', color: 'from-green-400 to-green-600' },
    { id: 'medium', label: 'Medium', emoji: '🤔', color: 'from-yellow-400 to-orange-600' },
    { id: 'hard', label: 'Hard', emoji: '🔥', color: 'from-red-400 to-red-600' },
  ] as const;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white text-center">Select Difficulty</h3>
      <div className="flex space-x-3">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.id}
            onClick={() => onDifficultyChange(difficulty.id)}
            className={`flex-1 p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              selectedDifficulty === difficulty.id
                ? `bg-gradient-to-br ${difficulty.color} text-white shadow-lg neumorphic`
                : 'bg-white/30 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 hover:bg-white/40'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl">{difficulty.emoji}</span>
              <span className="font-semibold text-sm">{difficulty.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
