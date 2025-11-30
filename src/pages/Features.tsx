
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Background from '../components/Background';

const Features = () => {
  const features = [
    {
      title: "Adaptive Difficulty",
      description: "Practices get harder as you improve",
      icon: "⚡"
    },
    {
      title: "Progress Heatmaps",
      description: "Visualize your strongest/weakest areas",
      icon: "📊"
    },
    {
      title: "Zen Mode",
      description: "Stress-free practice without timers",
      icon: "🧘"
    },
    {
      title: "Skill Badges",
      description: "Earn awards like 'Subtraction Samurai' or 'Addition Ace'",
      icon: "🏆"
    },
    {
      title: "Daily Streaks",
      description: "Motivational rewards for consistent practice",
      icon: "🔥"
    }
  ];

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen">
      <Background />
      
      <div className="mb-6 flex items-center">
        <Link
          to="/"
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Features</h1>
      </div>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{feature.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">📜 Terms of Service</h2>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <p><strong>Account:</strong> No registration required for basic use.</p>
          <p><strong>Data:</strong> We never sell your data. Anonymous performance metrics help improve the app.</p>
          <p><strong>Conduct:</strong> No abusive behavior in leaderboards (if added).</p>
          <p><strong>Updates:</strong> Features may change without notice.</p>
          <p><strong>Liability:</strong> SkillDigits is not liable for academic outcomes.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;
