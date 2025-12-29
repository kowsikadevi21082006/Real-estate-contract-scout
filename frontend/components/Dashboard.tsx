'use client';

import { useEffect, useState } from 'react';

interface Metadata {
    property_name: string;
    lease_end_date: string;
    notice_period: string;
    security_deposit: string;
    red_flags: string;
    source: string;
}

interface DashboardProps {
    refreshTrigger?: number;
}

export default function Dashboard({ refreshTrigger }: DashboardProps) {
    const [metadata, setMetadata] = useState<Metadata[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetadata();
    }, [refreshTrigger]);

    const fetchMetadata = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/extract');
            const data = await response.json();
            setMetadata(data);
        } catch (error) {
            console.error("Failed to fetch metadata", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-12 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                <p className="text-slate-500 font-medium">Extracting lease intelligence...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Lease Expiry Tracker & Red-Flag Scout</h2>
                    <p className="text-slate-500 text-sm">Automatically extracted intelligence from your contracts.</p>
                </div>
                <button
                    onClick={fetchMetadata}
                    className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors font-semibold"
                >
                    Refetch Intelligence
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metadata.map((item, index) => {
                    const isUpcoming = item.lease_end_date !== "Not found" &&
                        new Date(item.lease_end_date) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

                    const hasRedFlags = item.red_flags && item.red_flags.toLowerCase() !== 'none detected' && item.red_flags.toLowerCase() !== 'none';

                    return (
                        <div key={index} className={`p-5 rounded-2xl shadow-sm border transition-all hover:shadow-md ${isUpcoming || hasRedFlags ? 'bg-red-50/50 border-red-100' : 'bg-white border-slate-100'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-slate-900 truncate pr-2 flex-1" title={item.property_name}>
                                    {item.property_name}
                                </h3>
                                <div className="flex flex-col gap-1 items-end">
                                    {isUpcoming && (
                                        <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                                            Expiring Soon
                                        </span>
                                    )}
                                    {hasRedFlags && (
                                        <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                                            Risk Found
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-sm">
                                    <span className="text-slate-400 w-24">Expiry Date:</span>
                                    <span className={`font-medium ${isUpcoming ? 'text-red-600' : 'text-slate-700'}`}>
                                        {item.lease_end_date}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <span className="text-slate-400 w-24">Deposit:</span>
                                    <span className="text-slate-700 font-medium">{item.security_deposit}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <span className="text-slate-400 w-24">Notice Period:</span>
                                    <span className="text-slate-700 font-medium">{item.notice_period}</span>
                                </div>

                                {hasRedFlags && (
                                    <div className="mt-3 p-3 bg-white rounded-lg border border-red-100">
                                        <p className="text-[10px] text-red-500 font-bold uppercase mb-1 flex items-center gap-1">
                                            <span className="text-xs">⚠️</span> Red Flag Detected
                                        </p>
                                        <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-2">
                                            {item.red_flags}
                                        </p>
                                    </div>
                                )}

                                <div className="pt-2 mt-2 border-t border-slate-50">
                                    <span className="text-[10px] text-slate-400 uppercase tracking-tight">Source File:</span>
                                    <p className="text-[11px] text-slate-500 truncate">{item.source}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {metadata.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400">No contracts indexed yet. Upload files to see the tracker.</p>
                </div>
            )}
        </div>
    );
}
