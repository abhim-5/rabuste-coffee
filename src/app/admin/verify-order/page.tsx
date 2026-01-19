'use client';

import { useState } from 'react';
import { QrCode, CheckCircle, XCircle, Package, AlertCircle, Camera } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import QRScanner to avoid SSR issues
const QRScanner = dynamic(() => import('@/components/admin/QRScanner'), { ssr: false });

interface OrderItem {
    menu_item_name: string;
    variation_name: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

interface VerifiedOrder {
    id: string;
    orderNumber: string;
    orderType: string;
    status: string;
    paymentStatus: string;
    total: number;
    customerName: string;
    customerEmail: string;
    createdAt: string;
    items: OrderItem[];
}

export default function VerifyOrderPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifiedOrder, setVerifiedOrder] = useState<VerifiedOrder | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showScanner, setShowScanner] = useState(false); // Camera scanner toggle

    const verifyOrder = async (code: string) => {
        setLoading(true);
        setError(null);
        setVerifiedOrder(null);
        setSuccessMessage(null);

        try {
            const response = await fetch('/api/admin/verify-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderNumber: code })
            });

            const data = await response.json();

            if (data.success && data.valid) {
                setVerifiedOrder(data.order);
            } else {
                setError(data.error || 'Order verification failed');
            }
        } catch (err: any) {
            setError('Failed to verify order. Please try again.');
            console.error('Verification error:', err);
        } finally {
            setLoading(false);
        }
    };

    const markPickup = async () => {
        if (!verifiedOrder) return;

        setLoading(true);
        try {
            const response = await fetch('/api/admin/mark-pickup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: verifiedOrder.id })
            });

            const data = await response.json();

            if (data.success) {
                setSuccessMessage(`Order ${verifiedOrder.orderNumber} marked as picked up!`);
                setVerifiedOrder(null);
                setOrderNumber('');

                // Auto-clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                setError(data.error || 'Failed to mark pickup');
            }
        } catch (err: any) {
            setError('Failed to mark pickup. Please try again.');
            console.error('Markup pickup error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderNumber.trim()) {
            verifyOrder(orderNumber.trim().toUpperCase());
        }
    };

    const handleQRScan = () => {
        // Parse URL from QR scanner (format: .../verify-order?code=RC123456)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            setOrderNumber(code);
            verifyOrder(code);
            // Clear URL parameter
            window.history.pushState({}, '', '/admin/verify-order');
        }
    };

    // Check for QR code in URL on mount
    useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            setOrderNumber(code);
            verifyOrder(code);
            window.history.pushState({}, '', '/admin/verify-order');
        }
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Verification</h1>
                <p className="text-gray-600 mt-1">Scan or enter order code to verify pickup</p>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <p className="text-green-800 font-medium">{successMessage}</p>
                </div>
            )}

            {/* Manual Entry Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    Enter Order Code
                </h2>
                <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            Order Number
                        </label>
                        <input
                            type="text"
                            id="orderNumber"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                            placeholder="RC123456"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B6F47] focus:border-transparent text-lg font-mono"
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !orderNumber.trim()}
                        className="w-full bg-[#8B6F47] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6d5638] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Verifying...' : 'Verify Order'}
                    </button>
                </form>

                {/* Camera Scanner Button */}
                <div className="mt-4 flex gap-3">
                    <button
                        onClick={() => setShowScanner(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-md"
                    >
                        <Camera className="w-5 h-5" />
                        Scan QR with Camera
                    </button>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Users can scan their QR code to auto-fill this field</span>
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <XCircle className="w-6 h-6 text-red-600" />
                    <div>
                        <p className="text-red-800 font-medium">{error}</p>
                        <button
                            onClick={() => {
                                setError(null);
                                setOrderNumber('');
                            }}
                            className="text-sm text-red-600 hover:text-red-800 underline mt-1"
                        >
                            Clear and try again
                        </button>
                    </div>
                </div>
            )}

            {/* Verified Order Details */}
            {verifiedOrder && (
                <div className="bg-white rounded-lg border-2 border-green-500 shadow-lg">
                    {/* Header */}
                    <div className="bg-green-50 px-6 py-4 border-b border-green-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                                <div>
                                    <h3 className="text-xl font-bold text-green-900">Order Verified</h3>
                                    <p className="text-sm text-green-700">Order #{verifiedOrder.orderNumber}</p>
                                </div>
                            </div>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                PAID
                            </span>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Name</p>
                                <p className="font-medium text-gray-900">{verifiedOrder.customerName}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Email</p>
                                <p className="font-medium text-gray-900">{verifiedOrder.customerEmail}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Order Type</p>
                                <p className="font-medium text-gray-900 capitalize">
                                    {verifiedOrder.orderType.replace('-', ' ')}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Order Time</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(verifiedOrder.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Order Items ({verifiedOrder.items.length})
                        </h4>
                        <div className="space-y-2">
                            {verifiedOrder.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{item.menu_item_name}</p>
                                        {item.variation_name && (
                                            <p className="text-sm text-gray-600">Variation: {item.variation_name}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        <p className="font-semibold text-gray-900">₹{item.subtotal.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                            <span className="text-2xl font-bold text-green-700">₹{verifiedOrder.total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="px-6 py-4">
                        <button
                            onClick={markPickup}
                            disabled={loading}
                            className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Marking...' : '✓ Confirm Order Picked Up'}
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            This will mark the order as completed and prevent reuse
                        </p>
                    </div>
                </div>
            )}

            {/* Instructions */}
            {!verifiedOrder && !error && !successMessage && (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">How to verify orders:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        <li>Customer shows QR code from their receipt or phone</li>
                        <li>Scan the QR code (it will auto-fill the order number)</li>
                        <li>Or manually enter the order number from the receipt</li>
                        <li>System will verify payment, status, and show order details</li>
                        <li>Check items match the customer's order</li>
                        <li>Click "Confirm Order Picked Up" to complete</li>
                    </ol>
                </div>
            )}

            {/* QR Camera Scanner Modal */}
            {showScanner && (
                <QRScanner
                    onScan={(data) => {
                        // Parse QR data - can be either full URL or just order number
                        try {
                            const url = new URL(data);
                            const code = url.searchParams.get('code');
                            if (code) {
                                setOrderNumber(code);
                                verifyOrder(code);
                            }
                        } catch {
                            // Not a URL, treat as order number directly
                            if (data.startsWith('RC')) {
                                setOrderNumber(data);
                                verifyOrder(data);
                            }
                        }
                        setShowScanner(false);
                    }}
                    onClose={() => setShowScanner(false)}
                />
            )}
        </div>
    );
}
