"use client";

import React, { useState, useEffect } from "react";
import ReactCountryFlag from "react-country-flag";
import {
  parsePhoneNumberWithError,
  isValidPhoneNumber,
} from "libphonenumber-js";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import {
  SearchableSelect,
  type Option,
} from "@/components/ui/searchable-select";
import { Input } from "@/components/ui/input";
import { cn, fetchCountries } from "@/lib/utils";

interface PhoneInputProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  defaultValue = "",
  onChange,
  className,
  placeholder = "Enter phone number",
  disabled = false,
}) => {
  const [countries, setCountries] = useState<Option[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Option | undefined>(
    undefined
  );
  const [selectedCountryLabel, setSelectedCountryLabel] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const fetchCountriesData = async () => {
    const fetchedCountries = await fetchCountries();
    setCountries(
      fetchedCountries.map((country) => ({
        value: country.value,
        label: (
          <div className="flex items-center">
            <ReactCountryFlag
              countryCode={country.value}
              svg
              className="mr-2"
              style={{
                width: "1em",
                height: "1em",
              }}
            />
            (+{country.code}) {country.label}
          </div>
        ),
        selectedLabel: (
          <div className="flex items-center">
            <ReactCountryFlag
              countryCode={country.value}
              svg
              className="mr-1"
              style={{
                width: "1em",
                height: "1em",
              }}
            />
            +{country.code}
          </div>
        ),
        code: country.code,
      }))
    );
    return fetchedCountries;
  };

  useEffect(() => {
    fetchCountriesData().then((countriesData) => {
      if (defaultValue) {
        const countryCode = countriesData.find(
          (c) => c.value === defaultValue
        )?.value;
        if (countryCode) {
          handleCountryChange(countryCode, false);
        }
      }
    });
  }, [defaultValue]);

  const handleCountryChange = (countryCode: string, empty = true) => {
    const country = countries.find((c) => c.value === countryCode);
    setSelectedCountry(country);
    setSelectedCountryLabel(country?.selectedLabel || "");
    if (empty) {
      setPhoneNumber("");
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    setPhoneNumber(inputValue);

    if (selectedCountry && onChange) {
      const fullPhoneNumber = `+${selectedCountry.code}${inputValue}`;
      onChange(fullPhoneNumber);
    }
  };

  const isValid = () => {
    if (!selectedCountry || !phoneNumber) return false;
    try {
      const phoneNumberObj = parsePhoneNumberWithError(
        `+${selectedCountry.code}${phoneNumber}`
      );
      return isValidPhoneNumber(phoneNumberObj.number);
    } catch {
      return false;
    }
  };

  return (
    <div className={cn("flex space-x-2", className)}>
      <FormItem className="w-1/4">
        <FormControl>
          <SearchableSelect
            options={countries}
            placeholder="Country"
            onChange={handleCountryChange}
            className="w-full"
            disabled={disabled}
            defaultValue={selectedCountry?.value}
            selectedLabel={selectedCountryLabel}
          />
        </FormControl>
        <FormMessage>{!selectedCountry && "Country is required"}</FormMessage>
      </FormItem>
      <FormItem className="flex-1">
        <FormControl>
          <Input
            type="tel"
            placeholder={placeholder}
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            disabled={disabled || !selectedCountry}
            className={cn(
              "w-full",
              selectedCountry &&
                phoneNumber &&
                (isValid() ? "border-green-500" : "border-destructive")
            )}
          />
        </FormControl>
        <FormMessage>
          {selectedCountry &&
            phoneNumber &&
            !isValid() &&
            "Invalid phone number"}
        </FormMessage>
      </FormItem>
    </div>
  );
};
