import React , {useState} from 'react'
import Navbar from '../components/Navbar.jsx'
import Timeline from './Timeline.jsx';
import InterviewExperience from './InterviewExperience.jsx';
import Profile from './Profile.jsx';
import AdminPanel from './AdminPanel.jsx';


const HomePage = () => {
  const [state , setState] = useState('timeline');
  return (
    <div className='flex flex-col items-center px-3 py-3 md:py-6 md:px-6 bg-slate-50 min-h-screen relative overflow-hidden'>
      {/* Background Decorative Mesh Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-emerald-100/40 via-teal-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className='w-full max-w-5xl relative z-40'>
        <Navbar state={state} setState={setState} />
      </div>

      <div className='w-full max-w-5xl mt-6 relative z-10'>
        {state === 'timeline' ? <Timeline /> : 
         state === 'profile' ? <Profile /> : 
         state === 'admin_panel' ? <AdminPanel /> : 
         <InterviewExperience />}
      </div>
    </div>
  )
}

export default HomePage