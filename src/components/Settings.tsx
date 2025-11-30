
import React from 'react';
import { X, Sun, Moon } from 'lucide-react';
import { Slider } from './ui/slider';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  timerEnabled: boolean;
  onTimerToggle: (enabled: boolean) => void;
  questionCount: number;
  onQuestionCountChange: (count: number) => void;
  timeLimit: number;
  onTimeLimitChange: (time: number) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Settings = ({ 
  isOpen, 
  onClose, 
  timerEnabled, 
  onTimerToggle, 
  questionCount, 
  onQuestionCountChange,
  timeLimit,
  onTimeLimitChange,
  isLoggedIn,
  onLogout
}: SettingsProps) => {
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Theme</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Switch between light and dark mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                theme === 'dark' ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform flex items-center justify-center ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              >
                {theme === 'dark' ? (
                  <Moon className="w-3 h-3 text-blue-500" />
                ) : (
                  <Sun className="w-3 h-3 text-yellow-500" />
                )}
              </div>
            </button>
          </div>

          {/* Timer Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Timer</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enable/disable question timer</p>
            </div>
            <button
              onClick={() => onTimerToggle(!timerEnabled)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                timerEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  timerEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Time Limit Slider */}
          {timerEnabled && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Time Limit: {timeLimit}s
              </h3>
              <Slider
                value={[timeLimit]}
                onValueChange={(value) => onTimeLimitChange(value[0])}
                min={10}
                max={60}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span>10s</span>
                <span>60s</span>
              </div>
            </div>
          )}

          {/* Question Count Slider */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Questions: {questionCount}
            </h3>
            <Slider
              value={[questionCount]}
              onValueChange={(value) => onQuestionCountChange(value[0])}
              min={5}
              max={20}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span>5</span>
              <span>20</span>
            </div>
          </div>
        </div>

        {isLoggedIn && onLogout && (
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full mt-6 bg-red-500 text-white font-bold py-3 rounded-2xl hover:bg-red-600 transition-all duration-300"
          >
            Logout
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
