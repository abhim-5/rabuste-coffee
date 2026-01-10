'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Upload, Save, Loader2, Palette, ChevronDown } from 'lucide-react';

interface AddArtModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface Artist {
    id: string;
    name: string;
    description: string | null;
}

export function AddArtModal({ isOpen, onClose, onSuccess }: AddArtModalProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    // Form State
    const [name, setName] = useState('');
    const [artistName, setArtistName] = useState('');
    const [artistDescription, setArtistDescription] = useState('');
    const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // Artist Autocomplete State
    const [artists, setArtists] = useState<Artist[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch artists on mount
    useEffect(() => {
        if (isOpen) {
            fetchArtists();
        }
    }, [isOpen]);

    // Filter artists based on input
    useEffect(() => {
        if (artistName.trim()) {
            const filtered = artists.filter(a => 
                a.name.toLowerCase().includes(artistName.toLowerCase())
            );
            setFilteredArtists(filtered);
        } else {
            setFilteredArtists(artists);
        }
    }, [artistName, artists]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchArtists = async () => {
        try {
            const res = await fetch('/api/artists');
            const data = await res.json();
            if (data.success) {
                setArtists(data.artists);
            }
        } catch (error) {
            console.error('Error fetching artists:', error);
        }
    };

    const handleSelectArtist = (artist: Artist) => {
        setSelectedArtistId(artist.id);
        setArtistName(artist.name);
        setArtistDescription(artist.description || '');
        setShowDropdown(false);
    };

    const handleArtistNameChange = (value: string) => {
        setArtistName(value);
        setSelectedArtistId(null); // Clear selection when manually typing
        setShowDropdown(true);
        
        // Clear description if typing new artist name
        const exactMatch = artists.find(a => a.name.toLowerCase() === value.toLowerCase());
        if (!exactMatch) {
            setArtistDescription('');
        }
    };

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let uploadedImagePath = '';

            // 1. Upload Image
            if (imageFile) {
                setUploading(true);
                const formData = new FormData();
                formData.append('file', imageFile);

                const uploadRes = await fetch('/api/admin/gallery/upload-image', {
                    method: 'POST',
                    body: formData
                });
                
                const uploadData = await uploadRes.json();
                if (!uploadData.success) throw new Error(uploadData.error || 'Image upload failed');
                
                uploadedImagePath = uploadData.filePath;
                setUploading(false);
            }

            // 2. Create Art Piece (API will handle artist creation if needed)
            const artData = {
                name,
                artist_id: selectedArtistId,
                artist_name: artistName,
                artist_description: artistDescription,
                description,
                price: parseFloat(price),
                image_url: uploadedImagePath || null,
                available: true
            };

            const createRes = await fetch('/api/gallery/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(artData)
            });

            const createResult = await createRes.json();
            if (!createResult.success) throw new Error(createResult.error || 'Failed to create art piece');

            onSuccess();
            onClose();
            
            // Reset form
            setName('');
            setArtistName('');
            setArtistDescription('');
            setSelectedArtistId(null);
            setDescription('');
            setPrice('');
            setImageFile(null);
            setPreviewUrl('');

        } catch (error) {
            console.error('Error adding art:', error);
            alert('Failed to add art piece: ' + (error as Error).message);
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    const isNewArtist = !selectedArtistId && artistName.trim().length > 0;

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-900">Add New Art Piece</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Image Upload */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group w-full h-48">
                            <div className={`w-full h-full rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${
                                previewUrl ? 'border-[#8B6F47] bg-white' : 'border-gray-300 bg-gray-50 hover:border-[#8B6F47] hover:bg-amber-50/30'
                            }`}>
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="text-center p-2">
                                        <Palette className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <span className="text-sm text-gray-500 font-medium">Click to Upload Artwork</span>
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
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B6F47] focus:border-[#8B6F47] outline-none"
                                placeholder="e.g. Sunset Dreams"
                            />
                        </div>

                        {/* Artist Autocomplete */}
                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Artist Name
                                {isNewArtist && (
                                    <span className="ml-2 text-xs font-normal text-green-600">(New Artist)</span>
                                )}
                            </label>
                            <div className="relative">
                                <input
                                    required
                                    type="text"
                                    value={artistName}
                                    onChange={(e) => handleArtistNameChange(e.target.value)}
                                    onFocus={() => setShowDropdown(true)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B6F47] focus:border-[#8B6F47] outline-none"
                                    placeholder="e.g. John Doe"
                                />
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Dropdown */}
                            {showDropdown && filteredArtists.length > 0 && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {filteredArtists.map(artist => (
                                        <button
                                            key={artist.id}
                                            type="button"
                                            onClick={() => handleSelectArtist(artist)}
                                            className="w-full px-4 py-2 text-left hover:bg-[#8B6F47]/10 transition-colors flex flex-col"
                                        >
                                            <span className="font-medium text-gray-900">{artist.name}</span>
                                            {artist.description && (
                                                <span className="text-xs text-gray-500 truncate">{artist.description}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Artist Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Artist Description / POV
                                {selectedArtistId && (
                                    <span className="ml-2 text-xs font-normal text-blue-600">(Auto-filled)</span>
                                )}
                            </label>
                            <textarea
                                value={artistDescription}
                                onChange={(e) => setArtistDescription(e.target.value)}
                                rows={2}
                                disabled={!!selectedArtistId}
                                className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B6F47] focus:border-[#8B6F47] outline-none resize-none ${
                                    selectedArtistId ? 'bg-gray-50 cursor-not-allowed' : ''
                                }`}
                                placeholder="Artist's perspective or biography..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                            <input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B6F47] focus:border-[#8B6F47] outline-none"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Artwork Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B6F47] focus:border-[#8B6F47] outline-none resize-none"
                                placeholder="Describe the artwork..."
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
                                    Add Artwork
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
