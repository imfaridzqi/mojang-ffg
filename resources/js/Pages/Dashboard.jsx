import AuthGuard from '@/Components/AuthGuard';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useRef, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

// ── Dummy Data ────────────────────────────────────────────────────
const revenueData = [
    { month: 'Jan', revenue: 42000000, target: 38000000 },
    { month: 'Feb', revenue: 58000000, target: 45000000 },
    { month: 'Mar', revenue: 51000000, target: 50000000 },
    { month: 'Apr', revenue: 74000000, target: 60000000 },
    { month: 'Mei', revenue: 68000000, target: 65000000 },
    { month: 'Jun', revenue: 91000000, target: 75000000 },
    { month: 'Jul', revenue: 87000000, target: 80000000 },
    { month: 'Agu', revenue: 105000000, target: 90000000 },
];

const userGrowthData = [
    { week: 'Mg 1', new: 120, active: 890 },
    { week: 'Mg 2', new: 185, active: 1020 },
    { week: 'Mg 3', new: 143, active: 980 },
    { week: 'Mg 4', new: 210, active: 1150 },
    { week: 'Mg 5', new: 178, active: 1280 },
    { week: 'Mg 6', new: 256, active: 1420 },
];

const recentTransactions = [
    { id: 'TRX-001', user: 'Budi Santoso', amount: 2500000, status: 'success', date: '15 Apr 2026', avatar: 'BS' },
    { id: 'TRX-002', user: 'Siti Rahayu', amount: 1750000, status: 'pending', date: '15 Apr 2026', avatar: 'SR' },
    { id: 'TRX-003', user: 'Ahmad Fauzi', amount: 4200000, status: 'success', date: '14 Apr 2026', avatar: 'AF' },
    { id: 'TRX-004', user: 'Dewi Lestari', amount: 890000, status: 'failed', date: '14 Apr 2026', avatar: 'DL' },
    { id: 'TRX-005', user: 'Reza Firmansyah', amount: 3100000, status: 'success', date: '13 Apr 2026', avatar: 'RF' },
];

const navItems = [
    { icon: GridIcon, label: 'Dashboard' },
    { icon: UsersIcon, label: 'Pengguna' },
    { icon: ChartIcon, label: 'Analitik' },
    { icon: BoxIcon, label: 'Produk' },
    { icon: UploadExcelIcon, label: 'Upload Excel' },
    { icon: BellIcon, label: 'Notifikasi', badge: 3 },
    { icon: SettingsIcon, label: 'Pengaturan' },
];

const stats = [
    { label: 'Total Pengguna', value: '12,847', change: '+8.2%', up: true, icon: UsersIcon, color: 'indigo' },
    { label: 'Pendapatan', value: 'Rp 128,5M', change: '+14.5%', up: true, icon: WalletIcon, color: 'violet' },
    { label: 'Transaksi', value: '3,241', change: '+5.1%', up: true, icon: ArrowsIcon, color: 'emerald' },
    { label: 'Pengguna Baru', value: '892', change: '-2.4%', up: false, icon: TrendIcon, color: 'amber' },
];

// ── Icons ─────────────────────────────────────────────────────────
function GridIcon({ className }) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
}
function UsersIcon({ className }) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm10 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>;
}
function ChartIcon({ className }) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
}
function BoxIcon({ className }) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
}
function BellIcon({ className }) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
}
function SettingsIcon({ className }) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
function WalletIcon({ className }) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
}
function ArrowsIcon({ className }) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>;
}
function TrendIcon({ className }) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
}
function LogoutIcon({ className }) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
}
function UploadExcelIcon({ className }) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6M4 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" /></svg>;
}
function UploadCloudIcon({ className }) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>;
}
function XCircleIcon({ className }) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function CheckCircleIcon({ className }) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}

