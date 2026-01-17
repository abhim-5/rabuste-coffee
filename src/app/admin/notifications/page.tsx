'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Bell, Users, Building2, Mail, Star, Check, X, Clock, Phone, MapPin, Instagram, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NotificationItem {
    id: string;
    type: 'workshop_request' | 'franchise_inquiry' | 'newsletter' | 'cafe_review';
    title: string;
    subtitle: string;
    description: string;
    user_name: string;
    created_at: string;
    status: string;
    metadata: any;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        fetchNotifications();

        // Set up real-time subscriptions
        const workshopChannel = supabase
            .channel('admin-workshops')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'workshop_requests', filter: 'status=eq.pending' },
                () => fetchNotifications()
            )
            .subscribe();

        const franchiseChannel = supabase
            .channel('admin-franchise')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'franchise_inquiries' },
                () => fetchNotifications()
            )
            .subscribe();

        const newsletterChannel = supabase
            .channel('admin-newsletter')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'newsletter_subscriptions' },
                () => fetchNotifications()
            )
            .subscribe();

        const reviewsChannel = supabase
            .channel('admin-reviews')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'cafe_reviews', filter: 'status=eq.pending' },
                () => fetchNotifications()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(workshopChannel);
            supabase.removeChannel(franchiseChannel);
            supabase.removeChannel(newsletterChannel);
            supabase.removeChannel(reviewsChannel);
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/admin/notifications');
            const data = await res.json();
            if (data.success) {
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, type: string, action: 'approve' | 'reject' | 'feature') => {
        try {
            setNotifications(prev => prev.filter(n => n.id !== id));

            let table = '';
            let updates: any = {};

            if (type === 'workshop_request') {
                table = 'workshop_requests';
                updates = { status: action === 'approve' ? 'approved' : 'rejected' };
            } else if (type === 'franchise_inquiry') {
                table = 'franchise_inquiries';
                updates = { status: action === 'approve' ? 'contacted' : 'rejected' };
            } else if (type === 'cafe_review') {
                table = 'cafe_reviews';
                if (action === 'feature') {
                    updates = { status: 'featured' };
                } else {
                    updates = { status: action === 'approve' ? 'approved' : 'rejected' };
                }
            }

            const { error } = await supabase.from(table).update(updates).eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Action failed:', error);
            fetchNotifications();
            alert('Failed to update status');
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'workshop_request': return <Users className="w-5 h-5 text-amber-600" />;
            case 'franchise_inquiry': return <Building2 className="w-5 h-5 text-blue-600" />;
            case 'newsletter': return <Mail className="w-5 h-5 text-green-600" />;
            case 'cafe_review': return <Star className="w-5 h-5 text-purple-600" />;
            default: return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'workshop_request': return 'bg-amber-50 border-amber-100';
            case 'franchise_inquiry': return 'bg-blue-50 border-blue-100';
            case 'newsletter': return 'bg-green-50 border-green-100';
            case 'cafe_review': return 'bg-purple-50 border-purple-100';
            default: return 'bg-gray-50 border-gray-100';
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600 mt-1">All user interactions requiring attention</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-600">
                    {loading ? '...' : `${notifications.length} Total`}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B6F47]"></div>
                </div>
            ) : notifications.length === 0 ? (
                <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                    <p className="text-gray-500">
                        No pending notifications at the moment.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((item) => (
                        <div
                            key={`${item.type}-${item.id}`}
                            className={`relative group rounded-xl border p-5 transition-all hover:shadow-md ${getTypeColor(item.type)}`}
                        >
                            <div className="flex flex-col gap-4">
                                {/* Header */}
                                <div className="flex gap-4 justify-between">
                                    <div className="flex gap-4 flex-1">
                                        <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0`}>
                                            {getTypeIcon(item.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 text-gray-600 border border-gray-200/50">
                                                    {item.type.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-0.5">{item.subtitle}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {formatDate(item.created_at)}
                                                </span>
                                            </div>

                                            {/* Expandable Details */}
                                            {expandedId === item.id && (
                                                <div className="mt-4 p-4 bg-white/50 rounded-lg border border-gray-100/50 space-y-2">
                                                    {item.type === 'workshop_request' && (
                                                        <>
                                                            <p className="text-sm"><strong>Email:</strong> {item.metadata.email}</p>
                                                            <p className="text-sm"><strong>Phone:</strong> {item.metadata.phone}</p>
                                                            {item.metadata.instagram_handle && (
                                                                <p className="text-sm flex items-center gap-1">
                                                                    <Instagram size={14} /> {item.metadata.instagram_handle}
                                                                </p>
                                                            )}
                                                            <p className="text-sm"><strong>Details:</strong> {item.description}</p>
                                                        </>
                                                    )}
                                                    {item.type === 'franchise_inquiry' && (
                                                        <>
                                                            <p className="text-sm"><strong>Email:</strong> {item.metadata.email}</p>
                                                            <p className="text-sm flex items-center gap-1">
                                                                <Phone size={14} /> {item.metadata.phone}
                                                            </p>
                                                            <p className="text-sm flex items-center gap-1">
                                                                <MapPin size={14} /> {item.metadata.location}
                                                            </p>
                                                            <p className="text-sm"><strong>Message:</strong> {item.description}</p>
                                                        </>
                                                    )}
                                                    {item.type === 'cafe_review' && (
                                                        <>
                                                            <div className="flex items-center gap-1">
                                                                {[...Array(item.metadata.rating)].map((_, i) => (
                                                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                                ))}
                                                            </div>
                                                            {item.metadata.user_email && (
                                                                <p className="text-sm"><strong>Email:</strong> {item.metadata.user_email}</p>
                                                            )}
                                                            <p className="text-sm"><strong>Review:</strong> {item.metadata.review_text || 'No review text'}</p>
                                                        </>
                                                    )}
                                                    {item.type === 'newsletter' && (
                                                        <p className="text-sm"><strong>Email:</strong> {item.metadata.email}</p>
                                                    )}
                                                </div>
                                            )}

                                            <button
                                                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                                className="mt-2 text-xs text-blue-600 hover:underline"
                                            >
                                                {expandedId === item.id ? 'Hide Details' : 'Show Details'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {item.type !== 'newsletter' && (
                                        <div className="flex items-center gap-2 self-start shrink-0">
                                            {item.type === 'cafe_review' && (
                                                <button
                                                    onClick={() => handleAction(item.id, item.type, 'feature')}
                                                    className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-purple-50 text-purple-700 border border-gray-200 hover:border-purple-200 rounded-lg transition text-sm font-medium shadow-sm"
                                                >
                                                    <Star size={16} />
                                                    Feature
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleAction(item.id, item.type, 'approve')}
                                                className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-green-50 text-green-700 border border-gray-200 hover:border-green-200 rounded-lg transition text-sm font-medium shadow-sm"
                                            >
                                                <Check size={16} />
                                                {item.type === 'franchise_inquiry' ? 'Contact' : 'Approve'}
                                            </button>
                                            <button
                                                onClick={() => handleAction(item.id, item.type, 'reject')}
                                                className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-red-50 text-red-700 border border-gray-200 hover:border-red-200 rounded-lg transition text-sm font-medium shadow-sm"
                                            >
                                                <X size={16} />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
