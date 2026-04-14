import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const FilterBar = ({ filters, setFilters, onClear }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-emerald-100 rounded-3xl p-4 mb-6 shadow-sm flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 flex-1 min-w-[200px]">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Search tech (e.g. React, Java)..." 
          name="devStack"
          value={filters.devStack}
          onChange={handleChange}
          className="bg-transparent outline-none text-sm w-full font-medium"
        />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Min Package Filter */}
        <select 
          name="minPackage" 
          value={filters.minPackage} 
          onChange={handleChange}
          className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-emerald-900 outline-none cursor-pointer hover:bg-emerald-50 transition-colors"
        >
          <option value="">Min Package</option>
          <option value="5">5+ LPA</option>
          <option value="10">10+ LPA</option>
          <option value="15">15+ LPA</option>
          <option value="25">25+ LPA</option>
        </select>

        {/* CGPA Eligibility Filter */}
        <select 
          name="eligibility" 
          value={filters.eligibility} 
          onChange={handleChange}
          className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-emerald-900 outline-none cursor-pointer hover:bg-emerald-50 transition-colors"
        >
          <option value="">Max CGPA Req.</option>
          <option value="6">6.0 & below</option>
          <option value="7">7.0 & below</option>
          <option value="8">8.0 & below</option>
          <option value="9">9.0 & below</option>
        </select>

        {/* Status Filter */}
        <select 
          name="status" 
          value={filters.status} 
          onChange={handleChange}
          className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-emerald-900 outline-none cursor-pointer hover:bg-emerald-50 transition-colors"
        >
          <option value="">Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="visited">Visited</option>
        </select>

        <button 
          onClick={onClear}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          title="Clear Filters"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default FilterBar;