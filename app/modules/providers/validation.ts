import { z } from "zod";

export const createProviderSchema = (credentials: Record<string, any>) => {
  const shape: Record<string, z.ZodString> = {};

  Object.entries(credentials).forEach(([key, config]) => {
    if (config.required) {
      shape[key] = z
        .string()
        .min(1, { message: `${config.label} is required` });
    } else {
      shape[key] = z.string();
    }
  });

  return z.object(shape);
};

export const connectProvidersSchema = z.object({
  provider_id: z.string().min(1, "Provider Id is required"),
  status: z.enum(["active", "inactive"] as const).optional(),
  credentials: z.record(z.string()).optional(),
});

export type ConnectProvidersValues = z.infer<typeof connectProvidersSchema>;
