import { z } from "zod";

export const BookSchema = z.object({
    title: z.string(),
    author: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});

export const BooksSchema = z.array(BookSchema);
export const BookObject = BookSchema;

// Infer TypeScript type
export type Book = z.infer<typeof BookSchema>;
