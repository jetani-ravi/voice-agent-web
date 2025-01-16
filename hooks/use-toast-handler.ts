/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToast } from "@/hooks/use-toast";
import { ZodError } from "zod";
import { isApiError } from "@/types/api";

type ToastHandlerOptions<T> = {
  result: { success: boolean; error?: any; data?: T; message?: string };
  form?: any;
  successMessage?: string;
};

export function useToastHandler() {
  const { toast } = useToast();

  const handleToast = <T>({
    result,
    form,
    successMessage,
  }: ToastHandlerOptions<T>) => {
    if (!result.success) {
      // Handle Zod validation errors
      if (result.error instanceof ZodError && form) {
        result.error.errors.forEach((error) => {
          const field = error.path[0];
          form.setError(field, {
            message: error.message,
          });
        });
        return;
      }

      // Handle API errors
      if (isApiError(result.error)) {
        toast({
          title: result.error.type,
          description: result.message || result.error.message,
          variant: "destructive",
        });
        return;
      }

      // Handle generic errors
      toast({
        title: "Error",
        description: result.message || result.error || "An error occurred",
        variant: "destructive",
      });
      return;
    }

    // Handle success
    toast({
      title: "Success",
      description: result.message || successMessage || "Operation completed successfully",
    });
  };

  return { handleToast };
}
