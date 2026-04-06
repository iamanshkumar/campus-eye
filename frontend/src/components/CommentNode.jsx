import React , {useState} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {ArrowUp , ArrowDown , MessageCircle , Trash2 , ShieldCheck} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CommentNode = ({comment ,experienceID , onDeleteTopLevel})=>{
    const {user} = useAuth();

    const [isReplying , setIsReplying] = useState(false);
    const [replyText , setReplyText] = useState('');
    const [isSubmitting , setIsSubmitting] = useState(false);
    const [localReplies , setLocalReplies] = useState(comment.replies || []);
    
    const getCount = (votes) => {
        if (Array.isArray(votes)) return votes.length;
        if (typeof votes === 'number') return votes;
        return 0;
    };

    const [upvotes, setUpvotes] = useState(getCount(comment.upvotes));
    const [downvotes, setDownvotes] = useState(getCount(comment.downvotes));
    
    const hasUpvoted = comment.upvotes?.includes(user?._id);
    const hasDownvoted = comment.downvotes?.includes(user?._id);


    const handleDelete = async()=>{
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try{
            await axios.delete(`/api/comments/${comment._id}`, { withCredentials: true });
            toast.success("Comment deleted");
            if (onDeleteTopLevel) {
                onDeleteTopLevel(comment._id);
            }
        }catch(err){
            toast.error(err.response?.data?.message || "Error deleting comment");
        }
    }

    const handleReplySubmit = async(e)=>{
        e.preventDefault();
        if(!replyText.trim()){
            return;
        }
        setIsSubmitting(true);
            try{
                const res = await axios.post(`/api/comments`,{
                    experienceId : experienceID,
                    description : replyText,
                    parentCommentId : comment._id
                },{
                    withCredentials : true
                });

                if(res.data.success){
                    toast.success("Reply added!")
                    setReplyText('');
                    setIsReplying(false);
                    const newReplyData = { ...res.data.data, replies: [] };
                    setLocalReplies(prev => [...prev, newReplyData]);
                }
            }catch(err){
                console.error("Error posting reply", err);
                toast.error(err.response?.data?.message || "Failed to post reply");
            }finally{
                setIsSubmitting(false);
            }
    }

    const handleUpvote = async()=>{
        setUpvotes(prev=>prev+1);
        try{
            const res = await axios.put(`/api/comments/${comment._id}/upvote`, {}, { withCredentials: true });
            setUpvotes(res.data.data.upvotes.length);
            setDownvotes(res.data.data.downvotes.length);
        }catch(err){
            setUpvotes(prev => prev - 1);
            toast.error("Failed to upvote");
        }
    }

    const handleDownvote = async () => {
        setDownvotes(prev => prev + 1); 
        try {
            const res = await axios.put(`/api/comments/${comment._id}/downvote`, {}, { withCredentials: true });
            setUpvotes(res.data.data.upvotes.length);
            setDownvotes(res.data.data.downvotes.length);
        } catch (err) {
            setDownvotes(prev => prev - 1);
            toast.error("Failed to downvote");
        }
    };
    return (
        <div className="bg-white p-3 rounded-lg text-sm border border-gray-100 shadow-sm mb-3">
            
        <div className="flex justify-between items-start mb-1">
                <div className="flex gap-2 items-center">
                    <span className="font-bold text-gray-800">{comment.user?.fullName}</span>
                    <span className="font-medium text-gray-500">@{comment.user?.username}</span>
                </div>
                
                {(user?._id === comment.user?._id || user?.role === 'admin') && (
                    <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition cursor-pointer">
                        <Trash2 size={14} />
                    </button>
                )}
        </div>

        <p className="text-gray-700 mt-1 mb-2">{comment.description}</p>

        <div className="flex items-center gap-4 border-t pt-2 mt-2">
            <button onClick={handleUpvote} className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition">
                <ArrowUp size={16} fill={hasUpvoted ? "currentColor" : "none"}/>
                <span className="text-xs">{upvotes}</span>
            </button>

            <button onClick={handleDownvote} className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition">
                <ArrowDown size={16} fill={hasDownvoted ? "currentColor" : "none"}/>
                <span className="text-xs">{downvotes}</span>
            </button>

            <button onClick={()=>setIsReplying(!isReplying)}
             className={`flex items-center gap-1 transition ml-2 ${isReplying ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                <MessageCircle size={16}/>
                <span className="text-xs">{isReplying ? 'Cancel' : 'Reply'}</span>
            </button>
        </div>

        {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <textarea
                        value={replyText}
                        onChange={(e)=>setReplyText(e.target.value)}
                        placeholder={`Replying to @${comment.user?.username}...`}
                        className="w-full p-2 text-sm bg-transparent focus:outline-none resize-none"
                        rows="2"
                        disabled={isSubmitting}
                        autoFocus
                    />

                    <div className="flex justify-end gap-2">
                        <button type="button"
                                onClick={() => setIsReplying(false)}
                                className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!replyText.trim() || isSubmitting}
                            className={`px-3 py-1.5 text-xs font-medium text-white rounded-md transition-colors ${
                                !replyText.trim() || isSubmitting
                                    ? 'bg-emerald-600 cursor-not-allowed'
                                    : 'bg-emerald-800 hover:bg-emerald-900 hover:cursor-pointer'
                            }`}
                        >
                            {isSubmitting ? 'Posting...' : 'Reply'}
                        </button>
                    </div>
                </div>
            </form>
        )}


        {localReplies && localReplies.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-2">
                {localReplies.map((reply) => (
                    <CommentNode key={reply._id} 
                    comment={reply} 
                    experienceID={experienceID} 
                    onDeleteTopLevel={(id) => setLocalReplies(prev => prev.filter(r => r._id !== id))}
                    />
                ))}
            </div>
        )}
    </div>
    )
    
}

export default CommentNode;