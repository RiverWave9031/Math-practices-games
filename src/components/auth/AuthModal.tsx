
import React, { useState } from 'react';
import { X, Mail, Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string) => void;
  onGoogleAuth: () => void;
}

// Validation schema
const authSchema = z.object({
  email: z.string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
});

const AuthModal = ({ isOpen, onClose, onLogin, onSignup, onGoogleAuth }: AuthModalProps) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate input
    const validation = authSchema.safeParse({ email, password });
    
    if (!validation.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0] === 'email' || err.path[0] === 'password') {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    
    if (isLoginMode) {
      const { error } = await supabase.auth.signInWithPassword({
        email: validation.data.email,
        password: validation.data.password,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        onLogin(validation.data.email, validation.data.password);
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email: validation.data.email,
        password: validation.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Check your email to confirm your account!');
        onSignup(validation.data.email, validation.data.password);
      }
    }
  };

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      onGoogleAuth();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {isLoginMode ? 'Login' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: undefined });
              }}
              className={`w-full ${errors.email ? 'border-red-500' : ''}`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: undefined });
              }}
              className={`w-full pr-10 ${errors.password ? 'border-red-500' : ''}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            {isLoginMode ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/20 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400">Or</span>
            </div>
          </div>

          <button
            onClick={handleGoogleAuth}
            className="w-full mt-4 bg-white text-gray-700 font-semibold py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>🔍</span>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
