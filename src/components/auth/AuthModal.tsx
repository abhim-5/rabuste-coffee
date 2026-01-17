'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail, validatePassword, validateName, validateAge, getPasswordStrengthColor, getPasswordStrengthWidth } from '@/lib/auth/utils';
import Image from 'next/image';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRect?: DOMRect;
}

type TabType = 'signin' | 'signup';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resendVerificationEmail } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign in form
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign up form
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const resetForm = () => {
    setSignInEmail('');
    setSignInPassword('');
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    const { error } = await signInWithGoogle();

    if (error) {
      setError(error.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
    // If successful, page will redirect to Google OAuth flow
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    const emailValidation = validateEmail(signInEmail);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Invalid email');
      setIsLoading(false);
      return;
    }

    if (!signInPassword) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    const { error } = await signInWithEmail(signInEmail, signInPassword);

    if (error) {
      setError(error.message || 'Invalid credentials');
      setIsLoading(false);
      return;
    }

    // Success - close modal
    handleClose();
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validation
    const nameValidation = validateName(signUpName);
    if (!nameValidation.isValid) {
      setError(nameValidation.error || 'Invalid name');
      setIsLoading(false);
      return;
    }

    const emailValidation = validateEmail(signUpEmail);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Invalid email');
      setIsLoading(false);
      return;
    }

    const passwordValidation = validatePassword(signUpPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error || 'Invalid password');
      setIsLoading(false);
      return;
    }

    const { error } = await signUpWithEmail(
      signUpName,
      signUpEmail,
      signUpPassword
    );

    if (error) {
      setError(error.message || 'Failed to create account');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    // Show verification message
    setSuccess(
      `✅ Account created! Please check your email (${signUpEmail}) for a verification link. Click the link to activate your account and sign in.`
    );

    // Keep modal open so user sees the message
  };

  const passwordStrength = validatePassword(signUpPassword).strength;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-[#8B6F47]/20"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-[#8B6F47]/10 px-6 py-4 rounded-t-3xl z-10">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                <h2 className="text-2xl font-bold text-[#262626] text-center mb-4">
                  Welcome to Rabuste
                </h2>

                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => {
                      setActiveTab('signin');
                      setError('');
                      setSuccess('');
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === 'signin'
                      ? 'bg-white text-[#8B6F47] shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('signup');
                      setError('');
                      setSuccess('');
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === 'signup'
                      ? 'bg-white text-[#8B6F47] shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                {/* Google Sign In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-[#8B6F47] rounded-xl py-3 px-4 font-medium text-gray-700 hover:text-[#8B6F47] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
                    {success}
                  </div>
                )}

                {/* Sign In Form */}
                {activeTab === 'signin' && (
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8B6F47] focus:outline-none transition-colors text-gray-900"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8B6F47] focus:outline-none transition-colors text-gray-900"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#8B6F47] to-[#6d5638] hover:from-[#6d5638] hover:to-[#8B6F47] text-white font-bold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </form>
                )}

                {/* Sign Up Form */}
                {activeTab === 'signup' && (
                  <form onSubmit={handleEmailSignUp} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={signUpName}
                          onChange={(e) => setSignUpName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8B6F47] focus:outline-none transition-colors text-gray-900"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8B6F47] focus:outline-none transition-colors text-gray-900"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8B6F47] focus:outline-none transition-colors text-gray-900"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {signUpPassword && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            <div className={`h-1 flex-1 rounded-full transition-all ${getPasswordStrengthColor(passwordStrength)} ${getPasswordStrengthWidth(passwordStrength)}`}></div>
                            <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'medium' || passwordStrength === 'strong' ? getPasswordStrengthColor(passwordStrength) : 'bg-gray-200'}`}></div>
                            <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'strong' ? getPasswordStrengthColor(passwordStrength) : 'bg-gray-200'}`}></div>
                          </div>
                          <p className="text-xs text-gray-500">
                            {passwordStrength === 'weak' && 'Weak password'}
                            {passwordStrength === 'medium' && 'Medium strength'}
                            {passwordStrength === 'strong' && 'Strong password'}
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-1">
                        At least 8 characters with uppercase, lowercase, and numbers
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#8B6F47] to-[#6d5638] hover:from-[#6d5638] hover:to-[#8B6F47] text-white font-bold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                      ) : (
                        'Create Account'
                      )}
                    </button>

                    <p className="text-xs text-center text-gray-500">
                      By signing up, you agree to our Terms and Privacy Policy
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}