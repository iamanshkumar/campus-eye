import React , {useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {Settings , BookOpen , Briefcase , LayoutGrid , UserCircle , ShieldAlert} from 'lucide-react'
import PrepCheckList from '../components/PrepCheckList';

const Profile = ()=>{
  const {user} = useAuth();
  const[activeTab , setActiveTab] = useState('experience');
  const isStudent = user?.role==='student';
  const isAdmin = user?.role==='admin';

  return(
    <div className="w-full max-w-6xl mx-auto mt-6 px-4 pb-10">
      <div className="grid grid-cols-12 gap-8">

        <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="relative w-48 h-48 rounded-full border-4 border-amber-100 p-1 mb-4 overflow-hidden bg-gray-50 flex items-center justify-center">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircle size={120} className="text-gray-300" />
              )}

              {isAdmin && (
                <div className="absolute bottom-2 right-6 bg-blue-600 text-white p-2 rounded-full border-4 border-white shadow-lg" title="Administrator">
                  <ShieldAlert size={18} />
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-800">{user?.fullName}</h2>
            <p className="text-gray-500 font-medium">@{user?.username}</p>
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={()=>setActiveTab('experience')}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all ${activeTab === 'experience' ? 'bg-emerald-800 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}>
              <LayoutGrid size={20}/>
              {isAdmin ? "Manage All Content" : "Your Experience"}
            </button>

            {isStudent && (
              <>
                <button 
                  onClick={() => setActiveTab('prep')}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all ${activeTab === 'prep' ? 'bg-emerald-800 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
                >
                  <BookOpen size={20} />
                  Your Preparation
                </button>

                <button 
                  onClick={() => setActiveTab('companies')}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all ${activeTab === 'companies' ? 'bg-emerald-800 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
                >
                  <Briefcase size={20} />
                  Targeted Companies
                </button>
              </>
            )}
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative">
            <button className="absolute top-6 right-6 p-2 text-gray-400 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer">
              <Settings size={22}/>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Account Info</p>
                <div className="space-y-2">
                  <p className="text-gray-700 flex justify-between border-b pb-1">
                    <span className="font-semibold">Role:</span>
                    <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold ${isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{user?.role}</span>
                  </p>

                  <p className="text-gray-700"><span className="font-semibold">Email:</span> {user?.email}</p>
                </div>
              </div>

              {isStudent && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Academic Details</p>
                  <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-semibold">Branch:</span> {user?.branch}</p>
                    <p className="text-gray-700"><span className="font-semibold">Year:</span> {user?.year}th Year</p>
                    <p className="text-gray-700"><span className="font-semibold">CGPA:</span> {user?.cgpa}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
            <h3 className="text-xl font-bold text-gray-800 mb-6 capitalize">
              {activeTab === 'prep' ? 'Preparation Checklist' : activeTab === 'companies' ? 'Company Tracking' : (isAdmin ? 'Admin Dashboard' : 'My Posted Experiences')}
            </h3>

            {activeTab === 'experience' && <div className="text-gray-500 italic">Content Feed...</div>}
            {activeTab === 'prep' && isStudent && <PrepCheckList />}
            {activeTab === 'companies' && isStudent && <div>Company Tracking Component...</div>}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile;