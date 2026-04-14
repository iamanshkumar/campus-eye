import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import CompanyCard from '../components/CompanyCard.jsx';
import CompanyModal from '../components/CompanyModal.jsx';
import {useAuth} from '../context/AuthContext.jsx';
import { Plus } from 'lucide-react';

const Timeline = () => {
    const {user} = useAuth();
    const [companies, setCompanies] = useState([]);
    const [isModalOpen , setIsModalOpen] = useState(false);
    const [editingCompany , setEditingCompany] = useState(null);
    const isAdmin = user?.role === 'admin';

    const fetchData = async () => {
        try {
            const { data } = await axios.get(`/api/companies`, {
                withCredentials: true
            });
            setCompanies(data.data)
        } catch (err) {
            toast.error("Error while fetching companies details");
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const handleEdit = (company)=>{
        setEditingCompany(company);
        setIsModalOpen(true);
    }

    return (
        <div className='relative w-full max-w-4xl mx-auto'>
            {isAdmin && (
                <button 
                    onClick={() => { setEditingCompany(null); setIsModalOpen(true); }}
                    className="fixed bottom-10 right-10 z-50 bg-emerald-900 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer border-4 border-white"
                >
                    <Plus size={32} strokeWidth={3} />
                </button>
            )}

            <CompanyModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                companyToEdit={editingCompany}
                onRefresh={fetchData}
            />

            <div className='flex flex-col gap-6 mt-3'>
                {companies.map((company) => (
                    <div key={company._id} className="relative group">
                        <CompanyCard 
                            company={company} 
                            isAdmin={isAdmin} 
                            onEdit={() => handleEdit(company)}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Timeline