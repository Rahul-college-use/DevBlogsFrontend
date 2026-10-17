import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success("Logged out successfully");
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 px-4 md:px-8 py-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                
                {/* Logo / Brand */}
                <Link to="/dashboard" className="text-xl font-extrabold text-white tracking-wider flex items-center gap-2">
                    📚 <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">BlogApp</span>
                </Link>

                {/* Desktop Nav Links */}
                {token && (
                    <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-300">
                        <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
                        <Link to="/Blog" className="hover:text-blue-400 transition">My Blogs</Link>
                        <Link to="/Categories" className="hover:text-blue-400 transition">Categories</Link>
                        <Link to="/community" className="hover:text-blue-400 transition">Community Posts</Link>
                    </div>
                )}

                {/* Right Side: Logout & Hamburger Toggle for Mobile */}
                <div className="flex items-center gap-4">
                    {token && (
                        <button 
                            onClick={handleLogout} 
                            className="hidden md:block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-md"
                        >
                            Logout
                        </button>
                    )}

                    {!token && (
                        <Link 
                            to="/login" 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-md"
                        >
                            Login
                        </Link>
                    )}

                    {/* Mobile Hamburger Button */}
                    {token && (
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="md:hidden text-gray-300 hover:text-white focus:outline-none p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    )}
                </div>

            </div>

            {/* Mobile Dropdown Menu */}
            {token && isOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-3 text-sm font-semibold text-gray-300">
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition py-1">Dashboard</Link>
                    <Link to="/Blog" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition py-1">My Blogs</Link>
                    <Link to="/Categories" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition py-1">Categories</Link>
                    <Link to="/community" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition py-1">Community Posts</Link>
                    <button 
                        onClick={() => { setIsOpen(false); handleLogout(); }} 
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-md text-center mt-2"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}