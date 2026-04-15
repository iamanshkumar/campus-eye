import React , {useState , useRef , useEffect} from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {X , Save , Camera , UserCircle , Loader2} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EditProfileModal = ({isOpen , onClose})=>{
    const {user , updateUser} = useAuth();
    const fileInputRef = useRef(null);
    const [isSubmitting , setIsSubmitting] = useState(false);
    const [previewUrl , setPreviewUrl] = useState(user?.profilePic || null)
    const [selectedFile , setSelectedFile] = useState(null);

    const [formData , setFormData] = useState({
        fullName : user?.fullName || '',
        cgpa : user?.cgpa || '',
        branch : user?.branch || ''    
    })

    useEffect(()=>{
        if(isOpen){
            setFormData({
                fullName: user?.fullName || '',
                cgpa: user?.cgpa || '',
                branch: user?.branch || '',
                year: user?.year || ''
            })
            setPreviewUrl(user?.profilePic || null);
            setSelectedFile(null);
        }
    },[isOpen , user])

    if(!isOpen) return null;

    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        if(file){
            if (file.size > 2 * 1024 * 1024) {
                return toast.error("File is too large. Please pick an image under 2MB.");
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setIsSubmitting(true);
        try{
            const data = new FormData();
            data.append('fullName' , formData.fullName);

            if(user?.role==='student'){
                data.append('cgpa' , formData.cgpa);
                data.append('branch' , formData.branch);
            }
            

            if(selectedFile){
                data.append('profilePic' , selectedFile);
            }
            const res = await api.put('/api/user/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            if(res.data.success){
                updateUser(res.data.data);
                toast.success("Profile updated successfully");
                onClose();
            }
        }catch(err){
            console.error("Update error:", err);
            toast.error(err.response?.data?.message || "Failed to update profile");
        
        }finally{
            setIsSubmitting(false);
        }
    }

    const isStudent = user?.role==='student';

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                <form onSubmit={handleSubmit}>

                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-xl font-bold text-gray-800">Edit Profile</h3>
                        <button type="button" onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
                            <X size={20} className="text-gray-500"/>
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex flex-col items-center">
                            <div onClick={() => fileInputRef.current.click()} className="relative group cursor-pointer">
                                <div className="w-28 h-28 rounded-full border-4 border-emerald-50 overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserCircle size={70} className="text-gray-300" />
                                    )}
                                </div>

                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera size={24} className="text-white"/>
                                </div>
                                <input type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleImageChange} 
                                    className="hidden" 
                                    accept="image/*"/>

                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">Click to change photo</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Full Name</label>
                                <input 
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                                />
                            </div>

                            {isStudent && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">CGPA</label>
                                        <input 
                                            type="text"
                                            required
                                            value={formData.cgpa}
                                            onChange={(e) => setFormData({...formData, cgpa: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Branch</label>
                                        <input 
                                            type="text"
                                            required
                                            value={formData.branch}
                                            onChange={(e) => setFormData({...formData, branch: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="button" 
                                onClick={onClose} 
                                className="flex-1 px-4 py-3 text-gray-500 font-bold text-sm hover:text-gray-700 transition-colors cursor-pointer">
                                Cancel
                            </button>

                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-800 text-white font-bold rounded-2xl hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 cursor-pointer"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProfileModal;



