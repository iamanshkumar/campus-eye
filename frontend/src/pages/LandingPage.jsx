import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Target, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2 
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-emerald-950 font-sans selection:bg-emerald-200">
      

      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center shadow-lg">
            <Target className="text-white" size={24} />
          </div>
          <span className="font-black text-2xl tracking-tighter">CampusEye</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-full font-bold border-2 border-emerald-900 hover:bg-emerald-900 hover:text-white transition-all cursor-pointer"
        >
          Login
        </button>
      </nav>

      <header className="max-w-7xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-7xl font-black mb-6 leading-tight max-w-4xl"
        >
          Decode Your <span className="text-emerald-700">Campus Placement</span> Journey.
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-emerald-900/70 max-w-2xl mb-10 font-medium"
        >
          The all-in-one command center for students to track company arrivals, share interview secrets, and master the technical preparation roadmap.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
        >
          <button 
            onClick={() => navigate('/login')}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-emerald-900 text-white rounded-2xl font-bold text-lg hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20 cursor-pointer"
          >
            Get Started Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-4xl shadow-sm border border-emerald-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-6">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Company Radar</h3>
            <p className="text-emerald-900/60 leading-relaxed font-medium">
              Real-time updates on visiting companies, including package details, tech stacks, and eligibility criteria posted directly by admins.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-4xl shadow-sm border border-emerald-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Interview Vault</h3>
            <p className="text-emerald-900/60 leading-relaxed font-medium">
              Read authentic reviews and question sets shared by your seniors. Know exactly what each company expects before you walk in.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-4xl shadow-sm border border-emerald-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Prep Roadmap</h3>
            <p className="text-emerald-900/60 leading-relaxed font-medium">
              Master your technical skills with a granular, topic-wise checklist covering DSA, Core Subjects, and System Design.
            </p>
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-emerald-950 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              Why settle for <br /><span className="text-emerald-400">Random Prep?</span>
            </h2>
            <div className="space-y-6">
              {[
                "Centralized company tracking for focused targeting.",
                "Peer-reviewed insights on specific college patterns.",
                "Zero-fluff preparation checklist for core engineering roles.",
                "Community discussion on interview experiences."
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
                  <p className="text-emerald-100 font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl rounded-full"></div>
             <div className="relative bg-emerald-900/50 border border-emerald-800 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
                <blockquote className="text-2xl font-medium italic text-emerald-100">
                  "Campus Eye turned a stressful placement season into a structured preparation roadmap. Having the interview questions from my seniors in one place was the ultimate game changer."
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <div>
                    <p className="font-bold">Ansh Kumar</p>
                    <p className="text-emerald-400 text-sm">Full-Stack Developer & Founder</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center border-t border-emerald-100 mt-20">
        <p className="text-emerald-900/40 font-bold mb-4 md:mb-0">© 2026 Campus Eye. All rights reserved.</p>
        <div className="flex gap-8 font-bold text-emerald-900/60 text-sm">
          <a href="https://github.com/iamanshkumar" target="_blank" className="hover:text-emerald-900 transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;