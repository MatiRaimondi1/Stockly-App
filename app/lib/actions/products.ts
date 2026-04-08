"use server"

import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import { AppDataSource } from "../db";
import { Product } from "../entities/Product";
import { z } from "zod"

/**
 * Product schema for validation
 */
const ProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.coerce.number().nonnegative("Price must be non-negative"),
    quantity: z.coerce.number().int().min(0, "Quantity must be non-negative"),
    sku: z.string().optional(),
    lowStockAt: z.coerce.number().int().min(0).optional(),
});

/**
 * Initialize the database connection
 */
if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
}
const productRepository = AppDataSource.getRepository(Product);

/**
 * Deletes a product
 * @param formData 
 */
export async function deleteProduct(formData: FormData) {
    const user = await getCurrentUser();
    const id = String(formData.get("id") || "");

    await productRepository.delete({ id: id, userId: user.id });
}

/**
 * Creates a new product
 * @param formData 
 */
export async function createProduct(formData: FormData) {
    const user = await getCurrentUser();

    const parsed = ProductSchema.safeParse({
        name: formData.get("name"),
        price: formData.get("price"),
        quantity: formData.get("quantity"),
        sku: formData.get("sku") || undefined,
        lowStockAt: formData.get("lowStockAt") || undefined,
    });

    if (!parsed.success) {
        throw new Error("Validation failed");
    }

    try {
        const product = productRepository.create({
            ...parsed.data,
            userId: user.id
        });

        await productRepository.insert(product);
    } catch (error) {
        throw new Error("Failed to create product: " + (error instanceof Error ? error.message : String(error)));
    }

    redirect("/inventory");
}