import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Blog from './pages/Blog';
import Categories from './pages/Categories';
import CommunityPosts from './pages/CommunityPosts';

export default function App() {
    return (
        <Router>
            {/* Toast Notifications */}
            <Toaster position="top-center" reverseOrder={false} />

            <Routes>
                {/* Default redirect to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Dashboard & Feature Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/Blog" element={<Blog />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/community" element={<CommunityPosts />} />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}