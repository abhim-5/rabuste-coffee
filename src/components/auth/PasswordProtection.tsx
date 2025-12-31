'use client';

import { useState, useEffect } from 'react';

const CORRECT_PASSWORD = 'SaaS@554';
const AUTH_KEY = 'rabuste_authenticated';

export default function PasswordProtection({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem(AUTH_KEY);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  // Show loading state briefly to check localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-50">
        <div className="animate-pulse text-amber-900">Loading...</div>
      </div>
    );
  }

  // If authenticated, show the children (the actual website)
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show password protection screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-50 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-2 font-serif">
            Rabuste Coffee
          </h1>
          <p className="text-amber-700">Enter password to continue</p>
        </div>

        {/* Password Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-amber-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter password"
                autoFocus
                style={{ 
                  WebkitTextSecurity: 'disc',
                  fontFamily: 'text-security-disc',
                  color: '#000000',
                  WebkitTextFillColor: '#000000',
                  opacity: 1
                }}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 animate-shake">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-900 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Unlock Access
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center mt-6 text-sm text-amber-700">
          Your device will remember this password
        </p>
      </div>
    </div>
  );
}
