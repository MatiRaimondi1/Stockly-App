import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Sidebar from "@/components/sidebar";

describe("Sidebar Component", () => {
    const mockUser = {
        displayName: "John Doe",
        primaryEmail: "john@example.com",
    };

    const defaultProps = {
        user: mockUser,
        currentPath: "/dashboard",
        signOutUrl: "/api/auth/signout",
    };

    it("should render the brand name (STOCKLY)", async () => {
        const SidebarComponent = await Sidebar(defaultProps);
        render(SidebarComponent);

        expect(screen.getByText("STOCKLY")).toBeInTheDocument();
        expect(screen.getByText("Enterprise")).toBeInTheDocument();
    });

    it("should display the user data correctly", async () => {
        const SidebarComponent = await Sidebar(defaultProps);
        render(SidebarComponent);

        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("john@example.com")).toBeInTheDocument();
        expect(screen.getByText("J")).toBeInTheDocument();
    });

    it("should use the email's initial if the displayName doesn't exist", async () => {
        const propsWithoutName = {
            ...defaultProps,
            user: { primaryEmail: "admin@stockly.com" },
        };
        const SidebarComponent = await Sidebar(propsWithoutName);
        render(SidebarComponent);

        expect(screen.getByText("Operator")).toBeInTheDocument();
        expect(screen.getByText("A")).toBeInTheDocument();
    });

    it("should mark the current path as active", async () => {
        const SidebarComponent = await Sidebar({
            ...defaultProps,
            currentPath: "/inventory"
        });
        render(SidebarComponent);

        const inventoryLink = screen.getByRole("link", { name: /inventory/i });
        const dashboardLink = screen.getByRole("link", { name: /dashboard/i });

        expect(inventoryLink).toHaveClass("bg-purple-600/10");
        expect(inventoryLink).toHaveClass("text-white");

        expect(dashboardLink).toHaveClass("text-zinc-500");
    });

    it("should have the correct href on the sign-out button", async () => {
        const SidebarComponent = await Sidebar(defaultProps);
        render(SidebarComponent);

        const signOutBtn = screen.getByTitle("Disconnect");
        expect(signOutBtn).toHaveAttribute("href", "/api/auth/signout");
    });

    it("should render all the defined navigation elements", async () => {
        const SidebarComponent = await Sidebar(defaultProps);
        render(SidebarComponent);

        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Inventory")).toBeInTheDocument();
        expect(screen.getByText("Add Product")).toBeInTheDocument();
    });
});