import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

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
    <div className="flex min-h-screen items-center justify-center bg-amber-50 px-4">
      <div className="p-6 md:p-8 pb-6 bg-emerald-900 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300">
        
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
                className="flex items-center gap-1.5 text-emerald-100 hover:text-amber-50 text-sm font-medium mb-4 group cursor-pointer transition duration-300"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Login
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shadow-md">
                  <Mail className="text-emerald-900" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl text-amber-50 font-bold leading-tight">Forgot Password?</h2>
                  <p className="text-emerald-100/70 text-xs mt-0.5 font-medium">No worries, we'll send you recovery steps.</p>
                </div>
              </div>

              <form className="flex flex-col gap-4 mt-6 w-full" onSubmit={handleRequestOtp}>
                <div className="flex flex-col gap-2">
                  <label className="text-amber-50 text-sm font-medium flex items-center gap-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input 
                      disabled={isLoading}
                      type="email"
                      required
                      placeholder="e.g., student@college.edu"
                      className="w-full border rounded px-3 py-2.5 border-neutral-500/40 text-sm bg-emerald-50 focus:ring-2 focus:ring-amber-200 outline-none disabled:opacity-50 text-emerald-950 font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  className="bg-amber-50 text-emerald-900 hover:bg-amber-100 transition duration-300 cursor-pointer rounded px-3 py-3 mt-2 font-bold flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 shadow-md"
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </form>

              {isLoading && (
                <p className="text-[10px] text-amber-100/60 text-center mt-3 animate-pulse font-medium">
                  Note: Email transmission can take up to 10 seconds.
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
                className="flex items-center gap-1.5 text-emerald-100 hover:text-amber-50 text-sm font-medium mb-4 group cursor-pointer transition duration-300"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                Change Email Address
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shadow-md">
                  <KeyRound className="text-emerald-900" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl text-amber-50 font-bold leading-tight">Verify & Reset</h2>
                  <p className="text-emerald-100/70 text-xs mt-0.5 font-medium">We've sent a 6-digit code to your email.</p>
                </div>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-800 rounded-lg p-2.5 my-3 text-center">
                <span className="text-xs text-amber-50/90 font-mono select-all">{email}</span>
              </div>

              <form className="flex flex-col gap-3.5 mt-4 w-full" onSubmit={handleResetPassword}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-amber-50 text-sm font-medium">Verification Code</label>
                  <input 
                    disabled={isLoading}
                    type="text"
                    required
                    maxLength={6}
                    placeholder="------"
                    className="border rounded px-3 py-2.5 border-neutral-500/40 text-center font-mono text-lg tracking-[0.6em] bg-emerald-50 focus:ring-2 focus:ring-amber-200 outline-none disabled:opacity-50 text-emerald-950 font-bold placeholder:text-gray-400 placeholder:tracking-normal"
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setOtp(val);
                    }} 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-amber-50 text-sm font-medium">New Password</label>
                  <div className="relative flex items-center">
                    <input 
                      disabled={isLoading}
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Minimum 6 characters"
                      className="w-full border rounded pl-3 pr-10 py-2.5 border-neutral-500/40 text-sm bg-emerald-50 focus:ring-2 focus:ring-amber-200 outline-none disabled:opacity-50 text-emerald-950 font-medium"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} 
                    />
                    <button
                      type="button"
                      tabIndex="-1"
                      className="absolute right-3 text-emerald-900/60 hover:text-emerald-900 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-amber-50 text-sm font-medium">Confirm New Password</label>
                  <div className="relative flex items-center">
                    <input 
                      disabled={isLoading}
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter password"
                      className="w-full border rounded pl-3 pr-10 py-2.5 border-neutral-500/40 text-sm bg-emerald-50 focus:ring-2 focus:ring-amber-200 outline-none disabled:opacity-50 text-emerald-950 font-medium"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                    <button
                      type="button"
                      tabIndex="-1"
                      className="absolute right-3 text-emerald-900/60 hover:text-emerald-900 focus:outline-none"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  className="bg-amber-50 text-emerald-900 hover:bg-amber-100 transition duration-300 cursor-pointer rounded px-3 py-3 mt-3 font-bold flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 shadow-md"
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

              <div className="text-center mt-5 text-sm text-emerald-100">
                {resendTimer > 0 ? (
                  <p className="text-emerald-100/60 font-medium">
                    Resend code in <span className="font-bold text-amber-50">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-amber-50 font-bold hover:underline cursor-pointer disabled:opacity-50"
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
  );
};

export default ForgotPasswordPage;
