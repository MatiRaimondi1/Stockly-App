import { describe, it, expect, vi, beforeEach } from "vitest";
import { createProduct, deleteProduct } from "@/app/lib/actions/products";
import { getCurrentUser } from "@/app/lib/auth";
import { AppDataSource } from "@/app/lib/db";
import { redirect } from "next/navigation";

const { mockRepository } = vi.hoisted(() => ({
    mockRepository: {
        create: vi.fn(),
        insert: vi.fn(),
        delete: vi.fn(),
    }
}));

vi.mock("@/app/lib/auth", () => ({
    getCurrentUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    redirect: vi.fn(),
}));

vi.mock("@/app/lib/db", () => ({
    AppDataSource: {
        isInitialized: true,
        initialize: vi.fn(),
        getRepository: vi.fn(() => mockRepository),
    },
}));

describe("Products Server Actions", () => {
    const mockUser = { id: "user_123" };

    beforeEach(() => {
        vi.clearAllMocks();
        (getCurrentUser as any).mockResolvedValue(mockUser);
    });

    describe("createProduct", () => {
        it("should create a product successfully and redirect", async () => {
            const formData = new FormData();
            formData.append("name", "Mechanic Keyboard");
            formData.append("price", "150.50");
            formData.append("quantity", "10");
            formData.append("sku", "KB-123");

            mockRepository.create.mockReturnValue({ id: "prod_1", name: "Mechanic Keyboard" });
            mockRepository.insert.mockResolvedValue({});

            await createProduct(formData);

            expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                name: "Mechanic Keyboard",
                price: 150.50,
                quantity: 10,
                userId: mockUser.id
            }));

            expect(mockRepository.insert).toHaveBeenCalled();
            expect(redirect).toHaveBeenCalledWith("/inventory");
        });

        it("should throw an error if Zod validation fails", async () => {
            const formData = new FormData();
            formData.append("name", "");
            formData.append("price", "-10");

            await expect(createProduct(formData)).rejects.toThrow("Validation failed");
            expect(mockRepository.insert).not.toHaveBeenCalled();
        });

        it("should handle database errors", async () => {
            const formData = new FormData();
            formData.append("name", "Product Error");
            formData.append("price", "10");
            formData.append("quantity", "5");

            mockRepository.insert.mockRejectedValue(new Error("DB Connection Lost"));

            await expect(createProduct(formData)).rejects.toThrow(/Failed to create product/);
        });
    });

    describe("deleteProduct", () => {
        it("should call the delete method with the correct ID and userId", async () => {
            const formData = new FormData();
            formData.append("id", "prod_999");

            await deleteProduct(formData);

            expect(mockRepository.delete).toHaveBeenCalledWith({
                id: "prod_999",
                userId: mockUser.id
            });
        });

        it("should handle deletion even if the ID is empty", async () => {
            const formData = new FormData();

            await deleteProduct(formData);

            expect(mockRepository.delete).toHaveBeenCalledWith({
                id: "",
                userId: mockUser.id
            });
        });
    });
});