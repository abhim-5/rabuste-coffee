"use client";

import { useRouter } from "next/navigation";
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
import { LogOut } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('rabuste_auth');
        localStorage.removeItem('rabuste_user_email');
        localStorage.removeItem('rabuste_user_password');
        localStorage.removeItem('rabuste_user_name');
        localStorage.removeItem('rabuste_user_image');
        router.push('/');
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-16 lg:pt-20 pb-20 lg:pb-8">
                {/* Profile Header */}
                <ProfileHeader user={mockUserProfile} />

                {/* Order History */}
                <OrderHistory orders={mockOrders} />

                {/* Workshops Section */}
                <WorkshopsSection workshops={mockWorkshops} />

                {/* Art Collection */}
                <ArtCollection artPieces={mockArtCollection} />

                {/* Logout Button */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-md mx-auto">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <Footer />
            </main>
        </>
    );
}
