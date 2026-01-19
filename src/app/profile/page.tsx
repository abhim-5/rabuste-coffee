"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { OrderHistory } from "@/components/profile/OrderHistory";
import { WorkshopsSection } from "@/components/profile/WorkshopsSection";
import { ArtCollection } from "@/components/profile/ArtCollection";
import { CafeReviewsSection } from "@/components/profile/CafeReviewsSection";
import { FranchiseRequestsSection } from "@/components/profile/FranchiseRequestsSection";
import { WorkshopRequestsSection } from "@/components/profile/WorkshopRequestsSection";
import {
    LogOut, Edit2, ShoppingBag, GraduationCap, Palette, Gift,
    Settings, Bell, Heart, MapPin, Calendar, TrendingUp, Award,
    ChevronRight, User, Mail, Clock, X, Upload, Lock, Save, Camera, Star, Building2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useProfileStats } from "@/hooks/useProfileStats";
import { useProfileOrders } from "@/hooks/useProfileOrders";
import { useProfileWorkshops } from "@/hooks/useProfileWorkshops";
import { useProfileArt } from "@/hooks/useProfileArt";
import { MyCouponsSection } from "@/components/profile/MyCouponsSection";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCart } from "@/hooks/useCart";

// Component that uses useSearchParams - must be wrapped in Suspense
function TabHandler({ setActiveSection }: { setActiveSection: (tab: string) => void }) {
    const searchParams = useSearchParams();
    
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['orders', 'workshops', 'art', 'coupons', 'reviews', 'franchise-requests', 'workshop-requests'].includes(tab)) {
            setActiveSection(tab);
        }
    }, [searchParams, setActiveSection]);
    
    return null;
}

