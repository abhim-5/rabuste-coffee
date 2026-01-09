// Admin Data Table Component
'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

interface Column<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    onRowClick?: (row: T) => void;
}

export default function DataTable<T extends Record<string, any>>({
    data,
    columns,
    loading = false,
    searchable = false,
    searchPlaceholder = 'Search...',
    onRowClick,
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Filter data based on search
    const filteredData = searchable
        ? data.filter((row) =>
            Object.values(row).some((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        : data;

    // Sort data
    const sortedData = sortColumn
        ? [...filteredData].sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];

            if (aVal === bVal) return 0;
            const comparison = aVal > bVal ? 1 : -1;
            return sortDirection === 'asc' ? comparison : -comparison;
        })
        : filteredData;

    const handleSort = (columnKey: string) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Search */}
            {searchable && (
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                                        }`}
                                    onClick={() =>
                                        column.sortable && handleSort(String(column.key))
                                    }
                                >
                                    <div className="flex items-center gap-2">
                                        {column.label}
                                        {column.sortable && sortColumn === column.key && (
                                            <span>
                                                {sortDirection === 'asc' ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={`hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''
                                        }`}
                                    onClick={() => onRowClick?.(row)}
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={String(column.key)}
                                            className="px-6 py-4 text-sm text-gray-900"
                                        >
                                            {column.render
                                                ? column.render(row)
                                                : String(row[column.key] ?? '-')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            {sortedData.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 text-sm text-gray-500">
                    Showing {sortedData.length} of {data.length} results
                </div>
            )}
        </div>
    );
}
