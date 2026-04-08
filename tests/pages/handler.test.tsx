import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@stackframe/stack", () => ({
    StackHandler: vi.fn(() => <div data-testid="stack-handler">Stack Handler Mock</div>),
}));

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

vi.mock("lucide-react", () => ({
    ArrowLeft: () => <span data-testid="arrow-icon" />,
}));

vi.mock("next/link", () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

import Handler from "@/app/handler/[...stack]/page";
import { StackHandler } from "@stackframe/stack";

describe("Handler Page", () => {
    it("should render the Stack Handler component", () => {
        render(<Handler />);

        const handler = screen.getByTestId("stack-handler");
        expect(handler).toBeInTheDocument();

        expect(StackHandler).toHaveBeenCalledWith(
            expect.objectContaining({ fullPage: false }),
            undefined
        );
    });

    it("should display the link to return to the Home", () => {
        render(<Handler />);

        const backLink = screen.getByRole("link", { name: /Back to Home/i });
        expect(backLink).toHaveAttribute("href", "/");
    });

    it("should apply the 'dark fix' styles through the style tag", () => {
        const { container } = render(<Handler />);

        const styleTag = container.querySelector('style');
        expect(styleTag?.innerHTML).toContain(".stack-dark-fix");
        expect(styleTag?.innerHTML).toContain("background: #18181b !important");
    });

    it("should render the decorative background elements", () => {
        const { container } = render(<Handler />);

        const blobs = container.querySelectorAll('.blur-\\[120px\\]');
        expect(blobs.length).toBe(2);
    });

    it("should have the main container with absolute centering", () => {
        const { container } = render(<Handler />);

        const mainWrapper = container.firstChild;
        expect(mainWrapper).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');
    });
});