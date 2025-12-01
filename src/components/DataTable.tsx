"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: string;
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  pageSize?: number;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  isLoading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  onRowClick,
  actions,
  emptyMessage = "No data found",
  pageSize = 10,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((item) =>
      columns.some((col) => {
        const value = item[col.key];
        return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
  }, [data, searchQuery, columns]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (isLoading) {
    return (
      <div className="bg-secondary border border-border rounded-2xl overflow-hidden">
        <div className="animate-pulse">
          <div className="h-14 bg-border m-4 sm:m-6 rounded-xl"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-border/50 mx-4 sm:mx-6 my-3 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary border border-border rounded-2xl overflow-hidden shadow-lg">
      {/* Search Bar */}
      {searchable && (
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-sm sm:text-base"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/30 border-b border-border">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider",
                    column.sortable && "cursor-pointer hover:text-white transition-colors",
                    column.width && `w-${column.width}`
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortKey === column.key && (
                      <span className="text-primary font-bold">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-4 sm:px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-border rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr
                  key={item[keyField]}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "hover:bg-secondary-hover transition-all duration-200",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 sm:px-6 py-4 text-sm text-white font-medium">
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 sm:px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        {actions(item)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400 font-medium">
            Showing <span className="text-white font-semibold">{(currentPage - 1) * pageSize + 1}</span> to{" "}
            <span className="text-white font-semibold">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{" "}
            <span className="text-white font-semibold">{sortedData.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2.5 hover:bg-secondary-hover rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed group"
              aria-label="First page"
            >
              <ChevronsLeft className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 hover:bg-secondary-hover rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed group"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <div className="hidden sm:flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "min-w-10 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                        page === currentPage
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "text-gray-400 hover:bg-secondary-hover hover:text-white"
                      )}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 text-gray-500 font-bold">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            <div className="sm:hidden text-sm text-white font-semibold px-3">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2.5 hover:bg-secondary-hover rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed group"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2.5 hover:bg-secondary-hover rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed group"
              aria-label="Last page"
            >
              <ChevronsRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
