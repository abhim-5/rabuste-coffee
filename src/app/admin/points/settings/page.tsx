// Points System Global Settings
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Save, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

interface Config {
    id: number;
    system_enabled: boolean;
    earning_enabled: boolean;
    redemption_enabled: boolean;
    points_to_rupee_ratio: number;
    max_discount_percent: number;
    min_payable_amount: number;
    order_confirmation_delay_minutes: number;
    max_points_per_order: number;
    daily_earning_limit: number;
}

export default function PointsSettingsPage() {
    const { user } = useAuth();
    const [config, setConfig] = useState<Config | null>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('points_config')
                .select('*')
                .eq('id', 1)
                .single();

            if (error) throw error;
            setConfig(data);
        } catch (error) {
            console.error('Error fetching config:', error);
            setMessage({ type: 'error', text: 'Failed to load configuration' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;

        setSaving(true);
        setMessage(null);

        try {
            const supabase = createClient();

            const { error } = await supabase
                .from('points_config')
                .update({
                    ...config,
                    updated_by: user?.id,
                    updated_at: new Date().toISOString()
                })
                .eq('id', 1);

            if (error) throw error;

            // Log admin action
            await supabase.from('points_admin_actions').insert({
                admin_id: user?.id,
                action_type: 'config_change',
                details: { config }
            });

            setMessage({ type: 'success', text: 'Configuration saved successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving config:', error);
            setMessage({ type: 'error', text: 'Failed to save configuration' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
            </div>
        );
    }

    if (!config) return <div>Failed to load configuration</div>;

    const previewDiscount = (points: number) => {
        return (points / config.points_to_rupee_ratio).toFixed(2);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Global Settings</h1>
                <p className="text-gray-600 mt-1">Configure points system behavior and safety caps</p>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Master Controls */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Master Controls</h2>
                <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#D4AF37] cursor-pointer">
                        <div>
                            <p className="font-medium text-gray-900">Enable Points System</p>
                            <p className="text-sm text-gray-600">Master kill switch - disables entire system instantly</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={config.system_enabled}
                            onChange={(e) => setConfig({ ...config, system_enabled: e.target.checked })}
                            className="w-6 h-6 accent-[#D4AF37]"
                        />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#D4AF37] cursor-pointer">
                        <div>
                            <p className="font-medium text-gray-900">Enable Earning</p>
                            <p className="text-sm text-gray-600">Allow users to earn points from purchases</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={config.earning_enabled}
                            onChange={(e) => setConfig({ ...config, earning_enabled: e.target.checked })}
                            disabled={!config.system_enabled}
                            className="w-6 h-6 accent-[#D4AF37] disabled:opacity-50"
                        />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#D4AF37] cursor-pointer">
                        <div>
                            <p className="font-medium text-gray-900">Enable Redemption</p>
                            <p className="text-sm text-gray-600">Allow users to redeem points for discounts</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={config.redemption_enabled}
                            onChange={(e) => setConfig({ ...config, redemption_enabled: e.target.checked })}
                            disabled={!config.system_enabled}
                            className="w-6 h-6 accent-[#D4AF37] disabled:opacity-50"
                        />
                    </label>
                </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Conversion Rate</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Points to Rupee Ratio
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={config.points_to_rupee_ratio}
                            onChange={(e) => setConfig({ ...config, points_to_rupee_ratio: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                            {config.points_to_rupee_ratio} points = ₹1 discount
                        </p>
                    </div>

                    {/* Preview Calculator */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">💡 Preview:</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">100 points</p>
                                <p className="font-semibold">= ₹{previewDiscount(100)}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">500 points</p>
                                <p className="font-semibold">= ₹{previewDiscount(500)}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">1000 points</p>
                                <p className="font-semibold">= ₹{previewDiscount(1000)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Safety Caps */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Revenue Protection & Safety Caps</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Discount Percent Per Order
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={config.max_discount_percent}
                            onChange={(e) => setConfig({ ...config, max_discount_percent: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                            Points can cover maximum {config.max_discount_percent}% of order total
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Payable Amount (₹)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={config.min_payable_amount}
                            onChange={(e) => setConfig({ ...config, min_payable_amount: parseFloat(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                            Users must pay at least ₹{config.min_payable_amount} even with points
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Points Per Order
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={config.max_points_per_order}
                            onChange={(e) => setConfig({ ...config, max_points_per_order: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                            Prevent single large redemptions (security measure)
                        </p>
                    </div>
                </div>
            </div>

            {/* Abuse Prevention */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Abuse Prevention</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Order Confirmation Delay (minutes)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="120"
                            value={config.order_confirmation_delay_minutes}
                            onChange={(e) => setConfig({ ...config, order_confirmation_delay_minutes: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                            Award points {config.order_confirmation_delay_minutes} minutes after order completion (prevents cancel farming)
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font- medium text-gray-700 mb-2">
                            Daily Earning Limit (per user)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={config.daily_earning_limit}
                            onChange={(e) => setConfig({ ...config, daily_earning_limit: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                            Maximum points a user can earn per day (0 = unlimited)
                        </p>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-[#1a202c] text-white rounded-lg hover:bg-[#2d3748] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Configuration'}
                </button>

                <button
                    onClick={fetchConfig}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                    Reset Changes
                </button>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-900">
                    <p className="font-semibold">Configuration changes take effect immediately</p>
                    <p>All users will see updated behavior instantly. Test changes carefully.</p>
                </div>
            </div>
        </div>
    );
}
