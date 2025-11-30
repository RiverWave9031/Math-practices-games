
import React from 'react';

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900"></div>
      
      {/* Floating math symbols */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 text-blue-200 dark:text-blue-800 text-6xl opacity-30 animate-float">+</div>
        <div className="absolute top-40 right-20 text-purple-200 dark:text-purple-800 text-4xl opacity-25 animate-float" style={{animationDelay: '1s'}}>×</div>
        <div className="absolute bottom-40 left-20 text-green-200 dark:text-green-800 text-5xl opacity-20 animate-float" style={{animationDelay: '2s'}}>÷</div>
        <div className="absolute bottom-20 right-10 text-blue-200 dark:text-blue-800 text-3xl opacity-30 animate-float" style={{animationDelay: '0.5s'}}>-</div>
        <div className="absolute top-1/2 left-1/2 text-purple-200 dark:text-purple-800 text-7xl opacity-15 animate-float" style={{animationDelay: '1.5s'}}>√</div>
        <div className="absolute top-32 left-1/3 text-green-200 dark:text-green-800 text-4xl opacity-25 animate-float" style={{animationDelay: '2.5s'}}>%</div>
      </div>
      
      {/* Geometric shapes */}
      <div className="absolute top-10 right-32 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 animate-float"></div>
      <div className="absolute bottom-32 left-32 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-600 rounded-lg rotate-45 opacity-15 animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/3 right-10 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>
    </div>
  );
};

export default Background;
