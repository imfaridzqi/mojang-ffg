import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useRef, useState } from 'react';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '', totp_code: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState('');
    const [loggingOut, setLoggingOut] = useState(false);
    const totpRefs = useRef([]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleTotpInput = (e, index) => {
        const val = e.target.value.replace(/\D/g, '').slice(-1);
        const digits = form.totp_code.split('');
        digits[index] = val;
        const newCode = digits.join('').slice(0, 6);
        setForm({ ...form, totp_code: newCode });
        setError('');
        if (val && index < 5) totpRefs.current[index + 1]?.focus();
    };

    const handleTotpKey = (e, index) => {
        if (e.key === 'Backspace' && !form.totp_code[index] && index > 0) {
            totpRefs.current[index - 1]?.focus();
        }
    };

    const handleTotpPaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        setForm({ ...form, totp_code: pasted });
        totpRefs.current[Math.min(pasted.length, 5)]?.focus();
        e.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.totp_code.length < 6) {
            setError('Masukkan 6 digit kode Google Authenticator.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/users/login', form);
            localStorage.setItem('auth_token', res.data.data.token);
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.error || 'Terjadi kesalahan. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">

                {/* Background blobs */}
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />

                {/* Card */}
                <div className="relative z-10 w-full max-w-sm">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

                        {/* Logo */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-semibold text-white tracking-tight">Selamat datang di</h1>
                            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent tracking-wide">MOJANG FFG</span>
                            <p className="text-sm text-white/40 mt-2">Masuk ke akun Anda</p>
                        </div>

                        {success ? (
                            <div className="flex flex-col items-center py-6 gap-4">
                                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-medium">Login berhasil!</p>
                                    <p className="text-white/40 text-sm mt-1">Anda berhasil masuk ke MOJANG FFG.</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        setLoggingOut(true);
                                        try {
                                            await axios.post('/api/users/logout', {}, {
                                                headers: { Authorization: `Bearer ${token}` },
                                            });
                                            setSuccess(false);
                                            setToken('');
                                            setForm({ email: '', password: '', totp_code: '' });
                                        } catch {
                                            // token sudah tidak valid, reset saja
                                            setSuccess(false);
                                            setToken('');
                                            setForm({ email: '', password: '', totp_code: '' });
                                        } finally {
                                            setLoggingOut(false);
                                        }
                                    }}
                                    disabled={loggingOut}
                                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 font-medium py-2.5 rounded-xl transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loggingOut ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Keluar...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Keluar
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                {/* Email */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="nama@email.com"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all"
                                    />
                                </div>

                                {/* Password */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all"
                                    />
                                </div>

                                {/* TOTP */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-medium text-white/50 uppercase tracking-widest">
                                        Kode Authenticator
                                    </label>
                                    <div className="flex gap-2 justify-between" onPaste={handleTotpPaste}>
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <input
                                                key={i}
                                                ref={(el) => (totpRefs.current[i] = el)}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={form.totp_code[i] || ''}
                                                onChange={(e) => handleTotpInput(e, i)}
                                                onKeyDown={(e) => handleTotpKey(e, i)}
                                                className="w-full aspect-square text-center text-lg font-bold text-white bg-white/5 border border-white/10 rounded-xl outline-none focus:border-indigo-500/60 focus:bg-indigo-500/10 transition-all caret-transparent"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-white/25 text-center">6 digit dari Google Authenticator</p>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                        <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-xs text-red-400">{error}</p>
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-1 w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98] text-sm"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Memproses...
                                        </span>
                                    ) : 'Masuk'}
                                </button>
                            </form>
                        )}
                    </div>

                    <p className="text-center text-white/20 text-xs mt-6">
                        Protected with Google Authenticator 2FA
                    </p>
                </div>
            </div>
        </>
    );
}
