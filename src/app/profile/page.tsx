"use client";

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

export default function ProfilePage() {
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

                {/* Footer */}
                <Footer />
            </main>
        </>
    );
}
