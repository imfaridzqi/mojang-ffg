import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ThemeToggle from '@/Components/ThemeToggle';

function EyeIcon({ open }) {
    return open ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', nik: '', password: '' });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        axios.get('/api/users/current', { headers: { Authorization: `Bearer ${token}` } })
            .then(() => { window.location.href = '/dashboard'; })
            .catch(() => { localStorage.removeItem('auth_token'); });
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== confirmPassword) {
            setError('Password dan konfirmasi password tidak cocok.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/users', form);
            alert('Registrasi berhasil, silakan login.');
            window.location.href = '/login';
        } catch (err) {
            setError(err.response?.data?.error || 'Terjadi kesalahan. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const passwordsMatch = confirmPassword && form.password === confirmPassword;
    const passwordsMismatch = confirmPassword && form.password !== confirmPassword;

    const inputClass = "w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 outline-none focus:border-indigo-500/70 transition-all";
    const eyeBtnClass = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/70 transition-colors";
    const labelClass = "text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-widest";

    return (
        <>
            <Head title="Registrasi" />

            <div className="min-h-screen bg-slate-100 dark:bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 dark:bg-indigo-600/20 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 dark:bg-violet-600/20 blur-[120px] pointer-events-none" />

                <div className="absolute top-4 right-4 z-20">
                    <ThemeToggle />
                </div>

                <div className="relative z-10 w-full max-w-sm">
                    <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-xl dark:shadow-none">

                        <div className="flex flex-col items-center mb-8">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Buat Akun Baru</h1>
                            <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent tracking-wide">MOJANG FFG</span>
                            <p className="text-sm text-gray-400 dark:text-white/40 mt-2">Daftarkan akun Anda</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>Nama Lengkap</label>
                                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nama lengkap Anda" required className={inputClass} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>Email</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="nama@email.com" required className={inputClass} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>NIK</label>
                                <input type="text" name="nik" value={form.nik} onChange={handleChange} placeholder="NIK" inputMode="numeric" required className={inputClass} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>Password</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Minimal 8 karakter" required className={inputClass + ' pr-11'} />
                                    <button type="button" onClick={() => setShowPassword(v => !v)} className={eyeBtnClass} tabIndex={-1}>
                                        <EyeIcon open={showPassword} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>Konfirmasi Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                                        placeholder="Ulangi password Anda"
                                        required
                                        className={`w-full bg-white dark:bg-white/5 border rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 outline-none transition-all ${
                                            passwordsMismatch
                                                ? 'border-red-400 dark:border-red-500/50'
                                                : passwordsMatch
                                                ? 'border-emerald-400 dark:border-emerald-500/50'
                                                : 'border-gray-200 dark:border-white/10 focus:border-indigo-500/70'
                                        }`}
                                    />
                                    <button type="button" onClick={() => setShowConfirm(v => !v)} className={eyeBtnClass} tabIndex={-1}>
                                        <EyeIcon open={showConfirm} />
                                    </button>
                                </div>
                                {passwordsMismatch && <p className="text-xs text-red-400">Password tidak cocok.</p>}
                                {passwordsMatch && <p className="text-xs text-emerald-500 dark:text-emerald-400">Password cocok.</p>}
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                    <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-xs text-red-400">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-1 w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-[0.98] text-sm"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Mendaftarkan...
                                    </span>
                                ) : 'Daftar Sekarang'}
                            </button>

                            <p className="text-center text-gray-400 dark:text-white/30 text-xs mt-1">
                                Sudah punya akun?{' '}
                                <a href="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-medium">
                                    Masuk
                                </a>
                            </p>
                        </form>
                    </div>

                    <p className="text-center text-gray-400 dark:text-white/20 text-xs mt-6">
                        Protected with Google Authenticator 2FA
                    </p>
                </div>
            </div>
        </>
    );
}