function UploadExcelPage() {
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const inputRef = useRef(null);

    const validateAndSet = useCallback((f) => {
        setResult(null);
        setErrorMsg('');
        if (!f) return;
        if (!f.name.match(/\.(xlsx|xls)$/i)) {
            setErrorMsg('File harus berformat .xlsx atau .xls');
            return;
        }
        if (f.size > 10 * 1024 * 1024) {
            setErrorMsg('Ukuran file maksimal 10 MB');
            return;
        }
        setFile(f);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) validateAndSet(f);
    }, [validateAndSet]);

    const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const onDragLeave = () => setDragging(false);

    const onInputChange = (e) => {
        const f = e.target.files?.[0];
        if (f) validateAndSet(f);
        e.target.value = '';
    };

    const removeFile = () => { setFile(null); setResult(null); setErrorMsg(''); };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setResult(null);
        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem('auth_token');
        try {
            await axios.post('/api/upload-excel', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            });
            setResult('success');
            setFile(null);
        } catch (err) {
            setResult('error');
            setErrorMsg(err.response?.data?.error || 'Upload gagal. Coba lagi.');
        } finally {
            setUploading(false);
        }
    };

    const formatSize = (bytes) => {
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-6">
                <h2 className="text-lg font-semibold">Upload Excel</h2>
                <p className="text-sm text-white/30 mt-0.5">Upload file .xlsx atau .xls, maksimal 10 MB</p>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col gap-5">
                {/* Drop zone */}
                <div
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onClick={() => !file && inputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all py-12 px-6
                        ${file
                            ? 'border-white/10 cursor-default'
                            : dragging
                                ? 'border-indigo-500/70 bg-indigo-500/10 cursor-copy'
                                : 'border-white/15 hover:border-indigo-500/50 hover:bg-white/3 cursor-pointer'
                        }`}
                >
                    <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={onInputChange} />

                    {file ? (
                        <div className="flex items-center gap-4 w-full">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                                <UploadExcelIcon className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-white/30 mt-0.5">{formatSize(file.size)}</p>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                className="text-white/30 hover:text-red-400 transition-colors shrink-0"
                            >
                                <XCircleIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${dragging ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
                                <UploadCloudIcon className={`w-7 h-7 transition-colors ${dragging ? 'text-indigo-400' : 'text-white/30'}`} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-white/70">
                                    {dragging ? 'Lepaskan file di sini' : 'Drag & drop file di sini'}
                                </p>
                                <p className="text-xs text-white/30 mt-1">
                                    atau <span className="text-indigo-400 font-medium">klik untuk memilih file</span>
                                </p>
                            </div>
                            <p className="text-[11px] text-white/20">Mendukung .xlsx dan .xls • Maks. 10 MB</p>
                        </>
                    )}
                </div>

                {/* Error */}
                {errorMsg && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                        <XCircleIcon className="w-4 h-4 text-red-400 shrink-0" />
                        <p className="text-xs text-red-400">{errorMsg}</p>
                    </div>
                )}

                {/* Success */}
                {result === 'success' && (
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                        <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                        <p className="text-xs text-emerald-400">File berhasil diupload.</p>
                    </div>
                )}

                {/* Button */}
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98] text-sm flex items-center justify-center gap-2"
                >
                    {uploading ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Mengupload...
                        </>
                    ) : (
                        <>
                            <UploadCloudIcon className="w-4 h-4" />
                            Upload File
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

const colorMap = {
    indigo: 'bg-indigo-500/15 text-indigo-400',
    violet: 'bg-violet-500/15 text-violet-400',
    emerald: 'bg-emerald-500/15 text-emerald-400',
    amber: 'bg-amber-500/15 text-amber-400',
};

const statusMap = {
    success: 'bg-emerald-500/15 text-emerald-400',
    pending: 'bg-amber-500/15 text-amber-400',
    failed: 'bg-red-500/15 text-red-400',
};

const statusLabel = { success: 'Berhasil', pending: 'Pending', failed: 'Gagal' };

const fmt = (v) => 'Rp ' + (v / 1000000).toFixed(1) + 'M';

// ── Component ─────────────────────────────────────────────────────
export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [activePage, setActivePage] = useState('Dashboard');

    const handleLogout = async () => {
        setLoggingOut(true);
        const token = localStorage.getItem('auth_token');
        try { await axios.post('/api/users/logout', {}, { headers: { Authorization: `Bearer ${token}` } }); }
        finally { localStorage.removeItem('auth_token'); window.location.href = '/login'; }
    };

    return (
        <AuthGuard>
            {(user) => (
        <>
            <Head title="Dashboard — MOJANG FFG" />
            <div className="min-h-screen bg-[#0d0d14] flex text-white">

                {/* ── Sidebar ── */}
                <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#0a0a0f] border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {/* Brand */}
                    <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold tracking-wide">MOJANG FFG</p>
                            <p className="text-[10px] text-white/30">Admin Panel</p>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
                        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-2">Menu</p>
                        {navItems.map(({ icon: Icon, label, badge }) => (
                            <button key={label} onClick={() => { setActivePage(label); setSidebarOpen(false); }} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${activePage === label ? 'bg-indigo-500/15 text-indigo-400' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}>
                                <Icon className="w-5 h-5 shrink-0" />
                                {label}
                                {badge && <span className="ml-auto bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
                            </button>
                        ))}
                    </nav>

                    {/* User */}
                    <div className="px-3 pb-4 border-t border-white/5 pt-3">
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold shrink-0">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-[10px] text-white/30 truncate">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                        >
                            <LogoutIcon className="w-4 h-4" />
                            {loggingOut ? 'Keluar...' : 'Keluar'}
                        </button>
                    </div>
                </aside>

                {/* Overlay mobile */}
                {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

                {/* ── Main ── */}
                <div className="flex-1 flex flex-col lg:ml-60 min-w-0">

                    {/* Navbar */}
                    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0d0d14]/80 backdrop-blur-xl border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white/40 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                            <div>
                                <h1 className="text-base font-semibold">{activePage}</h1>
                                <p className="text-xs text-white/30">Rabu, 16 April 2026</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                                <BellIcon className="w-4 h-4 text-white/60" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
                            </button>
                            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-[11px] text-white/30 mt-0.5">Administrator</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="flex-1 px-6 py-6 space-y-6 overflow-auto">
                        {activePage === 'Upload Excel' && <UploadExcelPage />}
                        {activePage !== 'Upload Excel' && activePage !== 'Dashboard' && (
                            <div className="flex flex-col items-center justify-center h-64 text-white/20">
                                <p className="text-lg font-medium">{activePage}</p>
                                <p className="text-sm mt-1">Halaman belum tersedia</p>
                            </div>
                        )}
                        {activePage === 'Dashboard' && <>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map(({ label, value, change, up, icon: Icon, color }) => (
                                <div key={label} className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-3 hover:bg-white/8 transition-all">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-white/40 font-medium">{label}</p>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold tracking-tight">{value}</p>
                                        <p className={`text-xs mt-1 font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {change} <span className="text-white/25 font-normal">vs bulan lalu</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Area Chart */}
                            <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <p className="text-sm font-semibold">Pendapatan Bulanan</p>
                                        <p className="text-xs text-white/30 mt-0.5">Jan — Agu 2026</p>
                                    </div>
                                    <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full font-medium">+14.5%</span>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis tickFormatter={(v) => `${v / 1000000}M`} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                                        <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" name="Aktual" />
                                        <Area type="monotone" dataKey="target" stroke="rgba(139,92,246,0.5)" strokeWidth={1.5} strokeDasharray="4 4" fill="none" name="Target" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Bar Chart */}
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                                <div className="mb-5">
                                    <p className="text-sm font-semibold">Pertumbuhan User</p>
                                    <p className="text-xs text-white/30 mt-0.5">6 minggu terakhir</p>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={userGrowthData} barSize={8}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                                        <Bar dataKey="new" fill="#6366f1" radius={[4, 4, 0, 0]} name="User Baru" />
                                        <Bar dataKey="active" fill="rgba(139,92,246,0.4)" radius={[4, 4, 0, 0]} name="User Aktif" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                                <div>
                                    <p className="text-sm font-semibold">Transaksi Terbaru</p>
                                    <p className="text-xs text-white/30 mt-0.5">5 transaksi terakhir</p>
                                </div>
                                <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Lihat semua →</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            {['ID Transaksi', 'Pengguna', 'Jumlah', 'Status', 'Tanggal'].map(h => (
                                                <th key={h} className="text-left px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTransactions.map((tx, i) => (
                                            <tr key={tx.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i === recentTransactions.length - 1 ? 'border-0' : ''}`}>
                                                <td className="px-5 py-3.5 text-white/50 font-mono text-xs">{tx.id}</td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500/50 to-violet-600/50 flex items-center justify-center text-[10px] font-bold shrink-0">{tx.avatar}</div>
                                                        <span className="font-medium">{tx.user}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 font-semibold">Rp {tx.amount.toLocaleString('id-ID')}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusMap[tx.status]}`}>{statusLabel[tx.status]}</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-white/40 text-xs">{tx.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        </>}

                    </main>
                </div>
            </div>
        </>
            )}
        </AuthGuard>
    );
}
