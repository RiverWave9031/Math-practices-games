
import React, { useState } from 'react';
import { Pause, Play, Square, ArrowLeft, Settings, X } from 'lucide-react';
import { Slider } from './ui/slider';

interface PracticeControlsProps {
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onBack: () => void;
  onSettings: () => void;
  showTableRange?: boolean;
  tableRange?: { min: number; max: number };
  onTableRangeChange?: (range: { min: number; max: number }) => void;
  difficulty?: 'simple' | 'medium' | 'hard';
}

const PracticeControls = ({ 
  isPaused, 
  onPause, 
  onResume, 
  onStop, 
  onBack, 
  onSettings,
  showTableRange = false,
  tableRange = { min: 2, max: 10 },
  onTableRangeChange,
  difficulty = 'simple'
}: PracticeControlsProps) => {
  const [showSlider, setShowSlider] = useState(false);
  
  const maxRange = difficulty === 'simple' ? 10 : difficulty === 'medium' ? 20 : 50;
  
  const handleRangeChange = (value: number[]) => {
    if (onTableRangeChange) {
      onTableRangeChange({ min: 2, max: value[0] });
    }
  };
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="flex space-x-2">
          <button
            onClick={isPaused ? onResume : onPause}
            className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          
          <button
            onClick={onStop}
            className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <Square className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={onSettings}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Table Range Slider - appears in corner for multiplication tests */}
      {showTableRange && (
        <>
          {!showSlider ? (
            <button
              onClick={() => setShowSlider(true)}
              className="fixed top-20 right-6 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all text-sm font-medium"
            >
              Tables Range: 2-{tableRange.max}
            </button>
          ) : (
            <div className="fixed top-20 right-6 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg w-64">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Table Range</h3>
                <button
                  onClick={() => setShowSlider(false)}
                  className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Min: 2</span>
                  <span>Max: {tableRange.max}</span>
                </div>
                
                <Slider
                  value={[tableRange.max]}
                  onValueChange={handleRangeChange}
                  min={2}
                  max={maxRange}
                  step={1}
                  className="w-full"
                />
                
                <div className="text-center text-sm font-medium text-gray-800 dark:text-white bg-white/20 dark:bg-gray-800/20 rounded-lg py-2">
                  Tables: 2 to {tableRange.max}
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {difficulty === 'simple' && 'Simple: up to 10'}
                  {difficulty === 'medium' && 'Medium: up to 20'}
                  {difficulty === 'hard' && 'Hard: up to 50'}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PracticeControls;
