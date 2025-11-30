
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface OperationCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  progress?: number;
}

const OperationCard = ({ title, icon: Icon, color, onClick, progress = 0 }: OperationCardProps) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700';
      case 'purple':
        return 'from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700';
      case 'green':
        return 'from-green-400 to-green-600 hover:from-green-500 hover:to-green-700';
      case 'orange':
        return 'from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700';
      case 'pink':
        return 'from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700';
      case 'indigo':
        return 'from-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700';
      case 'teal':
        return 'from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700';
      default:
        return 'from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700';
    }
  };

  return (
    <div 
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className={`bg-gradient-to-br ${getColorClasses(color)} p-6 rounded-3xl neumorphic transition-all duration-300 transform hover:scale-105 hover:shadow-2xl`}>
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg text-center">{title}</h3>
          
          {progress > 0 && (
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
        
        <div className="absolute inset-0 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export default OperationCard;
