import React , {useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {Settings , BookOpen , Briefcase , LayoutGrid , UserCircle , ShieldAlert} from 'lucide-react'
import PrepCheckList from '../components/PrepCheckList';
import CompanyTracker from '../components/CompanyTracker';
import EditProfileModal from '../components/EditProfileModal';
import MyExperiences from '../components/MyExperiences';

const Profile = ()=>{
  const {user} = useAuth();
  const [activeTab , setActiveTab] = useState('experience');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isStudent = user?.role==='student';
  const isAdmin = user?.role==='admin';

  return(
    <div className="w-full max-w-6xl mx-auto mt-4 px-2 md:px-4 pb-12">
      <EditProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <div className="grid grid-cols-12 gap-6">

        {/* Left Sidebar */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-5">
          {/* Avatar Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-zinc-200/80 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-r from-emerald-900 to-teal-800" />

            <div className="relative z-10 w-28 h-28 rounded-full border-4 border-white shadow-md mt-4 mb-3 overflow-hidden bg-zinc-100 flex items-center justify-center">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <UserCircle size={80} className="text-zinc-300" />
              )}

              {isAdmin && (
                <div className="absolute bottom-1 right-1 bg-emerald-600 text-white p-1.5 rounded-full border-2 border-white shadow-sm" title="Administrator">
                  <ShieldAlert size={14} />
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-zinc-900 leading-tight">{user?.fullName}</h2>
            <p className="text-xs text-zinc-400 font-semibold mt-0.5">@{user?.username}</p>

            <div className="w-full border-t border-zinc-100 mt-4 pt-4 flex justify-around text-center">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Branch</p>
                <p className="text-xs font-bold text-zinc-800 mt-0.5">{user?.branch || "N/A"}</p>
              </div>
              <div className="w-[1px] h-8 bg-zinc-100" />
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Year</p>
                <p className="text-xs font-bold text-zinc-800 mt-0.5">{user?.year ? `${user.year} Year` : "N/A"}</p>
              </div>
              <div className="w-[1px] h-8 bg-zinc-100" />
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">CGPA</p>
                <p className="text-xs font-bold text-emerald-800 mt-0.5">{user?.cgpa || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={()=>setActiveTab('experience')}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-xs md:text-sm transition-all cursor-pointer border ${
                activeTab === 'experience' 
                  ? 'bg-emerald-950 text-white border-emerald-950 shadow-sm' 
                  : 'bg-white text-zinc-700 hover:bg-zinc-50 border-zinc-200/80 shadow-2xs'
              }`}
            >
              <LayoutGrid size={18}/>
              {isAdmin ? "Manage All Content" : "Your Experience"}
            </button>

            {isStudent && (
              <>
                <button 
                  onClick={() => setActiveTab('prep')}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-xs md:text-sm transition-all cursor-pointer border ${
                    activeTab === 'prep' 
                      ? 'bg-emerald-950 text-white border-emerald-950 shadow-sm' 
                      : 'bg-white text-zinc-700 hover:bg-zinc-50 border-zinc-200/80 shadow-2xs'
                  }`}
                >
                  <BookOpen size={18} />
                  Your Preparation
                </button>

                <button 
                  onClick={() => setActiveTab('companies')}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-xs md:text-sm transition-all cursor-pointer border ${
                    activeTab === 'companies' 
                      ? 'bg-emerald-950 text-white border-emerald-950 shadow-sm' 
                      : 'bg-white text-zinc-700 hover:bg-zinc-50 border-zinc-200/80 shadow-2xs'
                  }`}
                >
                  <Briefcase size={18} />
                  Targeted Companies
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Main Panel */}
        <div className="col-span-12 md:col-span-8 flex flex-col gap-5">
          {/* Account Details Box */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-zinc-200/80 relative">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-emerald-900 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
              title="Edit Profile"
            >
              <Settings size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-2">Account Overview</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-zinc-100 pb-1.5">
                    <span className="font-semibold text-zinc-500">Account Role:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold border ${
                      isAdmin 
                        ? 'bg-blue-50 text-blue-800 border-blue-200' 
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {user?.role}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-100 pb-1.5">
                    <span className="font-semibold text-zinc-500">Email Address:</span>
                    <span className="font-bold text-zinc-900">{user?.email}</span>
                  </div>
                </div>
              </div>

              {isStudent && (
                <div>
                  <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-2">Academic Metrics</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center border-b border-zinc-100 pb-1.5">
                      <span className="font-semibold text-zinc-500">Branch of Study:</span>
                      <span className="font-bold text-zinc-900">{user?.branch || "Not Specified"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-100 pb-1.5">
                      <span className="font-semibold text-zinc-500">Academic Year:</span>
                      <span className="font-bold text-zinc-900">{user?.year ? `${user.year}${user.year===1 ? "st" : user.year===2 ? "nd" : user.year===3 ? "rd" : "th"} Year` : "N/A"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tab Content Box */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-zinc-200/80 min-h-[400px]">
            <h3 className="text-base font-bold text-zinc-900 mb-5 capitalize tracking-tight">
              {activeTab === 'prep' ? 'Preparation Checklist' : activeTab === 'companies' ? 'Targeted Companies' : (isAdmin ? 'Admin Dashboard' : 'My Posted Experiences')}
            </h3>

            {activeTab === 'experience' && (
              <div>
                <MyExperiences />
              </div>
            )}
            
            {activeTab === 'prep' && isStudent && <PrepCheckList />}
            
            {activeTab === 'companies' && isStudent && <CompanyTracker />}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile;