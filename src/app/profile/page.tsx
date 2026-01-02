"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { OrderHistory } from "@/components/profile/OrderHistory";
import { WorkshopsSection } from "@/components/profile/WorkshopsSection";
import { ArtCollection } from "@/components/profile/ArtCollection";
import {
    mockUserProfile,
    mockOrders,
    mockWorkshops,
    mockArtCollection,
} from "@/data/profileData";
import { 
    LogOut, Edit2, ShoppingBag, GraduationCap, Palette, Coins, 
    Settings, Bell, Heart, MapPin, Calendar, TrendingUp, Award,
    ChevronRight, User, Mail, Clock, X, Upload, Lock, Save, Camera
} from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [activeSection, setActiveSection] = useState("orders");
    const [userName, setUserName] = useState("Guest User");
    const [userEmail, setUserEmail] = useState("");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [memberDuration, setMemberDuration] = useState("just now");
    
    // Edit form states
    const [editName, setEditName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const name = localStorage.getItem('rabuste_user_name') || 'Guest User';
        const email = localStorage.getItem('rabuste_user_email') || '';
        const image = localStorage.getItem('rabuste_user_image') || null;
        setUserName(name);
        setUserEmail(email);
        setProfileImage(image);
        setEditName(name);

        // Calculate member duration
        const memberSinceStr = localStorage.getItem('rabuste_member_since');
        if (memberSinceStr) {
            const memberSince = new Date(memberSinceStr);
            const now = new Date();
            const diffMs = now.getTime() - memberSince.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffMonths = Math.floor(diffDays / 30);
            const diffYears = Math.floor(diffDays / 365);
            
            if (diffDays < 1) setMemberDuration('today');
            else if (diffDays < 30) setMemberDuration(`${diffDays} day${diffDays !== 1 ? 's' : ''}`);
            else if (diffMonths < 12) setMemberDuration(`${diffMonths} month${diffMonths !== 1 ? 's' : ''}`);
            else setMemberDuration(`${diffYears} year${diffYears !== 1 ? 's' : ''}`);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('rabuste_auth');
        localStorage.removeItem('rabuste_user_email');
        localStorage.removeItem('rabuste_user_password');
        localStorage.removeItem('rabuste_user_name');
        localStorage.removeItem('rabuste_user_image');
        router.push('/');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result as string;
                setProfileImage(imageData);
                localStorage.setItem('rabuste_user_image', imageData);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        setPasswordError("");
        
        // Validate password if changing
        if (oldPassword || newPassword || confirmPassword) {
            const savedPassword = localStorage.getItem('rabuste_user_password');
            
            if (oldPassword !== savedPassword) {
                setPasswordError('Previous password is incorrect');
                return;
            }
            
            if (newPassword.length < 8) {
                setPasswordError('New password must be at least 8 characters');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                setPasswordError('Passwords do not match');
                return;
            }
            
            localStorage.setItem('rabuste_user_password', newPassword);
        }
        
        // Save name
        localStorage.setItem('rabuste_user_name', editName);
        setUserName(editName);
        
        // Reset form
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSaveSuccess(true);
        
        setTimeout(() => {
            setSaveSuccess(false);
            setIsEditing(false);
        }, 1500);
    };

    const handleCancelEdit = () => {
        setEditName(userName);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
        setIsEditing(false);
    };

    // Calculate totals from actual data
    const ordersTotal = mockOrders.reduce((sum, order) => sum + order.total, 0);
    const workshopsTotal = mockWorkshops.length * 500;
    const artTotal = mockArtCollection.reduce((sum, art) => sum + art.price, 0);
    const totalSpent = ordersTotal + workshopsTotal + artTotal;
    const totalOrders = mockOrders.length;

    const generateInitials = (name: string) => {
        if (!name || name.trim() === '') return 'GU';
        const firstName = name.trim().split(' ')[0];
        return firstName.slice(0, 2).toUpperCase();
    };

    const sidebarItems = [
        { id: "orders", label: "My Orders", icon: ShoppingBag, count: mockOrders.length },
        { id: "workshops", label: "Workshops", icon: GraduationCap, count: mockWorkshops.length },
        { id: "art", label: "Art Collection", icon: Palette, count: mockArtCollection.length },
        { id: "points", label: "Reward Points", icon: Coins, href: "/points" },
    ];

    const quickStats = [
        { label: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "amber" },
        { label: "Reward Points", value: mockUserProfile.points, icon: Coins, color: "yellow" },
        { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, icon: TrendingUp, color: "green" },
        { label: "Member Tier", value: "Gold", icon: Award, color: "amber" },
    ];

    return (
        <>
            <Navbar />
            <main className="min-h-screen" style={{ backgroundColor: "#D8CBB8" }}>
                {/* Mobile Layout - Same as before */}
                <div className="lg:hidden pt-16 pb-20">
                    <ProfileHeader 
                        user={{
                            ...mockUserProfile,
                            totalOrders: totalOrders,
                            totalSpent: totalSpent,
                        }} 
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                    />
                    <OrderHistory orders={mockOrders} totalSpent={ordersTotal} />
                    <WorkshopsSection workshops={mockWorkshops} totalSpent={workshopsTotal} />
                    <ArtCollection artPieces={mockArtCollection} />
                    
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-lg mx-auto flex flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-medium text-sm shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-transparent border border-[#a8a29e] text-[#78716c] hover:border-red-400 hover:text-red-500 font-sans font-medium text-sm transition-all duration-300"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout - New Premium Design */}
                <div className="hidden lg:block pt-28 pb-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex gap-8 items-start">
                            {/* Left Sidebar - Fixed position with self-start */}
                            <motion.aside
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="w-80 flex-shrink-0 self-start"
                            >
                                <div className="sticky top-28 space-y-6">
                                    {/* Profile Card */}
                                    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                                        {/* Cover Image */}
                                        <div className="h-28 bg-gradient-to-br from-[#8B6F47] via-[#a07d50] to-[#6d5638] relative">
                                            <div className="absolute inset-0 opacity-30">
                                                <div className="absolute top-4 right-4 w-20 h-20 bg-amber-300 rounded-full blur-2xl" />
                                                <div className="absolute bottom-4 left-4 w-16 h-16 bg-amber-200 rounded-full blur-xl" />
                                            </div>
                                        </div>

                                        {/* Avatar & Info */}
                                        <div className="relative px-6 pb-6">
                                            <div className="relative -mt-14 mb-4">
                                                {profileImage ? (
                                                    <Image
                                                        src={profileImage}
                                                        alt={userName}
                                                        width={100}
                                                        height={100}
                                                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                                                    />
                                                ) : (
                                                    <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center bg-gradient-to-br from-[#8B6F47] to-[#6d5638] text-white text-2xl font-bold">
                                                        {generateInitials(userName)}
                                                    </div>
                                                )}
                                                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                                                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                                                </div>
                                            </div>

                                            <h2 className="font-display text-xl font-bold text-[#262626] mb-1">
                                                {userName}
                                            </h2>
                                            <p className="text-sm text-[#78716c] mb-3 flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5" />
                                                {userEmail || "user@email.com"}
                                            </p>

                                            <div className="flex items-center gap-2 text-xs text-[#a8a29e] mb-4">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>Member for {memberDuration}</span>
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B6F47] hover:bg-[#6d5638] text-white font-sans font-medium text-sm transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    Edit Profile
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="p-2.5 rounded-xl border border-[#e7e5e4] hover:border-red-300 hover:bg-red-50 text-[#78716c] hover:text-red-500 transition-all"
                                                    title="Logout"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Navigation Menu */}
                                    <div className="bg-white rounded-2xl shadow-sm p-2">
                                        <nav className="space-y-1">
                                            {sidebarItems.map((item) => {
                                                const isActive = activeSection === item.id;
                                                const Icon = item.icon;

                                                if (item.href) {
                                                    return (
                                                        <Link key={item.id} href={item.href}>
                                                            <div className="flex items-center justify-between px-4 py-3 rounded-xl text-[#78716c] hover:bg-[#F5F0EB] hover:text-[#8B6F47] transition-all cursor-pointer">
                                                                <div className="flex items-center gap-3">
                                                                    <Icon className="w-5 h-5" />
                                                                    <span className="font-sans font-medium text-sm">{item.label}</span>
                                                                </div>
                                                                <ChevronRight className="w-4 h-4" />
                                                            </div>
                                                        </Link>
                                                    );
                                                }

                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => setActiveSection(item.id)}
                                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                                                            isActive
                                                                ? "bg-[#8B6F47] text-white shadow-md"
                                                                : "text-[#78716c] hover:bg-[#F5F0EB] hover:text-[#8B6F47]"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Icon className="w-5 h-5" />
                                                            <span className="font-sans font-medium text-sm">{item.label}</span>
                                                        </div>
                                                        {item.count !== undefined && (
                                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                                isActive ? "bg-white/20" : "bg-[#F5F0EB]"
                                                            }`}>
                                                                {item.count}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </nav>
                                    </div>

                                    {/* Member Tier Card */}
                                    <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-2xl p-5 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                                        
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                                    <Award className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-amber-100 text-xs font-medium">Member Tier</p>
                                                    <p className="font-display text-lg font-bold">Gold Member</p>
                                                </div>
                                            </div>
                                            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                                <div className="w-1/2 h-full bg-white rounded-full" />
                                            </div>
                                            <p className="text-xs text-amber-100 mt-2">250 pts to Platinum</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.aside>

                            {/* Main Content Area */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex-1 min-w-0"
                            >
                                {/* Quick Stats Grid */}
                                <div className="grid grid-cols-4 gap-4 mb-8">
                                    {quickStats.map((stat, index) => {
                                        const Icon = stat.icon;
                                        return (
                                            <motion.div
                                                key={stat.label}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                                                    stat.color === "amber" ? "bg-amber-100 text-amber-600" :
                                                    stat.color === "yellow" ? "bg-yellow-100 text-yellow-600" :
                                                    "bg-green-100 text-green-600"
                                                }`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs text-[#78716c] font-medium mb-1">{stat.label}</p>
                                                <p className="font-display text-xl font-bold text-[#262626]">
                                                    {stat.value}
                                                </p>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Content Sections */}
                                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                                    {/* Section Header */}
                                    <div className="px-8 py-6 border-b border-[#f5f5f4]">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="font-display text-2xl font-bold text-[#262626]">
                                                    {activeSection === "orders" && "Order History"}
                                                    {activeSection === "workshops" && "My Workshops"}
                                                    {activeSection === "art" && "Art Collection"}
                                                </h2>
                                                <p className="text-sm text-[#78716c] mt-1">
                                                    {activeSection === "orders" && `${mockOrders.length} orders • ₹${ordersTotal.toLocaleString()} spent`}
                                                    {activeSection === "workshops" && `${mockWorkshops.length} workshops attended`}
                                                    {activeSection === "art" && `${mockArtCollection.length} pieces • ₹${artTotal.toLocaleString()} value`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section Content */}
                                    <div className="p-8">
                                        {activeSection === "orders" && (
                                            <OrderHistory orders={mockOrders} totalSpent={ordersTotal} isDesktop />
                                        )}
                                        {activeSection === "workshops" && (
                                            <WorkshopsSection workshops={mockWorkshops} totalSpent={workshopsTotal} isDesktop />
                                        )}
                                        {activeSection === "art" && (
                                            <ArtCollection artPieces={mockArtCollection} isDesktop />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <Footer />

                {/* Edit Profile Modal - Desktop */}
                <AnimatePresence>
                    {isEditing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/50 backdrop-blur-sm p-8"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) handleCancelEdit();
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col"
                            >
                                {/* Modal Header */}
                                <div className="bg-gradient-to-br from-[#8B6F47] via-[#a07d50] to-[#6d5638] px-6 py-4 relative flex-shrink-0">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <h2 className="font-display text-xl font-bold text-white">Edit Profile</h2>
                                    <p className="text-amber-100/80 text-xs mt-0.5">Update your personal information</p>
                                </div>

                                {/* Modal Content - Scrollable */}
                                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                                    {/* Profile Picture */}
                                    <div className="flex items-center gap-4">
                                        <div className="relative flex-shrink-0">
                                            {profileImage ? (
                                                <Image
                                                    src={profileImage}
                                                    alt={userName}
                                                    width={64}
                                                    height={64}
                                                    className="w-16 h-16 rounded-xl object-cover border-2 border-[#e7e5e4]"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-xl border-2 border-[#e7e5e4] flex items-center justify-center bg-gradient-to-br from-[#8B6F47] to-[#6d5638] text-white text-lg font-bold">
                                                    {generateInitials(editName)}
                                                </div>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-[#262626] mb-1.5">Profile Photo</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#8B6F47] bg-[#F5F0EB] hover:bg-[#e7e0d6] rounded-lg transition-colors"
                                                >
                                                    <Upload className="w-3.5 h-3.5" />
                                                    Upload
                                                </button>
                                                {profileImage && (
                                                    <button
                                                        onClick={() => {
                                                            setProfileImage(null);
                                                            localStorage.removeItem('rabuste_user_image');
                                                        }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Name Field */}
                                    <div>
                                        <label className="block text-xs font-medium text-[#262626] mb-1.5">
                                            Display Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-lg border border-[#e7e5e4] focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/20 outline-none transition-all text-[#262626] text-sm"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    {/* Email (readonly) */}
                                    <div>
                                        <label className="block text-xs font-medium text-[#262626] mb-1.5">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={userEmail}
                                            disabled
                                            className="w-full px-3 py-2.5 rounded-lg border border-[#e7e5e4] bg-[#f5f5f4] text-[#78716c] cursor-not-allowed text-sm"
                                        />
                                    </div>

                                    {/* Password Section */}
                                    <div className="pt-3 border-t border-[#e7e5e4]">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Lock className="w-3.5 h-3.5 text-[#8B6F47]" />
                                            <span className="text-xs font-semibold text-[#262626]">Change Password</span>
                                            <span className="text-[10px] text-[#a8a29e]">(optional)</span>
                                        </div>
                                        <div className="space-y-2">
                                            <input
                                                type="password"
                                                placeholder="Current Password"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-lg border border-[#e7e5e4] focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/20 outline-none transition-all text-[#262626] text-sm"
                                            />
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-lg border border-[#e7e5e4] focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/20 outline-none transition-all text-[#262626] text-sm"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm New Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-lg border border-[#e7e5e4] focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/20 outline-none transition-all text-[#262626] text-sm"
                                            />
                                            {passwordError && (
                                                <p className="text-red-500 text-xs">{passwordError}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 bg-[#f5f5f4] flex items-center justify-end gap-3 flex-shrink-0">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-5 py-2 rounded-lg text-sm font-medium text-[#78716c] hover:bg-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-[#8B6F47] hover:bg-[#6d5638] transition-colors"
                                    >
                                        {saveSuccess ? (
                                            <>
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
                                                >
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </motion.div>
                                                Saved!
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </>
    );
}
