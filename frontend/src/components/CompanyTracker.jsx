import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Trash2, Search, Plus, Building2, Loader2, CheckCircle } from 'lucide-react';

const CompanyTracker = () => {
    const [trackedCompanies, setTrackedCompanies] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [searchedTerm, setSearchedTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);

    const statusBadgeStyles = {
        targeting: 'bg-blue-50 text-blue-700 border-blue-200/80',
        applied: 'bg-amber-50 text-amber-700 border-amber-200/80',
        interviewed: 'bg-purple-50 text-purple-700 border-purple-200/80',
        selected: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        rejected: 'bg-rose-50 text-rose-700 border-rose-200/80'
    };

    const fetchTracked = async () => {
        try {
            const res = await api.get('/api/status');
            setTrackedCompanies(res.data.data);
        } catch (err) {
            toast.error('Failed to load tracked companies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTracked();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchedTerm.trim().length < 2) {
                setSearchResult([]);
                return;
            }

            setIsSearching(true);
            try {
                const res = await api.get(`/api/companies?name=${searchedTerm}`);
                const trackedIds = trackedCompanies.map(item => item.company._id);
                const filtered = res.data.data.filter(c => !trackedIds.includes(c._id));
                setSearchResult(filtered);
            } catch (err) {
                console.log('Search error : ', err);
            } finally {
                setIsSearching(false);
            }
        }, 350);

        return () => clearTimeout(delayDebounceFn);
    }, [searchedTerm, trackedCompanies]);

    const handleAddCompany = async (companyId) => {
        try {
            const res = await api.post('/api/status', { company: companyId });
            if (res.data.success) {
                toast.success('Added to your target list');
                setSearchedTerm('');
                setSearchResult([]);
                fetchTracked();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Already targeting this company");
        }
    };

    const handleStatusChange = async (companyId, newStatus) => {
        try {
            await api.put(`/api/status/${companyId}`, { status: newStatus });
            setTrackedCompanies(prev => prev.map(item =>
                item.company._id === companyId ? { ...item, status: newStatus } : item
            ));
            toast.success(`Status updated`);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleRemove = async (companyId) => {
        if (!window.confirm("Remove this company from your tracked list?")) return;
        try {
            await api.delete(`/api/status/${companyId}`);
            setTrackedCompanies(prev => prev.filter(item => item.company._id !== companyId));
            toast.success("Removed successfully");
        } catch (err) {
            toast.error("Failed to remove");
        }
    };

    return (
        <div className="space-y-6">
            {/* Search & Add Bar */}
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search companies to track (e.g. Google, Adobe)..."
                        value={searchedTerm}
                        onChange={(e) => setSearchedTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-200/90 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-800/30 focus:border-emerald-700 transition-all text-xs md:text-sm font-medium text-zinc-800 shadow-2xs placeholder:text-zinc-400"
                    />
                    {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-emerald-800" size={18} />}
                </div>

                {searchResult.length > 0 && (
                    <div className="absolute z-40 w-full mt-2 bg-white border border-zinc-200 rounded-2xl shadow-xl max-h-64 overflow-y-auto p-1.5 animate-in fade-in duration-200">
                        {searchResult.map(company => (
                            <div key={company._id} className="flex items-center justify-between p-2.5 hover:bg-zinc-50 rounded-xl transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-zinc-50 rounded-xl p-1 flex items-center justify-center border border-zinc-200/80 shrink-0">
                                        <img src={company.logo} alt="" className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900 text-xs">{company.name}</p>
                                        <p className="text-[11px] text-zinc-500">₹{company.offeredPackage} LPA • {company.location[0]}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAddCompany(company._id)}
                                    className="px-3 py-1.5 bg-emerald-950 text-white rounded-xl hover:bg-emerald-900 transition-all text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                                >
                                    <Plus size={14} /> Track
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* List Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-bold text-zinc-900 tracking-tight">Targeted Companies</h4>
                    <p className="text-xs text-zinc-400 font-medium">Keep track of your placement applications</p>
                </div>
                <span className="text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
                    {trackedCompanies.length} Tracked
                </span>
            </div>

            {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="animate-spin text-emerald-900" size={28} /></div>
            ) : trackedCompanies.length === 0 ? (
                <div className="text-center py-12 bg-white/70 rounded-3xl border border-dashed border-zinc-200/80 shadow-2xs">
                    <Building2 className="mx-auto text-zinc-300 mb-2.5" size={40} />
                    <p className="text-zinc-800 font-bold text-sm">No companies tracked yet</p>
                    <p className="text-zinc-400 text-xs mt-0.5">Use the search bar above to start tracking companies!</p>
                </div>
            ) : (
                /* Ultra-Clean Minimal List View */
                <div className="space-y-2.5">
                    {trackedCompanies.map((item) => (
                        <div 
                            key={item._id} 
                            className="bg-white border border-zinc-200/80 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs hover:shadow-sm hover:border-zinc-300 transition-all group"
                        >
                            <div className="flex items-center gap-3.5 w-full md:w-auto">
                                <div className="w-11 h-11 bg-zinc-50 rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-zinc-200/80">
                                    <img src={item.company.logo} alt="" className="max-w-full max-h-full object-contain" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h5 className="font-bold text-zinc-900 text-sm">{item.company.name}</h5>
                                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                            ₹{item.company.offeredPackage} LPA
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-400 font-medium mt-0.5 flex items-center gap-1">
                                        <CheckCircle size={12} className="text-emerald-600" />
                                        Targeted on {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2.5 md:pt-0 border-zinc-100">
                                <select
                                    value={item.status}
                                    onChange={(e) => handleStatusChange(item.company._id, e.target.value)}
                                    className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border outline-none cursor-pointer transition-all ${statusBadgeStyles[item.status]}`}
                                >
                                    <option value="targeting">Targeting</option>
                                    <option value="applied">Applied</option>
                                    <option value="interviewed">Interviewed</option>
                                    <option value="selected">Selected</option>
                                    <option value="rejected">Rejected</option>
                                </select>

                                <button
                                    onClick={() => handleRemove(item.company._id)}
                                    className="p-1.5 text-zinc-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                    title="Remove from target list"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanyTracker;