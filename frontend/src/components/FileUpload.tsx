'use client';

import { useState } from 'react';
import { UploadCloud, File, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface FileUploadProps {
    onUploadComplete?: () => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        setUploading(true);
        setStatus('Connecting to server...');

        try {
            // Quick health check
            await fetch('http://localhost:5000/api/health').catch(() => {
                throw new Error("Backend server is not reachable.");
            });

            setStatus('Uploading and Indexing...');

            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Failed to upload ${file.name}`);
                }
            }
            setStatus('All files processed successfully!');
            setFiles([]);
            if (onUploadComplete) onUploadComplete();
            setTimeout(() => setStatus(''), 5000);

        } catch (error: any) {
            setStatus(`Error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-primary-100 transition-all duration-300 hover:shadow-lg hover:shadow-primary-50">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-50 rounded-lg">
                    <UploadCloud className="w-6 h-6 text-primary-500" />
                </div>
                <h2 className="text-xl font-bold text-primary-900">Upload Contracts</h2>
            </div>

            <div
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300",
                    isDragOver ? "border-primary-500 bg-primary-50" : "border-primary-200 hover:border-primary-400 hover:bg-primary-50/30"
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    if (e.dataTransfer.files) setFiles(Array.from(e.dataTransfer.files));
                }}
            >
                <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                        <UploadCloud className="w-8 h-8 text-primary-400" />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-primary-700">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-primary-400 mt-1">
                            PDF files only (Max 10MB)
                        </p>
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                        {files.map((file, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg border border-primary-100">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <File className="w-4 h-4 text-primary-500 shrink-0" />
                                    <span className="text-sm text-primary-700 truncate">{file.name}</span>
                                </div>
                                <span className="text-xs text-primary-500 shrink-0">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary-200"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <UploadCloud className="w-5 h-5" />
                                Index Contracts
                            </>
                        )}
                    </button>
                </div>
            )}

            {status && (
                <div className={cn(
                    "mt-4 p-4 rounded-lg flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2",
                    status.startsWith('Error')
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                )}>
                    {status.startsWith('Error') ? (
                        <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                    ) : (
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                    )}
                    {status}
                </div>
            )}
        </div>
    );
}
