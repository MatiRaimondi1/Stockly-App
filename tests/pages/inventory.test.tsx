import { act, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockRepository } = vi.hoisted(() => ({
    mockRepository: {
        count: vi.fn(),
        find: vi.fn(),
    }
}));

vi.mock("@/app/lib/db", () => ({
    AppDataSource: {
        isInitialized: true,
        initialize: vi.fn().mockResolvedValue(true),
        getRepository: vi.fn(() => mockRepository),
    },
}));

vi.mock("@/app/lib/auth", () => ({
    getCurrentUser: vi.fn(),
}));

vi.mock("@/stack/server", () => ({
    stackServerApp: {
        urls: { signOut: "/sign-out-url" }
    },
}));

vi.mock("@/components/sidebar", () => ({
    default: () => <div data-testid="sidebar">Sidebar Mock</div>
}));

vi.mock("@/components/pagination", () => ({
    default: ({ currentPage }: { currentPage: number }) => (
        <div data-testid="pagination">Page {currentPage}</div>
    )
}));

vi.mock("lucide-react", () => ({
    Search: () => <span>SearchIcon</span>,
    Trash2: () => <span>DeleteIcon</span>,
    Package: () => <span>PackageIcon</span>,
    Tag: () => <span>TagIcon</span>,
    AlertTriangle: () => <span>AlertIcon</span>,
}));

import InventoryPage from "@/app/inventory/page";
import { getCurrentUser } from "@/app/lib/auth";

describe("Inventory Page", () => {
    const mockUser = { id: "user_123", displayName: "Matias", primaryEmail: "matias@test.com" };

    const mockProducts = [
        { id: 1, name: "Product A", price: 100, quantity: 50, sku: "SKU-A", lowStockAt: 10 },
        { id: 2, name: "Product B", price: 50, quantity: 5, sku: "SKU-B", lowStockAt: 10 }, // Low stock
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getCurrentUser).mockResolvedValue(mockUser as any);
    });

    it("should display the inventory with all products", async () => {
        mockRepository.count.mockResolvedValue(2);
        mockRepository.find.mockResolvedValue(mockProducts);

        const pageJSX = await InventoryPage({ searchParams: Promise.resolve({}) });

        await act(async () => {
            render(<>{pageJSX}</>);
        });

        expect(screen.getByText(/Inventory/i)).toBeInTheDocument();
        expect(screen.getByText(/2 items/i)).toBeInTheDocument();

        expect(screen.getByText("Product A")).toBeInTheDocument();
        expect(screen.getByText("SKU-A")).toBeInTheDocument();
        expect(screen.getByText("Product B")).toBeInTheDocument();

        expect(screen.getByText((content) => content.includes("100.00"))).toBeInTheDocument();
    });

    it("should display a 'Low Stock' warning when the quantity is low", async () => {
        mockRepository.count.mockResolvedValue(1);
        mockRepository.find.mockResolvedValue([mockProducts[1]]);

        const pageJSX = await InventoryPage({ searchParams: Promise.resolve({}) });

        await act(async () => {
            render(<>{pageJSX}</>);
        });

        expect(screen.getByText(/Warning: Low Stock/i)).toBeInTheDocument();
    });

    it("should display the empty state if there are no products", async () => {
        mockRepository.count.mockResolvedValue(0);
        mockRepository.find.mockResolvedValue([]);

        const pageJSX = await InventoryPage({ searchParams: Promise.resolve({}) });

        await act(async () => {
            render(<>{pageJSX}</>);
        });

        expect(screen.getByText(/No products found/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Add your first item/i })).toBeInTheDocument();
    });

    it("should render the pagination if there are more than one page", async () => {
        mockRepository.count.mockResolvedValue(15);
        mockRepository.find.mockResolvedValue(Array(10).fill(mockProducts[0]));

        const pageJSX = await InventoryPage({
            searchParams: Promise.resolve({ page: "1" })
        });

        await act(async () => {
            render(<>{pageJSX}</>);
        });

        expect(screen.getByTestId("pagination")).toBeInTheDocument();
        expect(screen.getByText("Page 1")).toBeInTheDocument();
    });

    it("should pass the search term to the repository", async () => {
        mockRepository.count.mockResolvedValue(0);
        mockRepository.find.mockResolvedValue([]);

        const searchParams = Promise.resolve({ q: "keyboard" });
        await InventoryPage({ searchParams });

        expect(mockRepository.find).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    name: expect.anything()
                })
            })
        );
    });
});