'use client';

import { useEffect, useState } from 'react';
import { Calendar, AlertTriangle, FileText, RefreshCw } from 'lucide-react';
import { cn } from "@/lib/utils";

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
            setMetadata(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch metadata", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-12 glass-panel rounded-2xl text-center border border-rose-100">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full mb-4"></div>
                <p className="text-slate-500 font-medium">Extracting lease intelligence...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-primary-950 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-primary-500" />
                        Lease Expiry Tracker
                    </h2>
                    <p className="text-primary-600/80 text-sm mt-1">Live intelligence from your contracts.</p>
                </div>
                <button
                    onClick={fetchMetadata}
                    className="group flex items-center gap-2 text-sm bg-white text-primary-700 border border-primary-200 px-4 py-2 rounded-full hover:bg-primary-50 hover:text-primary-800 hover:border-primary-300 transition-all font-medium shadow-sm"
                >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    Refresh Data
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metadata.map((item, index) => {
                    const isUpcoming = item.lease_end_date !== "Not found" &&
                        new Date(item.lease_end_date) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

                    const hasRedFlags = item.red_flags &&
                        item.red_flags.toLowerCase() !== 'none detected' &&
                        item.red_flags.toLowerCase() !== 'none';

                    let borderColor = "border-primary-100 hover:shadow-primary-100";
                    if (hasRedFlags) borderColor = "border-rose-200 hover:shadow-rose-100 bg-rose-50/10";
                    else if (isUpcoming) borderColor = "border-amber-200 hover:shadow-amber-100 bg-amber-50/10";

                    return (
                        <div key={index}
                            className={cn(
                                "p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white",
                                borderColor
                            )}
                        >
                            <div className="flex justify-between items-start mb-4 gap-4">
                                <h3 className="font-bold text-lg text-primary-900 truncate flex-1" title={item.property_name}>
                                    {item.property_name || "Unnamed Property"}
                                </h3>
                                <div className="flex flex-col gap-2 items-end shrink-0">
                                    {isUpcoming && (
                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" /> Expiring
                                        </span>
                                    )}
                                    {hasRedFlags && (
                                        <span className="px-2 py-1 bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" /> Red Flag
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm py-1 border-b border-primary-50">
                                        <span className="text-primary-500">Expiry Date</span>
                                        <span className={cn("font-medium", isUpcoming ? 'text-amber-600 font-bold' : 'text-primary-700')}>
                                            {item.lease_end_date}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-1 border-b border-primary-50">
                                        <span className="text-primary-500">Deposit</span>
                                        <span className="text-primary-700 font-medium">{item.security_deposit}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-1 border-b border-primary-50">
                                        <span className="text-primary-500">Notice Period</span>
                                        <span className="text-primary-700 font-medium">{item.notice_period}</span>
                                    </div>
                                </div>

                                {hasRedFlags && (
                                    <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
                                        <p className="text-[10px] text-rose-600 font-bold uppercase mb-1 flex items-center gap-1">
                                            High Risk Detected
                                        </p>
                                        <p className="text-xs text-rose-800/80 leading-relaxed italic line-clamp-3">
                                            {item.red_flags}
                                        </p>
                                    </div>
                                )}

                                <div className="pt-2 flex items-center gap-2 text-primary-300">
                                    <FileText className="w-3 h-3" />
                                    <p className="text-[11px] truncate max-w-[200px]">{item.source}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {metadata.length === 0 && (
                <div className="text-center py-16 bg-primary-50/50 rounded-2xl border border-dashed border-primary-200">
                    <FileText className="w-12 h-12 text-primary-300 mx-auto mb-3" />
                    <p className="text-primary-500">No contracts indexed yet.</p>
                </div>
            )}
        </div>
    );
}
