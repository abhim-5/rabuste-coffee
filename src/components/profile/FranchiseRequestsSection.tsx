'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Clock, CheckCircle, XCircle, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

interface FranchiseRequest {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    message: string;
    status: 'pending' | 'contacted' | 'rejected' | 'closed';
    admin_notes?: string;
    created_at: string;
    updated_at: string;
}

export function FranchiseRequestsSection() {
    const [requests, setRequests] = useState<FranchiseRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/user/franchise-requests');
            const data = await res.json();
            if (data.success) {
                setRequests(data.requests);
            }
        } catch (error) {
            console.error('Failed to fetch franchise requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
            contacted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
            closed: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle }
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
                    <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#292524] mb-2">No Franchise Inquiries Yet</h3>
                <p className="text-[#78716c] text-sm">
                    Visit our <a href="/about-us#franchise-inquiry" className="text-[#8B6F47] hover:underline">About Us</a> page to submit a franchise inquiry.
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
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 px-6 py-4 border-b border-blue-100">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#292524]">Franchise Inquiry</h3>
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
                                <MapPin className="w-4 h-4 text-[#8B6F47] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs text-[#78716c] font-medium">Preferred Location</p>
                                    <p className="text-sm text-[#292524]">{request.location}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Phone className="w-4 h-4 text-[#8B6F47] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs text-[#78716c] font-medium">Contact</p>
                                    <p className="text-sm text-[#292524]">{request.phone}</p>
                                </div>
                            </div>
                        </div>

                        {request.message && (
                            <div className="flex items-start gap-2">
                                <MessageSquare className="w-4 h-4 text-[#8B6F47] mt-0.5 shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-[#78716c] font-medium mb-1">Your Message</p>
                                    <p className="text-sm text-[#292524] bg-gray-50 p-3 rounded-lg">{request.message}</p>
                                </div>
                            </div>
                        )}

                        {request.admin_notes && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <p className="text-xs font-medium text-blue-900 mb-1">Admin Notes:</p>
                                <p className="text-sm text-blue-800">{request.admin_notes}</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
