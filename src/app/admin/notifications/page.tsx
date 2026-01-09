// Notifications Page (Placeholder for future)
'use client';

import { Bell } from 'lucide-react';

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">Real-time notifications system</p>
            </div>

            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">
                    Real-time notification system will be implemented in Phase 8
                </p>
            </div>
        </div>
    );
}
