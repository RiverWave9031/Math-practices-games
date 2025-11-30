
import React, { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Background from '../components/Background';
import { Input } from '../components/ui/input';

const Contact = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle feedback submission
    console.log('Feedback submitted:', feedback);
    setFeedback('');
    alert('Thank you for your feedback!');
  };

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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Contact Us</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">📩 Email Directly</h2>
          <a
            href="mailto:skilldigits@gmail.com"
            className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 font-medium"
          >
            <Mail className="w-5 h-5" />
            <span>skilldigits@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
