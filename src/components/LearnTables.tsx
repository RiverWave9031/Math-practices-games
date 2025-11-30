
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LearnTablesProps {
  onBack: () => void;
}

const LearnTables = ({ onBack }: LearnTablesProps) => {
  const [selectedTable, setSelectedTable] = useState(2);

  const tables = Array.from({ length: 29 }, (_, i) => i + 2); // 2 to 30

  const generateTable = (tableNumber: number) => {
    return Array.from({ length: 10 }, (_, i) => ({
      multiplier: i + 1,
      result: tableNumber * (i + 1)
    }));
  };

  const currentTable = generateTable(selectedTable);

  const handlePrevious = () => {
    if (selectedTable > 2) {
      setSelectedTable(selectedTable - 1);
    }
  };

  const handleNext = () => {
    if (selectedTable < 30) {
      setSelectedTable(selectedTable + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Learn Multiplication Tables
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Study tables from 2 to 30</p>
      </div>

      {/* Table Selector */}
      <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-3xl p-6 border border-white/30">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevious}
            disabled={selectedTable <= 2}
            className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Table of {selectedTable}
            </h2>
          </div>
          
          <button
            onClick={handleNext}
            disabled={selectedTable >= 30}
            className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Table Selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {tables.map(table => (
            <button
              key={table}
              onClick={() => setSelectedTable(table)}
              className={`w-8 h-8 rounded-lg font-semibold transition-colors ${
                selectedTable === table
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {table}
            </button>
          ))}
        </div>

        {/* Table Display */}
        <div className="space-y-3">
          {currentTable.map(({ multiplier, result }) => (
            <div
              key={multiplier}
              className="bg-white/30 dark:bg-gray-800/30 rounded-xl p-4 flex justify-between items-center"
            >
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                {selectedTable} × {multiplier}
              </span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                = {result}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
      >
        Back to Home
      </button>
    </div>
  );
};

export default LearnTables;
