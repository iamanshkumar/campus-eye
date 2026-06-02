import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import ApproveExperienceModal from '../components/ApproveExperienceModal.jsx';

const AdminPanel = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);

  const fetchExperiences = async (status) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/experiences/admin/status?status=${status}`);
      setExperiences(data.data);
    } catch (err) {
      toast.error(`Error fetching ${status} experiences`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences(activeTab);
  }, [activeTab]);

  const handleApproveClick = (exp) => {
    setSelectedExperience(exp);
    setIsApproveModalOpen(true);
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this experience?")) return;
    
    try {
      await api.put(`/api/experiences/${id}/reject`);
      toast.success("Experience rejected");
      fetchExperiences(activeTab);
    } catch (err) {
      toast.error("Failed to reject experience");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-4 mb-2">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${activeTab === 'pending' ? 'bg-amber-400 text-amber-950 shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
        >
          Pending Requests
        </button>
        <button 
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${activeTab === 'rejected' ? 'bg-red-400 text-red-950 shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
        >
          Rejected Requests
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 text-emerald-800/40">
          <Loader2 className="animate-spin mb-2" size={40} />
          <p className="font-bold">Loading...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="flex flex-col items-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-emerald-100">
          <p className="text-emerald-900/40 font-bold text-lg">No {activeTab} requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {experiences.map(exp => (
            <div key={exp._id} className="bg-white p-5 rounded-2xl shadow-lg border border-emerald-100 flex flex-col gap-3 relative">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-emerald-950">
                    {exp.unlistedCompanyName || 'Unknown Company'}
                  </h3>
                  <p className="text-xs text-gray-500">Submitted by: {exp.user?.fullName} (@{exp.user?.username})</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(exp.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${exp.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                  {exp.status.toUpperCase()}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-xl text-gray-700 text-sm italic border border-gray-100">
                "{exp.description}"
              </div>
              
              <div className="flex justify-end gap-2 mt-2">
                {activeTab === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleReject(exp._id)}
                      className="flex items-center gap-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                    <button 
                      onClick={() => handleApproveClick(exp)}
                      className="flex items-center gap-1 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                  </>
                )}
                {activeTab === 'rejected' && (
                  <button 
                    onClick={() => handleApproveClick(exp)}
                    className="flex items-center gap-1 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    <CheckCircle size={16} /> Re-Evaluate & Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isApproveModalOpen && selectedExperience && (
        <ApproveExperienceModal
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          experience={selectedExperience}
          onSuccess={() => fetchExperiences(activeTab)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
