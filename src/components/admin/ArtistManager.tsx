'use client';

import { useState, useEffect } from 'react';
import { Edit2, Save, X, Users, AlertCircle } from 'lucide-react';

interface Artist {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
}

export function ArtistManager() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ name: '', description: '' });
    const [saving, setSaving] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const INITIAL_DISPLAY_COUNT = 3;

    useEffect(() => {
        fetchArtists();
    }, []);

    const fetchArtists = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/artists');
            const data = await res.json();
            if (data.success) {
                setArtists(data.artists);
            }
        } catch (error) {
            console.error('Error fetching artists:', error);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (artist: Artist) => {
        setEditingId(artist.id);
        setEditForm({
            name: artist.name,
            description: artist.description || ''
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: '', description: '' });
    };

    const saveEdit = async (id: string) => {
        setSaving(true);
        try {
            const res = await fetch('/api/artists', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    name: editForm.name,
                    description: editForm.description
                })
            });

            const data = await res.json();
            if (data.success) {
                await fetchArtists();
                setEditingId(null);
            } else {
                alert('Failed to update artist: ' + data.error);
            }
        } catch (error) {
            console.error('Error updating artist:', error);
            alert('Failed to update artist');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <Users className="w-5 h-5 text-[#8B6F47]" />
                <h3 className="text-lg font-semibold text-gray-900">Artist Management</h3>
                <span className="ml-auto text-sm text-gray-500">{artists.length} artists</span>
            </div>

            <div className="p-4">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B6F47]"></div>
                    </div>
                ) : artists.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>No artists yet. Add your first artwork to create an artist.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {(showAll ? artists : artists.slice(0, INITIAL_DISPLAY_COUNT)).map(artist => (
                            <div
                                key={artist.id}
                                className={`border rounded-lg p-4 transition ${
                                    editingId === artist.id
                                        ? 'border-[#8B6F47] bg-amber-50/30'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {editingId === artist.id ? (
                                    // Edit Mode
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Artist Name
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#8B6F47] focus:border-[#8B6F47] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Description / POV
                                            </label>
                                            <textarea
                                                value={editForm.description}
                                                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#8B6F47] focus:border-[#8B6F47] outline-none resize-none"
                                                placeholder="Artist's perspective or biography..."
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 pt-2">
                                            <div className="flex-1 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                                <AlertCircle size={14} />
                                                <span>Changes will affect all artworks by this artist</span>
                                            </div>
                                            <button
                                                onClick={() => saveEdit(artist.id)}
                                                disabled={saving}
                                                className="px-4 py-2 bg-[#8B6F47] text-white text-sm font-semibold rounded-lg hover:bg-[#725a39] transition disabled:opacity-50 flex items-center gap-2"
                                            >
                                                <Save size={14} />
                                                {saving ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-1">{artist.name}</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {artist.description || <span className="italic text-gray-400">No description yet</span>}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => startEdit(artist)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition shrink-0"
                                            title="Edit Artist"
                                        >
                                            <Edit2 size={16} className="text-gray-600" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Show More/Less Button */}
                        {artists.length > INITIAL_DISPLAY_COUNT && (
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="w-full py-2 text-sm font-medium text-[#8B6F47] hover:text-[#725a39] hover:bg-amber-50 rounded-lg transition"
                            >
                                {showAll ? `Show Less` : `Show ${artists.length - INITIAL_DISPLAY_COUNT} More Artists`}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
