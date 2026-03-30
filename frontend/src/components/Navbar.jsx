import React from 'react'
import {motion} from 'framer-motion'

const Navbar = ({state , setState}) => {
    const tabs = [
        {id : 'timeline' , label : 'Timeline'},
        {id : 'interview experience' , label : 'Interview Experience'},
        {id : 'profile' , label : 'Profile'}
    ]
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
    </div>
  )
}

export default Navbar