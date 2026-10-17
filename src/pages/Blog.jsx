import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import BlogCard from '../components/BlogList';

export default function Blog() {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const fetchBlogs = async () => {
        try {
            if (!token) {
                navigate('/login');
                return;
            }
            // Backend endpoint to fetch blogs
            const res = await axios.get('https://dev-blogs-mu.vercel.app/blog/', { headers });
            setBlogs(res.data.findAllPost || res.data.findOwnPost || []);
        } catch (err) {
            toast.error("Failed to load blogs");
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleEdit = (blog) => {
        // Aap chahein toh edit ke liye dashboard par redirect kar sakte hain ya modal open kar sakte hain
        navigate('/dashboard');
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`https://dev-blogs-mu.vercel.app/blog/delete/${id}`, { headers });
            toast.success(res.data.message || "Blog deleted successfully");
            fetchBlogs();
        } catch (err) {
            toast.error("Failed to delete blog");
        }
    };

    return (
        <div className="min-h-screen relative bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1920&auto=format&fit=crop')` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950/85 via-gray-900/80 to-blue-950/85 backdrop-blur-[2px]"></div>
            
            {/* Navbar Component */}
            <Navbar />

            <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-8 space-y-6">
                <h1 className="text-3xl font-extrabold text-white">📖 All Blog Posts</h1>
                <p className="text-gray-300 text-sm">Explore all the published articles and stories in one place.</p>

                {blogs.length === 0 ? (
                    <div className="bg-white/15 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-center text-gray-300">
                        No blogs available right now.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {blogs.map(blog => (
                            <BlogCard 
                                key={blog._id} 
                                blog={blog} 
                                onEdit={handleEdit} 
                                onDelete={handleDelete} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}