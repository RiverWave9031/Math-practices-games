import React from 'react';
import { X, Trophy, Target, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface PlayHistory {
  operation: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  date: string;
}

interface PlayHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: PlayHistory[];
  totalXP: number;
}

const PlayHistoryModal = ({ isOpen, onClose, history, totalXP }: PlayHistoryModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-white/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Play History & Stats
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Total XP Card */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white">
            <div className="text-sm font-medium opacity-90">Total Points</div>
            <div className="text-3xl font-bold">{totalXP} XP</div>
            <div className="text-xs mt-1 opacity-75">
              💡 Points can be used to skip questions or show answers (20 points each)
            </div>
          </div>

          {/* History List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Recent Games</h3>
            
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No games played yet. Start practicing to see your history!
              </div>
            ) : (
              history.map((game, index) => (
                <div
                  key={index}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-white/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-800 dark:text-white">
                      {game.operation}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {game.date}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {game.score}/{game.totalQuestions}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {game.score * 10} XP
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {Math.floor(game.timeTaken / 60)}:{(game.timeTaken % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                        style={{ width: `${(game.score / game.totalQuestions) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayHistoryModal;