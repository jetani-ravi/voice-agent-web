import { Agent } from "@/app/modules/agents/interface";
import { initiateCall } from "@/app/modules/phone-numbers/action";
import { InitiateCall } from "@/app/modules/phone-numbers/interface";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { Option, SearchableSelect } from "@/components/ui/searchable-select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PhoneCallModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  agent: Agent;
  phoneNumbers: Option[];
}

const formSchema = z.object({
  recipient_phone_number: z.string().min(1, {
    message: "Phone number is required",
  }),
  from_phone_number: z
    .string()
    .min(1, { message: "From Phone number is required" }),
});

type FormSchema = z.infer<typeof formSchema>;

const PhoneCallModal = ({
  open,
  setOpen,
  agent,
  phoneNumbers,
}: PhoneCallModalProps) => {
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient_phone_number: "",
      from_phone_number: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    if (!agent?.agent_id) return;
    const payload: InitiateCall = {
      recipient_phone_number: data.recipient_phone_number,
      agent_id: agent?.agent_id,
      from_phone_number: data.from_phone_number,
    };
    await initiateCall(payload);
    toast({
      title: "Call initiated",
      description: "Call has been initiated to the recipient",
    });
    handleToggle();
  };

  const handleToggle = () => {
    setOpen(!open);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleToggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Place an Outbound Call</DialogTitle>
          <DialogDescription>
            Enter phone numbers with country code (for example: +919998887766)
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="recipient_phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="from_phone_number"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>From Phone Number</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={phoneNumbers}
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={handleToggle}>
                Cancel
              </Button>
              <Button type="submit">Place Call</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneCallModal;
