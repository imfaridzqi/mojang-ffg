import { Head } from '@inertiajs/react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { useState } from 'react';

export default function Activate() {
    const [login, setLogin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [totpUri, setTotpUri] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/users/activate', { login });
            setTotpUri(res.data.data.totp_uri);
        } catch (err) {
            setError(err.response?.data?.error || 'Terjadi kesalahan. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Aktivasi Akun" />

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
                            <h1 className="text-xl font-semibold text-white tracking-tight">Aktivasi Akun</h1>
                            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent tracking-wide">MOJANG FFG</span>
                            <p className="text-sm text-white/40 mt-2">
                                {totpUri ? 'Scan QR Code dengan Google Authenticator' : 'Masukkan email atau NIK untuk mendapatkan QR Code'}
                            </p>
                        </div>

                        {totpUri ? (
                            /* ── QR Code ── */
                            <div className="flex flex-col items-center gap-5">
                                {/* QR Code */}
                                <div className="bg-white p-4 rounded-2xl shadow-lg shadow-indigo-500/10">
                                    <QRCode
                                        value={totpUri}
                                        size={180}
                                        bgColor="#ffffff"
                                        fgColor="#0a0a0f"
                                    />
                                </div>

                                {/* Steps */}
                                <div className="w-full flex flex-col gap-2.5">
                                    {[
                                        'Buka aplikasi Google Authenticator di HP Anda',
                                        'Tekan tombol "+" lalu pilih "Scan QR Code"',
                                        'Arahkan kamera ke QR Code di atas',
                                        'Akun akan otomatis ditambahkan',
                                    ].map((step, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                {i + 1}
                                            </span>
                                            <p className="text-xs text-white/50 leading-relaxed">{step}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex gap-2.5">
                                    <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-xs text-amber-300/80 leading-relaxed">
                                        Simpan QR Code ini. Setelah meninggalkan halaman ini, Anda tidak dapat melihatnya lagi.
                                    </p>
                                </div>

                                <a
                                    href="/login"
                                    className="w-full text-center bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 text-sm"
                                >
                                    Lanjut ke Login
                                </a>
                            </div>
                        ) : (
                            /* ── Input Form ── */
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Email / NIK</label>
                                    <input
                                        type="text"
                                        value={login}
                                        onChange={(e) => { setLogin(e.target.value); setError(''); }}
                                        placeholder="nama@email.com atau NIK"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all"
                                    />
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
                                            Mencari akun...
                                        </span>
                                    ) : 'Tampilkan QR Code'}
                                </button>

                                <p className="text-center text-white/30 text-xs mt-1">
                                    Belum punya akun?{' '}
                                    <a href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                                        Daftar
                                    </a>
                                </p>
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
