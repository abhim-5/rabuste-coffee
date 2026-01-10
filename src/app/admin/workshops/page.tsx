// Workshops Management Page - WITH REAL DATABASE DATA
'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import StatCard from '@/components/admin/StatCard';
import { GraduationCap, Users, TrendingUp, DollarSign, Clock, Mail, Phone, Instagram, Check, X, AlertCircle, Eye, Edit, Trash2, Save, Plus, RefreshCw, Upload } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface WorkshopData {
    workshop_id: string;
    title: string;
    instructor: string;
    start_date: string;
    price: number;
    max_spots: number;
    available_spots: number;
    capacity: number;
    bookings: number;
    booking_rate: number;
    revenue: number;
    start_time?: string;
    duration?: string;
    level?: string;
    description?: string;
}

interface WorkshopRequest {
    id: string;
    user_id: string | null;
    name: string;
    email: string;
    phone: string;
    workshop_theme: string;
    additional_details: string | null;
    instagram_handle: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    created_at: string;
}

interface Registration {
    id: string;
    name: string;
    email: string;
    phone: string;
    booking_number: string;
    status: string;
    created_at: string;
}

export default function WorkshopsPage() {
    const [workshops, setWorkshops] = useState<WorkshopData[]>([]);
    const [workshopRequests, setWorkshopRequests] = useState<WorkshopRequest[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [requestsLoading, setRequestsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    
    // Modal states
    const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
    const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [registrationsLoading, setRegistrationsLoading] = useState(false);
    
    // Edit modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingWorkshop, setEditingWorkshop] = useState<any>(null);
    
    // Delete confirmation
    const [workshopToDelete, setWorkshopToDelete] = useState<string | null>(null);
    
    // Approval with workshop selection
    const [approvingRequest, setApprovingRequest] = useState<WorkshopRequest | null>(null);
    const [selectedWorkshopForApproval, setSelectedWorkshopForApproval] = useState<string>('');
    
    // Create new workshop
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newWorkshop, setNewWorkshop] = useState<any>({
        title: '',
        instructor: '',
        start_date: '',
        start_time: '',
        duration: '',
        price: 0,
        max_spots: 20,
        available_spots: 20,
        level: '',
        description: '',
    });

    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImageForCreate, setSelectedImageForCreate] = useState<File | null>(null);
    const [selectedImageForEdit, setSelectedImageForEdit] = useState<File | null>(null);
    const [imagePreviewForCreate, setImagePreviewForCreate] = useState<string>('');
    const [imagePreviewForEdit, setImagePreviewForEdit] = useState<string>('');

    useEffect(() => {
        fetchData();
        fetchWorkshopRequests();

        // Set up real-time subscription for new workshop requests
        const supabase = createClient();
        const channel = supabase
            .channel('workshop-requests-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'workshop_requests' },
                () => {
                    fetchWorkshopRequests();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchData = async () => {
        try {
            const supabase = createClient();

            // Get all workshops with registrations
            const { data: workshopsData } = await supabase
                .from('workshops')
                .select(`
          *,
          workshop_registrations (id)
        `)
                .order('start_date', { ascending: false });

            const workshopAnalytics = (workshopsData || []).map((workshop: any) => {
                const bookings = workshop.workshop_registrations?.length || 0;
                const capacity = workshop.max_spots || 0;
                const bookingRate = capacity > 0 ? (bookings / capacity) * 100 : 0;
                const revenue = bookings * Number(workshop.price);

                return {
                    workshop_id: workshop.id,
                    title: workshop.title,
                    instructor: workshop.instructor,
                    start_date: workshop.start_date,
                    start_time: workshop.start_time,
                    duration: workshop.duration,
                    level: workshop.level,
                    description: workshop.description,
                    price: workshop.price,
                    max_spots: workshop.max_spots,
                    available_spots: workshop.available_spots,
                    capacity,
                    bookings,
                    booking_rate: Number(bookingRate.toFixed(2)),
                    revenue: Number(revenue.toFixed(2))
                };
            });

            setWorkshops(workshopAnalytics);

            // Calculate stats
            const totalBookings = workshopAnalytics.reduce((sum, w) => sum + w.bookings, 0);
            const totalRevenue = workshopAnalytics.reduce((sum, w) => sum + w.revenue, 0);
            const avgBookingRate = workshopAnalytics.length > 0
                ? workshopAnalytics.reduce((sum, w) => sum + w.booking_rate, 0) / workshopAnalytics.length
                : 0;

            setStats({
                total: workshopAnalytics.length,
                bookings: totalBookings,
                revenue: totalRevenue,
                avg_booking_rate: avgBookingRate
            });

        } catch (error) {
            console.error('Error fetching workshops:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkshopRequests = async () => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('workshop_requests')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setWorkshopRequests(data || []);
        } catch (error) {
            console.error('Error fetching workshop requests:', error);
        } finally {
            setRequestsLoading(false);
        }
    };

    const fetchRegistrations = async (workshopId: string) => {
        setRegistrationsLoading(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('workshop_registrations')
                .select('*')
                .eq('workshop_id', workshopId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRegistrations(data || []);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            alert('Failed to load registrations');
        } finally {
            setRegistrationsLoading(false);
        }
    };

    const handleViewRegistrations = (workshopId: string) => {
        setSelectedWorkshopId(workshopId);
        setShowRegistrationsModal(true);
        fetchRegistrations(workshopId);
    };

    const handleEditWorkshop = (workshop: WorkshopData) => {
        setEditingWorkshop(workshop);
        setShowEditModal(true);
    };

    const handleSaveWorkshop = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const supabase = createClient();
            
            let imageUrl = editingWorkshop.image_url || '';
            if (selectedImageForEdit) {
                // Delete old image if it exists
                if (editingWorkshop.image_url) {
                    await deleteImageFromSupabase(editingWorkshop.image_url);
                }
                // Upload new image
                const uploadedUrl = await uploadImageToSupabase(selectedImageForEdit);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }
            
            const { error } = await supabase
                .from('workshops')
                .update({
                    title: editingWorkshop.title,
                    instructor: editingWorkshop.instructor,
                    start_date: editingWorkshop.start_date,
                    start_time: editingWorkshop.start_time,
                    duration: editingWorkshop.duration,
                    price: editingWorkshop.price,
                    max_spots: editingWorkshop.max_spots,
                    available_spots: editingWorkshop.available_spots,
                    level: editingWorkshop.level,
                    image_url: imageUrl,
                })
                .eq('id', editingWorkshop.workshop_id);

            if (error) throw error;
            
            setShowEditModal(false);
            setEditingWorkshop(null);
            setSelectedImageForEdit(null);
            setImagePreviewForEdit('');
            fetchData();
            alert('Workshop updated successfully!');
        } catch (error) {
            console.error('Error updating workshop:', error);
            alert('Failed to update workshop');
        }
    };

    const handleDeleteWorkshop = async (workshopId: string) => {
        if (!confirm('Are you sure you want to delete this workshop? This action cannot be undone.')) {
            return;
        }

        try {
            const supabase = createClient();
            
            // Check if workshop has registrations
            const { data: regs } = await supabase
                .from('workshop_registrations')
                .select('id')
                .eq('workshop_id', workshopId);

            if (regs && regs.length > 0) {
                if (!confirm(`This workshop has ${regs.length} registration(s). Are you absolutely sure you want to delete it?`)) {
                    return;
                }
            }

            const { error } = await supabase
                .from('workshops')
                .delete()
                .eq('id', workshopId);

            if (error) throw error;
            
            setWorkshops(prev => prev.filter(w => w.workshop_id !== workshopId));
            alert('Workshop deleted successfully!');
        } catch (error) {
            console.error('Error deleting workshop:', error);
            alert('Failed to delete workshop');
        }
    };

    const handleApproveClick = (request: WorkshopRequest) => {
        setApprovingRequest(request);
        setSelectedWorkshopForApproval('');
    };

    const handleApproveWithWorkshop = async () => {
        if (!approvingRequest || !selectedWorkshopForApproval) {
            alert('Please select a workshop');
            return;
        }

        try {
            const supabase = createClient();
            
            // Get selected workshop
            const workshop = workshops.find(w => w.workshop_id === selectedWorkshopForApproval);
            if (!workshop) {
                alert('Workshop not found');
                return;
            }

            // Check available spots
            if (workshop.available_spots <= 0) {
                alert('No available spots in this workshop!');
                return;
            }

            // Update request status
            const { error: requestError } = await supabase
                .from('workshop_requests')
                .update({ status: 'approved' })
                .eq('id', approvingRequest.id);

            if (requestError) throw requestError;

            // Create registration entry
            const bookingNumber = `WS-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
            const { error: regError } = await supabase
                .from('workshop_registrations')
                .insert({
                    workshop_id: selectedWorkshopForApproval,
                    user_id: approvingRequest.user_id,
                    name: approvingRequest.name,
                    email: approvingRequest.email,
                    phone: approvingRequest.phone,
                    booking_number: bookingNumber,
                    status: 'pending'
                });

            if (regError) throw regError;

            // Clear states and refresh
            setApprovingRequest(null);
            setSelectedWorkshopForApproval('');
            setWorkshopRequests(prev => prev.filter(req => req.id !== approvingRequest.id));
            fetchData(); // Refresh workshops to update available spots
            alert('Request approved! Registration created with pending status.');
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Failed to approve request. Please try again.');
            fetchWorkshopRequests();
            fetchData();
        }
    };

    const handleReject = async (id: string) => {
        try {
            const supabase = createClient();
            
            // Optimistic update
            setWorkshopRequests(prev => prev.filter(req => req.id !== id));

            const { error } = await supabase
                .from('workshop_requests')
                .update({ status: 'rejected' })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error rejecting request:', error);
            // Revert on error
            fetchWorkshopRequests();
            alert('Failed to reject request. Please try again.');
        }
    };

    const handleToggleRegistrationStatus = async (registrationId: string, currentStatus: string) => {
        try {
            const supabase = createClient();
            
            // Toggle between confirmed and pending
            const newStatus = currentStatus === 'confirmed' ? 'pending' : 'confirmed';
            
            // Optimistically update UI
            setRegistrations(prev => 
                prev.map(reg => 
                    reg.id === registrationId 
                        ? { ...reg, status: newStatus } 
                        : reg
                )
            );

            const { error } = await supabase
                .from('workshop_registrations')
                .update({ status: newStatus })
                .eq('id', registrationId);

            if (error) throw error;
            
            // Refresh to ensure consistency
            if (selectedWorkshopId) {
                fetchRegistrations(selectedWorkshopId);
            }
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Failed to update status');
            // Revert on error
            if (selectedWorkshopId) {
                fetchRegistrations(selectedWorkshopId);
            }
        }
    };

    const handleImageSelect = (file: File, isEdit: boolean = false) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { alert('Image size must be less than 5MB'); return; }
        if (isEdit) {
            setSelectedImageForEdit(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreviewForEdit(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setSelectedImageForCreate(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreviewForCreate(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const deleteImageFromSupabase = async (imageUrl: string) => {
        try {
            const supabase = createClient();
            
            // Extract filename - handle both full URLs and plain filenames
            let fileName: string;
            if (imageUrl.startsWith('http')) {
                // It's a full URL, extract filename from end
                const urlParts = imageUrl.split('/');
                fileName = urlParts[urlParts.length - 1];
            } else {
                // It's already just a filename
                fileName = imageUrl;
            }
            
            console.log('Deleting old image:', fileName);
            
            const { error } = await supabase.storage.from('workshops').remove([fileName]);
            if (error) {
                console.error('Error deleting old image:', error);
            } else {
                console.log('Old image deleted successfully');
            }
        } catch (error) {
            console.error('Error in deleteImageFromSupabase:', error);
        }
    };

    const uploadImageToSupabase = async (file: File): Promise<string | null> => {
        try {
            setUploadingImage(true);
            const supabase = createClient();
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            
            console.log('Uploading file:', fileName, 'to bucket: workshops');
            
            const { data, error } = await supabase.storage.from('workshops').upload(fileName, file);
            
            if (error) {
                console.error('Storage upload error:', error);
                throw error;
            }
            
            console.log('Upload successful, data:', data);
            
            // Return only the filename, not the full URL
            console.log('Returning filename:', fileName);
            return fileName;
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
            return null;
        } finally {
            setUploadingImage(false);
        }
    };

    const handleCreateWorkshop = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const supabase = createClient();
            
            let imageUrl = '';
            if (selectedImageForCreate) {
                console.log('Uploading image...');
                const uploadedUrl = await uploadImageToSupabase(selectedImageForCreate);
                console.log('Uploaded URL:', uploadedUrl);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }
            
            console.log('Creating workshop with image_url:', imageUrl);
            
            const { error } = await supabase
                .from('workshops')
                .insert({
                    title: newWorkshop.title,
                    instructor: newWorkshop.instructor,
                    start_date: newWorkshop.start_date,
                    start_time: newWorkshop.start_time,
                    duration: newWorkshop.duration,
                    price: newWorkshop.price,
                    max_spots: newWorkshop.max_spots,
                    available_spots: newWorkshop.available_spots,
                    level: newWorkshop.level,
                    description: newWorkshop.description,
                    image_url: imageUrl,
                    available: true,
                    is_upcoming: true,
                });

            if (error) throw error;
            
            setShowCreateModal(false);
            setNewWorkshop({
                title: '',
                instructor: '',
                start_date: '',
                start_time: '',
                duration: '',
                price: 0,
                max_spots: 20,
                available_spots: 20,
                level: '',
                description: '',
            });
            setSelectedImageForCreate(null);
            setImagePreviewForCreate('');
            fetchData();
            alert('Workshop created successfully!');
        } catch (error) {
            console.error('Error creating workshop:', error);
            alert('Failed to create workshop');
        }
    };


    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    const columns = [
        {
            key: 'title',
            label: 'Workshop',
            sortable: true,
            render: (row: WorkshopData) => (
                <div>
                    <p className="font-medium">{row.title}</p>
                    <p className="text-xs text-gray-500">by {row.instructor}</p>
                </div>
            )
        },
        {
            key: 'start_date',
            label: 'Date',
            sortable: true,
            render: (row: WorkshopData) => new Date(row.start_date).toLocaleDateString()
        },
        {
            key: 'bookings',
            label: 'Bookings',
            sortable: true,
            render: (row: WorkshopData) => (
                <div>
                    <p className="font-semibold">{row.bookings}/{row.max_spots}</p>
                    <p className="text-xs text-gray-500">Available: {row.available_spots}</p>
                </div>
            )
        },
        {
            key: 'booking_rate',
            label: 'Rate',
            sortable: true,
            render: (row: WorkshopData) => (
                <span className={`font-medium ${row.booking_rate >= 80 ? 'text-green-600' :
                        row.booking_rate >= 50 ? 'text-yellow-600' :
                            'text-red-600'
                    }`}>
                    {row.booking_rate.toFixed(0)}%
                </span>
            )
        },
        {
            key: 'revenue',
            label: 'Revenue',
            sortable: true,
            render: (row: WorkshopData) => (
                <span className="font-semibold text-green-700">₹{row.revenue.toLocaleString()}</span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (row: WorkshopData) => (
                <div className="flex gap-1">
                    <button
                        onClick={() => handleViewRegistrations(row.workshop_id)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600"
                        title="View Registrations"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => handleEditWorkshop(row)}
                        className="p-2 hover:bg-amber-50 rounded-lg transition text-amber-600"
                        title="Edit Workshop"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDeleteWorkshop(row.workshop_id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                        title="Delete Workshop"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Workshop Management</h1>
                    <p className="text-gray-600 mt-1">Manage workshops and view analytics</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#8B6F47] hover:bg-[#7A5F3A] text-white rounded-lg transition font-medium shadow-sm"
                >
                    <Plus size={20} />
                    Create Workshop
                </button>
            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Workshops"
                        value={stats.total}
                        icon={GraduationCap}
                        loading={loading}
                    />
                    <StatCard
                        title="Total Bookings"
                        value={stats.bookings}
                        icon={Users}
                        loading={loading}
                    />
                    <StatCard
                        title="Avg Booking Rate"
                        value={`${stats.avg_booking_rate?.toFixed(0) || 0}%`}
                        icon={TrendingUp}
                        loading={loading}
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`₹${stats.revenue?.toLocaleString() || 0}`}
                        icon={DollarSign}
                        loading={loading}
                    />
                </div>
            )}

            <DataTable
                data={workshops}
                columns={columns}
                loading={loading}
                searchable
                searchPlaceholder="Search workshops..."
            />

            {/* Workshop Requests Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Workshop Requests</h2>
                        <p className="text-gray-600 mt-1">Pending requests from users</p>
                    </div>
                    <div className="bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 shadow-sm text-sm font-medium text-amber-700">
                        {requestsLoading ? '...' : `${workshopRequests.length} Pending`}
                    </div>
                </div>

                {requestsLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B6F47]"></div>
                    </div>
                ) : workshopRequests.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                        <p className="text-gray-500">
                            No pending workshop requests at the moment.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {workshopRequests.map((request) => (
                            <div
                                key={request.id}
                                className="relative group rounded-xl border border-amber-100 bg-amber-50 p-5 transition-all hover:shadow-md"
                            >
                                <div className="flex flex-col gap-4">
                                    {/* Header */}
                                    <div className="flex gap-4 justify-between">
                                        <div className="flex gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center shadow-sm shrink-0">
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-semibold text-gray-900">{request.name}</h3>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                                                        Pending
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 text-sm mt-0.5 font-medium">
                                                    Wants: {request.workshop_theme}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {formatDate(request.created_at)}
                                                    </span>
                                                </div>

                                                {/* Expandable Details */}
                                                {expandedId === request.id && (
                                                    <div className="mt-4 p-4 bg-white rounded-lg border border-amber-100 space-y-2">
                                                        <p className="text-sm flex items-center gap-2">
                                                            <Mail size={14} className="text-gray-400" />
                                                            <strong>Email:</strong> {request.email}
                                                        </p>
                                                        <p className="text-sm flex items-center gap-2">
                                                            <Phone size={14} className="text-gray-400" />
                                                            <strong>Phone:</strong> {request.phone}
                                                        </p>
                                                        {request.instagram_handle && (
                                                            <p className="text-sm flex items-center gap-2">
                                                                <Instagram size={14} className="text-gray-400" />
                                                                <strong>Instagram:</strong> {request.instagram_handle}
                                                            </p>
                                                        )}
                                                        {request.additional_details && (
                                                            <p className="text-sm">
                                                                <strong>Additional Details:</strong> {request.additional_details}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
                                                    className="mt-2 text-xs text-amber-700 hover:underline font-medium"
                                                >
                                                    {expandedId === request.id ? 'Hide Details' : 'Show Details'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2 self-start shrink-0">
                                            <button
                                                onClick={() => handleApproveClick(request)}
                                                className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-green-50 text-green-700 border border-gray-200 hover:border-green-200 rounded-lg transition text-sm font-medium shadow-sm"
                                            >
                                                <Check size={16} />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.id)}
                                                className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-red-50 text-red-700 border border-gray-200 hover:border-red-200 rounded-lg transition text-sm font-medium shadow-sm"
                                            >
                                                <X size={16} />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Registrations Modal */}
            {showRegistrationsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">Workshop Registrations</h2>
                            <p className="text-gray-600 mt-1">
                                Workshop: {workshops.find(w => w.workshop_id === selectedWorkshopId)?.title}
                            </p>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {registrationsLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B6F47]"></div>
                                </div>
                            ) : registrations.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    No registrations yet
                                </div>
                            ) : (
                                <div className="space-y-3">
                                   {registrations.map((reg) => (
                                        <div key={reg.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{reg.name}</p>
                                                    <p className="text-sm text-gray-600">{reg.email}</p>
                                                    <p className="text-sm text-gray-600">{reg.phone}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Booking: {reg.booking_number}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleToggleRegistrationStatus(reg.id, reg.status)}
                                                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:scale-105 flex items-center gap-1 ${
                                                        reg.status === 'confirmed' 
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                    }`}
                                                    title="Click to toggle status"
                                                >
                                                    <RefreshCw size={12} />
                                                    {reg.status}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => {
                                    setShowRegistrationsModal(false);
                                    setSelectedWorkshopId(null);
                                    setRegistrations([]);
                                }}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Workshop Modal */}
            {showEditModal && editingWorkshop && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">Edit Workshop</h2>
                        </div>
                        <form onSubmit={handleSaveWorkshop} className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={editingWorkshop.title}
                                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                                    <input
                                        type="text"
                                        value={editingWorkshop.instructor}
                                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, instructor: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={editingWorkshop.start_date}
                                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, start_date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input
                                        type="text"
                                        value={editingWorkshop.start_time || ''}
                                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, start_time: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        placeholder="e.g., 2:00 PM - 5:00 PM"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={editingWorkshop.price}
                                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, price: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Spots</label>
                                    <input
                                        type="number"
                                        value={editingWorkshop.max_spots}
                                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, max_spots: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Spots</label>
                                    <input
                                        type="number"
                                        value={editingWorkshop.available_spots}
                                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, available_spots: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                                    <input
                                        type="text"
                                        value={editingWorkshop.level || ''}
                                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, level: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        placeholder="e.g., Beginner"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Workshop Image</label>
                                    <div className="space-y-2">
                                        {editingWorkshop?.image_url && !imagePreviewForEdit && (
                                            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                                                <img src={editingWorkshop.image_url} alt="Current" className="w-full h-full object-cover" />
                                                <span className="absolute bottom-2 left-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">Current Image</span>
                                            </div>
                                        )}
                                        <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#8B6F47] hover:bg-gray-50 transition">
                                            <Upload size={20} className="text-gray-400" />
                                            <span className="text-sm text-gray-600">{editingWorkshop?.image_url ? 'Change Image' : 'Choose Image'}</span>
                                            <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageSelect(file, true); }} className="hidden" />
                                        </label>
                                        {imagePreviewForEdit && (
                                            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-green-200">
                                                <img src={imagePreviewForEdit} alt="New Preview" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => { setSelectedImageForEdit(null); setImagePreviewForEdit(''); }} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"><X size={16} /></button>
                                                <span className="absolute bottom-2 left-2 text-xs bg-green-500 text-white px-2 py-1 rounded">New Image</span>
                                            </div>
                                        )}
                                        {uploadingImage && (<div className="text-sm text-gray-600 flex items-center gap-2"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#8B6F47]"></div>Uploading...</div>)}
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingWorkshop(null);
                                }}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveWorkshop}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center gap-2"
                            >
                                <Save size={16} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Approval Workshop Selection Modal */}
            {approvingRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">Approve Request</h2>
                            <p className="text-gray-600 mt-1">Select workshop for {approvingRequest.name}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Workshop
                                </label>
                                <select
                                    value={selectedWorkshopForApproval}
                                    onChange={(e) => setSelectedWorkshopForApproval(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">-- Choose a workshop --</option>
                                    {workshops.filter(w => w.available_spots > 0).map(w => (
                                        <option key={w.workshop_id} value={w.workshop_id}>
                                            {w.title} - {w.available_spots} spots left
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-2">
                                    Requested theme: <strong>{approvingRequest.workshop_theme}</strong>
                                </p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setApprovingRequest(null);
                                    setSelectedWorkshopForApproval('');
                                }}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApproveWithWorkshop}
                                disabled={!selectedWorkshopForApproval}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Check size={16} />
                                Approve & Register
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Workshop Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">Create New Workshop</h2>
                        </div>
                        <form onSubmit={handleCreateWorkshop} className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                    <input
                                        type="text"
                                        value={newWorkshop.title}
                                        onChange={(e) => setNewWorkshop({ ...newWorkshop, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructor *</label>
                                    <input
                                        type="text"
                                        value={newWorkshop.instructor}
                                        onChange={(e) => setNewWorkshop({ ...newWorkshop, instructor: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                    <input
                                        type="date"
                                        value={newWorkshop.start_date}
                                        onChange={(e) => setNewWorkshop({ ...newWorkshop, start_date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input
                                        type="text"
                                        value={newWorkshop.start_time}
                                        onChange={(e) => setNewWorkshop({ ...newWorkshop, start_time: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        placeholder="e.g., 2:00 PM - 5:00 PM"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                    <input
                                        type="text"
                                        value={newWorkshop.duration}
                                        onChange={(e) => setNewWorkshop({ ...newWorkshop, duration: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        placeholder="e.g., 3 hours"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                                    <input
                                        type="number"
                                        value={newWorkshop.price}
                                        onChange={(e) => setNewWorkshop({ ...newWorkshop, price: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Spots *</label>
                                    <input
                                        type="number"
                                        value={newWorkshop.max_spots}
                                        onChange={(e) => {
                                            const spots = parseInt(e.target.value);
                                            setNewWorkshop({ ...newWorkshop, max_spots: spots, available_spots: spots });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                                    <input
                                        type="text"
                                        value={newWorkshop.level}
                                        onChange={(e) => setNewWorkshop({ ...newWorkshop, level: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        placeholder="e.g., Beginner"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Workshop Image</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#8B6F47] hover:bg-gray-50 transition">
                                            <Upload size={20} className="text-gray-400" />
                                            <span className="text-sm text-gray-600">Choose Image</span>
                                            <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageSelect(file, false); }} className="hidden" />
                                        </label>
                                        {imagePreviewForCreate && (
                                            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                                                <img src={imagePreviewForCreate} alt="Preview" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => { setSelectedImageForCreate(null); setImagePreviewForCreate(''); }} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"><X size={16} /></button>
                                                <span className="absolute bottom-2 left-2 text-xs bg-green-500 text-white px-2 py-1 rounded">New Image</span>
                                            </div>
                                        )}
                                        {uploadingImage && (<div className="text-sm text-gray-600 flex items-center gap-2"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#8B6F47]"></div>Uploading...</div>)}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={newWorkshop.description}
                                        onChange={(e) => setNewWorkshop({ ...newWorkshop, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        rows={3}
                                        placeholder="Workshop description..."
                                    />
                                </div>
                            </div>
                        </form>
                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setNewWorkshop({
                                        title: '',
                                        instructor: '',
                                        start_date: '',
                                        start_time: '',
                                        duration: '',
                                        price: 0,
                                        max_spots: 20,
                                        available_spots: 20,
                                        level: '',
                                        description: '',
                                    });
                                }}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateWorkshop}
                                className="px-4 py-2 bg-[#8B6F47] hover:bg-[#7A5F3A] text-white rounded-lg transition font-medium flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Create Workshop
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
