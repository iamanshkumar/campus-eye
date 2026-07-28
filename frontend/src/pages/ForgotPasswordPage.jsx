import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Loader2, Mail, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react';
import api from '../utils/api';
import { Helmet } from 'react-helmet-async';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    try {
      const { data } = await api.post('/api/auth/forget-password', { email });
      if (data.success) {
        toast.success(data.message || "Verification code sent to your email!");
        setStep(2);
        setResendTimer(60); 
      } else {
        toast.error(data.message || "Failed to send verification code");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong. Please check your email.");
      console.error("Forgot password request error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isLoading) return;
    setIsLoading(true);
    try {
      const { data } = await api.post('/api/auth/forget-password', { email });
      if (data.success) {
        toast.success("A new verification code has been dispatched!");
        setResendTimer(60);
      } else {
        toast.error(data.message || "Failed to resend code");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send verification code");
      console.error("Resend OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the verification code");
      return;
    }
    if (otp.length !== 6) {
      toast.error("Verification code must be exactly 6 digits");
      return;
    }
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post('/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });

      if (data.success) {
        toast.success(data.message || "Password updated successfully!");
        navigate('/login');
      } else {
        toast.error(data.message || "Reset request failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid code or expired code. Please try again.");
      console.error("Reset password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Helmet>
        <title>Forgot Password | Campus Eye</title>
        <meta name="description" content="Reset your campus eye password." />
      </Helmet>
    <div className="flex min-h-screen items-center justify-center bg-slate-50 relative overflow-hidden px-4 py-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-emerald-100/50 via-teal-50/30 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="p-8 md:p-10 bg-white rounded-3xl shadow-xl border border-zinc-200/90 w-full max-w-md transition-all duration-300">
        
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <button 
                onClick={() => navigate('/login')} 
                className="flex items-center gap-1.5 text-zinc-500 hover:text-emerald-950 text-xs font-bold mb-5 group cursor-pointer transition-colors"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Login
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-center shadow-2xs">
                  <Mail className="text-emerald-900" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-900 leading-tight">Forgot Password?</h2>
                  <p className="text-xs text-zinc-400 font-medium">We'll send a 6-digit code to your email.</p>
                </div>
              </div>

              <form className="flex flex-col gap-4 mt-6 w-full" onSubmit={handleRequestOtp}>
                <div className="flex flex-col gap-1">
                  <label className="text-zinc-700 text-xs font-bold uppercase tracking-wider">
                    Registered Email
                  </label>
                  <input 
                    disabled={isLoading}
                    type="email"
                    required
                    placeholder="e.g. student@college.edu"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-semibold text-sm focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 outline-none transition-all placeholder:text-zinc-400 disabled:opacity-50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>

                <button
                  disabled={isLoading}
                  className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer mt-2 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 text-sm"
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending Code...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </form>

              {isLoading && (
                <p className="text-[11px] text-zinc-500 text-center mt-3 animate-pulse font-medium">
                  Note: Code transmission can take up to 10 seconds.
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <button 
                onClick={() => setStep(1)} 
                className="flex items-center gap-1.5 text-zinc-500 hover:text-emerald-950 text-xs font-bold mb-4 group cursor-pointer transition-colors"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                Change Email Address
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-center shadow-2xs">
                  <KeyRound className="text-emerald-900" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-900 leading-tight">Verify & Reset</h2>
                  <p className="text-xs text-zinc-400 font-medium">Enter the code sent to your email.</p>
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 my-3 text-center">
                <span className="text-xs font-bold text-zinc-800 font-mono select-all">{email}</span>
              </div>

              <form className="flex flex-col gap-4 mt-4 w-full" onSubmit={handleResetPassword}>
                <div className="flex flex-col gap-1">
                  <label className="text-zinc-700 text-xs font-bold uppercase tracking-wider">Verification Code</label>
                  <input 
                    disabled={isLoading}
                    type="text"
                    required
                    maxLength={6}
                    placeholder="------"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-extrabold text-center font-mono text-xl tracking-[0.5em] focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 outline-none disabled:opacity-50 placeholder:text-zinc-300 placeholder:tracking-normal"
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setOtp(val);
                    }} 
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-zinc-700 text-xs font-bold uppercase tracking-wider">New Password</label>
                  <div className="relative flex items-center">
                    <input 
                      disabled={isLoading}
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Minimum 6 characters"
                      className="w-full pl-4 pr-10 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-semibold text-sm focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 outline-none transition-all placeholder:text-zinc-400 disabled:opacity-50"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} 
                    />
                    <button
                      type="button"
                      tabIndex="-1"
                      className="absolute right-3 text-zinc-400 hover:text-zinc-700 focus:outline-none cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-zinc-700 text-xs font-bold uppercase tracking-wider">Confirm New Password</label>
                  <div className="relative flex items-center">
                    <input 
                      disabled={isLoading}
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter password"
                      className="w-full pl-4 pr-10 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-semibold text-sm focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 outline-none transition-all placeholder:text-zinc-400 disabled:opacity-50"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                    <button
                      type="button"
                      tabIndex="-1"
                      className="absolute right-3 text-zinc-400 hover:text-zinc-700 focus:outline-none cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer mt-2 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 text-sm"
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>

              <div className="text-center mt-5 text-xs text-zinc-500 font-medium">
                {resendTimer > 0 ? (
                  <p>
                    Resend code in <span className="font-bold text-emerald-900">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-emerald-900 font-bold hover:underline cursor-pointer disabled:opacity-50"
                  >
                    Resend verification code
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  );
};

export default ForgotPasswordPage;
