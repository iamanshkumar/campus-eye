import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../utils/api";
import toast from "react-hot-toast";
import { X, Sparkles } from "lucide-react";

const AddExperienceModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [company, setCompany] = useState("");
  const [unlistedCompanyName, setUnlistedCompanyName] = useState("");
  const [unlistedCompanyDetails, setUnlistedCompanyDetails] = useState({
    offeredPackage: '',
    eligibility: '',
    location: '',
    devStack: ''
  });
  const [experience, setExperience] = useState("");
  const [companies, setCompanies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchCompanies = async () => {
        try {
          const { data } = await api.get(`/api/companies`);
          setCompanies(data.data);
        } catch (err) {
          console.error("Fetch companies error", err);
        }
      };
      fetchCompanies();
    }
  }, [isOpen]);

  const handleAddingExperience = async (e) => {
    e.preventDefault();
    if (!experience.trim()) {
      toast.error("Please write your interview experience");
      return;
    }
    if (!company) {
      toast.error("Please select a company");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        description: experience,
      };

      if (company === "other") {
        payload.unlistedCompanyName = unlistedCompanyName;
        payload.unlistedCompanyDetails = {
          ...unlistedCompanyDetails,
          location: typeof unlistedCompanyDetails.location === 'string' ? unlistedCompanyDetails.location.split(',').map(l => l.trim()).filter(Boolean) : [],
          devStack: typeof unlistedCompanyDetails.devStack === 'string' ? unlistedCompanyDetails.devStack.split(',').map(d => d.trim()).filter(Boolean) : [],
        };
      } else {
        payload.company = company;
      }

      const { data } = await api.post(`/api/experiences`, payload);

      toast.success(data.message || "Experience shared successfully!");
      setExperience("");
      setCompany("");
      setUnlistedCompanyName("");
      setUnlistedCompanyDetails({ offeredPackage: '', eligibility: '', location: '', devStack: '' });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding experience");
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-black/65 backdrop-blur-xs flex justify-center items-start pt-28 md:pt-32 pb-10 z-[99999] p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 md:p-8 rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-200/90 relative animate-in zoom-in-95 duration-200"
      >
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2 bg-zinc-100 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 rounded-full transition-all cursor-pointer"
          title="Close"
        >
          <X size={18} />
        </button>

        <div className="mb-5 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} className="text-emerald-800" />
            <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Share Interview Experience</h2>
          </div>
          <p className="text-xs text-zinc-400 font-medium">
            Posting as <span className="font-bold text-zinc-700">{user?.fullName}</span> (@{user?.username})
          </p>
        </div>

        <form onSubmit={handleAddingExperience} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Your Experience & Questions</label>
            <textarea
              placeholder="Share the interview rounds, coding questions asked, tips, and difficulty..."
              onChange={(e) => setExperience(e.target.value)}
              value={experience}
              rows={4}
              required
              disabled={isSubmitting}
              className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 outline-none transition-all placeholder:text-zinc-400 resize-none disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Target Company</label>
            <select
              onChange={(e) => setCompany(e.target.value)}
              value={company}
              required
              disabled={isSubmitting}
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 outline-none transition-all disabled:opacity-50 cursor-pointer"
            >
              <option value="">Select a company from database</option>

              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
              <option value="other">➕ Other (Unlisted Company)</option>
            </select>
          </div>

          {company === "other" && (
            <div className="flex flex-col gap-3 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 animate-in fade-in duration-200">
              <p className="text-xs text-emerald-950 font-bold">Unlisted Company Details</p>
              <input
                type="text"
                placeholder="Company Name (e.g. Acme Corp)"
                value={unlistedCompanyName}
                onChange={(e) => setUnlistedCompanyName(e.target.value)}
                className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-zinc-900 text-xs font-medium focus:ring-2 focus:ring-emerald-800/20 outline-none"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Offered Package (LPA)"
                  value={unlistedCompanyDetails.offeredPackage}
                  onChange={(e) => setUnlistedCompanyDetails({...unlistedCompanyDetails, offeredPackage: e.target.value})}
                  className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-zinc-900 text-xs font-medium focus:ring-2 focus:ring-emerald-800/20 outline-none"
                  required
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Min CGPA Eligibility"
                  value={unlistedCompanyDetails.eligibility}
                  onChange={(e) => setUnlistedCompanyDetails({...unlistedCompanyDetails, eligibility: e.target.value})}
                  className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-zinc-900 text-xs font-medium focus:ring-2 focus:ring-emerald-800/20 outline-none"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Locations (comma separated, e.g. Bangalore, Remote)"
                value={unlistedCompanyDetails.location}
                onChange={(e) => setUnlistedCompanyDetails({...unlistedCompanyDetails, location: e.target.value})}
                className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-zinc-900 text-xs font-medium focus:ring-2 focus:ring-emerald-800/20 outline-none"
                required
              />
              <input
                type="text"
                placeholder="Dev Stack (comma separated, e.g. React, Node.js, C++)"
                value={unlistedCompanyDetails.devStack}
                onChange={(e) => setUnlistedCompanyDetails({...unlistedCompanyDetails, devStack: e.target.value})}
                className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-zinc-900 text-xs font-medium focus:ring-2 focus:ring-emerald-800/20 outline-none"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer mt-2 text-sm disabled:opacity-50"
          >
            {isSubmitting ? "Posting Experience..." : "Share Experience"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExperienceModal;
