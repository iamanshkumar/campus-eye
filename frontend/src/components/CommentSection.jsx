import React, { useEffect, useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast'
import {ArrowUp , ArrowDown} from 'lucide-react'

const CommentSection = ({ experienceID }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${experienceID}`, { withCredentials: true });
            console.log(res.data);
            setComments(res.data.data);
        } catch (err) {
            console.log("Error in fetching comments", err);
            toast.error("Error while fetching comments");
        }
    }

    return (
        <div className='p-2 m-2.5'>
            <div className="space-y-2">
                {comments.map((c) => (
                    <div key={c._id} className="bg-gray-50 p-2 rounded-lg text-sm">
                        <span className="font-medium">{c.user?.username}</span>
                        <p>{c.description}</p>

                        <div className="flex items-center justify-between border-t pt-3">

                            <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition">
                                <ArrowUp size={18} />
                                <span className="text-sm">{c.upvotes}</span>
                            </button>

                            <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition">
                                <ArrowDown size={18} />
                                <span className="text-sm">{c.downvotes}</span>
                            </button>
                        </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default CommentSection