import { z } from "zod";

export const searchPhoneNumbersSchema = z.object({
  country: z.string().min(1, { message: "Country is required" }),
  pattern: z.string().optional(),
});

export type SearchPhoneNumbers = z.infer<typeof searchPhoneNumbersSchema>;

export const buyPhoneNumberSchema = z.object({
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  user_id: z.string().min(1, { message: "User ID is required" }),
  price: z.number().optional(),
  location: z.string().optional(),
  agent_id: z.string().optional(),
});

export type BuyPhoneNumber = z.infer<typeof buyPhoneNumberSchema>;