export default function ProfilePage() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const { profile, loading: profileLoading, updateProfile } = useProfile();
    const { stats, loading: statsLoading } = useProfileStats();
    const { orders, loading: ordersLoading } = useProfileOrders();
    const { workshops, loading: workshopsLoading } = useProfileWorkshops();
    const { artPieces, loading: artLoading } = useProfileArt();
    // const { addItem } = useCart(); // Removed as per instruction

    const [isEditing, setIsEditing] = useState(false);
    const [activeSection, setActiveSection] = useState("orders");
    const [rewardMessage, setRewardMessage] = useState<string | null>(null);

    // Handle reorder functionality
    const handleReorder = async (order: any) => {
        try {
            // Fetch current menu to match items
            const menuRes = await fetch('/api/menu/items');
            const menuData = await menuRes.json();

            if (!menuData.success || !menuData.items) {
                console.error('Unable to fetch menu items');
                return;
            }

            const menuItems = menuData.items;
            console.log('🔄 Reordering items from order:', order.order_number || order.id);
            console.log('📦 Order items to add:', order.items);

            // Get current cart from localStorage
            const cartKey = 'rabuste-cart';
            const storedCart = localStorage.getItem(cartKey);
            let cart = storedCart ? JSON.parse(storedCart) : { items: [], total: 0, itemCount: 0 };

            console.log('🛒 Current cart before reorder:', cart);

            // Add each item from the order
            for (const orderItem of order.items) {
                const menuItem = menuItems.find((m: any) =>
                    m.name.toLowerCase() === orderItem.name.toLowerCase()
                );

                if (menuItem) {
                    console.log('➕ Adding to cart:', menuItem.name, 'x', orderItem.quantity);

                    // Create cart item
                    const cartItem = {
                        menuItem: menuItem,
                        quantity: orderItem.quantity,
                        selectedVariation: undefined,
                        subtotal: menuItem.price * orderItem.quantity
                    };

                    cart.items.push(cartItem);
                } else {
                    console.warn('⚠️ Menu item not found:', orderItem.name);
                }
            }

            // Recalculate totals
            cart.total = cart.items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
            cart.itemCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

            // Save directly to localStorage
            localStorage.setItem(cartKey, JSON.stringify(cart));
            console.log('💾 Cart saved to localStorage:', cart);

            // Navigate to menu page where cart will auto-open
            console.log('🚀 Navigating to menu with', cart.itemCount, 'items...');
            window.location.href = '/menu?openCart=true';

        } catch (error) {
            console.error('Error reordering:', error);
        }
    };

    // Edit form states
    const [editName, setEditName] = useState("");
    const [editAge, setEditAge] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize edit form when profile loads
    useEffect(() => {
        if (profile) {
            setEditName(profile.full_name || "");
            setEditAge(profile.age?.toString() || "");
            setEditPhone(profile.phone || "");
        }
    }, [profile]);

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // For now, convert to base64. In production, upload to Supabase Storage
            const reader = new FileReader();
            reader.onloadend = async () => {
                const imageData = reader.result as string;

                // Update profile with new avatar
                const result = await updateProfile({
                    avatar_url: imageData
                });

                if (result.rewards && result.rewards.creditsEarned > 0) {
                    setRewardMessage(result.rewards.messages.join(' '));
                    setTimeout(() => setRewardMessage(null), 5000);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        }
    };

    const handleSaveProfile = async () => {
        setIsSubmitting(true);
        try {
            const result = await updateProfile({
                full_name: editName || null,
                age: editAge ? parseInt(editAge) : null,
                phone: editPhone || null
            });

            setSaveSuccess(true);

            // Show rewards if any
            if (result.rewards && result.rewards.creditsEarned > 0) {
                setRewardMessage(result.rewards.messages.join(' '));
                setTimeout(() => setRewardMessage(null), 5000);
            }

            setTimeout(() => {
                setSaveSuccess(false);
                setIsEditing(false);
            }, 1500);

        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setEditName(profile?.full_name || "");
        setEditAge(profile?.age?.toString() || "");
        setEditPhone(profile?.phone || "");
        setIsEditing(false);
    };

    // Loading check logic moved to render time

    const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
    const userEmail = profile?.email || user?.email || '';
    const profileImage = profile?.avatar_url;

    // Calculate member duration
    const memberSince = profile?.created_at ? new Date(profile.created_at) : new Date();
    const diffMs = Date.now() - memberSince.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const memberDuration = diffDays === 0 ? "today" :
        diffDays < 30 ? `${diffDays} day${diffDays > 1 ? 's' : ''}` :
            `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;

    // Mock data for workshops and art (until we integrate those)
    const mockWorkshops: any[] = [];
    const mockArtCollection: any[] = [];

    const totalOrders = stats?.ordersCount || 0;
    const totalSpent = stats?.totalSpent || 0;
    const ordersTotal = totalSpent;
    const workshopsTotal = (workshops?.length || 0) * 500; // Average workshop price
    const artTotal = artPieces?.reduce((sum, art) => sum + art.price, 0) || 0;

    const generateInitials = (name: string) => {
        if (!name || name.trim() === '') return 'GU';
        const firstName = name.trim().split(' ')[0];
        return firstName.slice(0, 2).toUpperCase();
    };

    const sidebarItems: Array<{
        id: string;
        label: string;
        icon: any;
        count?: number;
        href?: string;
    }> = [
            { id: "orders", label: "My Orders", icon: ShoppingBag, count: stats?.ordersCount || 0 },
            { id: "workshops", label: "Workshops", icon: GraduationCap, count: stats?.workshopsCount || 0 },
            { id: "workshop-requests", label: "Workshop Requests", icon: GraduationCap },
            { id: "art", label: "Art Collection", icon: Palette, count: stats?.artPurchasedCount || 0 },
            { id: "coupons", label: "My Coupons", icon: Gift },
            { id: "franchise-requests", label: "Franchise Requests", icon: Building2 },
            { id: "reviews", label: "Cafe Reviews", icon: Star },
        ];

    const quickStats = [
        { label: "Total Menu Orders", value: totalOrders, icon: ShoppingBag, color: "amber" },
        { label: "Total Workshops", value: workshops?.length || 0, icon: GraduationCap, color: "blue" },
        { label: "Total Art Items", value: artPieces?.length || 0, icon: Palette, color: "amber" },
        { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, icon: TrendingUp, color: "green" },
    ];

    return (
        <>
            <Suspense fallback={null}>
                <TabHandler setActiveSection={setActiveSection} />
            </Suspense>
            <Navbar />
            <main className="min-h-screen" style={{ backgroundColor: "#faeade" }}>
                {/* Reward Notification Toast */}
                <AnimatePresence>
                    {rewardMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
                        >
                            {rewardMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Layout */}
                <div className="lg:hidden pt-16 pb-20">
                    <ProfileHeader
                        user={{
                            id: user?.id || 'guest',
                            name: userName,
                            email: userEmail,
                            avatar: profileImage ?? undefined,
                            memberSince: memberSince,
                            points: 0, // Legacy field, not used
                            totalOrders: totalOrders,
                            totalSpent: totalSpent,
                        }}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                    />
                    <OrderHistory orders={(orders as any) || []} totalSpent={ordersTotal} onReorder={handleReorder} />
                    <WorkshopsSection workshops={(workshops as any) || []} totalSpent={workshopsTotal} />
                    
                    <section className="w-full py-8 lg:py-10" style={{ backgroundColor: "#D8CBB8" }}>
                        <div className="mx-auto w-full px-4 lg:px-6 max-w-6xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center mb-8"
                            >
                                <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#404040] mb-3 text-center">
                                    Workshop Requests
                                </h2>
                                <div className="relative w-24 h-6 mb-3">
                                    <Image
                                        src="/title-separator.png"
                                        fill
                                        alt=""
                                        className="object-contain"
                                    />
                                </div>
                            </motion.div>
                            <WorkshopRequestsSection />
                        </div>
                    </section>

                    <ArtCollection artPieces={(artPieces as any) || []} />
                    
                    <section className="w-full py-8 lg:py-10" style={{ backgroundColor: "#D8CBB8" }}>
                        <div className="mx-auto w-full px-4 lg:px-6 max-w-6xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center mb-8"
                            >
                                <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#404040] mb-3 text-center">
                                    My Coupons
                                </h2>
                                <div className="relative w-24 h-6 mb-3">
                                    <Image
                                        src="/title-separator.png"
                                        fill
                                        alt=""
                                        className="object-contain"
                                    />
                                </div>
                            </motion.div>
                            <MyCouponsSection />
                        </div>
                    </section>
                    
                    <section className="w-full py-8 lg:py-10" style={{ backgroundColor: "#D8CBB8" }}>
                        <div className="mx-auto w-full px-4 lg:px-6 max-w-6xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center mb-8"
                            >
                                <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#404040] mb-3 text-center">
                                    Franchise Requests
                                </h2>
                                <div className="relative w-24 h-6 mb-3">
                                    <Image
                                        src="/title-separator.png"
                                        fill
                                        alt=""
                                        className="object-contain"
                                    />
                                </div>
                            </motion.div>
                            <FranchiseRequestsSection />
                        </div>
                    </section>
                    
                    <section className="w-full py-8 lg:py-10" style={{ backgroundColor: "#D8CBB8" }}>
                        <div className="mx-auto w-full px-4 lg:px-6 max-w-6xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center mb-8"
                            >
                                <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#404040] mb-3 text-center">
                                    Cafe Reviews
                                </h2>
                                <div className="relative w-24 h-6 mb-3">
                                    <Image
                                        src="/title-separator.png"
                                        fill
                                        alt=""
                                        className="object-contain"
                                    />
                                </div>
                            </motion.div>
                            <CafeReviewsSection />
                        </div>
                    </section>

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

                {/* Desktop Layout */}
                <div className="hidden lg:block pt-28 pb-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex gap-8 items-start">
                            {/* Left Sidebar */}
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
                                                {profileLoading ? (
                                                     <Skeleton className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg" />
                                                ) : profileImage ? (
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
                                                {!profileLoading && (
                                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                                                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                                                    </div>
                                                )}
                                            </div>

                                            {profileLoading ? (
                                                 <div className="space-y-2 mb-4">
                                                     <Skeleton className="h-6 w-32" />
                                                     <Skeleton className="h-4 w-48" />
                                                 </div>
                                            ) : (
                                                <>
                                                    <h2 className="font-display text-xl font-bold text-[#262626] mb-1">
                                                        {userName}
                                                    </h2>
                                                    <p className="text-sm text-[#78716c] mb-3 flex items-center gap-2">
                                                        <Mail className="w-3.5 h-3.5" />
                                                        {userEmail}
                                                    </p>

                                                    <div className="flex items-center gap-2 text-xs text-[#a8a29e] mb-4">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>Member for {memberDuration}</span>
                                                    </div>
                                                </>
                                            )}

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
                                                        <div className="flex items-center justify-between px-4 py-3 rounded-xl text-[#78716c] hover:bg-[#fff9eb] hover:text-[#8B6F47] transition-all cursor-pointer">
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
                                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive
                                                            ? "bg-[#8B6F47] text-white shadow-md"
                                                            : "text-[#78716c] hover:bg-[#fff9eb] hover:text-[#8B6F47]"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Icon className="w-5 h-5" />
                                                            <span className="font-sans font-medium text-sm">{item.label}</span>
                                                        </div>
                                                        {item.count !== undefined && (
                                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-[#fff9eb]"
                                                                }`}>
                                                                {item.count}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </nav>
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
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color === "amber" ? "bg-amber-100 text-amber-600" :
                                                    stat.color === "yellow" ? "bg-yellow-100 text-yellow-600" :
                                                        "bg-green-100 text-green-600"
                                                    }`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs text-[#78716c] font-medium mb-1">{stat.label}</p>
                                                <div className="font-display text-xl font-bold text-[#7f3b2d]">
                                                    {profileLoading ? <Skeleton className="h-6 w-16" /> : stat.value}
                                                </div>
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
                                                <h2 className="font-display text-2xl font-bold text-[#7f3b2d]">
                                                    {activeSection === "orders" && "Order History"}
                                                    {activeSection === "workshops" && "My Workshops"}
                                                    {activeSection === "art" && "Art Collection"}
                                                    {activeSection === "coupons" && "My Coupons"}
                                                </h2>
                                                <div className="text-sm text-[#78716c] mt-1 h-5">
                                                    {profileLoading ? (
                                                          <Skeleton className="h-4 w-48" />
                                                    ) : (
                                                        <>
                                                            {activeSection === "orders" && `${stats?.ordersCount || 0} orders • ₹${ordersTotal.toLocaleString()} spent`}
                                                            {activeSection === "workshops" && `${workshops?.length || 0} workshops attended`}
                                                            {activeSection === "art" && `${artPieces?.length || 0} pieces • ₹${artTotal.toLocaleString()} value`}
                                                            {activeSection === "coupons" && "Manage your reward coupons"}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section Content */}
                                    <div className="p-8">
                                        {activeSection === "orders" && (
                                            <OrderHistory orders={(orders as any) || []} totalSpent={ordersTotal} isDesktop onReorder={handleReorder} />
                                        )}
                                        {activeSection === "workshops" && (
                                            <WorkshopsSection workshops={(workshops as any) || []} totalSpent={workshopsTotal} isDesktop />
                                        )}
                                        {activeSection === "art" && (
                                            <ArtCollection artPieces={(artPieces as any) || []} isDesktop />
                                        )}
                                        {activeSection === "coupons" && (
                                            <MyCouponsSection />
                                        )}
                                        {activeSection === "franchise-requests" && (
                                            <FranchiseRequestsSection />
                                        )}
                                        {activeSection === "workshop-requests" && (
                                            <WorkshopRequestsSection />
                                        )}
                                        {activeSection === "reviews" && (
                                            <CafeReviewsSection />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <Footer />

                {/* Edit Profile Modal */}
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
                                    <p className="text-amber-100/80 text-xs mt-0.5">Update your personal information & earn rewards</p>
                                </div>

                                {/* Modal Content */}
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
                                                <div className="w-16 h-16 rounded-xl border-2 border-[#e7e5e4] flex items-center justify-center bg-gradient-to-br from-[#8B6F47] to-[#6d5638]  text-white text-lg font-bold">
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
                                            <p className="text-[10px] text-green-600 mb-2">Upload photo = ₹50 reward!</p>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#8B6F47] bg-[#F5F0EB] hover:bg-[#e7e0d6] rounded-lg transition-colors"
                                            >
                                                <Upload className="w-3.5 h-3.5" />
                                                Upload
                                            </button>
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

                                    {/* Age Field */}
                                    <div>
                                        <label className="block text-xs font-medium text-[#262626] mb-1.5">
                                            Age {!profile?.age && <span className="text-green-600">(₹50 reward!)</span>}
                                        </label>
                                        <input
                                            type="number"
                                            value={editAge}
                                            onChange={(e) => setEditAge(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-lg border border-[#e7e5e4] focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/20 outline-none transition-all text-[#262626] text-sm"
                                            placeholder="Enter your age"
                                        />
                                    </div>

                                    {/* Phone Field */}
                                    <div>
                                        <label className="block text-xs font-medium text-[#262626] mb-1.5">
                                            Phone Number {!profile?.phone && <span className="text-green-600">(₹25 reward!)</span>}
                                        </label>
                                        <input
                                            type="tel"
                                            value={editPhone}
                                            onChange={(e) => setEditPhone(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-lg border border-[#e7e5e4] focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/20 outline-none transition-all text-[#262626] text-sm"
                                            placeholder="Enter your phone"
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
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 bg-[#f5f5f4] flex items-center justify-end gap-3 flex-shrink-0">
                                    <button
                                        onClick={handleCancelEdit}
                                        disabled={isSubmitting}
                                        className="px-5 py-2 rounded-lg text-sm font-medium text-[#78716c] hover:bg-white transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSubmitting}
                                        className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-[#8B6F47] hover:bg-[#6d5638] transition-colors disabled:bg-gray-400"
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
                                                {isSubmitting ? 'Saving...' : 'Save Changes'}
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
