import React, { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { CircleX } from 'lucide-react';

const ApproveExperienceModal = ({ isOpen, onClose, experience, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: experience?.unlistedCompanyName || '',
    offeredPackage: experience?.unlistedCompanyDetails?.offeredPackage || '',
    location: experience?.unlistedCompanyDetails?.location?.join(', ') || '',
    description: '',
    visitingDate: '',
    status: 'visited',
    devStack: experience?.unlistedCompanyDetails?.devStack?.join(', ') || '',
    eligibility: experience?.unlistedCompanyDetails?.eligibility || ''
  });
  const [logo, setLogo] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'devStack') {
        const stacks = formData[key].split(',').map(s => s.trim());
        stacks.forEach(s => submitData.append('devStack[]', s));
      } else if (key === 'location') {
        const locs = formData[key].split(',').map(l => l.trim());
        locs.forEach(l => submitData.append('location[]', l));
      } else {
        submitData.append(key, formData[key]);
      }
    });

    if (logo) submitData.append('logo', logo);

    try {
      const { data } = await api.put(`/api/experiences/${experience._id}/approve`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(data.message);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error('Failed to approve experience');
      console.log(err);
    }
  };

  if (!isOpen || !experience) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-black/65 backdrop-blur-xs flex justify-center items-start pt-28 md:pt-32 pb-10 z-[99999] p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 md:p-8 rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-200/90 relative animate-in zoom-in-95 duration-200"
      >
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute top-5 right-5 p-1.5 bg-zinc-100 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 rounded-full transition-all cursor-pointer z-10"
          title="Close Modal"
        >
          <CircleX size={20} />
        </button>

        <h2 className="text-xl font-bold text-zinc-900 mb-2 border-b border-zinc-100 pb-3 pr-8">
          Approve: {experience.unlistedCompanyName}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          To approve this experience, please provide the details to create the new company in the system.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded-lg bg-gray-50" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Company Logo</label>
            <input type="file" onChange={handleFileChange} className="w-full border p-2 rounded-lg bg-gray-50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Offered Package (LPA)</label>
              <input type="number" name="offeredPackage" value={formData.offeredPackage} onChange={handleChange} className="w-full border p-2 rounded-lg bg-gray-50" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Eligibility (CGPA)</label>
              <input type="number" step="0.1" name="eligibility" value={formData.eligibility} onChange={handleChange} className="w-full border p-2 rounded-lg bg-gray-50" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Locations (comma separated)</label>
            <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Bangalore, Pune" className="w-full border p-2 rounded-lg bg-gray-50" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dev Stack (comma separated)</label>
            <input name="devStack" value={formData.devStack} onChange={handleChange} placeholder="e.g. React, Node.js" className="w-full border p-2 rounded-lg bg-gray-50" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Visiting Date</label>
            <input type="date" name="visitingDate" value={formData.visitingDate} onChange={handleChange} className="w-full border p-2 rounded-lg bg-gray-50" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded-lg bg-gray-50 h-24" required />
          </div>

          <button type="submit" className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-lg">
            Create Company & Approve Experience
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApproveExperienceModal;
