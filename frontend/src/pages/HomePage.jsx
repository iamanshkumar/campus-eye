import React , {useState} from 'react'
import Navbar from '../components/Navbar.jsx'
import Timeline from './Timeline.jsx';
import InterviewExperience from './InterviewExperience.jsx';
import Profile from './Profile.jsx';

const HomePage = () => {
  const [state , setState] = useState('timeline');
  return (
    <div className='flex flex-col items-center p-2.5 bg-amber-50 min-h-screen'>
      <Navbar state={state} setState={setState}></Navbar>
      {state==='timeline' ? <Timeline></Timeline> : state==='profile' ? <Profile></Profile> : <InterviewExperience></InterviewExperience>}
    </div>
  )
}

export default HomePage