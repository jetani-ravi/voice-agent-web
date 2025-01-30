"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SystemProviders } from "@/app/modules/providers/interface";
import {
  ConnectProvidersValues,
  createProviderSchema,
} from "@/app/modules/providers/validation";
import { PROVIDERS_STATUS } from "@/constants/providers";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ConnectDialogProps {
  provider: SystemProviders;
  onConnect: (data: ConnectProvidersValues) => Promise<void>;
  open: boolean;
  setOpen: (open: boolean) => void;
  error?: {
    title: string;
    message: string;
  } | null;
}

export const ConnectProviderDialog = ({
  provider,
  onConnect,
  open,
  setOpen,
  error,
}: ConnectDialogProps) => {
  const formSchema = createProviderSchema(provider.credentials);
  type FormData = z.infer<typeof formSchema>;

  const [isConnecting, setIsConnecting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: Object.keys(provider.credentials).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {} as Record<string, string>),
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open]);

  const onSubmit = async (data: FormData) => {
    setIsConnecting(true);
    try {
      const payload: ConnectProvidersValues = {
        provider_id: provider._id,
        credentials: data,
        status: PROVIDERS_STATUS.ACTIVE,
      };
      await onConnect(payload);
    } catch (error) {
      // Handle error
      console.error("Failed to connect:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleToggle = () => {
    if (isConnecting) return;
    setOpen(!open);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleToggle}>
      <DialogContent className="overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Connect to {provider.name}</DialogTitle>
          <DialogDescription>
            Connect to {provider.name} to access your account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {Object.entries(provider.credentials).map(([key, config]) => (
              <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{config.label}</FormLabel>
                    <FormControl>
                      <Input
                        type={config.type}
                        placeholder={config.placeholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {error?.message && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{error?.title}</AlertTitle>
                <AlertDescription>{error?.message}</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleToggle}
                disabled={isConnecting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isConnecting}>
                {isConnecting ? "Conecting..." : "Connect"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
