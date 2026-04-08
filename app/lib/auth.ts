import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";

/**
 * Gets the current authenticated user
 * @returns 
 */
export async function getCurrentUser() {
    const user = await stackServerApp.getUser()
    if (!user) {
        redirect("/sign-in")
    }
    return user;
}