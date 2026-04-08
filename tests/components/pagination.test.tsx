import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Pagination from "@/components/pagination";

describe("Pagination Component", () => {
    const defaultProps = {
        currentPage: 1,
        totalPages: 10,
        baseUrl: "/inventory",
        searchParams: { query: "laptop" },
    };

    it("should not render anything if there is only one page", () => {
        const { container } = render(
            <Pagination {...defaultProps} totalPages={1} />
        );
        expect(container.firstChild).toBeNull();
    });

    it("should disable the 'Prev' button on the first page", () => {
        render(<Pagination {...defaultProps} currentPage={1} />);
        const prevButton = screen.getByText(/Prev/i).closest("a");
        expect(prevButton).toHaveClass("pointer-events-none");
        expect(prevButton).toHaveAttribute("href", "#");
    });

    it("should disable the 'Next' button on the last page", () => {
        render(<Pagination {...defaultProps} currentPage={10} />);
        const nextButton = screen.getByText(/Next/i).closest("a");
        expect(nextButton).toHaveClass("pointer-events-none");
        expect(nextButton).toHaveAttribute("href", "#");
    });

    it("should generate correct URLs including searchParams", () => {
        render(<Pagination {...defaultProps} currentPage={2} />);
        const page3Link = screen.getByRole("link", { name: "3" });

        expect(page3Link).toHaveAttribute("href", "/inventory?query=laptop&page=3");
    });

    it("should highlight the current page", () => {
        render(<Pagination {...defaultProps} currentPage={5} />);
        const currentPageLink = screen.getByRole("link", { name: "5" });
        expect(currentPageLink).toHaveClass("bg-purple-600");
    });

    describe("Lógica de Elipsis (...)", () => {
        it("should show elipsis at the end if there are many pages", () => {
            render(<Pagination {...defaultProps} currentPage={1} />);
            expect(screen.getByText("...")).toBeInTheDocument();
            expect(screen.getByText("10")).toBeInTheDocument();
        });

        it("should show elipsis at the beginning if we are on an advanced page", () => {
            render(<Pagination {...defaultProps} currentPage={8} />);
            expect(screen.getByText("...")).toBeInTheDocument();
            expect(screen.getByText("1")).toBeInTheDocument();
        });

        it("should show both elipsis if we are in the middle", () => {
            render(<Pagination {...defaultProps} currentPage={5} />);
            const dots = screen.getAllByText("...");
            expect(dots).toHaveLength(2);
            expect(screen.getByText("1")).toBeInTheDocument();
            expect(screen.getByText("10")).toBeInTheDocument();
        });
    });
});