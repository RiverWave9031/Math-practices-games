import React, { useState, useEffect } from 'react';
import { Plus, Minus, Percent, Moon, Sun, User as UserIcon, Menu, BookOpen } from 'lucide-react';
import Background from '../components/Background';
import Header from '../components/Header';
import OperationCard from '../components/OperationCard';
import ModeSelector from '../components/ModeSelector';
import DifficultySelector from '../components/DifficultySelector';
import QuestionCard from '../components/QuestionCard';
import ResultCard from '../components/ResultCard';
import Settings from '../components/Settings';
import AuthModal from '../components/auth/AuthModal';
import ProfileMenu from '../components/ProfileMenu';
import PracticeControls from '../components/PracticeControls';
import LearnTables from '../components/LearnTables';
import PlayHistoryModal from '../components/PlayHistoryModal';
import { useQuestions } from '../hooks/useQuestions';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

type Screen = 'home' | 'practice' | 'question' | 'result' | 'learn-tables';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<'test' | 'task'>('task');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'simple' | 'medium' | 'hard'>('simple');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);

  // User state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Guest');
  const [userEmail, setUserEmail] = useState('');
  const [userXP, setUserXP] = useState<number>(0);
  const [userStreak, setUserStreak] = useState<number>(0);

  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [customQuestionCount, setCustomQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(30);
  const [tableRange, setTableRange] = useState({ min: 2, max: 10 });
  const [playHistory, setPlayHistory] = useState<any[]>([]);
  const [matchOperations, setMatchOperations] = useState<string[]>(['addition', 'subtraction', 'multiplication', 'division']);

  const { generateQuestion } = useQuestions();
  const { theme, toggleTheme } = useTheme();

  // Initialize Supabase auth
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setIsLoggedIn(true);
          setUserEmail(session.user.email || '');
          setUserName(session.user.email?.split('@')[0] || 'User');
        } else {
          setIsLoggedIn(false);
          setUserEmail('');
          setUserName('Guest');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setIsLoggedIn(true);
        setUserEmail(session.user.email || '');
        setUserName(session.user.email?.split('@')[0] || 'User');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user data from Supabase or localStorage
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        // Load from Supabase for logged-in users
        const { data, error } = await supabase
          .from('profiles')
          .select('xp, streak, play_history')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          setUserXP(data.xp || 0);
          setUserStreak(data.streak || 0);
          setPlayHistory(Array.isArray(data.play_history) ? data.play_history : []);
        }
      } else {
        // Load from localStorage for guests
        const savedXP = localStorage.getItem('userXP');
        const savedStreak = localStorage.getItem('userStreak');
        const savedHistory = localStorage.getItem('playHistory');
        
        if (savedXP) setUserXP(parseInt(savedXP));
        if (savedStreak) setUserStreak(parseInt(savedStreak));
        if (savedHistory) setPlayHistory(JSON.parse(savedHistory));
      }
    };
    
    loadUserData();
  }, [user]);

  // Save user data to Supabase or localStorage whenever it changes
  useEffect(() => {
    const saveUserData = async () => {
      if (user) {
        // Save to Supabase for logged-in users
        await supabase
          .from('profiles')
          .update({
            xp: userXP,
            streak: userStreak,
            play_history: playHistory
          })
          .eq('id', user.id);
      } else {
        // Save to localStorage for guests
        localStorage.setItem('userXP', userXP.toString());
        localStorage.setItem('userStreak', userStreak.toString());
        localStorage.setItem('playHistory', JSON.stringify(playHistory));
      }
    };
    
    saveUserData();
  }, [userXP, userStreak, playHistory, user]);

  // Regenerate remaining questions when table range changes during practice
  useEffect(() => {
    if (currentScreen === 'question' && questions.length > 0 && currentQuestionIndex < questions.length) {
      // Keep answered questions, regenerate remaining ones
      const answeredQuestions = questions.slice(0, currentQuestionIndex);
      const remainingCount = questions.length - currentQuestionIndex;
      const newRemainingQuestions = Array.from({ length: remainingCount }, () => 
        generateQuestion(selectedOperation, selectedDifficulty, tableRange, matchOperations)
      );
      setQuestions([...answeredQuestions, ...newRemainingQuestions]);
    }
  }, [tableRange]);

  const operations = [{
    id: 'addition',
    title: 'Addition',
    icon: Plus,
    color: 'blue',
    progress: 85
  }, {
    id: 'subtraction',
    title: 'Subtraction',
    icon: Minus,
    color: 'purple',
    progress: 72
  }, {
    id: 'multiplication',
    title: 'Multiplication',
    icon: Plus,
    color: 'green',
    progress: 90
  }, {
    id: 'division',
    title: 'Division',
    icon: Minus,
    color: 'orange',
    progress: 68
  }, {
    id: 'percentage',
    title: 'Percentage',
    icon: Percent,
    color: 'pink',
    progress: 45
  }, {
    id: 'square-root',
    title: 'Square Root',
    icon: Plus,
    color: 'indigo',
    progress: 30
  }, {
    id: 'cube-root',
    title: 'Cube Root',
    icon: Minus,
    color: 'teal',
    progress: 25
  }, {
    id: 'tables',
    title: 'Tables (2-30)',
    icon: Plus,
    color: 'blue',
    progress: 40
  }, {
    id: 'learn-tables',
    title: 'Learn Tables',
    icon: BookOpen,
    color: 'green',
    progress: 65
  }, {
    id: 'algebra',
    title: 'Algebra',
    icon: Plus,
    color: 'purple',
    progress: 35
  }, {
    id: 'mixed',
    title: 'Mixed Practice',
    icon: Minus,
    color: 'green',
    progress: 50
  }, {
    id: 'fill-blank',
    title: 'Fill Missing Number',
    icon: Plus,
    color: 'orange',
    progress: 60
  }, {
    id: 'match',
    title: 'Match Following',
    icon: Minus,
    color: 'pink',
    progress: 45
  }];

  const handleOperationSelect = (operationId: string) => {
    setSelectedOperation(operationId);
    if (operationId === 'learn-tables') {
      setCurrentScreen('learn-tables');
    } else {
      setCurrentScreen('practice');
    }
  };

  const handleStartPractice = () => {
    const questionCount = selectedMode === 'test' ? customQuestionCount : Math.min(customQuestionCount, 10);
    
    // Set default table range and match operations based on difficulty
    const defaultRange = selectedDifficulty === 'simple' ? { min: 2, max: 10 } :
                        selectedDifficulty === 'medium' ? { min: 2, max: 20 } :
                        { min: 2, max: 50 };
    setTableRange(defaultRange);
    
    // Set default match operations based on difficulty
    const defaultMatchOps = selectedDifficulty === 'simple' 
      ? ['addition', 'subtraction']
      : selectedDifficulty === 'medium'
      ? ['addition', 'subtraction', 'multiplication']
      : ['addition', 'subtraction', 'multiplication', 'division'];
    setMatchOperations(defaultMatchOps);
    
    const newQuestions = Array.from({ length: questionCount }, () => 
      generateQuestion(selectedOperation, selectedDifficulty, defaultRange, defaultMatchOps)
    );
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setStartTime(Date.now());
    setIsPaused(false);
    setCurrentScreen('question');
  };

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    if (isPaused) return;
    
    console.log('handleAnswer called with:', { answer, isCorrect, currentQuestionIndex, totalQuestions: questions.length });
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      console.log('Moving to next question');
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log('Quiz complete, showing results');
      const correctAnswers = newAnswers.filter(Boolean).length;
      const earnedXP = correctAnswers * 10;
      setUserXP(prevXP => prevXP + earnedXP);

      const percentage = correctAnswers / questions.length * 100;
      if (percentage >= 50) {
        setUserStreak(prevStreak => prevStreak + 1);
      }
      
      // Add to play history
      const operationTitle = operations.find(op => op.id === selectedOperation)?.title || selectedOperation;
      const newHistory = {
        operation: operationTitle,
        score: correctAnswers,
        totalQuestions: questions.length,
        timeTaken: getTimeTaken(),
        date: new Date().toLocaleDateString()
      };
      setPlayHistory(prev => [newHistory, ...prev].slice(0, 20)); // Keep last 20 games
      
      setCurrentScreen('result');
    }
  };

  const handleSkipQuestion = () => {
    if (userXP < 20) {
      toast.error('Not enough coins! You need 20 coins to skip.');
      return;
    }
    
    setUserXP(prev => prev - 20);
    toast.success('Question skipped! -20 coins');
    
    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswers([...answers, false]); // Count as incorrect
    } else {
      // Last question, go to results
      const newAnswers = [...answers, false];
      setAnswers(newAnswers);
      setCurrentScreen('result');
    }
  };

  const handleShowAnswer = () => {
    if (userXP < 20) {
      toast.error('Not enough coins! You need 20 coins to show answer.');
      return;
    }
    
    setUserXP(prev => prev - 20);
    toast.success('Answer revealed! -20 coins');
  };

  const handleRegenerateMatchQuestion = (operations: string[]) => {
    setMatchOperations(operations);
    const currentQuestion = questions[currentQuestionIndex];
    const newQuestion = generateQuestion(selectedOperation, selectedDifficulty, tableRange, operations);
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = newQuestion;
    setQuestions(updatedQuestions);
  };

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);
  const handleStop = () => setCurrentScreen('result');
  const handleBackToPractice = () => setCurrentScreen('practice');

  const handleRestart = () => {
    console.log('Restarting quiz');
    setCurrentScreen('practice');
  };

  const handleHome = () => {
    console.log('Going back to home');
    setCurrentScreen('home');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuestions([]);
    setIsPaused(false);
  };

  const getTimeTaken = () => {
    return Math.floor((Date.now() - startTime) / 1000);
  };

  // Auth handlers
  const handleLogin = (email: string, password: string) => {
    setShowAuthModal(false);
    toast.success('Welcome back!');
  };

  const handleSignup = (email: string, password: string) => {
    setShowAuthModal(false);
  };

  const handleGoogleAuth = () => {
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserName('Guest');
    setUserEmail('');
    // Reset to guest data from localStorage
    const savedXP = localStorage.getItem('userXP');
    const savedStreak = localStorage.getItem('userStreak');
    const savedHistory = localStorage.getItem('playHistory');
    setUserXP(savedXP ? parseInt(savedXP) : 0);
    setUserStreak(savedStreak ? parseInt(savedStreak) : 0);
    setPlayHistory(savedHistory ? JSON.parse(savedHistory) : []);
    toast.success('Logged out successfully');
  };

  const renderHomeScreen = () => (
    <div 
      className="w-full max-w-md mx-auto p-6 min-h-screen overflow-x-hidden"
      onClick={(e) => {
        // Close menu if clicking outside of it
        if (showNavMenu && !(e.target as HTMLElement).closest('.nav-menu-container')) {
          setShowNavMenu(false);
        }
      }}
    >
      <Background />
      
      <Header 
        userName={userName} 
        streak={userStreak} 
        xp={userXP}
        onXPClick={() => setShowHistoryModal(true)}
      />
      
      <div className="flex justify-end space-x-2 mb-6 md:hidden">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>
        
        <button
          onClick={() => setShowNavMenu(!showNavMenu)}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-800 dark:text-white" />
        </button>
        
        <button
          onClick={() => {
            if (isLoggedIn) {
              setShowProfileMenu(!showProfileMenu);
            } else {
              setShowAuthModal(true);
            }
          }}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
          title={isLoggedIn ? userEmail : "Login to save your history and score"}
        >
          <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="hidden md:flex items-center justify-between mb-6">
        <div className="flex-1"></div>
        <div className="flex space-x-2">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
          
          <button
            onClick={() => setShowNavMenu(!showNavMenu)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-800 dark:text-white" />
          </button>
          
          <button
            onClick={() => {
              if (isLoggedIn) {
                setShowProfileMenu(!showProfileMenu);
              } else {
                setShowAuthModal(true);
              }
            }}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
            title={isLoggedIn ? userEmail : "Login to save your history and score"}
          >
            <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      {showNavMenu && (
        <div className="nav-menu-container fixed top-20 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl p-4 border border-white/30 z-[100] shadow-lg">
          <div className="space-y-2">
            <Link
              to="/faq"
              className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-white/20 rounded-lg transition-colors"
              onClick={() => setShowNavMenu(false)}
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-white/20 rounded-lg transition-colors"
              onClick={() => setShowNavMenu(false)}
            >
              Contact Us
            </Link>
            <Link
              to="/features"
              className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-white/20 rounded-lg transition-colors"
              onClick={() => setShowNavMenu(false)}
            >
              Features
            </Link>
          </div>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Skill Digits</h1>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Brain Booster</p>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Choose your math adventure!</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {operations.map(operation => (
          <OperationCard
            key={operation.id}
            title={operation.title}
            icon={operation.icon}
            color={operation.color}
            progress={operation.progress}
            onClick={() => handleOperationSelect(operation.id)}
          />
        ))}
      </div>

      {/* FAQ, Contact Us, Features Links */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <Link
          to="/faq"
          className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-colors text-center"
        >
          <div className="text-2xl mb-2">❓</div>
          <div className="text-gray-800 dark:text-white font-medium">FAQ</div>
        </Link>
        <Link
          to="/contact"
          className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-colors text-center"
        >
          <div className="text-2xl mb-2">📞</div>
          <div className="text-gray-800 dark:text-white font-medium">Contact</div>
        </Link>
        <Link
          to="/features"
          className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-colors text-center"
        >
          <div className="text-2xl mb-2">⭐</div>
          <div className="text-gray-800 dark:text-white font-medium">Features</div>
        </Link>
      </div>
    </div>
  );

  const renderPracticeScreen = () => (
    <div className="max-w-md mx-auto p-6 min-h-screen">
      <Background />
      
      <PracticeControls
        isPaused={false}
        onPause={() => {}}
        onResume={() => {}}
        onStop={() => setCurrentScreen('home')}
        onBack={() => setCurrentScreen('home')}
        onSettings={() => setShowSettings(true)}
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {operations.find(op => op.id === selectedOperation)?.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Set up your practice session</p>
      </div>

      <div className="space-y-6">
        <ModeSelector selectedMode={selectedMode} onModeChange={setSelectedMode} />
        <DifficultySelector selectedDifficulty={selectedDifficulty} onDifficultyChange={setSelectedDifficulty} />

        <button
          onClick={handleStartPractice}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-3xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 neumorphic"
        >
          Start Practice
        </button>
      </div>
    </div>
  );

  const renderQuestionScreen = () => (
    <div className="max-w-md mx-auto p-6 min-h-screen">
      <Background />
      
      <PracticeControls
        isPaused={isPaused}
        onPause={handlePause}
        onResume={handleResume}
        onStop={handleStop}
        onBack={handleBackToPractice}
        onSettings={() => setShowSettings(true)}
        showTableRange={selectedOperation === 'multiplication' || selectedOperation === 'tables' || selectedOperation === 'division'}
        tableRange={tableRange}
        onTableRangeChange={setTableRange}
        difficulty={selectedDifficulty}
      />

      <div className="mb-6 flex items-center justify-between">
        <div className="text-gray-600 dark:text-gray-300">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="flex space-x-1">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index < currentQuestionIndex ? 'bg-green-500' : 
                index === currentQuestionIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {questions[currentQuestionIndex] && (
        <QuestionCard
          question={questions[currentQuestionIndex].question}
          options={questions[currentQuestionIndex].options}
          correctAnswer={questions[currentQuestionIndex].correctAnswer}
          onAnswer={handleAnswer}
          timeLimit={timerEnabled ? timeLimit : undefined}
          questionIndex={currentQuestionIndex}
          isPaused={isPaused}
          difficulty={selectedDifficulty}
          type={questions[currentQuestionIndex].type}
          pairs={questions[currentQuestionIndex].pairs}
          userXP={userXP}
          onSkip={handleSkipQuestion}
          onShowAnswer={handleShowAnswer}
          onRegenerateMatchQuestion={handleRegenerateMatchQuestion}
        />
      )}
    </div>
  );

  const renderResultScreen = () => (
    <div className="max-w-md mx-auto p-6 min-h-screen">
      <Background />
      
      <ResultCard
        score={answers.filter(Boolean).length}
        totalQuestions={questions.length}
        timeTaken={getTimeTaken()}
        onRestart={handleRestart}
        onHome={handleHome}
      />
    </div>
  );

  const renderLearnTablesScreen = () => (
    <div className="max-w-md mx-auto p-6 min-h-screen">
      <Background />
      
      <PracticeControls
        isPaused={false}
        onPause={() => {}}
        onResume={() => {}}
        onStop={() => setCurrentScreen('home')}
        onBack={() => setCurrentScreen('home')}
        onSettings={() => setShowSettings(true)}
      />

      <LearnTables onBack={() => setCurrentScreen('home')} />
    </div>
  );

  return (
    <>
      {(() => {
        switch (currentScreen) {
          case 'home':
            return renderHomeScreen();
          case 'practice':
            return renderPracticeScreen();
          case 'question':
            return renderQuestionScreen();
          case 'result':
            return renderResultScreen();
          case 'learn-tables':
            return renderLearnTablesScreen();
          default:
            return renderHomeScreen();
        }
      })()}
      
      <Settings 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        timerEnabled={timerEnabled}
        onTimerToggle={setTimerEnabled}
        questionCount={customQuestionCount}
        onQuestionCountChange={setCustomQuestionCount}
        timeLimit={timeLimit}
        onTimeLimitChange={setTimeLimit}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onGoogleAuth={handleGoogleAuth}
      />

      <PlayHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={playHistory}
        totalXP={userXP}
      />

      <ProfileMenu
        isOpen={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
        userEmail={userEmail}
        onOpenSettings={() => setShowSettings(true)}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Index;
