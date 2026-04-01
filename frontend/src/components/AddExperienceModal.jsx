import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { CircleX } from "lucide-react";

const AddExperienceModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [company, setCompany] = useState("");
  const [experience, setExperience] = useState("");
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/companies`,
      {withCredentials : true});
      setCompanies(data.data);
    };

    fetchCompanies();
  }, []);

  const handleAddingExperience = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/experiences`,
        { description: experience, company },
        { withCredentials: true },
      );

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
          </select>

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
