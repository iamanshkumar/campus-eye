import React , {useState} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {ArrowUp , ArrowDown , MessageCircle , X} from 'lucide-react';

const CommentNode = ({comment ,experienceID})=>{
    const [isReplying , setIsReplying] = useState(false);
    const [replyText , setReplyText] = useState('');
    const [isSubmitting , setIsSubmitting] = useState(false);
    const [localReplies , setLocalReplies] = useState(comment.replies || []);

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
    return (
        <div className="bg-white p-3 rounded-lg text-sm border border-gray-100 shadow-sm mb-3">
        <div className="flex gap-2 items-center mb-1">
            <span className="font-bold text-gray-800">{comment.user?.fullName}</span>
            <span className="font-medium text-gray-500">@{comment.user?.username}</span>
        </div>

        <p className="text-gray-700 mt-1 mb-2">{comment.description}</p>

        <div className="flex items-center gap-4 border-t pt-2 mt-2">
            <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition">
                <ArrowUp size={16}/>
                <span className="text-xs">{comment.upvotes || 0}</span>
            </button>

            <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition">
                <ArrowDown size={16}/>
                <span className="text-xs">{comment.downvotes || 0}</span>
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
                    <CommentNode key={reply._id} comment={reply} experienceID={experienceID} />
                ))}
            </div>
        )}
    </div>
    )
    
}

export default CommentNode;