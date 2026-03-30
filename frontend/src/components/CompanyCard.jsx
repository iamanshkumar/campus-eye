import React from 'react'
import {Calendar , IndianRupee , Target} from 'lucide-react'

const CompanyCard = ({company}) => {
  return (
    <div
    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100"
  >
    {/* Header */}
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

    {/* Description */}
    <p className="text-gray-600 text-sm mb-4">
      {company.description}
    </p>

    {/* Info Row */}
    <div className="flex justify-between text-sm mb-3">
      <span className="font-medium text-gray-700 bg-green-50 rounded-3xl p-2.5 flex items-center gap-1">
        <IndianRupee className='size-4'/>{company.offeredPackage} LPA
      </span>
      <span className="text-blue-600 font-medium bg-blue-50 rounded-3xl p-2.5 flex items-center gap-1">
        <Target className='size-4'/>{company.eligibility} CGPA+
      </span>
    </div>

    {/* Dev Stack */}
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

    {/* Footer */}
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