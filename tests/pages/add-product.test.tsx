import { act, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/app/lib/auth", () => ({
    getCurrentUser: vi.fn(),
}));

vi.mock("@/stack/server", () => ({
    stackServerApp: {
        urls: { signOut: "/sign-out-url" }
    },
}));

vi.mock("@/app/lib/actions/products", () => ({
    createProduct: vi.fn(),
}));

vi.mock("@/components/sidebar", () => ({
    default: () => <div data-testid="sidebar">Sidebar Mock</div>
}));

vi.mock("lucide-react", () => ({
    ArrowLeft: () => <span>BackIcon</span>,
    Package: () => <span>PackageIcon</span>,
    DollarSign: () => <span>DollarIcon</span>,
    List: () => <span>ListIcon</span>,
    Bell: () => <span>BellIcon</span>,
    Zap: () => <span>ZapIcon</span>,
}));

vi.mock("next/link", () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

import AddProductPage from "@/app/add-product/page";
import { getCurrentUser } from "@/app/lib/auth";

describe("Add Product Page", () => {
    const mockUser = {
        id: "user_123",
        displayName: "Matias",
        primaryEmail: "matias@test.com"
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getCurrentUser).mockResolvedValue(mockUser as any);
    });

    it("should display the add product form with all required fields", async () => {
        const pageJSX = await AddProductPage();

        await act(async () => {
            render(<>{pageJSX}</>);
        });

        expect(screen.getByText(/Register Asset/i)).toBeInTheDocument();
        expect(screen.getByText(/System Write Access/i)).toBeInTheDocument();

        expect(screen.getByLabelText(/Asset Designation/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Unit Value \(USD\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Initial Stock/i)).toBeInTheDocument();

        expect(screen.getByLabelText(/Asset Designation/i)).toBeRequired();
        expect(screen.getByLabelText(/Unit Value/i)).toBeRequired();
        expect(screen.getByLabelText(/Initial Stock/i)).toBeRequired();
    });

    it("should have the correct attributes in the numeric inputs", async () => {
        const pageJSX = await AddProductPage();

        await act(async () => {
            render(<>{pageJSX}</>);
        });

        const priceInput = screen.getByLabelText(/Unit Value/i);
        expect(priceInput).toHaveAttribute("type", "number");
        expect(priceInput).toHaveAttribute("step", "0.01");
        expect(priceInput).toHaveAttribute("min", "0");

        const quantityInput = screen.getByLabelText(/Initial Stock/i);
        expect(quantityInput).toHaveAttribute("type", "number");
        expect(quantityInput).toHaveAttribute("min", "0");
    });

    it("should contain the confirmation button and the cancel link", async () => {
        const pageJSX = await AddProductPage();

        await act(async () => {
            render(<>{pageJSX}</>);
        });

        const submitBtn = screen.getByRole("button", { name: /Confirm/i });
        expect(submitBtn).toHaveAttribute("type", "submit");

        const cancelLink = screen.getByRole("link", { name: /Cancel/i });
        expect(cancelLink).toHaveAttribute("href", "/inventory");
    });

    it("should display the link to return to the inventory (Return to Fleet)", async () => {
        const pageJSX = await AddProductPage();

        await act(async () => {
            render(<>{pageJSX}</>);
        });

        const backLink = screen.getByRole("link", { name: /Return to Fleet/i });
        expect(backLink).toHaveAttribute("href", "/inventory");
    });

    it("should render the Sidebar with the correct current route", async () => {
        const pageJSX = await AddProductPage();

        await act(async () => {
            render(<>{pageJSX}</>);
        });

        expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    });
});