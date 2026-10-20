import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { LoadingSpinner } from '../components/Loader';
import { ShimmerDemo } from '../components/Shimmer';

export default function Dashboard() {
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);

    // Blog Form State (Fixed typo: descripation -> description)
    const [blogForm, setBlogForm] = useState({ title: '', image: '', categoryId: '', categoryName: '', description: '', status: 'post' });
    const [editBlogId, setEditBlogId] = useState(null);

    // Category Form State
    const [catForm, setCatForm] = useState({ title: '', image: '' });
    const [editCatId, setEditCatId] = useState(null);

    // Separate loading states for better UX
    const [pageLoading, setPageLoading] = useState(false);
    const [catLoading, setCatLoading] = useState(false);
    const [blogLoading, setBlogLoading] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const fetchAllData = useCallback(async () => {
        try {
            if (!token) {
                navigate('/login');
                return;
            }
            setPageLoading(true);
            
            // Fetch own blogs & categories concurrently
            const [blogRes, catRes] = await Promise.all([
                axios.get('https://dev-blogs-mu.vercel.app/blog/', { headers }).catch(() => ({ data: { findAllPost: [] } })),
                axios.get('https://dev-blogs-mu.vercel.app/category/', { headers }).catch(() => ({ data: { findAllCategory: [] } }))
            ]);

            setBlogs(blogRes.data.findAllPost || blogRes.data.findOwnPost || []);
            setCategories(catRes.data.findAllCategory || catRes.data.findOwnPost || []);
        } catch (err) {
            toast.error("Session expired or unauthorized");
            localStorage.removeItem('token');
            navigate('/login');
        } finally {
            setPageLoading(false);
        }
    }, [token, navigate]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // --- CATEGORY ACTIONS ---
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setCatLoading(true);
        try {
            if (editCatId) {
                const res = await axios.put(`https://dev-blogs-mu.vercel.app/category/update/${editCatId}`, catForm, { headers });
                toast.success(res.data.message || "Category updated");
                setEditCatId(null);
            } else {
                const res = await axios.post('https://dev-blogs-mu.vercel.app/category/add', catForm, { headers });
                toast.success(res.data.message || "Category added");
            }
            setCatForm({ title: '', image: '' });
            fetchAllData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Category operation failed");
        } finally {
            setCatLoading(false);
        }
    };

    const handleEditCategory = (cat) => {
        setEditCatId(cat._id);
        setCatForm({ title: cat.title, image: cat.image || '' });
    };

    const handleDeleteCategory = async (id) => {
        try {
            const res = await axios.delete(`https://dev-blogs-mu.vercel.app/category/delete/${id}`, { headers });
            toast.success(res.data.message || "Category deleted");
            fetchAllData();
        } catch (err) {
            toast.error("Delete category failed");
        }
    };

    // --- BLOG ACTIONS ---
    const handleBlogSubmit = async (e) => {
        e.preventDefault();
        setBlogLoading(true);
        try {
            if (editBlogId) {
                const res = await axios.put(`https://dev-blogs-mu.vercel.app/blog/update/${editBlogId}`, blogForm, { headers });
                toast.success(res.data.message || "Blog updated");
                setEditBlogId(null);
            } else {
                const res = await axios.post('https://dev-blogs-mu.vercel.app/blog/', blogForm, { headers });
                toast.success(res.data.message || "Blog posted");
            }
            setBlogForm({ title: '', image: '', categoryId: '', categoryName: '', description: '', status: 'post' });
            fetchAllData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Blog operation failed");
        } finally {
            setBlogLoading(false);
        }
    };

    const handleEditBlog = (blog) => {
        setEditBlogId(blog._id);
        setBlogForm({
            title: blog.title,
            image: blog.image,
            categoryId: blog.categoryId,
            categoryName: blog.categoryName,
            description: blog.description || blog.descripation || '',
            status: blog.status
        });
    };

    const handleDeleteBlog = async (id) => {
        try {
            const res = await axios.delete(`https://dev-blogs-mu.vercel.app/blog/delete/${id}`, { headers });
            toast.success(res.data.message || "Blog deleted");
            fetchAllData();
        } catch (err) {
            toast.error("Failed to delete blog");
        }
    };

    return (
        <div className="min-h-screen relative bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1920&auto=format&fit=crop')` }}>
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950/85 via-gray-900/80 to-blue-950/85 backdrop-blur-[2px]"></div>

            <Navbar />

            <div className="relative z-10 min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto">

                {/* Top Section: Categories Cards Grid */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">📂 Your Categories</h2>
                    {pageLoading && categories.length === 0 ? (
                        <ShimmerDemo />
                    ) : categories.length === 0 ? (
                        <p className="text-gray-300 text-sm bg-white/5 p-4 rounded-xl border border-white/10">No categories found. Create one below!</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {categories.map(cat => (
                                <div key={cat._id} className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-lg hover:bg-white/15 transition flex justify-between items-center">
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{cat.title}</h3>
                                        <p className="text-gray-300 text-xs mt-1">Category Item</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditCategory(cat)} className="bg-amber-500/80 hover:bg-amber-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">Edit</button>
                                        <button onClick={() => handleDeleteCategory(cat._id)} className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Content Grid: Forms & Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Create / Edit Forms */}
                    <div className="space-y-6">

                        {/* Category Form */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
                            <h3 className="text-lg font-bold text-white mb-4">{editCatId ? "Edit Category" : "Add Category"}</h3>
                            <form onSubmit={handleCategorySubmit}>
                                <input
                                    type="text"
                                    placeholder="Category Title"
                                    value={catForm.title}
                                    onChange={e => setCatForm({ ...catForm, title: e.target.value })}
                                    className="w-full p-3 mb-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Image URL (Optional)"
                                    value={catForm.image}
                                    onChange={e => setCatForm({ ...catForm, image: e.target.value })}
                                    className="w-full p-3 mb-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={catLoading}
                                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed">
                                        {catLoading ? <LoadingSpinner /> : (editCatId ? "Update Category" : "Add Category")}
                                    </button>
                                    {editCatId && (
                                        <button type="button" onClick={() => { setEditCatId(null); setCatForm({ title: '', image: '' }); }} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-xl text-sm">Cancel</button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Blog Form */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
                            <h3 className="text-lg font-bold text-white mb-4">{editBlogId ? "Edit Blog Post" : "Create New Blog"}</h3>
                            <form onSubmit={handleBlogSubmit}>
                                <input
                                    type="text"
                                    placeholder="Blog Title"
                                    value={blogForm.title}
                                    onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                                    className="w-full p-3 mb-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={blogForm.image}
                                    onChange={e => setBlogForm({ ...blogForm, image: e.target.value })}
                                    className="w-full p-3 mb-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                                <select
                                    value={blogForm.categoryId}
                                    onChange={e => {
                                        const cat = categories.find(c => c._id === e.target.value);
                                        setBlogForm({ ...blogForm, categoryId: e.target.value, categoryName: cat ? cat.title : '' });
                                    }}
                                    className="w-full p-3 mb-3 bg-gray-900 border border-white/20 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                >
                                    <option value="" className="bg-gray-900">Select Category</option>
                                    {categories.map(cat => <option key={cat._id} value={cat._id} className="bg-gray-900">{cat.title}</option>)}
                                </select>
                                <textarea
                                    placeholder="Description"
                                    value={blogForm.description}
                                    onChange={e => setBlogForm({ ...blogForm, description: e.target.value })}
                                    className="w-full p-3 mb-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                                    rows="3"
                                    required
                                ></textarea>
                                <select
                                    value={blogForm.status}
                                    onChange={e => setBlogForm({ ...blogForm, status: e.target.value })}
                                    className="w-full p-3 mb-3 bg-gray-900 border border-white/20 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="post" className="bg-gray-900">Post (Published)</option>
                                    <option value="draft" className="bg-gray-900">Draft</option>
                                </select>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={blogLoading}
                                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed">
                                        {blogLoading ? <LoadingSpinner /> : (editBlogId ? "Update Blog" : "Publish Blog")}
                                    </button>
                                    {editBlogId && (
                                        <button type="button" onClick={() => { setEditBlogId(null); setBlogForm({ title: '', image: '', categoryId: '', categoryName: '', description: '', status: 'post' }); }} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-xl text-sm">Cancel</button>
                                    )}
                                </div>
                            </form>
                        </div>

                    </div>

                    {/* Right Column: Recent Posted Blogs Feed */}
                    <div className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
                        <h3 className="text-xl font-bold text-white mb-6">📝 Recent Blog Posts Feed</h3>
                        {pageLoading && blogs.length === 0 ? (
                            <ShimmerDemo />
                        ) : (
                            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                                {blogs.map(blog => (
                                    <div key={blog._id} className="bg-white/10 border border-white/15 p-5 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 items-start">
                                        {blog.image && (
                                            <img src={blog.image} alt={blog.title} className="w-full md:w-36 h-28 object-cover rounded-xl border border-white/10" />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-white text-lg">{blog.title}</h4>
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${blog.status === 'post' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                                                    {blog.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-sm mt-2 line-clamp-2">{blog.description || blog.descripation}</p>

                                            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-gray-300">
                                                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-md font-medium">{blog.categoryName || "General"}</span>
                                                <span>👤 By: <strong className="text-white">{blog.userName || "Author"}</strong></span>
                                                <span>📅 {new Date(blog.createdAt || Date.now()).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex md:flex-col gap-2 self-end md:self-center">
                                            <button onClick={() => handleEditBlog(blog)} className="bg-amber-500/80 hover:bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold">Edit</button>
                                            <button onClick={() => handleDeleteBlog(blog._id)} className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}