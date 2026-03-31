import React , { useEffect, useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import ExperienceCard from '../components/ExperienceCard';

const InterviewExperience = () => {
  const [experiences , setExperiences] = useState([]);
  useEffect(()=>{
    const fetchData = async()=>{
      try{
        const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/experiences`,{
          withCredentials : true
        });

        setExperiences(data.data);
        console.log(data);
      }catch(err){
        console.log("Interview experiences fetching error : ",err);
        toast.error("Error while fetching interview experiences");
      }
    }

    fetchData();
  },[])
  return (
    <div className='flex flex-col gap-3 mt-3 w-[60vw]'>
      {experiences.map((experience)=>(
        <ExperienceCard key={experience._id} experience={experience}></ExperienceCard>
      ))}
    </div>
  )
}

export default InterviewExperience