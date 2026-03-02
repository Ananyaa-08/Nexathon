import React, { useState } from 'react';
import {
    ShieldCheck, Clock, CheckCircle, XCircle,
    Info, Bell, ChevronDown, Lock, Fingerprint, Loader2, X, User
} from 'lucide-react';
import { clsx } from 'clsx';
import { MOCK_ACCESS_REQUESTS } from '../../utils/mockData';
import { useToast } from '../../context/ToastContext';

const AccessRequests = () => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('Pending');
    const [requests, setRequests] = useState(MOCK_ACCESS_REQUESTS);
    const [isSigning, setIsSigning] = useState(false);
    const [signingStage, setSigningStage] = useState(0); // 0: idle, 1: open app, 2: biometric, 3: signing
    const [selectedRequest, setSelectedRequest] = useState(null);

    const tabs = ['Pending', 'Approved', 'Rejected', 'All'];

    const filteredRequests = requests.filter(r =>
        activeTab === 'All' ? true : r.status.toLowerCase() === activeTab.toLowerCase()
    );

    const handleApprove = (req) => {
        setSelectedRequest(req);
        setIsSigning(true);
        setSigningStage(1);

        setTimeout(() => setSigningStage(2), 1000);
        setTimeout(() => setSigningStage(3), 2000);
        setTimeout(() => {
            setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'approved' } : r));
            setIsSigning(false);
            setSigningStage(0);
            setSelectedRequest(null);
            showToast('success', 'Consent Granted', `You have authorized access to your ${req.requestedField}.`);
        }, 3500);
    };

    const handleReject = (req) => {
        if (window.confirm("Are you sure you want to reject this access request?")) {
            setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'rejected' } : r));
            showToast('info', 'Request Rejected', 'The requester has been notified of your decision.');
        }
    };

    return (
        <div className="page-enter space-y-8 pb-20">
            <div>
                <h2 className="text-3xl font-bold text-[#e2eaf8] mb-2 font-sans tracking-tight">Data Governance</h2>
                <p className="text-[#7a94bb] text-sm">Manage who can access specific parts of your digital identity record.</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-[#1a2d4a]">
                {tabs.map(tab => {
                    const count = tab === 'All' ? requests.length : requests.filter(r => r.status.toLowerCase() === tab.toLowerCase()).length;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={clsx(
                                "px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative",
                                activeTab === tab ? "text-[#00c9b1]" : "text-[#3d5278] hover:text-[#7a94bb]"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                {tab}
                                <span className={clsx(
                                    "px-1.5 py-0.5 rounded text-[9px] font-bold border",
                                    activeTab === tab ? "bg-[#00c9b110] border-[#00c9b140]" : "bg-[#152342] border-[#1a2d4a]"
                                )}>{count}</span>
                            </div>
                            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c9b1] shadow-[0_0_10px_#00c9b1]" />}
                        </button>
                    );
                })}
            </div>

            {/* Requests List */}
            <div className="grid gap-6">
                {filteredRequests.length === 0 ? (
                    <div className="bg-[#0f1e38] border border-[#1a2d4a] rounded-3xl py-24 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-[#152342] rounded-full flex items-center justify-center mb-6">
                            <ShieldCheck size={32} className="text-[#3d5278]" />
                        </div>
                        <h4 className="text-[#e2eaf8] font-bold text-lg">No {activeTab.toLowerCase()} requests</h4>
                        <p className="text-[#7a94bb] text-sm mt-1 max-w-xs">Your data is secure. Requests for access will appear here.</p>
                    </div>
                ) : (
                    filteredRequests.map((req, i) => (
                        <div
                            key={req.id}
                            style={{ animationDelay: `${i * 100}ms` }}
                            className={clsx(
                                "bg-[#0f1e38] border rounded-2xl p-6 transition-all duration-300 animate-fadeSlideUp",
                                req.status === 'pending' ? "border-[#f59e0b40] border-l-4 border-l-[#f59e0b]" :
                                    req.status === 'approved' ? "border-[#10b98140] border-l-4 border-l-[#10b981]" :
                                        "border-[#ef444440] border-l-4 border-l-[#ef4444] opacity-80"
                            )}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-5">
                                    <div className={clsx(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
                                        req.status === 'pending' ? "bg-[#f59e0b10] border-[#f59e0b25] text-[#f59e0b]" :
                                            req.status === 'approved' ? "bg-[#10b98110] border-[#10b98125] text-[#10b981]" :
                                                "bg-[#ef444410] border-[#ef444425] text-[#ef4444]"
                                    )}>
                                        {req.status === 'pending' ? <Bell size={24} /> :
                                            req.status === 'approved' ? <ShieldCheck size={24} /> : <XCircle size={24} />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-[#e2eaf8] font-bold text-lg">{req.refugeeName}</h3>
                                            <span className={clsx(
                                                "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight border",
                                                req.status === 'pending' ? "bg-[#f59e0b10] text-[#f59e0b] border-[#f59e0b20]" :
                                                    req.status === 'approved' ? "bg-[#10b98110] text-[#10b981] border-[#10b98120]" :
                                                        "bg-[#ef444410] text-[#ef4444] border-[#ef444420]"
                                            )}>
                                                {req.status}
                                            </span>
                                        </div>
                                        <p className="text-[#7a94bb] text-sm">Field Requested: <span className="text-[#e2eaf8] font-semibold">{req.requestedField}</span></p>
                                        <div className="flex items-center gap-4 pt-1">
                                            <span className="text-[#3d5278] text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5">
                                                <User className="w-3 h-3" /> By: {req.requestedBy}
                                            </span>
                                            <span className="text-[#3d5278] text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" /> {new Date(req.requestedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {req.status === 'pending' ? (
                                    <div className="flex items-center gap-3 shrink-0">
                                        <button
                                            onClick={() => handleReject(req)}
                                            className="px-6 py-3 border border-[#ef444440] text-[#ef4444] text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#ef444410] transition-all"
                                        >
                                            REJECT
                                        </button>
                                        <button
                                            onClick={() => handleApprove(req)}
                                            className="px-10 py-3 bg-[#00c9b1] text-[#060d1f] text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#00e0c5] shadow-[0_0_20px_rgba(0,201,177,0.1)] transition-all"
                                        >
                                            APPROVE
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 shrink-0 pr-4">
                                        {req.status === 'approved' && (
                                            <p className="text-[#10b981] text-[10px] font-bold uppercase italic tracking-widest">Access Active</p>
                                        )}
                                        <ChevronDown className="text-[#3d5278] cursor-pointer" />
                                    </div>
                                )}
                            </div>

                            {req.status === 'pending' && (
                                <div className="mt-6 p-4 bg-[#f59e0b05] border border-[#f59e0b15] rounded-xl flex gap-4 items-start">
                                    <Info size={16} className="text-[#f59e0b] shrink-0 mt-0.5" />
                                    <p className="text-[#7a94bb] text-[11px] leading-relaxed">
                                        Approving this request will allow the aid worker to view your <span className="text-white font-bold">{req.requestedField}</span> status. No other personal data will be disclosed. You can revoke this access at any time.
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Pera Signing Simulation Modal */}
            {isSigning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cc] backdrop-blur-md px-6">
                    <div className="bg-[#0f1e38] border border-[#1a2d4a] rounded-3xl p-10 max-w-sm w-full shadow-2xl animate-fadeSlideUp relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#3b82f6]" />
                        <div className="text-center">
                            <div className="w-20 h-20 bg-[#3b82f615] text-[#3b82f6] rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12 glow-teal">
                                <Fingerprint size={48} className={signingStage >= 2 ? "text-[#10b981]" : "text-[#3b82f6]"} />
                            </div>
                            <h3 className="text-[#e2eaf8] text-2xl font-bold mb-4">Pera Multi-Sig</h3>
                            <p className="text-[#7a94bb] text-sm leading-relaxed mb-10">
                                Please confirm the biometric challenge on your Pera Wallet mobile app to authorize this transaction.
                            </p>

                            <div className="space-y-4 text-left">
                                {[
                                    { label: 'Open Pera Wallet app', done: signingStage >= 1 },
                                    { label: 'Biometric authorization', done: signingStage >= 2 },
                                    { label: 'Smart contract signing', done: signingStage >= 3 },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className={clsx("text-xs font-bold uppercase tracking-widest", s.done ? "text-[#10b981]" : "text-[#3d5278]")}>
                                            {i + 1}. {s.label}
                                        </span>
                                        {s.done ? <CheckCircle size={14} className="text-[#10b981]" /> :
                                            (!s.done && signingStage === i + 1) ? <Loader2 size={14} className="animate-spin text-[#3b82f6]" /> :
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#1a2d4a]" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessRequests;
