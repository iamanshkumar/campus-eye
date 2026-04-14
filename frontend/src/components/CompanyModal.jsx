import React, { useState, useEffect } from "react";
import { X, Save, Plus, Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CompanyModal = ({ isOpen, onClose, companyToEdit, onRefresh }) => {
    const isEditing = !!companyToEdit;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewLogo, setPreviewLogo] = useState('');

    const [formData, setFormData] = useState({
        name: '', logo: '', offeredPackage: '', location: [''],
        description: '', visitingDate: '', status: 'upcoming',
        devStack: [''], eligibility: ''
    });

    useEffect(() => {
        if (isOpen && companyToEdit) {
            setFormData({ ...companyToEdit, visitingDate: new Date(companyToEdit.visitingDate).toISOString().split('T')[0] });
            setPreviewLogo(companyToEdit.logo);
        } else if (isOpen && !companyToEdit) {
            setFormData({ name: '', logo: '', offeredPackage: '', location: [''], description: '', visitingDate: '', status: 'upcoming', devStack: [''], eligibility: '' });
            setPreviewLogo('');
            setSelectedFile(null);
        }
    }, [isOpen, companyToEdit]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    const handleArrayChange = (index, value, field) => {
        const newArr = [...formData[field]];
        newArr[index] = value;
        setFormData({ ...formData, [field]: newArr });
    };

    const addField = (field) => setFormData({ ...formData, [field]: [...formData[field], ""] });

    const removeField = (index, field) => {
        if (formData[field].length === 1) return;
        const newArr = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArr });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (Array.isArray(formData[key])) {
                    formData[key].forEach(val => data.append(key, val));
                } else {
                    data.append(key, formData[key]);
                }
            });

            if (selectedFile) {
                data.append('logo', selectedFile);
            }
            const url = isEditing ? `/api/companies/${companyToEdit._id}` : '/api/companies';
            const method = isEditing ? 'put' : 'post';

            await axios[method](url, data, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success(`Company ${isEditing ? 'updated' : 'added'}!`);
            onRefresh();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">

                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-2xl font-bold text-gray-800">{isEditing ? 'Edit Company' : 'Add New Company'}</h2>
                        <button type="button" onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X /></button>
                    </div>

                    <div className="p-8 space-y-6 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Company Name</label>
                                <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Package (LPA)</label>
                                <input type="number" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.offeredPackage} onChange={e => setFormData({ ...formData, offeredPackage: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col items-center gap-4 mb-6">
                                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                                    {previewLogo ? <img src={previewLogo} className="w-full h-full object-contain" /> : <Plus className="text-gray-300" />}
                                </div>
                                <label className="cursor-pointer bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all">
                                    Upload Company Logo
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </label>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Visiting Date</label>
                                <input type="date" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.visitingDate} onChange={e => setFormData({ ...formData, visitingDate: e.target.value })} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Locations</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {formData.location.map((loc, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input required className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm" value={loc} onChange={e => handleArrayChange(i, e.target.value, 'location')} />
                                        <button type="button" onClick={() => removeField(i, 'location')} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={() => addField('location')} className="text-emerald-600 text-xs font-bold flex items-center gap-1 mt-2 hover:underline"><Plus size={14} /> Add Location</button>
                        </div>


                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Developer Stack</label>
                            <div className="flex flex-wrap gap-2">
                                {formData.devStack.map((stack, i) => (
                                    <div key={i} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                        <input required className="bg-transparent border-none outline-none text-xs w-20" value={stack} onChange={e => handleArrayChange(i, e.target.value, 'devStack')} />
                                        <button type="button" onClick={() => removeField(i, 'devStack')} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addField('devStack')} className="px-3 py-1 rounded-full border border-dashed border-emerald-400 text-emerald-600 text-xs font-bold flex items-center gap-1"><Plus size={12} /> Add Tech</button>
                            </div>
                        </div>


                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Eligibility (Min CGPA)</label>
                            <input type="number" step="0.1" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.eligibility} onChange={e => setFormData({ ...formData, eligibility: e.target.value })} />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Description</label>
                            <textarea rows="3" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                    </div>


                    <div className="p-8 border-t border-gray-100 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-4 text-gray-500 font-bold hover:text-gray-700">Cancel</button>
                        <button disabled={isSubmitting} type="submit" className="flex-1 py-4 bg-emerald-900 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-950 transition-all disabled:opacity-50">
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            {isEditing ? 'Update Details' : 'Post Company'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CompanyModal;