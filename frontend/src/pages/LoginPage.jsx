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
        <div className="flex min-h-screen items-center justify-center bg-amber-50 px-4">
            <div className="p-6 md:p-8 pb-2.5 bg-emerald-900 rounded-2xl shadow-xl w-full max-w-sm transition-all duration-300">
                <h2 className="text-2xl pb-3 text-amber-50 font-bold">
                    {state === 'Login' ? "Welcome Back!" : "Join Campus Eye"}
                </h2>

                <form className="flex flex-col gap-2.5 w-full" onSubmit={handleSubmit}>
                    {state === 'Register' && (
                        <div className='flex flex-col gap-2.5'>
                            <label className="text-amber-50 text-sm font-medium">Full Name</label>
                            <input
                                disabled={isLoading}
                                type="text"
                                placeholder="Enter your name"
                                className="border rounded px-2.5 py-2 border-neutral-500/40 text-sm bg-emerald-50 focus:ring-2 focus:ring-amber-200 outline-none disabled:opacity-50"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />

                            <label className="text-amber-50 text-sm font-medium">Username</label>
                            <input
                                disabled={isLoading}
                                type="text"
                                placeholder="Enter a unique username"
                                className="border rounded px-2.5 py-2 border-neutral-500/40 text-sm bg-emerald-50 focus:ring-2 focus:ring-amber-200 outline-none disabled:opacity-50"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />

                            <div className="flex gap-2 w-full">
                                <div className="flex flex-col gap-1 w-1/3">
                                    <label className="text-amber-50 text-xs font-medium">Branch</label>
                                    <select
                                        disabled={isLoading}
                                        className="border rounded px-2 py-2 border-neutral-500/40 text-sm bg-emerald-50 focus:ring-2 focus:ring-amber-200 outline-none disabled:opacity-50"
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
                                <div className="flex flex-col gap-1 w-1/3">
                                    <label className="text-amber-50 text-xs font-medium">Year</label>
                                    <select
                                        disabled={isLoading}
                                        className="border rounded px-2 py-2 border-neutral-500/40 text-sm bg-emerald-50 focus:ring-2 focus:ring-amber-200 outline-none disabled:opacity-50"
                                        value={year}
                                        onChange={(e) => setYear(Number(e.target.value))}
                                    >
                                        <option value={1}>1st</option>
                                        <option value={2}>2nd</option>
                                        <option value={3}>3rd</option>
                                        <option value={4}>4th</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1 w-1/3">
                                    <label className="text-amber-50 text-xs font-medium">CGPA</label>
                                    <input
                                        disabled={isLoading}
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        placeholder="CGPA"
                                        className="border rounded px-2 py-2 border-neutral-500/40 text-sm bg-emerald-50 focus:ring-2 focus:ring-amber-200 outline-none disabled:opacity-50 w-full"
                                        value={cgpa}
                                        onChange={(e) => setCgpa(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <label className="text-amber-50 text-sm font-medium">Email</label>
                    <input
                        disabled={isLoading}
                        type="text"
                        placeholder="Enter your email"
                        className="border rounded px-2.5 py-2 border-neutral-500/40 text-sm bg-emerald-50 focus:ring-2 focus:ring-amber-200 outline-none disabled:opacity-50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label className="text-amber-50 text-sm font-medium">Password</label>
                    <input
                        disabled={isLoading}
                        type="password"
                        placeholder="Enter your password"
                        className="border rounded px-2.5 py-2 border-neutral-500/40 text-sm bg-emerald-50 focus:ring-2 focus:ring-amber-200 outline-none disabled:opacity-50"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        disabled={isLoading}
                        className="bg-amber-50 text-emerald-900 hover:bg-amber-100 transition duration-300 cursor-pointer rounded px-3 py-3 mt-3 font-bold flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                        type='submit'
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Processing...
                            </>
                        ) : (
                            state
                        )}
                    </button>

                    {isLoading && (
                        <p className="text-[10px] text-amber-100/70 text-center mt-2 animate-pulse font-medium">
                            Note: Our server is waking up. This may take up to 40 seconds. Thanks for your patience!
                        </p>
                    )}
                </form>

                <div className="flex flex-col justify-center items-center p-6">
                    <p className="text-emerald-100 text-sm hover:underline transition duration-500 cursor-pointer" onClick={() => navigate("/forgot-password")}>Forgot password</p>
                    <div className="h-[1px] w-full bg-emerald-800 my-1"></div>
                    <div
                        className="text-emerald-100 text-sm hover:underline transition duration-500 cursor-pointer text-center"
                        onClick={() => {
                            if (!isLoading) {
                                state === 'Login' ? setState('Register') : setState('Login');
                            }
                        }}
                    >
                        {state === 'Login' ? (
                            <p>Don't have an account? <span className="text-sm text-amber-50 font-bold">Register Here</span></p>
                        ) : (
                            <p>Already have an account? <span className="text-sm text-amber-50 font-bold">Login Here</span></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;