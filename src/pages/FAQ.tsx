
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Background from '../components/Background';

const FAQ = () => {
  const faqs = [
    {
      question: "Is SkillDigits free?",
      answer: "Yes! Core math challenges (addition/subtraction) are 100% free."
    },
    {
      question: "What age group is this for?",
      answer: "Designed for all ages - anyone can use it to train mental agility."
    },
    {
      question: "Does it require internet?",
      answer: "Only for initial download and updates. Practice offline anytime."
    },
    {
      question: "How do I track progress?",
      answer: "Your stats (speed/accuracy streaks) save automatically after each session."
    },
    {
      question: "Are new math operations coming?",
      answer: "Yes! Multiplication/division modes arrive in the next update."
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">FAQ</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{faq.question}</h3>
            <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
