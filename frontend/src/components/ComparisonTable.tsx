'use client';

import { Check, X, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonTableProps {
    data: any[];
    loading: boolean;
}

export default function ComparisonTable({ data, loading }: ComparisonTableProps) {
    if (loading) {
        return (
            <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-rose-500 animate-spin mx-auto mb-4" />
                <p className="text-slate-500">Analyzing contracts...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400 italic">
                <p>No comparison results yet. Try a search above.</p>
            </div>
        );
    }

    // Dynamic column extraction
    const columns = Object.keys(data[0] || {}).filter(k => k !== 'source' && k !== 'chunks');

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 rounded-tl-xl whitespace-nowrap min-w-[200px]">Metric / Clause</th>
                        {data.map((file, i) => (
                            <th key={i} className="px-6 py-4 text-rose-600 truncate max-w-[200px]" title={file.source}>
                                {file.source}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {columns.map((col, idx) => (
                        <tr key={idx} className="hover:bg-rose-50/20 transition-colors">
                            <td className="px-6 py-4 font-semibold text-slate-700 capitalize whitespace-nowrap bg-slate-50/50">
                                {col.replace(/_/g, ' ')}
                            </td>
                            {data.map((file, i) => (
                                <td key={i} className="px-6 py-4 border-l border-slate-100">
                                    {typeof file[col] === 'boolean' ? (
                                        file[col] ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-red-500" />
                                    ) : (
                                        <span className="line-clamp-3" title={String(file[col])}>
                                            {String(file[col])}
                                        </span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
