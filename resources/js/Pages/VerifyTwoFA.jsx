import { Head } from '@inertiajs/react';
import axios from 'axios';
import QRCode from 'qrcode';
import { useEffect, useRef, useState } from 'react';

export default function VerifyTwoFA() {
    const [pendingToken, setPendingToken] = useState('');
    const [hasTotp, setHasTotp] = useState(true);
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [totpCode, setTotpCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);
    const totpRefs = useRef([]);

    useEffect(() => {
        const token  = sessionStorage.getItem('pending_token');
        const hasTp  = sessionStorage.getItem('has_totp') === '1';
        const uri    = sessionStorage.getItem('totp_uri') || '';

        if (!token) {
            window.location.href = '/login';
            return;
        }

        setPendingToken(token);
        setHasTotp(hasTp);

        if (!hasTp && uri) {
            QRCode.toDataURL(uri, { width: 200, margin: 2, color: { dark: '#0a0a0f', light: '#ffffff' } })
                .then(url => {
                    setQrDataUrl(url);
                    setReady(true);
                })
                .catch(() => setReady(true));
        } else {
            setReady(true);
        }
    }, []);

    const handleTotpInput = (e, index) => {
        const val    = e.target.value.replace(/\D/g, '').slice(-1);
        const digits = totpCode.split('');
        digits[index] = val;
        const newCode = digits.join('').slice(0, 6);
        setTotpCode(newCode);
        setError('');
        if (val && index < 5) totpRefs.current[index + 1]?.focus();
    };

    const handleTotpKey = (e, index) => {
        if (e.key === 'Backspace' && !totpCode[index] && index > 0) {
            totpRefs.current[index - 1]?.focus();
        }
    };

    const handleTotpPaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        setTotpCode(pasted);
        totpRefs.current[Math.min(pasted.length, 5)]?.focus();
        e.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (totpCode.length < 6) {
            setError('Masukkan 6 digit kode dari Google Authenticator.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/users/verify-2fa', {
                pending_token: pendingToken,
                totp_code: totpCode,
            });
            sessionStorage.removeItem('pending_token');
            sessionStorage.removeItem('has_totp');
            sessionStorage.removeItem('totp_uri');
            localStorage.setItem('auth_token', res.data.data.token);
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.error || 'Terjadi kesalahan. Coba lagi.');
            setTotpCode('');
            totpRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    if (!ready) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <svg className="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
            </div>
        );
    }

    return (
        <>
            <Head title="Verifikasi 2FA" />

            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />

                <div className="relative z-10 w-full max-w-sm">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

                        {/* Header */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-semibold text-white tracking-tight">Verifikasi 2FA</h1>
                            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent tracking-wide">MOJANG FFG</span>
                            <p className="text-sm text-white/40 mt-2 text-center">
                                {hasTotp
                                    ? 'Masukkan kode dari Google Authenticator'
                                    : 'Scan QR Code untuk mengaktifkan Google Authenticator'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                            {/* QR Code — only shown on first-time setup */}
                            {!hasTotp && qrDataUrl && (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="bg-white p-3 rounded-2xl shadow-lg shadow-indigo-500/10 mx-auto">
                                        <img src={qrDataUrl} alt="QR Code Google Authenticator" width={176} height={176} />
                                    </div>

                                    <div className="w-full flex flex-col gap-2">
                                        {[
                                            'Buka Google Authenticator di HP Anda',
                                            'Tekan "+" lalu pilih "Scan QR Code"',
                                            'Arahkan kamera ke QR Code di atas',
                                            'Masukkan 6 digit kode yang muncul',
                                        ].map((step, i) => (
                                            <div key={i} className="flex items-start gap-2.5">
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
                                            QR Code ini hanya muncul sekali. Pastikan sudah scan sebelum melanjutkan.
                                        </p>
                                    </div>

                                    <div className="w-full border-t border-white/5" />
                                </div>
                            )}

                            {/* TOTP input */}
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
                                            value={totpCode[i] || ''}
                                            onChange={(e) => handleTotpInput(e, i)}
                                            onKeyDown={(e) => handleTotpKey(e, i)}
                                            className="w-full aspect-square text-center text-lg font-bold text-white bg-white/5 border border-white/10 rounded-xl outline-none focus:border-indigo-500/60 focus:bg-indigo-500/10 transition-all caret-transparent"
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-white/25 text-center">6 digit dari Google Authenticator</p>
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
                                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98] text-sm"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Memverifikasi...
                                    </span>
                                ) : 'Verifikasi & Masuk'}
                            </button>

                            <button
                                type="button"
                                onClick={() => { sessionStorage.clear(); window.location.href = '/login'; }}
                                className="text-xs text-white/30 hover:text-white/60 transition-colors text-center"
                            >
                                ← Kembali ke login
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-white/20 text-xs mt-6">
                        Protected with Google Authenticator 2FA
                    </p>
                </div>
            </div>
        </>
    );
}
