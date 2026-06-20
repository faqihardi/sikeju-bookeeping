import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import { Package, Wallet, Factory, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage().props as any;

    return (
        <>
            <Head title="SIKEJU — Sistem Keuangan UMKM" />

            <div
                className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white"
                style={{
                    fontFamily: "'Outfit', sans-serif",
                }}
            >
                {/* ── Minimalist Background Grid ── */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* ── Subtle Ambient Glow ── */}
                <div
                    className="pointer-events-none absolute top-[-20%] left-[50%] h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-[0.03] blur-[100px]"
                    style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
                />

                {/* ── NAV ── */}
                <nav className="relative z-10 flex w-full items-center justify-between px-8 pt-6 lg:px-16">
                    {/* Brand wordmark */}
                    <div className="flex items-center gap-3">
                        <img src="/logo-keju.png" alt="SIKEJU Logo" className="h-[72px] w-auto drop-shadow-md" />
                    </div>

                    {/* Auth buttons */}
                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-xl px-5 py-2 text-sm font-semibold text-white/80 ring-1 ring-white/20 transition-all duration-200 hover:bg-white/10 hover:text-white hover:ring-white/40"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="rounded-xl px-5 py-2 text-sm font-semibold text-white/80 ring-1 ring-white/20 transition-all duration-200 hover:bg-white/10 hover:text-white hover:ring-white/40"
                            >
                                Masuk
                            </Link>
                        )}
                    </div>
                </nav>

                {/* ── HERO ── */}
                <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
                    {/* Badge */}
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        Sistem Pembukuan Digital untuk UMKM
                    </div>

                    {/* Main headline */}
                    <h1
                        className="mb-25 leading-[1.05] font-black tracking-tight"
                        style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                        }}
                    >
                        <span className="text-[#EBB557]">
                            SIKEJU
                        </span>{' '}
                        <span className="text-white">
                            Bookkeeping
                        </span>
                    </h1>

                    {/* CTA Buttons */}
                    {auth?.user ? (
                        <Link
                            href={dashboard()}
                            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-10 py-4 text-base font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-gray-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            <span>Buka Dashboard</span>
                            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    ) : (
                        <Link
                            href={login()}
                            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-10 py-4 text-base font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-gray-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            <span>Masuk ke Sistem</span>
                            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    )}

                    {/* Feature pills */}
                    <div className="mt-24 flex flex-wrap justify-center gap-4">
                        {[
                            { icon: <Package size={16} />, label: 'Manajemen Stok' },
                            { icon: <Wallet size={16} />, label: 'Buku Kas Umum' },
                            { icon: <Factory size={16} />, label: 'Produksi Otomatis' },
                            { icon: <BarChart3 size={16} />, label: 'Laporan Keuangan' },
                            { icon: <ShieldCheck size={16} />, label: 'Keamanan Multi-Role' },
                        ].map((f, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-white/70 transition-colors duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white"
                            >
                                <span className="text-white/50">{f.icon}</span>
                                <span>{f.label}</span>
                            </div>
                        ))}
                    </div>
                </main>

                {/* ── FOOTER ── */}
                <footer className="relative z-10 pb-8 text-center text-xs font-medium tracking-wide text-white/30" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    © {new Date().getFullYear()} SIKEJU Bookkeeping | Tim Pakcik
                </footer>
            </div>
        </>
    );
}
