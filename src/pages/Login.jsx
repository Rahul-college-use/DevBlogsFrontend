import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Captcha from '../components/Captcha';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [isCaptchaValid, setIsCaptchaValid] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            navigate('/dashboard')
        }
    }, [navigate])
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isCaptchaValid) return toast.error("Please verify the captcha correctly!");
        setLoading(true)
        try {
            const res = await axios.post('https://dev-blogs-mu.vercel.app/user/login', form);
            toast.success("Login Successful!");
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            const status = err.response?.status;
            const message = err.response?.data?.message || "Login failed";
            if (status === 429) {
                toast.error(message, { duration: 6000 }); // 1 Hour lockout notification
            } else {
                toast.error(message);
            }
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-6 text-sm">Please sign in to access your blog dashboard</p>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" placeholder="name@example.com" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" placeholder="••••••••" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" onChange={e => setForm({ ...form, password: e.target.value })} required />
                    </div>
                    <Captcha onVerify={setIsCaptchaValid} />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                {/* Chota sa CSS spinner */}
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>                </form>
                <p className="mt-6 text-center text-sm text-gray-600">Don't have an account? <Link to="/signup" className="text-blue-600 font-medium hover:underline">Create Account</Link></p>
            </div>
        </div>
    );
}