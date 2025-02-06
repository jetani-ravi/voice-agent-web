export const API_KEY_EXPIRATION_OPTIONS = [
  { label: "30 days", value: "43200" },
  { label: "60 days", value: "86400" },
  { label: "90 days", value: "129600" },
] as const;

// Inferred type for a single option:
export type ApiKeyExpirationOption =
  (typeof API_KEY_EXPIRATION_OPTIONS)[number];

// Extract the list of allowed values from the constant:
export const API_KEY_EXPIRATION_VALUES = API_KEY_EXPIRATION_OPTIONS.map(
  (option) => option.value
) as ReadonlyArray<ApiKeyExpirationOption["value"]>;
