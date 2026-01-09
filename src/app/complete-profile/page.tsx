'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { User, ArrowRight, Upload, Link2, X, Check } from 'lucide-react';

export default function CompleteProfilePage() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file' | null>(null);
  const [pasteUrl, setPasteUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/');
        return;
      }

      // Pre-fill data from authenticated user
      setEmail(user.email || '');

      // Get name from user_metadata (Google OAuth) or existing profile
      if (user.user_metadata?.full_name) {
        setName(user.user_metadata.full_name);
      } else if (user.user_metadata?.name) {
        setName(user.user_metadata.name);
      }

      // Get avatar from user_metadata (Google OAuth)
      if (user.user_metadata?.picture) {
        setAvatarUrl(user.user_metadata.picture);
      } else if (user.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
      }

      // Check if profile exists and is complete
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, full_name, age, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (existingProfile) {
        // If profile has name and age, it's complete
        if (existingProfile.full_name && existingProfile.age) {
          router.push('/');
          return;
        }

        // Pre-fill from existing profile if available
        if (existingProfile.full_name && !name) {
          setName(existingProfile.full_name);
        }
        if (existingProfile.avatar_url && !avatarUrl) {
          setAvatarUrl(existingProfile.avatar_url);
        }
      }
    };

    checkUser();
  }, [router, supabase]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setAvatarFile(file);
      setError('');

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlPaste = () => {
    if (pasteUrl.trim()) {
      setAvatarUrl(pasteUrl.trim());
      setPasteUrl('');
      setUploadMethod(null);
      setError('');
    }
  };

  const uploadFile = async (file: File, userId: string): Promise<string | null> => {
    try {
      setUploadLoading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${userId}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        setError('Failed to upload image');
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image');
      return null;
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      setIsLoading(false);
      return;
    }

    if (!age || parseInt(age) < 13 || parseInt(age) > 120) {
      setError('Please enter a valid age (13-120)');
      setIsLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('Not authenticated');
        setIsLoading(false);
        return;
      }

      let finalAvatarUrl = avatarUrl;

      // Upload file if selected
      if (avatarFile) {
        const uploadedUrl = await uploadFile(avatarFile, user.id);
        if (uploadedUrl) {
          finalAvatarUrl = uploadedUrl;
        } else {
          setIsLoading(false);
          return;
        }
      }

      // Complete profile creation with required email field
      const profileData = {
        id: user.id,
        full_name: name.trim(),
        age: parseInt(age),
        avatar_url: finalAvatarUrl || null,
        role: 'customer',
        email: user.email // Email is required in your database
      };

      // Try insert first (for new profiles)
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select();

      if (insertError) {
        // If insert fails due to existing record, try update instead
        if (insertError.code === '23505') { // Unique constraint violation
          const { data: updateData, error: updateError } = await supabase
            .from('profiles')
            .update({
              full_name: name.trim(),
              age: parseInt(age),
              avatar_url: finalAvatarUrl || null,
              email: user.email
            })
            .eq('id', user.id)
            .select();

          if (updateError) {
            console.error('Profile update error:', updateError);
            setError(`Failed to update profile: ${updateError.message || 'Unknown error'}`);
            setIsLoading(false);
            return;
          }
          console.log('Profile updated successfully:', updateData);

          // Clear session storage and force refresh after update too
          sessionStorage.removeItem(`profile_checked_${user.id}`);
          window.location.href = '/';
          return;
        } else {
          console.error('Profile insert error:', insertError);
          setError(`Failed to create profile: ${insertError.message || 'Unknown error'}`);
          setIsLoading(false);
          return;
        }
      } else {
        console.log('Profile created successfully:', insertData);
      }

      // Clear session storage flags and force auth refresh
      sessionStorage.removeItem(`profile_checked_${user.id}`);

      // Force reload to clear any cached state
      window.location.href = '/';
      return;
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D8CBB8] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#8B6F47]/40 p-8"
      >
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8B6F47] to-[#6d5638] flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#262626] mb-2">Complete Your Profile</h1>
          <p className="text-[#666] text-sm">Name and age required - avatar is optional!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl text-sm font-medium bg-red-100 text-red-800 border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-[#262626]">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-[#8B6F47]/30 rounded-xl text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/50 transition-all"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[#262626]">Email Address</label>
            <input
              type="email"
              value={email}
              className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-[#666] cursor-not-allowed"
              placeholder="Loading email..."
              disabled
              readOnly
            />
            <p className="text-xs text-[#666]">Email cannot be changed here</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[#262626]">Age *</label>
            <input
              type="number"
              min="13"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-[#8B6F47]/30 rounded-xl text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/50 transition-all"
              placeholder="Enter your age"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#262626]">Profile Picture (Optional)</label>

            {avatarUrl && (
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#8B6F47]/30"
                    onError={() => {
                      setAvatarUrl('');
                      setError('Invalid image URL');
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarUrl('');
                      setAvatarFile(null);
                      setPasteUrl('');
                      setUploadMethod(null);
                    }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {!avatarUrl && !uploadMethod && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#8B6F47]/30 rounded-xl hover:border-[#8B6F47]/50 transition-all group"
                >
                  <Upload className="w-6 h-6 text-[#8B6F47] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-[#666]">Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('url')}
                  className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#8B6F47]/30 rounded-xl hover:border-[#8B6F47]/50 transition-all group"
                >
                  <Link2 className="w-6 h-6 text-[#8B6F47] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-[#666]">Paste URL</span>
                </button>
              </div>
            )}

            {uploadMethod === 'url' && (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={pasteUrl}
                  onChange={(e) => setPasteUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border-2 border-[#8B6F47]/30 rounded-xl text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/50 transition-all text-sm"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={handleUrlPaste}
                  disabled={!pasteUrl.trim()}
                  className="px-4 py-2 bg-[#8B6F47] text-white rounded-xl hover:bg-[#6d5638] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {uploadLoading && (
            <div className="text-center text-sm text-[#8B6F47] flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-[#8B6F47] border-t-transparent rounded-full animate-spin"></div>
              Uploading image...
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || uploadLoading}
            className="w-full py-4 bg-gradient-to-r from-[#8B6F47] to-[#6d5638] hover:from-[#6d5638] hover:to-[#8B6F47] text-white font-bold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Complete Profile
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          <p className="text-center text-xs text-[#666] mt-4">
            Avatar upload is optional - you can always add one later!
          </p>
        </form>
      </motion.div>
    </div>
  );
}