import React, { useState } from 'react'
import {motion} from 'framer-motion'
import { LogOut, Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Notifications from './Notifications.jsx';

const Navbar = ({state , setState}) => {
    const tabs = [
        {id : 'timeline' , label : 'Timeline'},
        {id : 'interview experience' , label : 'Interview Experience'},
        {id : 'profile' , label : 'Profile'}
    ]
    const navigate = useNavigate();
    const {logout, user} = useAuth()
    const [showNotifications, setShowNotifications] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (user?.role === 'admin' && !tabs.find(t => t.id === 'admin_panel')) {
        tabs.push({id : 'admin_panel' , label : 'Admin Panel'});
    }
  return (
    <div className='relative flex justify-between items-center px-4 py-3 md:px-6 md:py-4 bg-emerald-950 border border-emerald-800/50 rounded-2xl md:rounded-4xl w-full shadow-xl gap-2'>
        <button 
          className="md:hidden p-2 text-emerald-200 hover:text-white cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex items-center gap-2">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setState(tab.id)}
              className={`relative px-3 py-2 md:px-6 md:py-2.5 text-sm md:text-xl font-medium cursor-pointer transition-colors duration-300 rounded-full whitespace-nowrap ${
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
        </div>
        <div className="flex items-center gap-2">
            <div className="relative">
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-emerald-200 hover:text-white transition-colors cursor-pointer"
                >
                    <Bell size={20} />
                </button>
                {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 z-50">
                        <Notifications onClose={() => setShowNotifications(false)} />
                    </div>
                )}
            </div>

            <button
            onClick={() => {
                logout();
                navigate('/login');
            }}
            className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-2xl font-bold text-white hover:bg-red-500/20 border border-emerald-500/20 hover:border-red-500/20 transition-all cursor-pointer group shrink-0"
            >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden md:block text-sm">Sign Out</span>
            </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-emerald-950 border border-emerald-800/50 rounded-2xl shadow-xl flex flex-col p-2 z-50 md:hidden">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => { setState(tab.id); setIsMenuOpen(false); }}
                className={`px-4 py-3 text-sm font-medium cursor-pointer rounded-xl transition-colors ${
                  state === tab.id ? 'bg-white/15 text-white' : 'text-emerald-200/60 hover:text-emerald-100 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

export default Navbar