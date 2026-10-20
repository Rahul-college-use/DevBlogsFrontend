import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { LoadingSpinner } from '../components/Loader';
import { ShimmerDemo } from '../components/Shimmer';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [catForm, setCatForm] = useState({ title: '', image: '' });
    const [editCatId, setEditCatId] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            if (!token) { navigate('/login'); return; }
            const res = await axios.get('https://dev-blogs-mu.vercel.app/category/', { headers });
            setCategories(res.data.findOwnPost || res.data.findAllCategory || []);
        } catch (err) {
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
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
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
            setLoading(false);
        }
    };

    const handleEdit = (cat) => {
        setEditCatId(cat._id);
        setCatForm({ title: cat.title, image: cat.image || '' });
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`https://dev-blogs-mu.vercel.app/category/delete/${id}`, { headers });
            toast.success(res.data.message || "Category deleted");
            fetchCategories();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="min-h-screen relative bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1920&auto=format&fit=crop')` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950/85 via-gray-900/80 to-blue-950/85 backdrop-blur-[2px]"></div>
            <Navbar />

            <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 space-y-8">
                <h1 className="text-3xl font-extrabold text-white">📂 Manage Categories</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add/Edit Form */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl h-fit">
                        <h3 className="text-lg font-bold text-white mb-4">{editCatId ? "Edit Category" : "Add New Category"}</h3>
                        <form onSubmit={handleSubmit}>
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
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed">
                                    {loading ? <LoadingSpinner /> : (editCatId ? "Update" : "Add Category")}
                                </button>
                                {editCatId && (
                                    <button type="button" onClick={() => { setEditCatId(null); setCatForm({ title: '', image: '' }); }} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-xl text-sm">Cancel</button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Categories Grid List */}
                    <div className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
                        <h3 className="text-xl font-bold text-white mb-6">All Categories</h3>
                        {loading && categories.length === 0 ? (
                            <ShimmerDemo/>
                            // <p className="text-gray-300 text-sm">No categories available.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {categories.map(cat => (
                                    <div key={cat._id} className="bg-white/10 border border-white/15 p-4 rounded-xl flex items-center justify-between gap-4 shadow">
                                        <div className="flex items-center gap-3">
                                            {cat.image ? (
                                                <img src={cat.image} alt={cat.title} className="w-12 h-12 object-cover rounded-lg border border-white/20 shadow" />
                                            ) : (
                                                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-xs text-gray-400">No Img</div>
                                            )}
                                            <div>
                                                <h4 className="text-white font-bold text-base">{cat.title}</h4>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(cat)} className="bg-amber-500/80 hover:bg-amber-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">Edit</button>
                                            <button onClick={() => handleDelete(cat._id)} className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">Delete</button>
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