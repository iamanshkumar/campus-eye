import React from 'react'
import {motion} from 'framer-motion'
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Navbar = ({state , setState}) => {
    const tabs = [
        {id : 'timeline' , label : 'Timeline'},
        {id : 'interview experience' , label : 'Interview Experience'},
        {id : 'profile' , label : 'Profile'}
    ]
    const navigate = useNavigate();
    const {logout} = useAuth()
  return (
    <div className='flex justify-evenly items-center p-6 bg-emerald-950 border border-emerald-800/50 rounded-4xl w-[80vw] shadow-xl'>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setState(tab.id)}
            className={`relative px-6 py-2.5 text-2xl font-medium cursor-pointer transition-colors duration-300 rounded-full ${
              state === tab.id ? 'text-white' : 'text-emerald-200/60 hover:text-emerald-100'
            }`}
          >

            <span className="relative z-10">{tab.label}</span>


            {state === tab.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-white/15 border border-white/30 shadow-inner rounded-full"
                transition={{ type: 'spring', duration: 0.6, bounce: 0.2 }}
              />
            )}
          </div>
        ))}
        <button 
                onClick={() => {
                    logout();
                    navigate('/login');
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-white hover:bg-red-500/20 border border-emerald-500/20 hover:border-red-500/20 transition-all cursor-pointer group"
            >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="hidden md:block">Sign Out</span>
            </button>
    </div>
  )
}

export default Navbar