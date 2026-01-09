'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Mail, RefreshCw } from 'lucide-react';

export default function AuthCodeErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D8CBB8] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-[#8B6F47]/20"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#262626] mb-2">Authentication Status</h1>
          <p className="text-[#666] mb-4">
            Your authentication was processed. If you were signing in, please check if you're now logged in.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Mail className="w-5 h-5" />
              <span className="font-medium">Authentication Complete</span>
            </div>
            <p className="text-sm text-blue-600">
              Your sign-in process has been completed. You should now be logged in.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B6F47] to-[#6d5638] text-white font-semibold rounded-xl hover:from-[#6d5638] hover:to-[#8B6F47] transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Go to Home Page
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#8B6F47]/30 text-[#8B6F47] font-semibold rounded-xl hover:bg-[#8B6F47]/10 transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}