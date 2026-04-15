import React, { useEffect, useState } from 'react'
import api from '../utils/api';
import toast from 'react-hot-toast';
import ExperienceCard from '../components/ExperienceCard';
import AddExperienceModal from '../components/AddExperienceModal';
import { Loader2, FileText } from 'lucide-react';

const InterviewExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/experiences`);
      setExperiences(data.data);
    } catch (err) {
      console.log("Interview experiences fetching error : ", err);
      toast.error("Error while fetching interview experiences");
    } finally {
      setLoading(false);
    }
  };

  const removeExperienceFromUI = (id) => {
    setExperiences(prev => prev.filter(exp => exp._id !== id));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='flex flex-col gap-3 mt-3 w-[60vw]'>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-emerald-900 text-white px-4 py-2 w-[10vw] rounded-xl cursor-pointer"
      >
        Add Experience
      </button>

      <AddExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-emerald-800/40">
          <Loader2 className="animate-spin mb-2" size={40} />
          <p className="font-bold">Loading experiences...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-4xl border-2 border-dashed border-emerald-100">
          <FileText size={48} className="text-emerald-200 mb-4" />
          <p className="text-emerald-900/40 font-bold text-lg">No experiences shared yet.</p>
          <p className="text-emerald-900/30 text-sm mt-1">Be the first to share your interview experience!</p>
        </div>
      ) : (
        experiences.map((experience) => (
          <ExperienceCard
            key={experience._id}
            experience={experience}
            onDelete={removeExperienceFromUI}
          />
        ))
      )}
    </div>
  );
};

export default InterviewExperience;