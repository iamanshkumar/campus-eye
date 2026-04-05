import React, { useEffect, useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast'
import CommentNode from './CommentNode';

const CommentSection = ({ experienceID }) => {
    const [comments, setComments] = useState([]);
    const [newText , setNewText] = useState('');
    const [isSubmitting , setIsSubmitting]= useState(false);
    useEffect(() => {
        fetchComments();
    }, [experienceID]);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`/api/comments/${experienceID}`, { withCredentials: true });
            setComments(res.data.data);
        } catch (err) {
            console.log("Error in fetching comments", err);
            toast.error("Error while fetching comments");
        }
    }

    const handlePostComment = async(e)=>{
        e.preventDefault();
        if(!newText.trim()){
            return;
        }

        setIsSubmitting(true);
        try{
            const res = await axios.post(`/api/comments`,{experienceId: experienceID, // Make sure casing matches what your backend expects!
        description: newText,},
                {withCredentials:true}
            );

            if(res.data.success){
                toast.success("Comment posted successfully");
                setNewText('');
                
                const newCommentData = {...res.data.data , replies:[]};
                setComments(prevComments=>[newCommentData , ...prevComments]);
            }
        }catch(err){
            console.log("Error posting comment", err);
            toast.error(err.response?.data?.message || "Failed to post comment")
        }finally{
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            
            <div className="mt-4 p-2 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 ml-1">Discussion</h3>
                
                <form onSubmit={handlePostComment} className="mb-6 flex flex-col gap-2">
                    <textarea value={newText} onChange={(e)=>setNewText(e.target.value)}
                        placeholder='Add to discussion...'
                        rows="2"
                        disabled={isSubmitting}
                        className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none bg-white"
                    />

                    <div className="flex justify-end">
                        <button type='submit'
                            disabled={!newText.trim() || isSubmitting}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 ${
                            !newText.trim() || isSubmitting
                                ? 'bg-emerald-600 cursor-not-allowed'
                                : 'bg-emerald-800 hover:bg-emerald-900 hover:cursor-pointer'
                        }`}>
                                {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>

                </form>

                <div className="space-y-1">
                    {comments.length>0 ? (
                        comments.map((c)=>(
                            <CommentNode key={c._id} comment={c} experienceID={experienceID}/>
                        ))
                    ) : <p className="text-sm text-gray-500 italic ml-1">No comments yet. Be the first to share your thoughts!</p>}
                </div>
            </div>
        </div>
        
    )
}

export default CommentSection