import { z } from "zod";

// Validation Schema
export const knowledgeBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  file: z
    .instanceof(File, { message: "File is required" })
    .refine((file) => file.size <= 10 * 1024 * 1024, "File size must be less than 10MB")
    .refine(
      (file) => file.type === "application/pdf",
      "Only PDF files are allowed"
    ),
});

export type KnowledgeBaseValues = z.infer<typeof knowledgeBaseSchema>;