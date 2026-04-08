import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCurrentUser } from "@/app/lib/auth";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

vi.mock("@/stack/server", () => ({
    stackServerApp: {
        getUser: vi.fn(),
    },
}));

vi.mock("next/navigation", () => ({
    redirect: vi.fn(),
}));

describe("Auth Lib - getCurrentUser", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return the user if stackServerApp.getUser() returns a user", async () => {
        const mockUser = { id: "user_123", primaryEmail: "test@example.com" };

        vi.mocked(stackServerApp.getUser as any).mockResolvedValue(mockUser);

        const result = await getCurrentUser();

        expect(result).toEqual(mockUser);
        expect(redirect).not.toHaveBeenCalled();
    });

    it("should redirect to /sign-in if there is no authenticated user", async () => {
        vi.mocked(stackServerApp.getUser as any).mockResolvedValue(null);

        try {
            await getCurrentUser();
        } catch (e) {

        }

        expect(redirect).toHaveBeenCalledWith("/sign-in");
    });

    it("should propagate errors if stackServerApp.getUser() fails", async () => {
        const dbError = new Error("Connection failed");
        vi.mocked(stackServerApp.getUser as any).mockRejectedValue(dbError);

        await expect(getCurrentUser()).rejects.toThrow("Connection failed");
        expect(redirect).not.toHaveBeenCalled();
    });
});