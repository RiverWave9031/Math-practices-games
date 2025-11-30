
import React from 'react';
import { Trophy, Flame, User } from 'lucide-react';

interface HeaderProps {
  userName?: string;
  streak?: number;
  xp?: number;
  onXPClick?: () => void;
}

const Header = ({ userName = "Guest", streak = 0, xp = 0, onXPClick }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between p-3 md:p-4 bg-white/10 dark:bg-gray-900/20 backdrop-blur-md rounded-2xl md:rounded-3xl mb-6 border border-white/20">
      {/* Mobile: Compact layout */}
      <div className="flex items-center space-x-2 md:space-x-3 md:hidden">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-sm text-gray-800 dark:text-white truncate">{userName}</h2>
          <p className="text-xs text-gray-600 dark:text-gray-300 truncate">Welcome back!</p>
        </div>
      </div>

      {/* Desktop: Full layout */}
      <div className="hidden md:flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-gray-800 dark:text-white">{userName}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Welcome back!</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="flex items-center space-x-1 bg-orange-100 dark:bg-orange-900/30 px-2 md:px-3 py-1 rounded-full">
          <Flame className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
          <span className="text-xs md:text-sm font-semibold text-orange-600 dark:text-orange-400">{streak}</span>
        </div>
        
        <button
          onClick={() => onXPClick?.()}
          className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 md:px-3 py-1 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors cursor-pointer"
        >
          <Trophy className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
          <span className="text-xs md:text-sm font-semibold text-yellow-600 dark:text-yellow-400">{xp}XP</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
