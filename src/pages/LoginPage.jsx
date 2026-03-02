import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, HardHat, User, ArrowRight } from 'lucide-react';
import { MOCK_STATS } from '../utils/mockData';

const LoginCard = ({ icon: Icon, title, description, badgeColor, buttonColor, onEnter }) => {
    return (
        <div
            onClick={onEnter}
            className="bg-[#0f1e38] border border-[#1a2d4a] rounded-xl p-8 cursor-pointer hover:border-[#00c9b1] hover:shadow-[0_0_20px_rgba(0,201,177,0.1)] hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center text-center"
        >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${badgeColor}`}>
                <Icon size={32} />
            </div>
            <h2 className="text-[#e2eaf8] text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-[#e2eaf8]">{title}</h2>
            <p className="text-[#7a94bb] text-sm mb-8 leading-relaxed">{description}</p>

            <button
                className={`w-full py-3 px-6 rounded-lg font-bold text-sm tracking-widest flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${buttonColor}`}
            >
                ENTER PORTAL <ArrowRight size={16} />
            </button>
        </div>
    );
};

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#060d1f] flex flex-col items-center justify-center relative overflow-hidden page-enter">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #1e3a5f 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                    animation: 'pulseOpacity 4s ease-in-out infinite'
                }}
            />

            <div className="max-w-4xl w-full px-6 flex flex-col items-center relative z-10">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="w-20 h-20 bg-[#00c9b110] rounded-2xl flex items-center justify-center border border-[#00c9b130] mb-8 animate-bounce shadow-[0_0_30px_rgba(0,201,177,0.1)]">
                        <Shield size={48} className="text-[#00c9b1]" />
                    </div>
                    <h1 className="font-mono text-6xl font-bold text-[#00c9b1] tracking-[0.2em] mb-4">RIMS</h1>
                    <p className="text-[#7a94bb] text-sm font-medium uppercase tracking-[0.3em]">Refugee Identity Management System</p>
                    <div className="h-0.5 w-24 bg-[#1a2d4a] mt-8 rounded-full" />
                </div>

                {/* Role Selection */}
                <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
                    <LoginCard
                        icon={HardHat}
                        title="Aid Worker Portal"
                        description="Register refugees, distribute aid resources, and manage verification requests."
                        badgeColor="bg-[#f59e0b20] text-[#f59e0b]"
                        buttonColor="border border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b20]"
                        onEnter={() => navigate('/aid-worker')}
                    />
                    <LoginCard
                        icon={User}
                        title="Refugee Portal"
                        description="Access your digital identity, manage data consents, and migrate to self-sovereign wallets."
                        badgeColor="bg-[#00c9b120] text-[#00c9b1]"
                        buttonColor="bg-[#00c9b1] text-[#060d1f] hover:bg-[#00e0c5]"
                        onEnter={() => navigate('/refugee')}
                    />
                    <LoginCard
                        icon={Shield}
                        title="Admin Portal"
                        description="Approve wallet migrations, audit blockchain activity, and manage system health."
                        badgeColor="bg-[#8b5cf620] text-[#8b5cf6]"
                        buttonColor="border border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf620]"
                        onEnter={() => navigate('/admin/dashboard')}
                    />
                </div>
            </div>

            {/* Marquee Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#0a1428] border-t border-[#1a2d4a] py-4 overflow-hidden">
                <div className="marquee-track whitespace-nowrap flex items-center gap-12">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-12 shrink-0">
                            <span className="text-[#7a94bb] text-xs font-medium flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00c9b1]" />
                                {MOCK_STATS.totalRegistered.toLocaleString()} identities secured on Algorand
                            </span>
                            <span className="text-[#7a94bb] text-xs font-medium flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00c9b1]" />
                                {MOCK_STATS.aidClaimsThisWeek} aid claims verified this week
                            </span>
                            <span className="text-[#7a94bb] text-xs font-medium flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00c9b1]" />
                                Zero documents required
                            </span>
                            <span className="text-[#7a94bb] text-xs font-medium flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00c9b1]" />
                                Custodial → Self-Sovereign migration live
                            </span>
                            <span className="text-[#7a94bb] text-xs font-medium flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00c9b1]" />
                                Biometric liveness detection active
                            </span>
                            <span className="text-[#7a94bb] text-xs font-medium flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00c9b1]" />
                                {MOCK_STATS.blockedDuplicates} duplicate registrations blocked
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
