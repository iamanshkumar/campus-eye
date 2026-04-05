import React , {useState} from 'react'
import {ArrowUp , ArrowDown , MessageCircle} from 'lucide-react'
import CommentSection from './CommentSection';

const ExperienceCard = ({experience}) => {
    const[showComments , setShowComments] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-5 mb-5">
        <div className='flex justify-between items-center mb-3'>
            <div className='flex gap-1'>
                <h1 className='font-bold'>{experience.user.fullName}</h1>
                <h2 className='font-medium text-gray-700'>@{experience.user.username}</h2>
            </div>
            
            <div className='flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full'>
                <img
                    src={experience.company.logo}
                    alt={experience.company.name}
                    className="w-5 h-5 object-contain"
                />
                <span className="text-xs font-medium text-gray-700">
                    {experience.company.name}
                </span>
            </div>
        </div>
        
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {experience.description}
        </p>
        
        <div className="flex items-center justify-between border-t pt-3">

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition">
            <ArrowUp size={18} />
            <span className="text-sm">{experience.upvotes}</span>
          </button>

          <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition">
            <ArrowDown size={18} />
            <span className="text-sm">{experience.downvotes}</span>
          </button>
        </div>

        <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition cursor-pointer" onClick={()=>setShowComments(!showComments)}>
          <MessageCircle size={18} />
          <span className="text-sm">Comments</span>
        </button>
      </div>

      {showComments && (
        <CommentSection experienceID={experience._id} />
      )}

    </div>
  )
}

export default ExperienceCard