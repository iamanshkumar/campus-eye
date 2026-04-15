import React , {useEffect , useState} from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {Trash2 , Search , Plus , Building2 , CheckCircle , Loader2} from 'lucide-react';

const CompanyTracker = ()=>{
    const [trackedCompanies , setTrackedCompanies] = useState([]);
    const [searchResult , setSearchResult] = useState([]);
    const [searchedTerm , setSearchedTerm] = useState('');
    const [isSearching , setIsSearching] = useState(false);
    const [loading , setLoading] = useState(false);

    const statusColors = {
        targeting: 'bg-blue-100 text-blue-700',
        applied: 'bg-yellow-100 text-yellow-700',
        interviewed: 'bg-purple-100 text-purple-700',
        selected: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700'
    };

    const fetchTracked = async()=>{
        try{
            const res = await api.get('/api/status');
            setTrackedCompanies(res.data.data);
        }catch(err){
            toast.error('Failed to load tracked companies')
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchTracked();
    },[]);

    useEffect(()=>{
        const delayDebounceFn = setTimeout(async()=>{
            if(searchedTerm.trim().length<2){
                setSearchResult([]);
                return;
            }

            setIsSearching(true);
            try{
                const res = await api.get(`/api/companies?name=${searchedTerm}`);
                const trackedIds = trackedCompanies.map(item=>item.company._id);
                const filtered = res.data.data.filter(c=>!trackedIds.includes(c._id));
                setSearchResult(filtered);
            }catch(err){
                console.log('Search error : ' , err);
            }finally{
                setIsSearching(false);
            }
        },500);

        return()=>clearTimeout(delayDebounceFn);
    } , [searchedTerm , trackedCompanies]);

    const handleAddCompany = async(companyId)=>{
        try{
            const res = await api.post('/api/status', { company: companyId });
            if(res.data.success){
                toast.success('Added to your target');
                setSearchedTerm('');
                setSearchResult([]);
                fetchTracked();
            }
        }catch(err){
            toast.error(err.response?.data?.message || "Already targeting this company");
        }
    };

    const handleStatusChange = async (companyId, newStatus) => {
        try {
            await api.put(`/api/status/${companyId}`, { status: newStatus });
            setTrackedCompanies(prev => prev.map(item => 
                item.company._id === companyId ? { ...item, status: newStatus } : item
            ));
            toast.success(`Moved to ${newStatus}`);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleRemove = async (companyId) => {
        if (!window.confirm("Remove this company from your dashboard?")) return;
        try {
            await api.delete(`/api/status/${companyId}`);
            setTrackedCompanies(prev => prev.filter(item => item.company._id !== companyId));
            toast.success("Removed successfully");
        } catch (err) {
            toast.error("Failed to remove");
        }
    };

    return(
        <div className="space-y-8">
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Search companies to target (e.g. Google, Adobe)..."
                        value={searchedTerm}
                        onChange={(e) => setSearchedTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                    />
                    {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-emerald-600" size={20} />}
                </div>
                {searchResult.length > 0 && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto p-2">
                        {searchResult.map(company => (
                            <div key={company._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg p-1 flex items-center justify-center">
                                        <img src={company.logo} alt="" className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{company.name}</p>
                                        <p className="text-xs text-gray-500">₹{company.offeredPackage} LPA • {company.location[0]}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleAddCompany(company._id)}
                                    className="p-2 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-800 hover:text-white transition-all cursor-pointer"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Your Application Funnel</h4>
                
                {loading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-300" /></div>
                ) : trackedCompanies.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <Building2 className="mx-auto text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500 font-medium">No companies tracked yet. Use the search bar above!</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {trackedCompanies.map((item) => (
                            <div key={item._id} className="bg-white border border-gray-100 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="w-14 h-14 bg-gray-50 rounded-xl p-2 flex items-center justify-center shrink-0">
                                        <img src={item.company.logo} alt="" className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h5 className="font-bold text-gray-900 truncate">{item.company.name}</h5>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <CheckCircle size={12} className="text-emerald-500" /> 
                                            Targeted on {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                                    <select 
                                        value={item.status}
                                        onChange={(e) => handleStatusChange(item.company._id, e.target.value)}
                                        className={`text-xs font-bold px-4 py-2 rounded-xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer ${statusColors[item.status]}`}
                                    >
                                        <option value="targeting">Targeting</option>
                                        <option value="applied">Applied</option>
                                        <option value="interviewed">Interviewed</option>
                                        <option value="selected">Selected</option>
                                        <option value="rejected">Rejected</option>
                                    </select>

                                    <button 
                                        onClick={() => handleRemove(item.company._id)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CompanyTracker;