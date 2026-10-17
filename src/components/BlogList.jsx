import React from 'react';

export default function BlogCard({ blog, onEdit, onDelete }) {
    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 items-start">
            {blog.image && (
                <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full md:w-36 h-28 object-cover rounded-xl border border-white/10" 
                />
            )}
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-lg">{blog.title}</h4>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${blog.status === 'post' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                        {blog.status}
                    </span>
                </div>
                <p className="text-gray-300 text-sm mt-2 line-clamp-2">{blog.descripation}</p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-gray-300">
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-md font-medium">
                        {blog.categoryName || "General"}
                    </span>
                    <span>👤 By: <strong className="text-white">{blog.userName || "Author"}</strong></span>
                    <span>📅 {new Date(blog.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Action Buttons */}
            {onEdit && onDelete && (
                <div className="flex md:flex-col gap-2 self-end md:self-center">
                    <button 
                        onClick={() => onEdit(blog)} 
                        className="bg-amber-500/80 hover:bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => onDelete(blog._id)} 
                        className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}