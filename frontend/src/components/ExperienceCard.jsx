import React , {useState} from 'react'
import {ArrowUp , ArrowDown , MessageCircle , Trash2 ,ShieldCheck, ChevronDown, ChevronUp, Building} from 'lucide-react'
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import CommentSection from './CommentSection';
import { useAuth } from '../context/AuthContext';

const ExperienceCard = ({experience , onDelete}) => {
    const {user} = useAuth();
    const [showComments , setShowComments] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const getCount = (votes) => {
        if (Array.isArray(votes)) return votes.length;
        if (typeof votes === 'number') return votes;
        return 0;
    };

    const [upvotes, setUpvotes] = useState(getCount(experience.upvotes));
    const [downvotes, setDownvotes] = useState(getCount(experience.downvotes));
    const [userUpvoted, setUserUpvoted] = useState(Array.isArray(experience.upvotes) ? experience.upvotes.includes(user?._id) : false);
    const [userDownvoted, setUserDownvoted] = useState(Array.isArray(experience.downvotes) ? experience.downvotes.includes(user?._id) : false);

    const isOwner = user?._id === experience.user?._id;
    const isAdmin = user?.role === 'admin';

    const isLongDescription = experience.description && experience.description.length > 280;

    const handleDelete = async () => {
        if (!window.confirm("Delete this interview experience permanently?")) return;
        try {
            await api.delete(`/api/experiences/${experience._id}`);
            toast.success("Experience deleted");
            if (onDelete) onDelete(experience._id);
        } catch (err) {
            toast.error(err.response?.data?.message || "Error deleting experience");
        }
    };

    const handleUpvote = async () => {
        try {
            const res = await api.put(`/api/experiences/${experience._id}/upvote`, {});
            if (res.data.success) {
                const newUpvotes = res.data.data.upvotes || [];
                const newDownvotes = res.data.data.downvotes || [];
                setUpvotes(newUpvotes.length);
                setDownvotes(newDownvotes.length);
                setUserUpvoted(newUpvotes.includes(user?._id));
                setUserDownvoted(newDownvotes.includes(user?._id));
            }
        } catch (err) {
            toast.error("Failed to upvote");
        }
    };

    const handleDownvote = async () => {
        try {
            const res = await api.put(`/api/experiences/${experience._id}/downvote`, {});
            if (res.data.success) {
                const newUpvotes = res.data.data.upvotes || [];
                const newDownvotes = res.data.data.downvotes || [];
                setUpvotes(newUpvotes.length);
                setDownvotes(newDownvotes.length);
                setUserUpvoted(newUpvotes.includes(user?._id));
                setUserDownvoted(newDownvotes.includes(user?._id));
            }
        } catch (err) {
            toast.error("Failed to downvote");
        }
    };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/80 p-5 md:p-6 mb-4 relative group">
        <div className='flex justify-between items-start mb-4'>
            <div className='flex items-center gap-3'>
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-sm shadow-inner">
                    {experience.user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                    <div className='flex items-center gap-1.5'>
                        <h1 className='font-bold text-gray-900 text-sm md:text-base'>{experience.user?.fullName}</h1>
                        {experience.user?.role === 'admin' && <ShieldCheck size={16} className="text-emerald-600" />}
                    </div>
                    <p className='text-xs font-medium text-gray-400'>@{experience.user?.username}</p>
                </div>
            </div>

            <div className='flex items-center gap-2'>
                {experience.company ? (
                    <div className='flex items-center gap-2 bg-emerald-50/70 border border-emerald-100 px-3 py-1.5 rounded-full shadow-xs'>
                        {experience.company.logo ? (
                            <img
                                src={experience.company.logo}
                                alt={experience.company.name}
                                className="w-4 h-4 object-contain"
                            />
                        ) : (
                            <Building size={14} className="text-emerald-700" />
                        )}
                        <span className="text-xs font-semibold text-emerald-900">
                            {experience.company.name}
                        </span>
                    </div>
                ) : experience.unlistedCompanyName ? (
                    <div className='flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold text-amber-900'>
                        <Building size={12} />
                        {experience.unlistedCompanyName}
                    </div>
                ) : null}

                {(isOwner || isAdmin) && (
                    <button 
                        onClick={handleDelete} 
                        className="text-gray-300 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all cursor-pointer"
                        title="Delete Experience"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </div>
        
        <div className="relative">
            <p className={`text-gray-700 text-sm leading-relaxed whitespace-pre-line ${!isExpanded && isLongDescription ? 'line-clamp-4' : ''}`}>
                {experience.description}
            </p>

            {isLongDescription && (
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer transition-colors"
                >
                    {isExpanded ? (
                        <>Show Less <ChevronUp size={14} /></>
                    ) : (
                        <>Read Full Experience <ChevronDown size={14} /></>
                    )}
                </button>
            )}
        </div>
        
        <div className="flex items-center justify-between border-t border-gray-100 mt-4 pt-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-2 py-1">
                <button 
                    onClick={handleUpvote} 
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        userUpvoted 
                            ? 'bg-emerald-100 text-emerald-800 shadow-xs' 
                            : 'text-gray-500 hover:text-emerald-700 hover:bg-emerald-50'
                    }`}
                >
                    <ArrowUp size={15} className={userUpvoted ? "stroke-[3]" : ""} />
                    <span>{upvotes}</span>
                </button>

                <div className="w-[1px] h-3 bg-gray-200" />

                <button 
                    onClick={handleDownvote} 
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        userDownvoted 
                            ? 'bg-rose-100 text-rose-800 shadow-xs' 
                            : 'text-gray-500 hover:text-rose-700 hover:bg-rose-50'
                    }`}
                >
                    <ArrowDown size={15} className={userDownvoted ? "stroke-[3]" : ""} />
                    <span>{downvotes}</span>
                </button>
            </div>

            <button 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    showComments 
                        ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-800'
                }`}
                onClick={() => setShowComments(!showComments)}
            >
                <MessageCircle size={15} />
                <span>Discussion</span>
            </button>
        </div>

        {showComments && (
            <div className="mt-4 pt-3 border-t border-gray-100 animate-in fade-in duration-300">
                <CommentSection experienceID={experience._id} />
            </div>
        )}
    </div>
  )
}

export default ExperienceCard