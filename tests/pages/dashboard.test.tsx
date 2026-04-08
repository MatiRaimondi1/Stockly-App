import { act, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { stackServerApp } from "@/stack/server";

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

vi.mock("lucide-react", () => ({
    Package: () => <span>Icon</span>,
    DollarSign: () => <span>Icon</span>,
    AlertCircle: () => <span>Icon</span>,
    ArrowUpRight: () => <span>Icon</span>,
    Clock: () => <span>Icon</span>,
    House: () => <span>Icon</span>,
}));

vi.mock("next/link", () => ({
    default: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

vi.mock("@/components/sidebar", () => ({
    default: () => <div data-testid="sidebar">Sidebar</div>
}));
vi.mock("@/components/products-chart", () => ({
    default: () => <div data-testid="chart">Chart</div>
}));

import DashboardPage from "@/app/dashboard/page";
import { getCurrentUser } from "@/app/lib/auth";

describe("Dashboard Page", () => {
    const mockUser = {
        id: "user_1",
        displayName: "Matias",
        primaryEmail: "matias@test.com"
    };

    const mockProducts = [
        { name: "Keyboard", price: 100, quantity: 10, createdAt: new Date().toISOString() },
        { name: "Mouse", price: 50, quantity: 50, createdAt: new Date().toISOString() },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getCurrentUser).mockResolvedValue(mockUser as any);

        mockRepository.count
            .mockResolvedValueOnce(2)
            .mockResolvedValueOnce(1);
        mockRepository.find.mockResolvedValue(mockProducts);
    });

    it("should display the dashboard with all components", async () => {
        const pageJSX = await DashboardPage();
        
        await act(async () => {
            render(<>{pageJSX}</>);
        });

        expect(screen.getByText(/Overview/i)).toBeInTheDocument();
        expect(screen.getByText(/50%/)).toBeInTheDocument();

        expect(screen.getByText("Keyboard")).toBeInTheDocument();
        expect(screen.getByText("Mouse")).toBeInTheDocument();
    });
});