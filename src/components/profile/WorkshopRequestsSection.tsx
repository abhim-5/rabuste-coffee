'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Clock, CheckCircle, XCircle, Phone, Mail, Instagram, MessageSquare } from 'lucide-react';

interface WorkshopRequest {
    id: string;
    name: string;
    email: string;
    phone: string;
    workshop_theme: string;
    instagram_handle?: string;
    additional_details?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
}

export function WorkshopRequestsSection() {
    const [requests, setRequests] = useState<WorkshopRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/user/workshop-requests');
            const data = await res.json();
            if (data.success) {
                setRequests(data.requests);
            }
        } catch (error) {
            console.error('Failed to fetch workshop requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
            approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
        };
        const style = styles[status as keyof typeof styles] || styles.pending;
        const Icon = style.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                <Icon className="w-3.5 h-3.5" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B6F47]"></div>
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-12 border border-[#e7e5e4] text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#292524] mb-2">No Workshop Requests Yet</h3>
                <p className="text-[#78716c] text-sm">
                    Visit our <a href="/workshops#request-custom-workshop" className="text-[#8B6F47] hover:underline">Workshops</a> page to request a custom workshop.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {requests.map((request) => (
                <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-[#e7e5e4] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 px-6 py-4 border-b border-amber-100">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#292524]">{request.workshop_theme}</h3>
                                    <p className="text-xs text-[#78716c] mt-0.5">
                                        Submitted {new Date(request.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            {getStatusBadge(request.status)}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-2">
                                <Phone className="w-4 h-4 text-[#8B6F47] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs text-[#78716c] font-medium">Phone</p>
                                    <p className="text-sm text-[#292524]">{request.phone}</p>
                                </div>
                            </div>
                            {request.instagram_handle && (
                                <div className="flex items-start gap-2">
                                    <Instagram className="w-4 h-4 text-[#8B6F47] mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-[#78716c] font-medium">Instagram</p>
                                        <p className="text-sm text-[#292524]">{request.instagram_handle}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {request.additional_details && (
                            <div className="flex items-start gap-2">
                                <MessageSquare className="w-4 h-4 text-[#8B6F47] mt-0.5 shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-[#78716c] font-medium mb-1">Additional Details</p>
                                    <p className="text-sm text-[#292524] bg-gray-50 p-3 rounded-lg">{request.additional_details}</p>
                                </div>
                            </div>
                        )}

                        {request.status === 'approved' && (
                            <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <p className="text-sm text-green-800">
                                    ✅ Your workshop request has been approved! We will contact you soon with the details.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
