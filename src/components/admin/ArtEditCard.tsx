'use client';

import { useState } from 'react';
import { Edit2, Save, X, Upload, Eye, EyeOff, Trash2, Palette } from 'lucide-react';

interface ArtPiece {
    id: string;
    name: string;
    description: string;
    price: number;
    artist: string;
    image_url: string | null;
    available: boolean;
}

interface ArtEditCardProps {
    art: ArtPiece;
    onUpdate: (id: string, updates: Partial<ArtPiece>) => Promise<any>;
    onDelete: (id: string) => Promise<void>;
    onRefresh: () => void;
}

export function ArtEditCard({ art, onUpdate, onDelete, onRefresh }: ArtEditCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: art.name || '',
        description: art.description || '',
        price: art.price || 0,
        artist: art.artist || '',
        image_url: art.image_url
    });

    const getImageUrl = (url: string | null) => {
        if (!url) return '/gallery/default.jpg';
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${url.replace(/^\/+/, '')}`;
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate(art.id, formData);
            setIsEditing(false);
            onRefresh();
        } catch (error) {
            console.error('Failed to update art piece', error);
            alert('Failed to update art piece');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: art.name || '',
            description: art.description || '',
            price: art.price || 0,
            artist: art.artist || '',
            image_url: art.image_url
        });
        setIsEditing(false);
    };

    const toggleAvailable = async () => {
        try {
            await onUpdate(art.id, { available: !art.available });
            onRefresh();
        } catch (error) {
            alert('Failed to update availability');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('folder', 'gallery'); // Upload to gallery folder
        // We might not have a generic upload route exposed for gallery folder specifically configured?
        // Using same product upload endpoint but it might assume 'products' table or trigger something.
        // Better: reuse the existing one if generic, or create new.
        // Assuming `/api/admin/upload` exists or similar. 
        // Let's use `/api/admin/products/upload-image` but force it? No, that updates product.
        // I need a generic upload endpoint.
        // For now, I'll assume we can use the same pattern or I need to create `api/admin/gallery/upload-image`.
        // Let's create `api/admin/gallery/upload-image` separately in next step!
        // For this code, I will point to `/api/admin/gallery/upload-image`.
        
        try {
            const res = await fetch('/api/admin/gallery/upload-image', {
                method: 'POST',
                body: formDataUpload
            });
            const data = await res.json();
            if (data.success) {
                setFormData(prev => ({ ...prev, image_url: data.filePath }));
            } else {
                alert('Upload failed: ' + data.error);
            }
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Upload failed');
        } finally {
            setIsUploadingImage(false);
        }
    };

    return (
        <div className={`bg-white rounded-xl border transition h-full flex flex-col ${
            isEditing ? 'border-[#8B6F47] shadow-lg' : 'border-gray-100 shadow-sm hover:shadow-md'
        }`}>
            {/* Image Section */}
            <div className="relative aspect-[4/3] bg-gray-50">
                {formData.image_url ? (
                    <img
                        src={getImageUrl(formData.image_url)}
                        alt={art.name}
                        className="w-full h-full object-cover rounded-t-xl"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Palette size={40} opacity={0.3} />
                    </div>
                )}
                
                {/* Out of Stock Overlay */}
                {!art.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-xl backdrop-blur-sm z-10">
                        <div className="bg-white/90 text-red-600 px-3 py-1 rounded-full text-xs font-bold shadow-md uppercase">
                            Out of Stock / Sold
                        </div>
                    </div>
                )}

                {/* Edit Overlay / Upload */}
                {isEditing ? (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                         <label className="cursor-pointer bg-white p-3 rounded-full hover:bg-gray-100 transition shadow-lg">
                            {isUploadingImage ? <div className="animate-spin border-2 border-[#8B6F47] border-t-transparent w-5 h-5 rounded-full"/> : <Upload size={20} className="text-[#8B6F47]" />}
                            <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                         </label>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white font-medium z-20"
                    >
                        <Edit2 size={20} className="mr-2" /> Edit Art
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                {!isEditing ? (
                    <>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 leading-tight">{art.name}</h3>
                            <span className="font-bold text-[#8B6F47] shrink-0 ml-2">₹{art.price}</span>
                        </div>
                        <p className="text-xs text-[#8B6F47] font-medium mb-2">{art.artist}</p>
                        <p className="text-sm text-gray-500 mb-4 h-10 line-clamp-2 overflow-hidden">{art.description}</p>
                        
                        <div className="mt-auto flex items-center gap-2">
                            <button
                                onClick={toggleAvailable}
                                className={`flex-1 h-10 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
                                    art.available
                                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                        : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                                }`}
                            >
                                {art.available ? <><EyeOff size={16} /> Mark Sold/Hidden</> : <><Eye size={16} /> Mark Available</>}
                            </button>
                            <button
                                onClick={() => {
                                    if(confirm('Delete this art piece permanently?')) onDelete(art.id);
                                }}
                                className="h-10 px-3 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center shrink-0"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-3 flex-1 flex flex-col">
                        <input
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-[#8B6F47] focus:border-[#8B6F47]"
                            placeholder="Art Title"
                        />
                         <input
                            value={formData.artist}
                            onChange={e => setFormData({...formData, artist: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-[#8B6F47] focus:border-[#8B6F47]"
                            placeholder="Artist Name"
                        />
                        <input
                            type="number"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-[#8B6F47] focus:border-[#8B6F47]"
                            placeholder="Price"
                        />
                         <textarea
                            value={formData.description}
                             onChange={e => setFormData({...formData, description: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm h-20 resize-none focus:ring-[#8B6F47] focus:border-[#8B6F47]"
                            placeholder="Description"
                        />
                        <div className="flex gap-2 mt-auto pt-2">
                            <button onClick={handleSave} disabled={isSaving} className="flex-1 bg-[#8B6F47] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#725a39]">
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={handleCancel} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
