'use client';

import { useState } from 'react';
import { X, Upload, Save, Loader2 } from 'lucide-react';
import { MenuCategory } from '@/types/menu';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CATEGORIES: { id: MenuCategory; label: string }[] = [
    { id: "robusta-cold", label: "Robusta Cold" },
    { id: "robusta-hot", label: "Robusta Hot" },
    { id: "blend-cold", label: "Blend Cold" },
    { id: "blend-hot", label: "Blend Hot" },
    { id: "manual-brew", label: "Manual Brew" },
    { id: "shakes-tea", label: "Shakes & Tea" },
    { id: "food", label: "Food" },
];

export function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<MenuCategory>('robusta-cold');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState(''); // Can act as preview or manual URL

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImageUrl(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalImageUrl = '';

            // 1. Upload Image first if selected
            if (imageFile) {
                setUploading(true);
                const formData = new FormData();
                formData.append('file', imageFile);
                
                // We use a temporary ID or just "new" for path generation in the upload generic API if possible, 
                // OR we create the product first then upload. 
                // BUT the upload endpoint (as seen in ProductEditCard) expects a productId usually for naming folder?
                // Looking at ProductEditCard: `/api/admin/products/upload-image` uses `productId`. 
                // Ideally, we should create product -> get ID -> upload image -> update product.
                
                // Let's create product WITHOUT image first
            }

            // Create Product
            const productData = {
                name,
                description,
                price: parseFloat(price),
                category,
                image_url: null as string | null // Will update later if image uploaded
            };

            const createResponse = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            const createResult = await createResponse.json();
            if (!createResult.success) throw new Error(createResult.error || 'Failed to create product');

            const newProductId = createResult.product.id;

            // 2. Now Upload Image if exists using the new ID
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('productId', newProductId);

                const uploadResponse = await fetch('/api/admin/products/upload-image', {
                    method: 'POST',
                    body: formData
                });
                
                const uploadResult = await uploadResponse.json();
                if (uploadResult.success) {
                    // Update the product with the image path
                    await fetch('/api/admin/products/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            productId: newProductId, 
                            image_url: uploadResult.filePath 
                        })
                    });
                }
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">Add New Item</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Image Upload */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group w-32 h-32">
                            <div className={`w-full h-full rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${
                                imageUrl ? 'border-[#8B6F47] bg-white' : 'border-gray-300 bg-gray-50 hover:border-[#8B6F47] hover:bg-amber-50/30'
                            }`}>
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-2">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <span className="text-xs text-gray-500 font-medium">Upload Image</span>
                                    </div>
                                )}
                            </div>
                            
                            <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B6F47] focus:border-[#8B6F47] outline-none transition-all"
                                placeholder="e.g. Classic Cold Coffee"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B6F47] focus:border-[#8B6F47] outline-none transition-all"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as MenuCategory)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B6F47] focus:border-[#8B6F47] outline-none transition-all bg-white"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B6F47] focus:border-[#8B6F47] outline-none transition-all resize-none"
                                placeholder="Describe the item..."
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 rounded-xl bg-[#8B6F47] text-white font-semibold hover:bg-[#725a39] active:scale-[0.98] transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {uploading ? 'Uploading...' : 'Saving...'}
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Add Item
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
