'use client';

import { useState } from 'react';

interface FileUploadProps {
    onUploadComplete?: () => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        setUploading(true);
        setStatus('Connecting to server...');

        try {
            // 0. Connection Test
            console.log("Testing connection to http://localhost:5000/api/health");
            const healthCheck = await fetch('http://localhost:5000/api/health').catch(e => {
                console.error("Health check failed:", e);
                throw new Error("Cannot reach the backend server. Please ensure it is running.");
            });

            if (!healthCheck.ok) {
                throw new Error("Server health check failed.");
            }

            setStatus('Uploading and Indexing...');

            for (const file of files) {
                console.log(`Uploading ${file.name}...`);
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
                    throw new Error(errorData.error || `Failed to upload ${file.name}`);
                }
            }
            setStatus('All files processed successfully!');
            setFiles([]);
            if (onUploadComplete) onUploadComplete();
        } catch (error: any) {
            console.error("Upload error details:", error);
            setStatus(`Error: ${error.message || 'Check console for details.'}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">1. Upload Contracts</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100 mb-4"
                />
                <p className="text-sm text-gray-400">Select multiple PDF files to index</p>
            </div>

            {files.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">Selected Files:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                        {files.map((file, i) => (
                            <li key={i}>{file.name}</li>
                        ))}
                    </ul>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all font-medium"
                    >
                        {uploading ? 'Processing...' : 'Start Indexing'}
                    </button>
                </div>
            )}

            {status && (
                <p className={`mt-4 text-sm font-medium ${status.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                    {status}
                </p>
            )}
        </div>
    );
}
