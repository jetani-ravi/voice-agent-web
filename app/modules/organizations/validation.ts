import { z } from "zod";

export const organizationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
});

export type OrganizationValues = z.infer<typeof organizationSchema>;
