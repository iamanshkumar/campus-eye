import React , { useEffect, useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import ExperienceCard from '../components/ExperienceCard';
import AddExperienceModal from '../components/AddExperienceModal';

const InterviewExperience = () => {
  const [experiences , setExperiences] = useState([]);
  const [isModalOpen , setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const {data} = await axios.get(`/api/experiences`,{
        withCredentials : true
      });
      setExperiences(data.data);
    } catch(err) {
      console.log("Interview experiences fetching error : ", err);
      toast.error("Error while fetching interview experiences");
    }
  };

  useEffect(() => {
    fetchData();
  }, [])
  return (
    <div className='flex flex-col gap-3 mt-3 w-[60vw]'>
      <button onClick={() => setIsModalOpen(true)}
        className="bg-emerald-900 text-white px-4 py-2 w-[10vw] rounded-xl cursor-pointer">Add Experience</button>
        <AddExperienceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchData}
        />
      {experiences.map((experience)=>(
        <ExperienceCard key={experience._id} experience={experience}></ExperienceCard>
      ))}
    </div>
  )
}

export default InterviewExperience