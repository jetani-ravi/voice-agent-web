"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  apiKeySchema,
  type APIKeyValues,
} from "@/app/modules/api-keys/validation";
import { createApiKey } from "@/app/modules/api-keys/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import {
  API_KEY_EXPIRATION_OPTIONS,
  API_KEY_EXPIRATION_VALUES,
} from "@/constants/apiKeys";
import { CopyIcon } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const APIKeyForm = ({ open, setOpen }: Props) => {
  const [isPending, startTransition] = useTransition();
  const { handleToast } = useToastHandler();
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);

  const form = useForm<APIKeyValues>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name: "",
      expires_at: API_KEY_EXPIRATION_VALUES[0],
    },
  });

  const handleSubmit = (values: APIKeyValues) => {
    startTransition(async () => {
      try {
        const result = await createApiKey(values);
        handleToast({ result });
        if (result.success && result.data?.value) {
          setGeneratedApiKey(result.data.value);
        }
        form.reset();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    });
  };

  const handleCopy = () => {
    if (generatedApiKey) {
      navigator.clipboard.writeText(generatedApiKey);
      handleToast({
        result: { success: true, message: "API key copied to clipboard" },
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setGeneratedApiKey(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="">
        {!generatedApiKey ? (
          <>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Create a new API key for your application.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter API key name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expires_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select expiration period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {API_KEY_EXPIRATION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating..." : "Create API Key"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>API Key Created</DialogTitle>
              <DialogDescription>
                Please copy your API key and store it securely. You won&apos;t
                be able to see it again.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="bg-muted p-3 rounded-md flex items-center justify-between">
                <code className="text-sm">{generatedApiKey}</code>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default APIKeyForm;
