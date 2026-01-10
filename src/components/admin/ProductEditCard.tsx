// Product Edit Card Component for Admin Menu
'use client';

import { useState, useEffect } from 'react';
import { Edit2, Save, X, Upload, Tag, Eye, EyeOff, Calendar, AlertCircle, Trash2 } from 'lucide-react';
import { MenuItem } from '@/types/menu';

interface ProductEditCardProps {
    product: MenuItem;
    onUpdate: (productId: string, updates: Partial<MenuItem>) => Promise<any>;
    onRefresh: () => void;
    onDelete?: (productId: string) => Promise<void>; 
}

export function ProductEditCard({ product, onUpdate, onRefresh, onDelete }: ProductEditCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        name: product.name,
        description: product.description || '',
        price: product.price,
        discount_price: product.discount_price || null,
        crossed_price: product.crossed_price || null,
        is_deal_of_day: product.is_deal_of_day || false,
        deal_expiry: product.deal_expiry || null,
        available: product.available !== false,
        image_url: product.image_url
    });

    // Smart Pricing Logic State
    const [pricing, setPricing] = useState({
        sellingPrice: product.discount_price || product.price,
        originalPrice: product.crossed_price || product.price, // Default original to price if not crossed
        discountPercent: 0
    });

    // Initialize pricing state on edit start or product change
    useEffect(() => {
        // Let's rely on formData for initialization to be safe across edits
        const currentSelling = formData.discount_price || formData.price;
        const currentOriginal = formData.crossed_price || (formData.discount_price ? formData.price : currentSelling);
        
        let initialDiscount = 0;
        if (currentOriginal > currentSelling) {
            initialDiscount = Math.round(((currentOriginal - currentSelling) / currentOriginal) * 100);
        }

        setPricing({
            sellingPrice: currentSelling,
            originalPrice: currentOriginal,
            discountPercent: initialDiscount
        });
    }, [product, formData, isEditing]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('File too large. Maximum size is 5MB.');
            return;
        }

        // Validate file type
        if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
            alert('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
            return;
        }

        setIsUploadingImage(true);
        try {
            // Step 1: Delete old image if it exists in Supabase Storage
            if (product.image_url && product.image_url.startsWith('product-images/')) {
                try {
                    const deleteResponse = await fetch('/api/admin/products/delete-image', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ filePath: product.image_url })
                    });
                    
                    if (!deleteResponse.ok) {
                        console.warn('Failed to delete old image, continuing with upload');
                    }
                } catch (deleteError) {
                    console.warn('Error deleting old image:', deleteError);
                    // Continue with upload even if delete fails
                }
            }

            // Step 2: Upload new image
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            uploadFormData.append('productId', product.id);

            const response = await fetch('/api/admin/products/upload-image', {
                method: 'POST',
                body: uploadFormData
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to upload image');
            }

            // Step 3: Update form data with new image URL (keep full path)
            setFormData(prev => ({ ...prev, image_url: data.filePath }));

            // Step 4: Auto-save the new image URL
            await onUpdate(product.id, { image_url: data.filePath });
            onRefresh();
            
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Image upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Map smart pricing back to DB columns
            let updates = { ...formData }; // Clone
            
            // Apply pricing logic finalization
            if (pricing.originalPrice > pricing.sellingPrice) {
                // Determine it's a deal
                updates.discount_price = pricing.sellingPrice;
                updates.crossed_price = pricing.originalPrice;
                updates.price = pricing.originalPrice; // Keep base price as original for consistency
            } else {
                // No deal
                updates.discount_price = null;
                updates.crossed_price = null;
                updates.price = pricing.sellingPrice;
            }

            await onUpdate(product.id, updates);
            setIsEditing(false);
            onRefresh();
        } catch (error) {
            alert('Failed to update product');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            discount_price: product.discount_price || null,
            crossed_price: product.crossed_price || null,
            is_deal_of_day: product.is_deal_of_day || false,
            deal_expiry: product.deal_expiry || null,
            available: product.available !== false,
            image_url: product.image_url
        });
        setIsEditing(false);
    };

    const displayPrice = formData.discount_price || formData.price;
    const showCrossedPrice = formData.discount_price ? (formData.crossed_price || formData.price) : formData.crossed_price;
    const discountPercent = (displayPrice && showCrossedPrice && showCrossedPrice > displayPrice) 
        ? Math.round(((showCrossedPrice - displayPrice) / showCrossedPrice) * 100) 
        : 0;

    // Generate correct image URL
    const getImageUrl = (imageUrl: string | undefined) => {
        if (!imageUrl) return null;
        
        // Check if it's a Supabase Storage path
        if (imageUrl.startsWith('product-images/')) {
            return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${imageUrl}`;
        }
        
        // Legacy local path
        return `/menu-images/${imageUrl}`;
    };

    // Quick toggles
    const toggleAvailable = async () => {
        await onUpdate(product.id, { available: !product.available });
        onRefresh();
    };

    // Smart Pricing Handlers
    const updateSellingPrice = (val: number) => {
        const newSelling = val;
        let newDiscount = 0;
        if (pricing.originalPrice > newSelling && pricing.originalPrice > 0) {
            newDiscount = Math.round(((pricing.originalPrice - newSelling) / pricing.originalPrice) * 100);
        }
        setPricing({ ...pricing, sellingPrice: newSelling, discountPercent: newDiscount });
    };

    const updateOriginalPrice = (val: number) => {
        const newOriginal = val;
        let newDiscount = 0;
        if (newOriginal > pricing.sellingPrice && newOriginal > 0) {
            newDiscount = Math.round(((newOriginal - pricing.sellingPrice) / newOriginal) * 100);
        }
        setPricing({ ...pricing, originalPrice: newOriginal, discountPercent: newDiscount });
    };

    const updateDiscount = (val: number) => {
        const newDiscount = val;
        // Calculate new selling price based on original
        const newSelling = Math.round(pricing.originalPrice * (1 - (newDiscount / 100)));
        setPricing({ ...pricing, discountPercent: newDiscount, sellingPrice: newSelling });
    };

    return (
        <div className={`bg-white rounded-xl border transition ${
            isEditing ? 'border-[#8B6F47] shadow-lg' : 'border-gray-100 shadow-sm hover:shadow-md'
        }`}>
            {/* ... image section ... */}
            <div className="relative aspect-square">
                {formData.image_url ? (
                    <img
                        src={getImageUrl(formData.image_url) || ''}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-t-xl"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 rounded-t-xl flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                    </div>
                )}

                {/* Dynamic Deal Label (Top-Left) */}
                {discountPercent > 0 && product.available && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm z-10">
                        DEAL {discountPercent}% OFF
                    </div>
                )}

                {/* Out of Stock Overlay (Center/Visble) */}
                {!product.available && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-t-xl z-10 backdrop-blur-[1px]">
                         <div className="bg-white/90 text-red-600 px-4 py-2 rounded-full text-xs font-bold shadow-lg uppercase tracking-wider flex items-center gap-2">
                            <AlertCircle size={16} />
                            Out of Stock
                        </div>
                    </div>
                )}

                {/* Edit Overlay or Image Upload */}
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white gap-2 z-20"
                    >
                        <Edit2 size={20} />
                        <span>Edit Product</span>
                    </button>
                ) : (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
                        <label 
                            htmlFor={`image-upload-${product.id}`}
                            className="cursor-pointer bg-white/90 hover:bg-white p-3 rounded-full transition flex items-center gap-2"
                        >
                            {isUploadingImage ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-[#8B6F47] border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm font-medium">Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <Upload size={20} className="text-[#8B6F47]" />
                                    <span className="text-sm font-medium text-gray-700">Change Image</span>
                                </>
                            )}
                        </label>
                        <input
                            id={`image-upload-${product.id}`}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={isUploadingImage}
                        />
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="p-4">
                {!isEditing ? (
                    // View Mode
                    <>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 h-10 line-clamp-2">{product.description}</p>
                        
                        {/* Pricing */}
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-2xl font-bold text-[#8B6F47]">
                                ₹{displayPrice}
                            </span>
                            {showCrossedPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                    ₹{showCrossedPrice}
                                </span>
                            )}
                        </div>

                        {/* Quick Actions - Simplified */}
                        <div className="w-full flex items-center gap-2">
                            <button
                                onClick={toggleAvailable}
                                className={`flex-1 h-10 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
                                    product.available
                                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                        : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                                }`}
                            >
                                {product.available ? (
                                    <>
                                        <EyeOff size={16} />
                                        Out of Stock
                                    </>
                                ) : (
                                    <>
                                        <Eye size={16} />
                                        In Stock
                                    </>
                                )}
                            </button>
                            
                            {/* Delete Button */}
                            {onDelete && (
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
                                            onDelete(product.id as string);
                                        }
                                    }}
                                    className="h-10 px-3 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center shrink-0"
                                    title="Delete Product"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    // Edit Mode
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47]"
                            placeholder="Product Name"
                        />

                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47]"
                            rows={2}
                            placeholder="Description"
                        />

                        {/* Smart Pricing Inputs */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-2">Pricing</div>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="text-[10px] text-gray-500 font-semibold">Selling Price (₹)</label>
                                    <input
                                        type="number"
                                        value={pricing.sellingPrice}
                                        onChange={(e) => updateSellingPrice(parseFloat(e.target.value) || 0)}
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-bold text-[#8B6F47] focus:outline-none focus:ring-2 focus:ring-[#8B6F47]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 font-semibold">Original Price (₹)</label>
                                    <input
                                        type="number"
                                        value={pricing.originalPrice}
                                        onChange={(e) => updateOriginalPrice(parseFloat(e.target.value) || 0)}
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B6F47]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 font-semibold">Discount (%)</label>
                                    <input
                                        type="number"
                                        value={pricing.discountPercent}
                                        onChange={(e) => updateDiscount(parseFloat(e.target.value) || 0)}
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-red-500 font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Deal of Day Options */}
                        <div className="flex items-center justify-between border-t pt-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_deal_of_day}
                                    onChange={(e) => setFormData({ ...formData, is_deal_of_day: e.target.checked })}
                                    className="w-4 h-4 text-[#8B6F47] rounded focus:ring-[#8B6F47]"
                                />
                                <span className="text-sm font-medium text-gray-700">Set as Deal of Day (Timed)</span>
                            </label>
                        </div>

                        {/* Deal Expiry */}
                        {formData.is_deal_of_day && (
                            <div className="bg-amber-50 p-2 rounded border border-amber-200">
                                <label className="text-xs text-amber-800 font-semibold flex items-center gap-1 mb-1">
                                    <Calendar size={12} />
                                    Deal Deadline
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.deal_expiry || ''}
                                    onChange={(e) => setFormData({ ...formData, deal_expiry: e.target.value || null })}
                                    className="w-full px-2 py-1 border border-amber-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                                />
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 bg-[#8B6F47] text-white py-2 rounded-lg hover:bg-[#6d5738] transition flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
                            >
                                <Save size={16} />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 font-medium"
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
