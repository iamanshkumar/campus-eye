import { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [state, setState] = useState('Login');
    const [selectedBranch, setSelectedBranch] = useState('CSE')
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [cgpa, setCgpa] = useState(0);
    const [year, setYear] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (state === "Login") {
            try {
                await login(email, password);
                toast.success("Login successfull")
                navigate('/home')
            } catch (err) {
                toast.error("Invalid credentials");
                console.log("Invalid credentials", err)
            }
        } else {
            try {
                await register(fullName, userName, email, password, cgpa, selectedBranch, year);
                toast.success("Registeration successfull")
                navigate('/home')
            } catch (err) {
                toast.error(err?.response?.data?.message || "Registration failed");
                console.log("Registeration error", err)
            }
        }

    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-amber-50 px-4">
            <div className="p-6 md:p-8 pb-2.5 bg-emerald-900 rounded-2xl shadow-xl w-full max-w-sm">
                <h2 className="text-2xl pb-3 text-amber-50 font-bold">{state==='Login'? "Welcome Back!" : "Join Campus Eye"}</h2>
                <form className="flex flex-col gap-2.5 w-full" onSubmit={handleSubmit}>
                    {state === 'Register' ?
                        <div className='flex flex-col gap-2.5 c'>
                            <label className="text-amber-50 text-sm">Full Name</label>
                            <input type="text"
                                placeholder="Enter your name"
                                className="border rounded px-2.5 py-2 border-neutral-500/40 text-sm bg-emerald-50"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)} />

                            <label className="text-amber-50 text-sm">Username</label>
                            <input type="text"
                                placeholder="Enter your username"
                                className="border rounded px-2.5 py-2 border-neutral-500/40 text-sm bg-emerald-50"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)} />

                            <div className='flex justify-between'>
                                <div className='flex flex-col'>
                                    <label className="text-amber-50 text-sm">CGPA</label>
                                    <input type="number"
                                        placeholder="CGPA"
                                        max={10}
                                        className="border rounded px-2.5 py-2 border-neutral-500/40 text-sm bg-emerald-50 w-20"
                                        value={cgpa}
                                        onChange={(e) => setCgpa(e.target.value)} />
                                </div>

                                <div className='flex flex-col'>
                                    <label className="text-amber-50 text-sm">Year</label>
                                    <input type="number"
                                        placeholder="Year"
                                        max={4}
                                        step={1}
                                        min={1}
                                        className="border rounded px-2.5 py-2 border-neutral-500/40 text-sm bg-emerald-50 w-20"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)} />

                                </div>

                                <div className='flex flex-col'>
                                    <label className="text-amber-50 text-sm"> Branch</label>
                                    <select id="car-select" value={selectedBranch}
                                        onChange={(e) => setSelectedBranch(e.target.value)}
                                        className="border rounded px-2.5 py-2 border-neutral-500/40 text-sm bg-emerald-50">
                                        <option value="CSE">CSE</option>
                                        <option value="CSE(AI)">CSE(AI)</option>
                                        <option value="CSE(AIML)">CSE(AIML)</option>
                                        <option value="CSE(CSDS)">CSE(CSDS)</option>
                                        <option value="IT">IT</option>
                                        <option value="ECE">ECE</option>
                                        <option value="EE">EE</option>
                                        <option value="Mech">Mech</option>
                                    </select>
                                </div>

                            </div>

                        </div> :
                        <div></div>}
                    <label className="text-amber-50 text-sm">Email</label>
                    <input type="text"
                        placeholder="Enter your email"
                        className="border rounded px-2.5 py-2 border-neutral-500/40 text-sm bg-emerald-50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    <label className="text-amber-50 text-sm">Password</label>
                    <input type="password"
                        placeholder="Enter your password"
                        className="border rounded px-2.5 py-2 border-neutral-500/40 text-sm bg-emerald-50"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    <button
                        className="bg-amber-50 text-emerald-900 hover:bg-amber-100 transition duration-500 cursor-pointer rounded px-3 py-2 mt-3 font-medium"
                        type='submit'
                    >{state}</button>
                </form>

                <div className="flex flex-col justify-center items-center p-6">
                    <p className="text-emerald-100 text-sm hover:underline transition duration-500 cursor-pointer">Forgot password</p>
                    <div className="h-[1px] w-full bg-emerald-800 my-1"></div>
                    <p className="text-emerald-100 text-sm hover:underline transition duration-500 cursor-pointer" onClick={() => {
                        state === 'Login' ? setState('Register') : setState('Login')
                    }}>{
                        state === 'Login' ? (
                          <p>
                            Don't have an account?{" "}
                            <span className="text-sm text-amber-50">Register Here</span>
                          </p>
                        ) : (
                          <p>
                            Already have an account?{" "}
                            <span className="text-sm text-amber-50">Login Here</span>
                          </p>
                        )
                      }</p>
                </div>



            </div>

        </div>
    )
}

export default LoginPage;