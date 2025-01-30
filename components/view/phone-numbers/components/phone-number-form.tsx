"use client";

import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useForm } from "react-hook-form";
import { SearchIcon } from "lucide-react";
import {
  SearchableSelect,
  type Option,
} from "@/components/ui/searchable-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  buyPhoneNumber,
  searchAvailablePhoneNumbers,
} from "@/app/modules/phone-numbers/action";
import { AvailablePhoneNumbers } from "@/app/modules/phone-numbers/interface";
import { isApiError } from "@/lib/api";
import { BuyPhoneNumber } from "@/app/modules/phone-numbers/validation";
import { Label } from "@/components/ui/label";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { useSession } from "next-auth/react";
import { fetchCountries } from "@/lib/utils";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface FormValues {
  country: string;
  pattern: string;
}

const PhoneNumberForm = ({ open, setOpen }: Props) => {
  const [phoneNumbers, setPhoneNumbers] = useState<AvailablePhoneNumbers[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] =
    useState<BuyPhoneNumber | null>(null);
  const { handleToast } = useToastHandler();
  const { data: session } = useSession();
  const [countries, setCountries] = useState<Option[]>([]);

  const form = useForm<FormValues>({
    defaultValues: {
      country: "",
      pattern: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSearching(true);
    try {
      const response = await searchAvailablePhoneNumbers(data);
      if (response.success) {
        setPhoneNumbers(response.data!);
        setError(null);
      } else {
        if (isApiError(response.error)) {
          setError(response.error.message || "An error occurred");
        } else {
          setError("An error occurred");
        }
      }
    } catch (error) {
      console.error("Error searching for phone numbers:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const onBuy = async () => {
    if (!selectedPhoneNumber) {
      return;
    }
    setIsBuying(true);
    try {
      const result = await buyPhoneNumber(selectedPhoneNumber);
      handleToast({
        result,
        successMessage: "Phone number purchased successfully!",
      });
    } catch (error) {
      console.error("Error buying phone number:", error);
    } finally {
      setIsBuying(false);
      resetForm();
    }
  };

  const onSelectPhoneNumber = (phoneNumber: string) => {
    const phoneNumberData = phoneNumbers.find(
      (number) => number.phoneNumber === phoneNumber
    );
    const payload: BuyPhoneNumber = {
      phone_number: phoneNumber,
      price: 1.15,
      location: phoneNumberData?.location,
      user_id: session?.user?.id || "",
    };
    setSelectedPhoneNumber(payload);
  };

  const resetForm = () => {
    form.reset();
    setSelectedPhoneNumber(null);
    setPhoneNumbers([]);
    setError(null);
  };

  const handleToggle = () => {
    resetForm();
    setOpen(!open);
  };

  useEffect(() => {
    fetchCountries().then((countries) => {
      setCountries(
        countries.map((country) => ({
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
              (+{country.code}) {country.label} - {country.value}
            </div>
          ),
        }))
      );
    });
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleToggle}>
      <DialogContent className="overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Buy Phone Number</DialogTitle>
          <DialogDescription>
            Choose your country and optionally provide a pattern. For example,
            to find US phone numbers containing 789, enter 789.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SearchableSelect
                      options={countries}
                      placeholder="Select a country"
                      onChange={field.onChange}
                      className="w-full"
                      defaultValue={field.value}
                      dropdownClassName="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end space-x-2">
              <FormField
                control={form.control}
                name="pattern"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Pattern (e.g., 789)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="flex items-center gap-2"
                disabled={isSearching || !form.getValues().country}
              >
                <SearchIcon className="h-4 w-4" />
                Search
              </Button>
            </div>
            {error && (
              <p className="text-red-500 text-xs">{`${error} or No available numbers found for ${
                form.getValues().country
              }`}</p>
            )}
            <div className="my-4 flex flex-col gap-2">
              <Label>Available Phone Numbers:</Label>
              <SearchableSelect
                options={
                  phoneNumbers?.map((number) => ({
                    value: number.phoneNumber,
                    label: `${number.phoneNumber} - ${number.location}`,
                  })) || []
                }
                placeholder={
                  isSearching
                    ? "Fetching phone numbers..."
                    : "Select a phone number"
                }
                emptyMessage="No results found."
                onChange={onSelectPhoneNumber}
                className="w-full"
                disabled={phoneNumbers.length === 0}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleToggle}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onBuy}
                disabled={!selectedPhoneNumber || isBuying}
              >
                {isBuying ? "Buying..." : "Buy"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneNumberForm;
