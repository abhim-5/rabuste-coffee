"use client";

import { motion } from "framer-motion";
import { Camera, Edit2, Award, ShoppingBag, Coins, Save, X, Upload, Lock } from "lucide-react";
import Image from "next/image";
import { UserProfile } from "@/types/menu";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

interface ProfileHeaderProps {
    user: UserProfile;
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
}

export function ProfileHeader({ user, isEditing, setIsEditing }: ProfileHeaderProps) {
    const { user: authUser } = useAuth();
    const [editedUser, setEditedUser] = useState(user);
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [profileImage, setProfileImage] = useState<string>('');
    const [memberDuration, setMemberDuration] = useState('just now');
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load user data from mock auth
    useEffect(() => {
        if (authUser) {
            const email = authUser?.email || '';
            const name = authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || 'User';
            const image = authUser?.user_metadata?.picture || authUser?.user_metadata?.avatar_url || '';

            setUserEmail(email);
            setUserName(name);
            setProfileImage(image);

            // Calculate member duration from auth user creation
            if (authUser.created_at) {
                const memberSince = new Date(authUser.created_at);
                const now = new Date();
                const diffMs = now.getTime() - memberSince.getTime();
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const diffMonths = Math.floor(diffDays / 30);

                if (diffDays === 0) {
                    setMemberDuration("today");
                } else if (diffDays < 30) {
                    setMemberDuration(`${diffDays} day${diffDays > 1 ? 's' : ''}`);
                } else {
                    setMemberDuration(`${diffMonths} month${diffMonths > 1 ? 's' : ''}`);
                }
            }

            setEditedUser({
                ...user,
                name: name,
                email: email,
            });
        }
    }, [authUser]);

    // Generate initials from first name
    const generateInitials = (name: string) => {
        if (!name || name.trim() === '') return 'U'; // User
        const firstName = name.trim().split(' ')[0];
        return firstName.slice(0, 2).toUpperCase();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result as string;
                setProfileImage(imageData);
                // TODO: Upload to Supabase storage in future update
            };
            reader.readAsDataURL(file);
        }
    };

    // Calculate real member duration from state
    const getMemberDuration = (): string => {
        return memberDuration;
    };

    const handleSave = () => {
        // Validate password if changing
        if (passwordData.oldPassword || passwordData.newPassword || passwordData.confirmPassword) {
            const savedPassword = localStorage.getItem('rabuste_user_password');

            if (passwordData.oldPassword !== savedPassword) {
                setPasswordError('Previous password is incorrect');
                return;
            }

            if (passwordData.newPassword.length < 8) {
                setPasswordError('New password must be at least 8 characters');
                return;
            }

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setPasswordError('Passwords do not match');
                return;
            }

            // Save new password
            localStorage.setItem('rabuste_user_password', passwordData.newPassword);
        }

        // Save to localStorage
        localStorage.setItem('rabuste_user_name', editedUser.name);
        setUserName(editedUser.name);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordError('');
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedUser({
            ...editedUser,
            name: userName,
        });
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordError('');
        setIsEditing(false);
    };

    return (
        <section
            className="relative w-full overflow-hidden pt-8 pb-12 lg:pt-12 lg:pb-16"
            style={{
                background: "linear-gradient(135deg, #8B6F47 0%, #6d5638 50%, #8B6F47 100%)",
            }}
        >
            {/* Decorative Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-64 h-64 bg-amber-200 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto w-full px-4 lg:px-6 max-w-6xl">
                {/* Main Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl"
                >
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative group"
                        >
                            <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                                {profileImage ? (
                                    <Image
                                        src={profileImage}
                                        alt={userName}
                                        fill
                                        className="rounded-full object-cover border-4 border-white/30 shadow-xl"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full border-4 border-white/30 shadow-xl flex items-center justify-center bg-gradient-to-br from-[#8B6F47] to-[#6d5638] text-white text-4xl font-bold">
                                        {generateInitials(userName)}
                                    </div>
                                )}

                                {/* Hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />

                                {/* Upload/Remove buttons - Only show in edit mode */}
                                {isEditing && (
                                    <>
                                        {/* Upload Image Button */}
                                        <motion.button
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.4, type: "spring" }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute -bottom-2 -right-2 bg-white text-[#8B6F47] p-3 rounded-full shadow-lg border-2 border-amber-500/30"
                                            title="Upload Image"
                                        >
                                            <Upload className="w-5 h-5" />
                                        </motion.button>

                                        {/* Remove Image Button - Only show if user has uploaded an image */}
                                        {profileImage && (
                                            <motion.button
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5, type: "spring" }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    setProfileImage('');
                                                    localStorage.removeItem('rabuste_user_image');
                                                }}
                                                className="absolute -bottom-2 -left-2 bg-red-500 text-white p-3 rounded-full shadow-lg border-2 border-red-400/30"
                                                title="Remove Image"
                                            >
                                                <X className="w-5 h-5" />
                                            </motion.button>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* User Info */}
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedUser.name}
                                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                                        className="font-display text-3xl lg:text-4xl font-bold text-white mb-2 bg-white/10 border border-amber-500/30 rounded-lg px-4 py-2 w-full"
                                    />
                                ) : (
                                    <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-2">
                                        {userName}
                                    </h1>
                                )}
                                <p className="font-sans text-base lg:text-lg text-amber-100 mb-1">
                                    {userEmail}
                                </p>

                                {/* Password Change Fields */}
                                {isEditing && (
                                    <div className="mt-4 space-y-3 w-full max-w-md">
                                        <div className="flex items-center gap-2 text-amber-100 mb-2">
                                            <Lock className="w-4 h-4" />
                                            <span className="text-sm font-semibold">Change Password</span>
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Previous Password"
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white/10 border border-amber-500/30 rounded-lg text-white placeholder-amber-200/50 focus:outline-none focus:border-amber-500"
                                        />
                                        <input
                                            type="password"
                                            placeholder="New Password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white/10 border border-amber-500/30 rounded-lg text-white placeholder-amber-200/50 focus:outline-none focus:border-amber-500"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Confirm New Password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white/10 border border-amber-500/30 rounded-lg text-white placeholder-amber-200/50 focus:outline-none focus:border-amber-500"
                                        />
                                        {passwordError && (
                                            <p className="text-red-400 text-sm">{passwordError}</p>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-center lg:justify-start gap-2 text-amber-100 mt-3">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                                    <span className="font-sans text-sm">
                                        Member for {memberDuration || 'just now'}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Edit/Save Buttons - Only show when in edit mode */}
                            {isEditing && (
                                <div className="flex gap-3 mt-4 mx-auto lg:mx-0 w-fit">
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSave}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-green-600/80 hover:bg-green-600 backdrop-blur-sm border border-green-500/30 rounded-full text-white font-sans text-sm font-semibold transition-all shadow-lg"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save
                                    </motion.button>
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm border border-red-500/30 rounded-full text-white font-sans text-sm font-semibold transition-all shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        {/* Total Orders */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-amber-500/20 rounded-lg">
                                    <ShoppingBag className="w-5 h-5 text-amber-200" />
                                </div>
                                <span className="font-sans text-sm text-amber-100">Total Orders</span>
                            </div>
                            <p className="font-display text-3xl font-bold text-white">
                                {user.totalOrders}
                            </p>
                        </motion.div>

                        {/* Points */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="bg-gradient-to-br from-amber-500/30 to-amber-600/30 backdrop-blur-sm rounded-2xl p-5 border border-amber-400/30 hover:from-amber-500/40 hover:to-amber-600/40 transition-all shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-amber-400/30 rounded-lg">
                                    <Coins className="w-5 h-5 text-amber-100" />
                                </div>
                                <span className="font-sans text-sm text-amber-50 font-semibold">
                                    Reward Points
                                </span>
                            </div>
                            <p className="font-display text-4xl font-bold text-white">
                                {user.points.toLocaleString()}
                            </p>
                        </motion.div>

                        {/* Total Spent */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Award className="w-5 h-5 text-green-200" />
                                </div>
                                <span className="font-sans text-sm text-amber-100">Total Spent</span>
                            </div>
                            <p className="font-display text-3xl font-bold text-white">
                                ₹{user.totalSpent.toLocaleString()}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
