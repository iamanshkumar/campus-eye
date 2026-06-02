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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 cursor-pointer">
          <CircleX size={24} className="text-gray-400 hover:text-red-500 transition-colors" />
        </button>

        <h2 className="text-xl font-bold text-emerald-950 mb-4 border-b pb-2">
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
