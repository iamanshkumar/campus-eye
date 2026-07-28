import { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const LoginPage = () => {
    const [state, setState] = useState('Login');
    const [selectedBranch, setSelectedBranch] = useState('CSE')
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [cgpa, setCgpa] = useState(0);
    const [year, setYear] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (state === "Login") {
            try {
                await login(email, password);
                toast.success("Login successful");
                navigate('/home');
            } catch (err) {
                toast.error("Invalid credentials");
                console.log("Invalid credentials", err);
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                await register(fullName, userName, email, password, cgpa, selectedBranch, year);
                toast.success("Registration successful");
                navigate('/home');
            } catch (err) {
                toast.error(err?.response?.data?.message || "Registration failed");
                console.log("Registration error", err);
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 relative overflow-hidden px-4 py-10">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-emerald-100/50 via-teal-50/30 to-transparent blur-3xl pointer-events-none -z-10" />

            <div className="p-8 md:p-10 bg-white rounded-3xl shadow-xl border border-zinc-200/90 w-full max-w-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-950 flex items-center justify-center font-extrabold text-white text-base shadow-sm">
                        CE
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                            {state === 'Login' ? "Welcome Back" : "Create Account"}
                        </h2>
                        <p className="text-xs text-zinc-400 font-medium">
                            {state === 'Login' ? "Sign in to access your dashboard" : "Join Campus Eye placement portal"}
                        </p>
                    </div>
                </div>

                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                    {state === 'Register' && (
                        <div className='flex flex-col gap-3'>
                            <div className="flex flex-col gap-1">
                                <label className="text-zinc-700 text-xs font-bold uppercase tracking-wider">Full Name</label>
                                <input
                                    disabled={isLoading}
                                    type="text"
                                    placeholder="e.g. Ansh Kumar"
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-semibold text-sm focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 outline-none transition-all placeholder:text-zinc-400 disabled:opacity-50"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-zinc-700 text-xs font-bold uppercase tracking-wider">Username</label>
                                <input
                                    disabled={isLoading}
                                    type="text"
                                    placeholder="e.g. anshkumar"
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-semibold text-sm focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 outline-none transition-all placeholder:text-zinc-400 disabled:opacity-50"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="flex flex-col gap-1">
                                    <label className="text-zinc-700 text-[10px] font-bold uppercase tracking-wider">Branch</label>
                                    <select
                                        disabled={isLoading}
                                        className="w-full px-2 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-semibold text-xs focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 outline-none disabled:opacity-50 cursor-pointer"
                                        value={selectedBranch}
                                        onChange={(e) => setSelectedBranch(e.target.value)}
                                    >
                                        <option value="CSE">CSE</option>
                                        <option value="IT">IT</option>
                                        <option value="ECE">ECE</option>
                                        <option value="MECH">MECH</option>
                                        <option value="CIVIL">CIVIL</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-zinc-700 text-[10px] font-bold uppercase tracking-wider">Year</label>
                                    <select
                                        disabled={isLoading}
                                        className="w-full px-2 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-semibold text-xs focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 outline-none disabled:opacity-50 cursor-pointer"
                                        value={year}
                                        onChange={(e) => setYear(Number(e.target.value))}
                                    >
                                        <option value={1}>1st Yr</option>
                                        <option value={2}>2nd Yr</option>
                                        <option value={3}>3rd Yr</option>
                                        <option value={4}>4th Yr</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-zinc-700 text-[10px] font-bold uppercase tracking-wider">CGPA</label>
                                    <input
                                        disabled={isLoading}
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        placeholder="8.5"
                                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-semibold text-xs focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 outline-none disabled:opacity-50"
                                        value={cgpa}
                                        onChange={(e) => setCgpa(Number(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="text-zinc-700 text-xs font-bold uppercase tracking-wider">Email Address</label>
                        <input
                            disabled={isLoading}
                            type="email"
                            placeholder="your.name@gmail.com"
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-semibold text-sm focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 outline-none transition-all placeholder:text-zinc-400 disabled:opacity-50"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-zinc-700 text-xs font-bold uppercase tracking-wider">Password</label>
                        <input
                            disabled={isLoading}
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-semibold text-sm focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-700 outline-none transition-all placeholder:text-zinc-400 disabled:opacity-50"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        disabled={isLoading}
                        className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer mt-2 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 text-sm"
                        type='submit'
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Processing...
                            </>
                        ) : (
                            state === 'Login' ? 'Sign In' : 'Create Account'
                        )}
                    </button>

                    {isLoading && (
                        <p className="text-[11px] text-zinc-500 text-center mt-1 animate-pulse font-medium">
                            Note: Server is waking up (may take up to 30s). Please wait!
                        </p>
                    )}
                </form>

                <div className="flex flex-col items-center pt-5 mt-4 border-t border-zinc-100 gap-3">
                    <button 
                        type="button"
                        className="text-xs font-bold text-zinc-500 hover:text-emerald-900 transition-colors cursor-pointer" 
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot password?
                    </button>
                    
                    <button
                        type="button"
                        className="text-xs text-zinc-600 font-medium cursor-pointer"
                        onClick={() => {
                            if (!isLoading) {
                                state === 'Login' ? setState('Register') : setState('Login');
                            }
                        }}
                    >
                        {state === 'Login' ? (
                            <span>Don't have an account? <strong className="text-emerald-900 hover:underline">Register Here</strong></span>
                        ) : (
                            <span>Already have an account? <strong className="text-emerald-900 hover:underline">Login Here</strong></span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;