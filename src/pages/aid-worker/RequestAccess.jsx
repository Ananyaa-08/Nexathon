import React, { useState } from 'react';
import {
    Key, ShieldCheck, Globe, User, FileText,
    Search, CheckCircle, Clock, AlertCircle, ChevronRight, Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { MOCK_REFUGEES, MOCK_ACCESS_REQUESTS } from '../../utils/mockData';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/ui/Common';

const RequestAccess = () => {
    const { showToast } = useToast();
    const [selectedRefugee, setSelectedRefugee] = useState(null);
    const [selectedField, setSelectedField] = useState(null);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [requests, setRequests] = useState(MOCK_ACCESS_REQUESTS);
    const [filter, setFilter] = useState('All');

    const fields = [
        { id: 'age', label: 'Age Verification', icon: ShieldCheck },
        { id: 'nationality', label: 'Nationality Proof', icon: Globe },
        { id: 'identity', label: 'Full Identity', icon: User },
        { id: 'record', label: 'Registration Record', icon: FileText },
    ];

    const handleSubmit = () => {
        if (!selectedRefugee || !selectedField) return;

        setIsSubmitting(true);
        setTimeout(() => {
            const newRequest = {
                id: `REQ-00${requests.length + 1}`,
                refugeeID: selectedRefugee.id,
                refugeeName: selectedRefugee.name,
                requestedField: selectedField.label,
                requestedBy: 'Aid Worker Maria Santos',
                requestedAt: new Date().toISOString(),
                status: 'pending'
            };
            setRequests([newRequest, ...requests]);
            setIsSubmitting(false);
            setSelectedRefugee(null);
            setSelectedField(null);
            setReason('');
            showToast('success', 'Request Submitted', 'Consent request sent to refugee.');
        }, 1500);
    };

    const filteredRequests = requests.filter(r =>
        filter === 'All' || r.status.toLowerCase() === filter.toLowerCase()
    );

    return (
        <div className="page-enter grid lg:grid-cols-5 gap-8 pb-20">
            {/* Left: New Request Form */}
            <div className="lg:col-span-3 space-y-6">
                <div className="bg-[#0f1e38] border border-[#1a2d4a] rounded-2xl p-8 sticky top-24">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-[#f59e0b10] rounded-lg flex items-center justify-center border border-[#f59e0b20]">
                            <Key size={20} className="text-[#f59e0b]" />
                        </div>
                        <h2 className="text-xl font-bold text-[#e2eaf8] uppercase tracking-wider">Request Data Access</h2>
                    </div>

                    <div className="space-y-8">
                        {/* Select Refugee */}
                        <div className="space-y-4">
                            <label className="block text-[#7a94bb] text-[10px] font-bold uppercase tracking-widest pl-2">1. Select Subject</label>
                            <select
                                className="w-full bg-[#060d1f] border border-[#1a2d4a] rounded-xl px-4 py-4 text-[#e2eaf8] text-sm focus:outline-none focus:border-[#00c9b1] cursor-pointer"
                                onChange={(e) => setSelectedRefugee(MOCK_REFUGEES.find(r => r.id === e.target.value))}
                                value={selectedRefugee?.id || ''}
                            >
                                <option value="" disabled>Choose a refugee...</option>
                                {MOCK_REFUGEES.map(r => (
                                    <option key={r.id} value={r.id}>{r.name} ({r.id})</option>
                                ))}
                            </select>

                            {selectedRefugee && (
                                <div className="flex items-center gap-3 p-3 bg-[#152342] rounded-xl border border-[#1a2d4a] animate-fadeSlideUp">
                                    <div className="w-10 h-10 bg-[#00c9b110] text-[#00c9b1] rounded-lg flex items-center justify-center font-bold text-sm">
                                        {selectedRefugee.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-[#e2eaf8]">{selectedRefugee.name}</p>
                                        <p className="text-[10px] text-[#7a94bb]">{selectedRefugee.campID} • {selectedRefugee.nationality}</p>
                                    </div>
                                    <span className="text-[10px] font-mono text-[#00c9b1]">{selectedRefugee.id}</span>
                                </div>
                            )}
                        </div>

                        {/* Select Field */}
                        <div className="space-y-4">
                            <label className="block text-[#7a94bb] text-[10px] font-bold uppercase tracking-widest pl-2">2. Data Component</label>
                            <div className="grid grid-cols-2 gap-3">
                                {fields.map(field => {
                                    const Icon = field.icon;
                                    const isSelected = selectedField?.id === field.id;
                                    return (
                                        <div
                                            key={field.id}
                                            onClick={() => setSelectedField(field)}
                                            className={clsx(
                                                "p-4 border rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3",
                                                isSelected
                                                    ? "bg-[#00c9b110] border-[#00c9b1] shadow-[0_0_15px_rgba(0,201,177,0.1)]"
                                                    : "bg-[#060d1f] border-[#1a2d4a] hover:border-[#3d5278] text-[#7a94bb] hover:text-[#e2eaf8]"
                                            )}
                                        >
                                            <Icon size={18} className={isSelected ? "text-[#00c9b1]" : "text-inherit"} />
                                            <span className="text-xs font-bold uppercase tracking-tighter">{field.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="space-y-4">
                            <label className="block text-[#7a94bb] text-[10px] font-bold uppercase tracking-widest pl-2">3. Purpose of Access</label>
                            <textarea
                                className="w-full bg-[#060d1f] border border-[#1a2d4a] rounded-xl px-4 py-4 text-[#e2eaf8] text-sm focus:outline-none focus:border-[#00c9b1] placeholder-[#3d5278] min-h-[100px] resize-none"
                                placeholder="Briefly state why this data is required for aid delivery..."
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!selectedRefugee || !selectedField || isSubmitting}
                            className="w-full bg-[#00c9b1] text-[#060d1f] font-bold py-4 rounded-xl hover:bg-[#00e0c5] active:scale-95 transition-all text-sm tracking-widest uppercase disabled:opacity-40 flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> SUBMITTING...</> : 'SUBMIT CONSENT REQUEST'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Active Requests List */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#0f1e38] border border-[#1a2d4a] rounded-2xl flex flex-col min-h-[600px]">
                    <div className="p-6 border-b border-[#1a2d4a]">
                        <h3 className="text-[#e2eaf8] font-bold text-lg mb-6 tracking-tight">Access History</h3>
                        <div className="flex gap-2">
                            {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={clsx(
                                        "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                        filter === status
                                            ? "bg-[#152342] text-[#00c9b1] border border-[#00c9b120]"
                                            : "text-[#3d5278] hover:text-[#e2eaf8]"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[700px]">
                        {filteredRequests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center text-[#3d5278]">
                                <Clock size={48} className="mb-4 opacity-20" />
                                <p className="text-sm font-medium">No history found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#1a2d4a]">
                                {filteredRequests.map(req => (
                                    <div key={req.id} className="p-6 hover:bg-[#152342] transition-colors group cursor-pointer">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={clsx(
                                                    "w-8 h-8 rounded-full flex items-center justify-center",
                                                    req.status === 'approved' ? "bg-[#10b98115] text-[#10b981]" :
                                                        req.status === 'rejected' ? "bg-[#ef444415] text-[#ef4444]" :
                                                            "bg-[#f59e0b15] text-[#f59e0b]"
                                                )}>
                                                    {req.status === 'approved' ? <CheckCircle size={16} /> :
                                                        req.status === 'rejected' ? <AlertCircle size={16} /> : <Clock size={16} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[#e2eaf8]">{req.refugeeName}</p>
                                                    <p className="text-[10px] text-[#7a94bb]">{req.requestedField}</p>
                                                </div>
                                            </div>
                                            <div className={clsx(
                                                "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter border",
                                                req.status === 'approved' ? "bg-[#10b98110] text-[#10b981] border-[#10b98120]" :
                                                    req.status === 'rejected' ? "bg-[#ef444410] text-[#ef4444] border-[#ef444420]" :
                                                        "bg-[#f59e0b10] text-[#f59e0b] border-[#f59e0b20]"
                                            )}>
                                                {req.status}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-[10px] text-[#3d5278]">
                                            <span>{new Date(req.requestedAt).toLocaleDateString()} at {new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <ChevronRight size={14} className="group-hover:text-[#00c9b1] transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestAccess;
