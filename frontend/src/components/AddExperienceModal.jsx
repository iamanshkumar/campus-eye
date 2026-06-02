import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../utils/api";
import toast from "react-hot-toast";
import { CircleX } from "lucide-react";

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

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data } = await api.get(`/api/companies`);
      setCompanies(data.data);
    };

    fetchCompanies();
  }, []);

  const handleAddingExperience = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        description: experience,
      };

      if (company === "other") {
        payload.unlistedCompanyName = unlistedCompanyName;
        payload.unlistedCompanyDetails = {
          ...unlistedCompanyDetails,
          location: unlistedCompanyDetails.location.split(',').map(l => l.trim()),
          devStack: unlistedCompanyDetails.devStack.split(',').map(d => d.trim()),
        };
      } else {
        payload.company = company;
      }

      const { data } = await api.post(`/api/experiences`, payload);

      toast.success(data.message);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error("Error in adding experience");
      console.log(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-amber-50 p-6 rounded-xl w-[400px] relative">
        <button onClick={onClose} className="absolute top-2 right-2">
          <CircleX
            size={17}
            className="text-black hover:text-red-500 cursor-pointer"
          />
        </button>

        <div className="mb-4">
          <h1 className="font-bold">{user.fullName}</h1>
          <h2 className="text-gray-500">@{user.username}</h2>
        </div>

        <form onSubmit={handleAddingExperience} className="flex flex-col gap-3">
          <textarea
            placeholder="Enter your experience"
            onChange={(e) => setExperience(e.target.value)}
            value={experience}
            className="border p-2 rounded bg-white"
          />

          <select
            onChange={(e) => setCompany(e.target.value)}
            value={company}
            className="border p-2 rounded bg-white"
          >
            <option value="">Select a company</option>

            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
            <option value="other">Other (Unlisted Company)</option>
          </select>

          {company === "other" && (
            <div className="flex flex-col gap-3 p-3 bg-emerald-50 rounded border border-emerald-100">
              <p className="text-xs text-emerald-800 font-semibold mb-1">Please provide some details about this company:</p>
              <input
                type="text"
                placeholder="Company Name"
                value={unlistedCompanyName}
                onChange={(e) => setUnlistedCompanyName(e.target.value)}
                className="border p-2 rounded bg-white"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Offered Package (LPA)"
                  value={unlistedCompanyDetails.offeredPackage}
                  onChange={(e) => setUnlistedCompanyDetails({...unlistedCompanyDetails, offeredPackage: e.target.value})}
                  className="border p-2 rounded bg-white w-full"
                  required
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Eligibility (CGPA)"
                  value={unlistedCompanyDetails.eligibility}
                  onChange={(e) => setUnlistedCompanyDetails({...unlistedCompanyDetails, eligibility: e.target.value})}
                  className="border p-2 rounded bg-white w-full"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Locations (comma separated)"
                value={unlistedCompanyDetails.location}
                onChange={(e) => setUnlistedCompanyDetails({...unlistedCompanyDetails, location: e.target.value})}
                className="border p-2 rounded bg-white"
                required
              />
              <input
                type="text"
                placeholder="Dev Stack (comma separated, e.g. React, Node.js)"
                value={unlistedCompanyDetails.devStack}
                onChange={(e) => setUnlistedCompanyDetails({...unlistedCompanyDetails, devStack: e.target.value})}
                className="border p-2 rounded bg-white"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-emerald-950 text-white py-2 rounded cursor-pointer"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExperienceModal;
