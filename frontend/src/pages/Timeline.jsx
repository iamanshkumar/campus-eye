import React, { useEffect, useState , useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import CompanyCard from '../components/CompanyCard.jsx';
import CompanyModal from '../components/CompanyModal.jsx';
import FilterBar from '../components/FilterBar.jsx';
import {useAuth} from '../context/AuthContext.jsx';
import { Plus ,Loader2 , Inbox } from 'lucide-react';

const Timeline = () => {
    const {user} = useAuth();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen , setIsModalOpen] = useState(false);
    const [editingCompany , setEditingCompany] = useState(null);
    const isAdmin = user?.role === 'admin';

    const [filters, setFilters] = useState({
        devStack: '',
        minPackage: '',
        eligibility: '',
        status: ''
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.devStack) params.append('devStack', filters.devStack);
            if (filters.minPackage) params.append('minPackage', filters.minPackage);
            if (filters.eligibility) params.append('eligibility', filters.eligibility);
            if (filters.status) params.append('status', filters.status);

            const { data } = await axios.get(`/api/companies?${params.toString()}`, { 
                withCredentials: true 
            });
            setCompanies(data.data);
        } catch (err) {
            toast.error("Error fetching companies");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 400); 

        return () => clearTimeout(timer);
    }, [fetchData])

    const handleEdit = (company)=>{
        setEditingCompany(company);
        setIsModalOpen(true);
    }

    const handleClear = () => {
        setFilters({ devStack: '', minPackage: '', eligibility: '', status: '' });
    };

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

            <FilterBar filters={filters} setFilters={setFilters} onClear={handleClear} />

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-emerald-800/40">
                    <Loader2 className="animate-spin mb-2" size={40} />
                    <p className="font-bold">Updating Timeline...</p>
                </div>
            ) : companies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-4xl border-2 border-dashed border-emerald-100">
                    <Inbox size={48} className="text-emerald-200 mb-4" />
                    <p className="text-emerald-900/40 font-bold text-lg">No companies match your filters.</p>
                    <button onClick={handleClear} className="mt-2 text-emerald-700 hover:underline font-bold cursor-pointer">Clear all filters</button>
                </div>
            ) : (
                <div className='flex flex-col gap-6 mt-3'>
                    {companies.map((company) => (
                        <div key={company._id} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <CompanyCard 
                                company={company} 
                                isAdmin={isAdmin} 
                                onEdit={() => { setEditingCompany(company); setIsModalOpen(true); }} 
                            />
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

export default Timeline