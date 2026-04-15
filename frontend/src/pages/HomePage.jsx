import React , {useState} from 'react'
import Navbar from '../components/Navbar.jsx'
import Timeline from './Timeline.jsx';
import InterviewExperience from './InterviewExperience.jsx';
import Profile from './Profile.jsx';


const HomePage = () => {
  const [state , setState] = useState('timeline');
  return (
    <div className='flex flex-col items-center px-3 py-3 md:p-4 bg-amber-50 min-h-screen'>
      <div className='w-full max-w-5xl'>
        <Navbar state={state} setState={setState} />
      </div>

      <div className='w-full max-w-5xl mt-4'>
        {state === 'timeline' ? <Timeline /> : state === 'profile' ? <Profile /> : <InterviewExperience />}
      </div>
    </div>
  )
}

export default HomePage