
import React from 'react';
import { BookOpen, Clock } from 'lucide-react';

interface ModeSelectorProps {
  selectedMode: 'test' | 'task';
  onModeChange: (mode: 'test' | 'task') => void;
}

const ModeSelector = ({ selectedMode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-3xl p-2 border border-white/30">
      <div className="flex">
        <button
          onClick={() => onModeChange('task')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl transition-all duration-300 ${
            selectedMode === 'task'
              ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:bg-white/10'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-semibold">Task Mode</span>
        </button>
        
        <button
          onClick={() => onModeChange('test')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl transition-all duration-300 ${
            selectedMode === 'test'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:bg-white/10'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="font-semibold">Test Mode</span>
        </button>
      </div>
    </div>
  );
};

export default ModeSelector;
