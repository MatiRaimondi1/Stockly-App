import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "@/app/page";
import { stackServerApp } from "@/stack/server";

vi.mock("@/stack/server", () => ({
    stackServerApp: {
        getUser: vi.fn(),
    },
}));

vi.mock("@/app/components/motion-wrapper", () => ({
    FadeIn: ({ children }: any) => <div>{children}</div>,
    FloatingPreview: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/app/components/preview", () => ({
    default: () => <div data-testid="preview-component" />,
}));

describe("Landing Page (Home)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("When the user is NOT authenticated", () => {
        beforeEach(() => {
            vi.mocked(stackServerApp.getUser).mockResolvedValue(null);
        });

        it("should display the 'Log in' and 'Get Started' buttons", async () => {
            const HomeComponent = await Home();
            render(HomeComponent);

            expect(screen.getByText(/log in/i)).toBeInTheDocument();
            expect(screen.getByText("Get Started Now")).toBeInTheDocument();
        });

        it("the main button should redirect to /sign-in", async () => {
            const HomeComponent = await Home();
            render(HomeComponent);

            const ctaButton = screen.getByRole("link", { name: /get started now/i });
            expect(ctaButton).toHaveAttribute("href", "/sign-in");
        });
    });

    describe("When the user IS authenticated", () => {
        beforeEach(() => {
            vi.mocked(stackServerApp.getUser as any).mockResolvedValue({ id: "user_123" });
        });

        it("should display the 'Log out' button instead of 'Log in'", async () => {
            const HomeComponent = await Home();
            render(HomeComponent);

            expect(screen.queryByText(/log in/i)).not.toBeInTheDocument();
            expect(screen.getByText(/log out/i)).toBeInTheDocument();
        });

        it("the main button should redirect to /dashboard", async () => {
            const HomeComponent = await Home();
            render(HomeComponent);

            const ctaButton = screen.getByRole("link", { name: /go to dashboard/i });
            expect(ctaButton).toHaveAttribute("href", "/dashboard");
        });
    });

    it("should display the main titles and the features section", async () => {
        vi.mocked(stackServerApp.getUser as any).mockResolvedValue(null);
        const HomeComponent = await Home();
        render(HomeComponent);

        expect(screen.getByText("Stockly")).toBeInTheDocument();
        expect(screen.getByText(/Intelligent inventory/i)).toBeInTheDocument();

        expect(screen.getByText("Item Management")).toBeInTheDocument();
        expect(screen.getByText("Optimal Stock Levels")).toBeInTheDocument();
        expect(screen.getByText("Visual Statistics")).toBeInTheDocument();
    });
});