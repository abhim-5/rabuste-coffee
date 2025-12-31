'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, Upload } from 'lucide-react';
import Image from 'next/image';
import ReCAPTCHA from 'react-google-recaptcha';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string, name?: string, profileImage?: string) => void;
  buttonRect?: DOMRect;
}

const ALLOWED_EMAIL_DOMAINS = ['gmail.com', 'hotmail.com', 'yahoo.com'];

export default function AuthModal({ isOpen, onClose, onLogin, buttonRect }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Generate initials avatar from FIRST NAME ONLY
  const generateInitialsAvatar = (name: string) => {
    const firstName = name.trim().split(' ')[0]; // Get only first name
    const initials = firstName
      .slice(0, 2) // Take first 2 letters
      .toUpperCase();
    return initials;
  };

  // Handle name change and generate avatar
  useEffect(() => {
    if (!isLogin && formData.name && !profileImage) {
      // Auto-generate initials if no image uploaded
    }
  }, [formData.name, isLogin, profileImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateName = (name: string) => {
    if (/\d/.test(name)) {
      return 'Name cannot contain numbers';
    }
    return '';
  };

  const validateEmail = (email: string) => {
    if (!email.includes('@')) {
      return 'Email must contain @';
    }
    if (email.indexOf('@') === 0) {
      return 'Email cannot start with @';
    }
    const domain = email.split('@')[1];
    if (!domain) {
      return 'Email must have a domain after @';
    }
    if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
      return `Email must be from ${ALLOWED_EMAIL_DOMAINS.join(', ')}`;
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check captcha for signup
    if (!isLogin && !captchaToken) {
      alert('Please complete the captcha verification');
      return;
    }

    // Validate all fields
    const newErrors = {
      name: !isLogin ? validateName(formData.name) : '',
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: !isLogin && formData.password !== formData.confirmPassword 
        ? 'Passwords do not match' 
        : ''
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    // Login/Sign up - pass name and image for signup
    if (isLogin) {
      onLogin(formData.email, formData.password);
    } else {
      onLogin(formData.email, formData.password, formData.name, profileImage);
    }
    onClose();
    
    // Reset captcha
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    setCaptchaToken(null);
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={buttonRect ? {
              scale: 0,
              x: buttonRect.left + buttonRect.width / 2 - window.innerWidth / 2,
              y: buttonRect.top + buttonRect.height / 2 - window.innerHeight / 2,
              borderRadius: '50px'
            } : { scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, x: 0, y: 0, borderRadius: '24px' }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300,
              borderRadius: { duration: 0.4 }
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl shadow-2xl border border-[#8B6F47]/40 overflow-hidden"
            style={{ backgroundColor: "#D8CBB8" }}
          >
            {/* Decorative coffee stains */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#8B6F47]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#6d5638]/5 rounded-full blur-2xl" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#8B6F47]/20 hover:bg-[#8B6F47]/40 transition-colors backdrop-blur-sm border border-[#8B6F47]/30"
            >
              <X className="w-5 h-5 text-[#262626]" />
            </button>

            {/* Header */}
            <div className="relative px-8 pt-6 pb-4">
              <div className="flex justify-center mb-4">
                {!isLogin ? (
                  // Profile Picture Upload (Sign Up)
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-24 h-24 rounded-full cursor-pointer overflow-hidden border-4 border-[#8B6F47]/40 hover:border-[#8B6F47]/70 transition-all shadow-xl"
                    >
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : formData.name.trim() ? (
                        <div className="w-full h-full bg-gradient-to-br from-[#8B6F47] to-[#6d5638] flex items-center justify-center">
                          <span className="text-white text-3xl font-bold font-display">
                            {generateInitialsAvatar(formData.name)}
                          </span>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#8B6F47]/30 to-[#6d5638]/30 flex items-center justify-center">
                          <UserIcon className="w-12 h-12 text-[#8B6F47]/50" />
                        </div>
                      )}
                    </div>
                    {/* Upload Badge - Always Visible */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-[#8B6F47] to-[#6d5638] rounded-full flex items-center justify-center cursor-pointer shadow-lg border-2 border-[#D8CBB8] hover:scale-110 transition-transform"
                    >
                      <Upload className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ) : (
                  // Login Icon
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8B6F47] to-[#6d5638] flex items-center justify-center shadow-2xl border-4 border-[#8B6F47]/20">
                    <UserIcon className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-display font-bold text-center mb-1" style={{ color: "#262626" }}>
                {isLogin ? 'Welcome Back' : 'Join Rabuste'}
              </h2>
              <p className="text-center text-[#2C2C2C] font-serif text-sm">
                {isLogin ? 'Sign in to your account' : 'Create your coffee journey'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 pb-6 space-y-3">
              {/* Name field (Sign Up only) */}
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-sm font-medium font-serif" style={{ color: "#262626" }}>Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]/60" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, name: value });
                        // Real-time validation
                        setErrors({ ...errors, name: validateName(value) });
                      }}
                      className="w-full pl-11 pr-4 py-2.5 bg-white/70 border border-[#8B6F47]/30 rounded-xl text-[#262626] placeholder:text-[#8B6F47]/40 focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/50 focus:border-[#8B6F47]/50 transition-all"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-0.5 font-sans font-semibold">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-medium font-serif" style={{ color: "#262626" }}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]/60" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, email: value });
                      // Real-time validation
                      setErrors({ ...errors, email: validateEmail(value) });
                    }}
                    className="w-full pl-11 pr-4 py-2.5 bg-white/70 border border-[#8B6F47]/30 rounded-xl text-[#262626] placeholder:text-[#8B6F47]/40 focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/50 focus:border-[#8B6F47]/50 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-xs mt-0.5 font-sans font-semibold">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-sm font-medium font-serif" style={{ color: "#262626" }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]/60" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, password: value });
                      // Real-time validation
                      setErrors({ ...errors, password: validatePassword(value) });
                    }}
                    className="w-full pl-11 pr-12 py-2.5 bg-white/70 border border-[#8B6F47]/30 rounded-xl text-[#262626] placeholder:text-[#8B6F47]/40 focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/50 focus:border-[#8B6F47]/50 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B6F47]/60 hover:text-[#8B6F47] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-0.5 font-sans font-semibold">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password (Sign Up only) */}
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-sm font-medium font-serif" style={{ color: "#262626" }}>Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]/60" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, confirmPassword: value });
                        // Real-time validation
                        setErrors({ 
                          ...errors, 
                          confirmPassword: formData.password !== value ? 'Passwords do not match' : ''
                        });
                      }}
                      className="w-full pl-11 pr-4 py-2.5 bg-white/70 border border-[#8B6F47]/30 rounded-xl text-[#262626] placeholder:text-[#8B6F47]/40 focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/50 focus:border-[#8B6F47]/50 transition-all"
                      placeholder="Confirm your password"
                      required={!isLogin}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-xs mt-0.5 font-sans font-semibold">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* reCAPTCHA (Sign Up only) */}
              {!isLogin && (
                <div className="flex justify-center py-2">
                  <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}>
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                      onChange={handleCaptchaChange}
                      theme="light"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!isLogin && !captchaToken}
                className={`w-full py-3 mt-4 bg-gradient-to-r from-[#8B6F47] to-[#6d5638] hover:from-[#6d5638] hover:to-[#8B6F47] text-white font-bold rounded-xl shadow-lg shadow-[#8B6F47]/30 transition-all duration-300 font-display text-lg ${
                  !isLogin && !captchaToken ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </motion.button>

              {/* Toggle Login/Signup */}
              <div className="text-center pt-3 border-t border-[#8B6F47]/20">
                <p className="text-[#2C2C2C] text-sm font-serif">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({ name: '', email: '', password: '', confirmPassword: '' });
                      setCaptchaToken(null);
                      if (recaptchaRef.current) {
                        recaptchaRef.current.reset();
                      }
                    }}
                    className="ml-2 text-[#8B6F47] hover:text-[#6d5638] font-semibold transition-colors font-display"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
