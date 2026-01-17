// IMAGE UPLOAD CODE TO ADD TO ADMIN WORKSHOPS PAGE
// Add these sections to src/app/admin/workshops/page.tsx

// ============================================
// 1. ADD TO STATE VARIABLES (after line 89)
// ============================================

// Image upload states
const [uploadingImage, setUploadingImage] = useState(false);
const [selectedImageForCreate, setSelectedImageForCreate] = useState<File | null>(null);
const [selectedImageForEdit, setSelectedImageForEdit] = useState<File | null>(null);
const [imagePreviewForCreate, setImagePreviewForCreate] = useState<string>('');
const [imagePreviewForEdit, setImagePreviewForEdit] = useState<string>('');


// ============================================
// 2. ADD HANDLER FUNCTIONS (after handleReject function)
// ============================================

const handleImageSelect = (file: File, isEdit: boolean = false) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
    }
    
    if (isEdit) {
        setSelectedImageForEdit(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviewForEdit(reader.result as string);
        };
        reader.readAsDataURL(file);
    } else {
        setSelectedImageForCreate(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviewForCreate(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
};

const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
        setUploadingImage(true);
        const supabase = createClient();
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { data, error } = await supabase.storage
            .from('workshop-images')
            .upload(filePath, file);
        
        if (error) {
            console.error('Upload error:', error);
            throw error;
        }
        
        const { data: { publicUrl } } = supabase.storage
            .from('workshop-images')
            .getPublicUrl(filePath);
        
        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
        return null;
    } finally {
        setUploadingImage(false);
    }
};


// ============================================
// 3. UPDATE handleCreateWorkshop FUNCTION
// ============================================

const handleCreateWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const supabase = createClient();
        
        let imageUrl = '';
        if (selectedImageForCreate) {
            const uploadedUrl = await uploadImageToSupabase(selectedImageForCreate);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            }
        }
        
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


// ============================================
// 4. UPDATE handleSaveWorkshop FUNCTION
// ============================================

const handleSaveWorkshop = async () => {
    if (!editingWorkshop) return;
    
    try {
        const supabase = createClient();
        
        let imageUrl = editingWorkshop.image_url || '';
        if (selectedImageForEdit) {
            const uploadedUrl = await uploadImageToSupabase(selectedImageForEdit);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            }
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
                description: editingWorkshop.description,
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


//==============================================
// 5. UI COMPONENT FOR CREATE MODAL
// Add this BEFORE the Description field in Create Modal
//==============================================

<div className="col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">
        Workshop Image
    </label>
    <div className="space-y-2">
        <div className="flex items-center gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#8B6F47] hover:bg-gray-50 transition">
                <Upload size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600">Choose Image</span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageSelect(file, false);
                    }}
                    className="hidden"
                />
            </label>
        </div>
        {imagePreviewForCreate && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                <img 
                    src={imagePreviewForCreate}
                    alt="Preview"
                    className="w-full h-full object-cover"
                />
                <button
                    type="button"
                    onClick={() => {
                        setSelectedImageForCreate(null);
                        setImagePreviewForCreate('');
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                    <X size={16} />
                </button>
                <span className="absolute bottom-2 left-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                    New Image
                </span>
            </div>
        )}
        {uploadingImage && (
            <div className="text-sm text-gray-600 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#8B6F47]"></div>
                Uploading image...
            </div>
        )}
    </div>
</div>


//==============================================
// 6. UI COMPONENT FOR EDIT MODAL  
// Add this in the Edit Modal form
//==============================================

<div className="col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">
        Workshop Image
    </label>
    <div className="space-y-2">
        {editingWorkshop?.image_url && !imagePreviewForEdit && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                <img 
                    src={editingWorkshop.image_url}
                    alt="Current workshop image"
                    className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                    Current Image
                </span>
            </div>
        )}
        
        <div className="flex items-center gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#8B6F47] hover:bg-gray-50 transition">
                <Upload size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                    {editingWorkshop?.image_url ? 'Change Image' : 'Choose Image'}
                </span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageSelect(file, true);
                    }}
                    className="hidden"
                />
            </label>
        </div>
        
        {imagePreviewForEdit && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-green-200">
                <img 
                    src={imagePreviewForEdit}
                    alt="New Preview"
                    className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                    New Image
                </span>
                <button
                    type="button"
                    onClick={() => {
                        setSelectedImageForEdit(null);
                        setImagePreviewForEdit('');
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                    <X size={16} />
                </button>
            </div>
        )}
        
        {uploadingImage && (
            <div className="text-sm text-gray-600 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#8B6F47]"></div>
                Uploading image...
            </div>
        )}
    </div>
</div>
