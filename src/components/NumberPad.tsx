
import React from 'react';
import { Delete } from 'lucide-react';

interface NumberPadProps {
  onNumberClick: (number: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

const NumberPad = ({ onNumberClick, onBackspace, onClear }: NumberPadProps) => {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  return (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mt-4">
      {/* Numbers 1-9 */}
      {numbers.slice(0, 9).map((num) => (
        <button
          key={num}
          onClick={() => onNumberClick(num)}
          className="h-12 bg-white/30 hover:bg-white/40 text-gray-800 dark:text-white font-bold text-lg rounded-xl transition-all duration-200 hover:scale-105"
        >
          {num}
        </button>
      ))}
      
      {/* Bottom row: Decimal, 0, Backspace */}
      <button
        onClick={() => onNumberClick('.')}
        className="h-12 bg-white/30 hover:bg-white/40 text-gray-800 dark:text-white font-bold text-lg rounded-xl transition-all duration-200 hover:scale-105"
      >
        .
      </button>
      
      <button
        onClick={() => onNumberClick('0')}
        className="h-12 bg-white/30 hover:bg-white/40 text-gray-800 dark:text-white font-bold text-lg rounded-xl transition-all duration-200 hover:scale-105"
      >
        0
      </button>
      
      <button
        onClick={onBackspace}
        className="h-12 bg-gray-500/30 hover:bg-gray-500/40 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center"
      >
        <Delete className="w-5 h-5" />
      </button>
    </div>
  );
};

export default NumberPad;
