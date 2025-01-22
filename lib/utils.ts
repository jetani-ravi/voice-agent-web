import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchCountries() {
  const combinedCountries = getCountries().map((countryCode) => {
    return {
      value: countryCode, // The country code (e.g., "US")
      label: new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode), // Country name (e.g., "United States")
      code: getCountryCallingCode(countryCode), // Dialing code (e.g., "1" for US)
    };
  });

  return combinedCountries;
}

