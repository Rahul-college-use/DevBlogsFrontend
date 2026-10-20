import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Captcha from '../components/Captcha';
import { LoadingSpinner } from '../components/Loader';

export default function Signup() {
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    const [isCaptchaValid, setIsCaptchaValid] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) return toast.error("Passwords do not match!");
        if (!isCaptchaValid) return toast.error("Please complete the captcha correctly!");
        setLoading(true)
        try {
            const res = await axios.post('https://dev-blogs-mu.vercel.app/user/signup', form);
            toast.success(res.data.message);
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Create Account</h2>
                <p className="text-center text-gray-500 mb-6 text-sm">Join our blogging community today</p>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <input type="text" placeholder="First Name" className="p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setForm({ ...form, firstName: e.target.value })} required />
                        <input type="text" placeholder="Last Name" className="p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setForm({ ...form, lastName: e.target.value })} required />
                    </div>
                    <div className="mb-4">
                        <input type="email" placeholder="Email Address" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="mb-4">
                        <input type="password" placeholder="Password" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setForm({ ...form, password: e.target.value })} required />
                    </div>
                    <div className="mb-4">
                        <input type="password" placeholder="Confirm Password" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
                    </div>
                    <Captcha onVerify={setIsCaptchaValid} />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed">
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            "Register"
                        )}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign In</Link></p>
            </div>
        </div>
    );
}