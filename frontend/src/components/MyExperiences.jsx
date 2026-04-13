import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import ExperienceCard from './ExperienceCard';

const MyExperiences = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyPosts = async () => {
        try {
            const res = await axios.get('/api/experiences/me', { withCredentials: true });
            setPosts(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error("Could not load your posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, []);
    const handleRemoveFromList = (deletedId) => {
        setPosts(prev => prev.filter(post => post._id !== deletedId));
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
        </div>
    );

    if (posts.length === 0) return (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
            <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">You haven't shared any experiences yet.</p>
        </div>
    );

    return (
        <div className="space-y-2">
            {posts.map((post) => (
                <ExperienceCard 
                    key={post._id} 
                    experience={post} 
                    onDelete={handleRemoveFromList}
                />
            ))}
        </div>
    );
};

export default MyExperiences;