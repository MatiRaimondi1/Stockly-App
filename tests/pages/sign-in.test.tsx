import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@stackframe/stack", () => ({
    SignIn: () => <div data-testid="stack-signin">Stack Auth Widget</div>,
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

import SignInPage from "@/app/sign-in/page";

describe("SignIn Page", () => {
    it("should render the Stack authentication widget", () => {
        render(<SignInPage />);

        expect(screen.getByTestId("stack-signin")).toBeInTheDocument();
        expect(screen.getByText("Stack Auth Widget")).toBeInTheDocument();
    });

    it("should display the link to return to the Home", () => {
        render(<SignInPage />);

        const backLink = screen.getByRole("link", { name: /Back to Home/i });
        expect(backLink).toBeInTheDocument();
        expect(backLink).toHaveAttribute("href", "/");
    });

    it("should contain the injected style block for dark mode", () => {
        const { container } = render(<SignInPage />);

        const styleTag = container.querySelector('style');
        expect(styleTag).not.toBeNull();
        expect(styleTag?.innerHTML).toContain(".stack-dark-fix");
    });

    it("should render the decorative background elements", () => {
        const { container } = render(<SignInPage />);

        const bgElements = container.querySelectorAll('.blur-\\[120px\\]');
        expect(bgElements.length).toBeGreaterThanOrEqual(2);
    });

    it("should have the correct layout structure", () => {
        render(<SignInPage />);

        const mainContainer = screen.getByText("Stack Auth Widget").closest('.min-h-screen');
        expect(mainContainer).toHaveClass('flex', 'items-center', 'justify-center');
    });
});