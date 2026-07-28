import React from 'react'
import {Calendar , IndianRupee , Target , Pencil, MapPin} from 'lucide-react'

const CompanyCard = ({company ,isAdmin, onEdit}) => {
  return (
    <div
      className="bg-white rounded-3xl shadow-2xs hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 p-6 border border-zinc-200/80 relative group"
    >
      {isAdmin && (
          <button 
              onClick={onEdit}
              className="absolute top-5 right-5 p-2 bg-emerald-50 text-emerald-800 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-100 cursor-pointer shadow-xs"
              title="Edit Company"
          >
              <Pencil size={16} />
          </button>
      )}

      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-zinc-50 rounded-2xl p-2 border border-zinc-200/80 flex items-center justify-center shrink-0 shadow-2xs">
          <img
            src={company.logo}
            alt={company.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-zinc-900 leading-tight">
            {company.name}
          </h2>
          <p className="text-xs text-zinc-400 font-medium flex items-center gap-1 mt-0.5">
            <MapPin size={12} className="text-zinc-400" />
            {company.location.join(", ")}
          </p>
        </div>
      </div>

      <p className="text-zinc-600 text-xs md:text-sm leading-relaxed mb-5 line-clamp-3 font-normal">
        {company.description}
      </p>

      {/* Package & Eligibility Metrics */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-xl text-emerald-900 text-xs font-bold">
          <IndianRupee size={14} className="text-emerald-700"/>
          <span>{company.offeredPackage} LPA</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200/60 rounded-xl text-blue-900 text-xs font-bold">
          <Target size={14} className="text-blue-700"/>
          <span>{company.eligibility} CGPA+</span>
        </div>
      </div>

      {/* Tech Stack Chips */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {company.devStack.map((tech, index) => (
          <span
            key={index}
            className="text-[11px] font-semibold bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-lg border border-zinc-200/60"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center pt-3 border-t border-zinc-100">
        <span className="text-xs text-zinc-500 font-medium flex items-center gap-1.5">
          <Calendar size={14} className="text-zinc-400"/> {new Date(company.visitingDate).toLocaleDateString()}
        </span>
        <span
          className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
            company.status === "upcoming"
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "bg-zinc-100 text-zinc-600 border border-zinc-200"
          }`}
        >
          {company.status}
        </span>
      </div>
    </div>
  )
}

export default CompanyCard