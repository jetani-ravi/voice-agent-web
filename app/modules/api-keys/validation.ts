import { API_KEY_EXPIRATION_VALUES } from "@/constants/apiKeys";
import { z } from "zod";

export const apiKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
  expires_at: z.enum(API_KEY_EXPIRATION_VALUES as [string, ...string[]], {
    required_error: "Please select an expiration period",
  }),
});

export type APIKeyValues = z.infer<typeof apiKeySchema>;
