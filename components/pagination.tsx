import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Props for the Pagination component
 */
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    searchParams: Record<string, string>;
}

/**
 * Pagination component
 * @param param0 
 * @returns 
 */
export default function Pagination({currentPage, totalPages, baseUrl, searchParams}: PaginationProps) {
    if (totalPages <= 1) return null;

    /**
     * Generates the URL for a specific page
     * @param page 
     * @returns 
     */
    const getPageUrl = (page: number) => {
        const params = new URLSearchParams({...searchParams, page: String(page)})
        return `${baseUrl}?${params.toString()}`
    }

    /**
     * Gets the list of visible pages for pagination
     * @returns 
     */
    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, "...");
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range)

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    }

    /**
     * Gets the list of visible pages for pagination
     * @returns 
     */
    const visiblePages = getVisiblePages();

    return ( 
        <nav className="flex items-center justify-center gap-2">
            {/* Previous button */}
            <Link 
                href={currentPage <= 1 ? "#" : getPageUrl(currentPage - 1)} 
                className={`flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${
                    currentPage <= 1 
                        ? "text-zinc-700 cursor-not-allowed pointer-events-none" 
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
            >
                <ChevronLeft size={16} /> Prev
            </Link>

            {/* Page number */}
            <div className="flex items-center gap-1 px-2">
                {visiblePages.map((page, key) => {
                    if (page === "...") {
                        return (
                            <span key={key} className="px-3 py-2 text-sm text-zinc-600 font-mono">
                                ...
                            </span>
                        )
                    }
                    const pageNumber = page as number;
                    const isCurrentPage = pageNumber === currentPage;

                    return (
                        <Link 
                            key={key} 
                            href={getPageUrl(pageNumber)} 
                            className={`min-w-10 h-10 flex items-center justify-center text-sm font-bold rounded-xl transition-all duration-200 ${
                                isCurrentPage 
                                    ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]" 
                                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
                            }`}
                        >
                            {pageNumber}
                        </Link>
                    )
                })}
            </div>

            {/* Next button */}
            <Link 
                href={currentPage >= totalPages ? "#" : getPageUrl(currentPage + 1)} 
                className={`flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${
                    currentPage >= totalPages 
                        ? "text-zinc-700 cursor-not-allowed pointer-events-none" 
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
            >
                Next <ChevronRight size={16} />
            </Link>
        </nav>
    )
}