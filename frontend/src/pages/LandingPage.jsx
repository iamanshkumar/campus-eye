import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Target, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Ambient Radial Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-emerald-200/40 via-teal-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-950 rounded-2xl flex items-center justify-center font-extrabold text-white text-base shadow-md">
            CE
          </div>
          <span className="font-extrabold text-xl tracking-tight text-zinc-900">Campus Eye</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-full font-bold text-sm bg-emerald-950 text-white hover:bg-emerald-900 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-20 flex flex-col items-center text-center relative z-10">
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/80 border border-emerald-200 rounded-full text-emerald-900 text-xs font-bold mb-6 shadow-2xs"
        >
          <Sparkles size={14} className="text-emerald-700" />
          <span>The #1 Placement Intelligence Command Center</span>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight max-w-4xl tracking-tight text-zinc-900"
        >
          Master Your <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-800 bg-clip-text text-transparent">Campus Placement</span> Journey.
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-base md:text-xl text-zinc-600 max-w-2xl mb-10 font-medium leading-relaxed"
        >
          Centralized command center to track visiting companies, access real interview experiences from seniors, and follow a structured technical roadmap.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button 
            onClick={() => navigate('/login')}
            className="group flex items-center justify-center gap-2.5 px-8 py-4 bg-emerald-950 text-white rounded-2xl font-bold text-base hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-950/20 active:scale-[0.98] cursor-pointer"
          >
            Explore Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </header>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-2xs border border-zinc-200/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mb-6 border border-amber-200/60">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-extrabold mb-2.5 text-zinc-900">Visiting Company Radar</h3>
            <p className="text-zinc-500 text-xs md:text-sm leading-relaxed font-medium">
              Real-time updates on visiting companies, including packages (LPA), CGPA eligibility, locations, and technology stacks posted by placement admins.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-2xs border border-zinc-200/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mb-6 border border-blue-200/60">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-lg font-extrabold mb-2.5 text-zinc-900">Interview Experience Vault</h3>
            <p className="text-zinc-500 text-xs md:text-sm leading-relaxed font-medium">
              Read authentic interview round write-ups and question sets shared by seniors. Threaded comment discussions help clear technical doubts.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-2xs border border-zinc-200/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mb-6 border border-emerald-200/60">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-extrabold mb-2.5 text-zinc-900">Preparation Roadmap</h3>
            <p className="text-zinc-500 text-xs md:text-sm leading-relaxed font-medium">
              Master your technical preparation with a granular, topic-wise checklist covering DSA, Core Subjects (OS, DBMS, CN, OOPs), and System Design.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* High-Impact Value Prop Section */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
              Why Settle For <br /><span className="text-emerald-400">Random Preparation?</span>
            </h2>
            <div className="space-y-4">
              {[
                "Centralized company drive tracking for focused targeting.",
                "Peer-reviewed insights on specific college interview patterns.",
                "Zero-fluff preparation checklist for core software roles.",
                "Threaded discussions and voting on technical experiences."
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
                  <p className="text-zinc-300 text-sm font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-full"></div>
             <div className="relative bg-slate-800/80 border border-slate-700/80 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
                <blockquote className="text-lg md:text-xl font-medium italic text-slate-200 leading-relaxed">
                  "Campus Eye turned a chaotic placement season into a structured, stress-free roadmap. Having interview questions from seniors in one place was an absolute game changer."
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-md">
                    AK
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">Ansh Kumar</p>
                    <p className="text-emerald-400 text-xs font-semibold">Full-Stack Developer & Founder</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center border-t border-zinc-200/80 mt-12">
        <p className="text-zinc-400 text-xs font-semibold mb-4 md:mb-0">© 2026 Campus Eye. All rights reserved.</p>
        <div className="flex gap-6 font-bold text-zinc-500 text-xs">
          <a href="https://github.com/iamanshkumar" target="_blank" rel="noreferrer" className="hover:text-emerald-900 transition-colors">GitHub Repository</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;