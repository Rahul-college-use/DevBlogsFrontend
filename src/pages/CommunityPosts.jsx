import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import {ShimmerDemo} from '../components/Shimmer'
export default function CommunityPosts() {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editCommentId, setEditCommentId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [pageLoading,setPageLoading]=useState(false)

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Decode JWT token to get current logged-in user ID
    useEffect(() => {
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                const decodedToken = JSON.parse(jsonPayload);
                setCurrentUserId(decodedToken.id || decodedToken.userId || decodedToken._id);
            } catch (err) {
                console.log("Error decoding token", err);
            }
        }
    }, [token]);

    const fetchCommunityPosts = async () => {
        setPageLoading(true)
        try {
            if (!token) { navigate('/login'); return; }
            const res = await axios.get('https://dev-blogs-mu.vercel.app/blog/get-all', { headers });
            setPosts(res.data.findAllPost || []);
        } catch (err) {
            toast.error("Failed to load community posts");
        }finally{
            setPageLoading(false)
        }
    };

    useEffect(() => {
        fetchCommunityPosts();
    }, []);

    const fetchComments = async (blogId) => {
        setPageLoading(true)
        try {

            const res = await axios.get(`https://dev-blogs-mu.vercel.app/comment/${blogId}`, { headers });
            setComments(res.data.findBlog || []);
        } catch (err) {
            setComments([]);
        }finally{
            setPageLoading(false)
        }
    };

    const handleOpenModal = (post) => {
        setSelectedPost(post);
        fetchComments(post._id);
        setEditCommentId(null);
        setNewComment('');
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !selectedPost) return;

        try {
            if (editCommentId) {
                const res = await axios.put(`https://dev-blogs-mu.vercel.app/comment/update/${editCommentId}`, { comment: newComment }, { headers });
                toast.success(res.data.message || "Comment updated successfully");
                setEditCommentId(null);
            } else {
                const payload = {
                    comment: newComment,
                    blogId: selectedPost._id
                };
                const res = await axios.post('https://dev-blogs-mu.vercel.app/comment', payload, { headers });
                toast.success(res.data.message || "Comment added successfully");
            }
            setNewComment('');
            fetchComments(selectedPost._id);
        } catch (err) {
            toast.error(err.response?.data?.message || "Comment operation failed");
        }
    };

    const handleEditComment = (comm) => {
        setEditCommentId(comm._id);
        setNewComment(comm.comment);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const res = await axios.delete(`https://dev-blogs-mu.vercel.app/comment/delete/${commentId}`, { headers });
            toast.success(res.data.message || "Comment deleted successfully");
            fetchComments(selectedPost._id);
        } catch (err) {
            toast.error("Failed to delete comment");
        }
    };

    const getShortDescription = (text) => {
        if (!text) return "";
        const words = text.split(" ");
        if (words.length <= 10) return text;
        return words.slice(0, 10).join(" ") + "...";
    };

    return (
        <div className="min-h-screen relative bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1920&auto=format&fit=crop')` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950/85 via-gray-900/80 to-blue-950/85 backdrop-blur-[2px]"></div>
            <Navbar />

            <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-8 space-y-6">
                <h1 className="text-3xl font-extrabold text-white">🌍 Community Blog Posts</h1>
                <p className="text-gray-300 text-sm">Explore insights and stories shared by other users in the network.</p>

                {pageLoading && posts.length === 0 ? (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-center text-gray-300">
                      <ShimmerDemo message = "Loading posts" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <div key={post._id} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-6 items-start justify-between">
                                {post.image && (
                                    <img src={post.image} alt={post.title} className="w-full md:w-48 h-32 object-cover rounded-xl border border-white/10" />
                                )}
                                <div className="flex-1">
                                    <h3 className="text-white font-bold text-xl">{post.title}</h3>
                                    <p className="text-gray-300 text-sm mt-2">{getShortDescription(post.descripation)}</p>
                                    
                                    <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-300">
                                        <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-md font-medium">{post.categoryName || "General"}</span>
                                        <span>👤 By: <strong className="text-white">{post.userName || post.author || "Community Member"}</strong></span>
                                        <span>📅 {new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleOpenModal(post)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition self-end md:self-center shadow-md whitespace-nowrap"
                                >
                                    View Full Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FULL DETAILS MODAL WITH COMMENTS */}
            {selectedPost && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-white/20 w-full max-w-2xl p-6 rounded-3xl shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
                        
                        <button 
                            onClick={() => { setSelectedPost(null); setComments([]); }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/10 p-2 rounded-full transition"
                        >
                            ✕
                        </button>

                        {selectedPost.image && (
                            <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-64 object-cover rounded-2xl border border-white/10" />
                        )}

                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
                                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-md font-medium">{selectedPost.categoryName || "General"}</span>
                                <span>👤 By: <strong className="text-white">{selectedPost.userName || selectedPost.author || "Community Member"}</strong></span>
                                <span>📅 {new Date(selectedPost.createdAt || Date.now()).toLocaleDateString()}</span>
                            </div>

                            <h2 className="text-2xl font-extrabold text-white">{selectedPost.title}</h2>
                            
                            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line pt-2 border-t border-white/10">
                                {selectedPost.descripation}
                            </p>
                        </div>

                        {/* COMMENTS SECTION */}
                        <div className="border-t border-white/15 pt-6 space-y-4">
                            <h3 className="text-lg font-bold text-white">💬 Comments ({comments.length})</h3>

                            <form onSubmit={handleCommentSubmit} className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder={editCommentId ? "Edit your comment..." : "Write a comment..."} 
                                    value={newComment} 
                                    onChange={e => setNewComment(e.target.value)} 
                                    className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                                    required 
                                />
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl text-sm font-semibold transition shadow-md whitespace-nowrap">
                                    {editCommentId ? "Update" : "Post"}
                                </button>
                                {editCommentId && (
                                    <button 
                                        type="button" 
                                        onClick={() => { setEditCommentId(null); setNewComment(''); }} 
                                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-3 rounded-xl text-sm"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </form>

                            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                {pageLoading && comments.length === 0 ? (
                                    <ShimmerDemo message='Loading comment'/>
                                    // <p className="text-gray-400 text-xs">No comments yet. Be the first one to comment!</p>
                                ) : (
                                    comments.map((comm, idx) => {
                                        // Check if the comment belongs to the logged-in user
                                        const isOwner = comm.userId === currentUserId || comm.user === currentUserId;

                                        return (
                                            <div key={comm._id || idx} className="bg-white/5 border border-white/10 p-3 rounded-xl flex justify-between items-start gap-3">
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex justify-between items-center text-xs text-gray-400">
                                                        <strong className="text-blue-300">{comm.userName || "User"}</strong>
                                                        <span>{new Date(comm.date || comm.createdAt || Date.now()).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-gray-200 text-sm">{comm.comment}</p>
                                                </div>

                                                {/* Show Edit/Delete ONLY if it's the user's own comment */}
                                                {isOwner && (
                                                    <div className="flex gap-1 self-center">
                                                        <button onClick={() => handleEditComment(comm)} className="bg-amber-500/80 hover:bg-amber-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">Edit</button>
                                                        <button onClick={() => handleDeleteComment(comm._id)} className="bg-red-500/80 hover:bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">Delete</button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button 
                                onClick={() => { setSelectedPost(null); setComments([]); }}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}