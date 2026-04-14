import React from 'react'
import {Calendar , IndianRupee , Target , Pencil} from 'lucide-react'

const CompanyCard = ({company ,isAdmin, onEdit}) => {
  return (
    <div
    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100"
  >
    {isAdmin && (
        <button 
            onClick={onEdit}
            className="absolute top-4 right-4 p-2 bg-emerald-50 text-emerald-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-100 cursor-pointer"
        >
            <Pencil size={18} />
        </button>
    )}

    <div className="flex items-center gap-4 mb-4">
      <img
        src={company.logo}
        alt={company.name}
        className="w-14 h-14 object-contain rounded-xl border p-1 bg-gray-50"
      />
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {company.name}
        </h2>
        <p className="text-sm text-gray-500">
          {company.location.join(", ")}
        </p>
      </div>
    </div>


    <p className="text-gray-600 text-sm mb-4">
      {company.description}
    </p>


    <div className="flex justify-between text-sm mb-3">
      <span className="font-medium text-gray-700 bg-green-50 rounded-3xl p-2.5 flex items-center gap-1">
        <IndianRupee className='size-4'/>{company.offeredPackage} LPA
      </span>
      <span className="text-blue-600 font-medium bg-blue-50 rounded-3xl p-2.5 flex items-center gap-1">
        <Target className='size-4'/>{company.eligibility} CGPA+
      </span>
    </div>


    <div className="flex flex-wrap gap-2 mb-4">
      {company.devStack.map((tech, index) => (
        <span
          key={index}
          className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700"
        >
          {tech}
        </span>
      ))}
    </div>

    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500 bg-blue-50 rounded-3xl flex gap-1 p-2.5">
        <Calendar className='size-4'/> {new Date(company.visitingDate).toLocaleDateString()}
      </span>
      <span
        className={`text-xs px-3 py-1 rounded-full ${
          company.status === "upcoming"
            ? "bg-green-100 text-green-600"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {company.status}
      </span>
    </div>
  </div>
  )
}

export default CompanyCard