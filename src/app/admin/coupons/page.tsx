"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Gift,
    Plus,
    Edit2,
    Trash2,
    Power,
    PowerOff,
    TrendingUp,
    Tag,
} from "lucide-react";

interface Coupon {
    id: string;
    type: "cart_value" | "menu_limited";
    name: string;
    description: string;
    discount_amount: number;
    min_cart_value?: number;
    applicable_categories?: string[];
    is_active: boolean;
    created_at: string;
}

function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<{
        cart_coupons: { active: number; max: number; coupons: Coupon[] };
        menu_coupons: { active: number; max: number; coupons: Coupon[] };
        system_enabled: boolean;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await fetch("/api/admin/coupons");
            const data = await response.json();

            if (data.success) {
                setCoupons(data);
                setError(null);
            } else {
                setError(data.error || "Failed to load coupons");
            }
        } catch (err: any) {
            console.error("Error fetching coupons:", err);
            setError("Database tables may not exist. Run migrations first!");
        } finally {
            setLoading(false);
        }
    };

    const toggleCouponStatus = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/admin/coupons/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: !currentStatus }),
            });

            if (response.ok) {
                fetchCoupons();
            }
        } catch (error) {
            console.error("Error toggling coupon:", error);
        }
    };

    const deleteCoupon = async (id: string) => {
        if (!confirm("Deactivate this coupon?")) return;

        try {
            const response = await fetch(`/api/admin/coupons/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchCoupons();
            }
        } catch (error) {
            console.error("Error deleting coupon:", error);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="text-gray-600">Loading coupons...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                    <h2 className="text-xl font-bold text-red-900 mb-2">⚠️ Database Error</h2>
                    <p className="text-red-700 mb-4">{error}</p>
                    <div className="bg-white rounded-lg p-4 text-left text-sm">
                        <p className="font-semibold mb-2">Run these SQL migrations first:</p>
                        <ol className="list-decimal list-inside space-y-1 text-gray-700">
                            <li>sql/70-coupon-system.sql</li>
                            <li>sql/71-migrate-points-to-coupons.sql</li>
                            <li>sql/72-sample-coupons.sql (optional)</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Coupon Management</h1>
                    <p className="text-gray-600 mt-1">Manage promotional coupons</p>
                </div>
            </div>

            {/* Cart Coupons */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Cart Value Coupons ({coupons?.cart_coupons.active}/2)</h2>
                        <p className="text-sm text-gray-600">Triggered when cart reaches threshold</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {coupons?.cart_coupons.coupons.map((coupon) => (
                        <div
                            key={coupon.id}
                            className={`p-4 rounded-lg border-2 ${coupon.is_active ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-gray-900">{coupon.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${coupon.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                                            {coupon.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{coupon.description}</p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-green-600 font-semibold">₹{coupon.discount_amount} OFF</span>
                                        <span className="text-gray-500">Min cart: ₹{coupon.min_cart_value}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleCouponStatus(coupon.id, coupon.is_active)}
                                        className="p-2 hover:bg-white rounded-lg transition-colors"
                                    >
                                        {coupon.is_active ? (
                                            <PowerOff className="w-5 h-5 text-orange-600" />
                                        ) : (
                                            <Power className="w-5 h-5 text-green-600" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => deleteCoupon(coupon.id)}
                                        className="p-2 hover:bg-white rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {coupons?.cart_coupons.coupons.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No cart value coupons. Run sample-coupons.sql to create test data.
                        </div>
                    )}
                </div>
            </div>

            {/* Menu Coupons */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Menu Coupons ({coupons?.menu_coupons.active}/2)</h2>
                        <p className="text-sm text-gray-600">Apply to specific categories</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {coupons?.menu_coupons.coupons.map((coupon) => (
                        <div
                            key={coupon.id}
                            className={`p-4 rounded-lg border-2 ${coupon.is_active ? "border-purple-200 bg-purple-50" : "border-gray-200 bg-gray-50"}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-gray-900">{coupon.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${coupon.is_active ? "bg-purple-100 text-purple-700" : "bg-gray-200 text-gray-600"}`}>
                                            {coupon.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{coupon.description}</p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-purple-600 font-semibold">₹{coupon.discount_amount} OFF</span>
                                        <span className="text-gray-500">
                                            {coupon.applicable_categories?.join(", ") || "All"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleCouponStatus(coupon.id, coupon.is_active)}
                                        className="p-2 hover:bg-white rounded-lg"
                                    >
                                        {coupon.is_active ? (
                                            <PowerOff className="w-5 h-5 text-orange-600" />
                                        ) : (
                                            <Power className="w-5 h-5 text-purple-600" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => deleteCoupon(coupon.id)}
                                        className="p-2 hover:bg-white rounded-lg"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {coupons?.menu_coupons.coupons.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No menu coupons. Run sample-coupons.sql to create test data.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminCouponsPage;
