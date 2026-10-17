import React, { useState, useEffect } from 'react';

export default function Captcha({ onVerify }) {
    const [captchaText, setCaptchaText] = useState('');
    const [userInput, setUserInput] = useState('');

    const generateCaptcha = () => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaText(result);
        setUserInput('');
        onVerify(false);
    };

    useEffect(() => { generateCaptcha(); }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        setUserInput(val);
        onVerify(val === captchaText);
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Security Captcha</label>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border border-gray-300 mb-2">
                <span className="font-mono text-xl font-bold tracking-widest text-blue-600 select-none line-through">{captchaText}</span>
                <button type="button" onClick={generateCaptcha} className="text-xs text-blue-600 hover:underline font-medium">Refresh</button>
            </div>
            <input 
                type="text" 
                placeholder="Enter characters above" 
                value={userInput} 
                onChange={handleChange} 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                required 
            />
        </div>
    );
}