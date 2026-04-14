import React , {useState} from 'react'
import {ArrowUp , ArrowDown , MessageCircle , Trash2 ,ShieldCheck} from 'lucide-react'
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CommentSection from './CommentSection';
import { useAuth } from '../context/AuthContext';

const ExperienceCard = ({experience , onDelete}) => {
    const {user} = useAuth();
    const[showComments , setShowComments] = useState(false);
    const getCount = (votes) => {
        if (Array.isArray(votes)) return votes.length;
        if (typeof votes === 'number') return votes;
        return 0;
    };

    const [upvotes, setUpvotes] = useState(getCount(experience.upvotes));
    const [downvotes, setDownvotes] = useState(getCount(experience.downvotes));

    const hasUpvoted = experience.upvotes?.includes(user?._id);
    const hasDownvoted = experience.downvotes?.includes(user?._id);

    const isOwner = user?._id === experience.user?._id;
    const isAdmin = user?.role === 'admin';

    const handleDelete = async () => {
        if (!window.confirm("Delete this interview experience permanently?")) return;
        try {
            await axios.delete(`/api/experiences/${experience._id}`, { withCredentials: true });
            toast.success("Experience deleted");
            if (onDelete) onDelete(experience._id);
        } catch (err) {
            toast.error(err.response?.data?.message || "Error deleting experience");
        }
    };

    const handleUpvote = async () => {
        setUpvotes(prev => prev + 1);
        try {
            const res = await axios.put(`/api/experiences/${experience._id}/upvote`, {}, { withCredentials: true });
            setUpvotes(res.data.data.upvotes.length);
            setDownvotes(res.data.data.downvotes.length);
        } catch (err) {
            setUpvotes(prev => prev - 1);
            toast.error("Failed to upvote");
        }
    };

    const handleDownvote = async () => {
        setDownvotes(prev => prev + 1);
        try {
            const res = await axios.put(`/api/experiences/${experience._id}/downvote`, {}, { withCredentials: true });
            setUpvotes(res.data.data.upvotes.length);
            setDownvotes(res.data.data.downvotes.length);
        } catch (err) {
            setDownvotes(prev => prev - 1);
            toast.error("Failed to downvote");
        }
    };
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-5 mb-5">
        <div className='flex justify-between items-center mb-3'>
            <div className='flex gap-1'>
                <h1 className='font-bold'>{experience.user.fullName}</h1>
                <h2 className='font-medium text-gray-700'>@{experience.user.username}</h2>
                {experience.user?.role === 'admin' && <ShieldCheck size={14} className="text-blue-500" />}
            </div>

            <div className='flex items-center gap-2'>
                {experience.company && (
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
                )}
                {(isOwner || isAdmin) && (
                    <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition cursor-pointer p-1">
                        <Trash2 size={18} />
                    </button>
                )}
            </div>
        </div>
        
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {experience.description}
        </p>
        
        <div className="flex items-center justify-between border-t pt-3">

        <div className="flex items-center gap-4">
          <button onClick={handleUpvote} className={`flex items-center gap-1 transition cursor-pointer ${hasUpvoted ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}>
            <ArrowUp size={18} />
            <span className="text-sm">{upvotes}</span>
          </button>

          <button onClick={handleDownvote} className={`flex items-center gap-1 transition cursor-pointer ${hasDownvoted ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}>
            <ArrowDown size={18} />
            <span className="text-sm">{downvotes}</span>
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