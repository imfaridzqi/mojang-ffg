import axios from 'axios';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        axios
            .get('/api/users/current', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setUser(res.data.data);
                setLoading(false);
            })
            .catch(() => {
                localStorage.removeItem('auth_token');
                window.location.href = '/login';
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <svg className="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <p className="text-white/40 text-sm">Memverifikasi sesi...</p>
                </div>
            </div>
        );
    }

    return children(user);
}
