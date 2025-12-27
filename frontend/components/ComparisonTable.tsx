'use client';

// Define the interface for the comparison data
interface ComparisonData {
    property: string;
    details: string;
}

interface ComparisonTableProps {
    data: ComparisonData[];
    loading: boolean;
}

export default function ComparisonTable({ data, loading }: ComparisonTableProps) {
    if (loading) {
        return (
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return null;
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Comparison Results</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Property / Document
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.property}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-pre-wrap">
                                    {item.details}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
