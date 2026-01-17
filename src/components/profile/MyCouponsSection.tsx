'use client';

import { useEffect, useState } from 'react';
import { Gift, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Coupon {
    id: string;
    discount_amount: number;
    is_used: boolean;
    expires_at: string | null;
    created_at: string;
}

export function MyCouponsSection() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/coupons/my-coupons');
            const data = await res.json();
            if (data.success) {
                setCoupons(data.coupons);
            }
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    const unusedCoupons = coupons.filter(c => !c.is_used);
    const usedCoupons = coupons.filter(c => c.is_used);

    return (
        <div className="space-y-6">
            {/* Unused Coupons */}
            {unusedCoupons.length > 0 && (
                <div>
                    <h3 className="font-display text-xl font-bold text-[#404040] mb-4">Active Coupons</h3>
                    <div className="grid gap-4">
                        {unusedCoupons.map((coupon) => (
                            <motion.div
                                key={coupon.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 border-2 border-green-500 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-100 rounded-full">
                                            <Gift className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-bold text-green-700">₹{coupon.discount_amount}</span>
                                                <span className="text-sm text-gray-600">OFF</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">Valid on orders above ₹100</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span className="font-semibold">Active</span>
                                        </div>
                                        {coupon.expires_at && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>Expires: {new Date(coupon.expires_at).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Used Coupons */}
            {usedCoupons.length > 0 && (
                <div>
                    <h3 className="font-display text-xl font-bold text-[#404040] mb-4">Used Coupons</h3>
                    <div className="grid gap-4">
                        {usedCoupons.map((coupon) => (
                            <div
                                key={coupon.id}
                                className="p-6 border border-gray-300 rounded-xl bg-gray-50 opacity-60"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gray-200 rounded-full">
                                            <Gift className="w-6 h-6 text-gray-500" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold text-gray-600">₹{coupon.discount_amount}</span>
                                                <span className="text-sm text-gray-500">OFF</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <XCircle className="w-5 h-5" />
                                        <span className="font-semibold">Used</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {coupons.length === 0 && (
                <div className="text-center py-12">
                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-sans">No coupons yet</p>
                    <p className="text-sm text-gray-400 mt-2">Place orders above ₹500 to earn reward coupons!</p>
                </div>
            )}
        </div>
    );
}
