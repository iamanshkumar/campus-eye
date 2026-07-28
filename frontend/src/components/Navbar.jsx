import React, { useState, useEffect } from 'react'
import {motion} from 'framer-motion'
import { LogOut, Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Notifications from './Notifications.jsx';
import api from '../utils/api.js';

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
    const [unreadCount, setUnreadCount] = useState(0);

    const checkUnread = async () => {
        try {
            const { data } = await api.get('/api/notifications/me');
            if (data.success) {
                const unread = data.data.filter(n => !n.isRead).length;
                setUnreadCount(unread);
            }
        } catch (err) {
            console.log("Unread count fetch error", err);
        }
    };

    useEffect(() => {
        checkUnread();
        const interval = setInterval(checkUnread, 30000);
        return () => clearInterval(interval);
    }, []);

    if (user?.role === 'admin' && !tabs.find(t => t.id === 'admin_panel')) {
        tabs.push({id : 'admin_panel' , label : 'Admin Panel'});
    }
  return (
    <div className='relative flex justify-between items-center px-4 py-3 md:px-6 md:py-3.5 bg-slate-900/90 border border-slate-800/80 rounded-2xl md:rounded-full w-full shadow-2xl backdrop-blur-xl gap-3 text-white'>
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden p-2 text-slate-300 hover:text-white cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo Badge */}
          <div className="flex items-center gap-2 pr-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md">
              CE
            </div>
            <span className="font-extrabold text-base tracking-tight text-white hidden sm:block">Campus Eye</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1 rounded-full border border-slate-700/50">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setState(tab.id)}
              className={`relative px-5 py-2 text-xs md:text-sm font-bold cursor-pointer transition-all duration-300 rounded-full whitespace-nowrap ${
                state === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
              {state === tab.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-emerald-600/80 border border-emerald-400/30 shadow-md rounded-full"
                  transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
            <div className="relative">
                <button
                    onClick={() => {
                        setShowNotifications(!showNotifications);
                        if (!showNotifications) setUnreadCount(0);
                    }}
                    className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer relative rounded-full hover:bg-slate-800/60"
                >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
                {showNotifications && (
                    <div className="absolute right-0 top-full mt-3 w-80 md:w-96 z-[100] shadow-2xl">
                        <Notifications onClose={() => {
                            setShowNotifications(false);
                            checkUnread();
                        }} />
                    </div>
                )}
            </div>

            <button
              onClick={() => {
                  logout();
                  navigate('/login');
              }}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-xs text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-600/30 border border-rose-500/20 transition-all cursor-pointer group shrink-0"
            >
              <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden md:block">Sign Out</span>
            </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col p-2 z-50 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => { setState(tab.id); setIsMenuOpen(false); }}
                className={`px-4 py-3 text-sm font-bold cursor-pointer rounded-xl transition-colors ${
                  state === tab.id ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
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