import { getAgent } from "@/app/modules/agents/action";
import { Agent } from "@/app/modules/agents/interface";
import {
  getPhoneNumbers,
  initiateCall,
} from "@/app/modules/phone-numbers/action";
import { InitiateCall } from "@/app/modules/phone-numbers/interface";
import { me } from "@/app/modules/user/action";
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
import { useToastHandler } from "@/hooks/use-toast-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PhoneCallModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  agent: Agent;
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

const PhoneCallModal = ({ open, setOpen, agent }: PhoneCallModalProps) => {
  const { toast } = useToast();
  const { handleToast } = useToastHandler();
  const [isPending, startTransition] = useTransition();
  const [phoneNumbers, setPhoneNumbers] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPhoneNumbers = async (provider: string = "twilio") => {
    const result = await getPhoneNumbers({ provider });
    if (result.success) {
      setPhoneNumbers(
        result.data?.phone_numbers.map((phoneNumber) => ({
          value: phoneNumber.phone_number,
          label: phoneNumber.phone_number,
        })) || []
      );
      return;
    }
    handleToast({ result });
  };

  const fetchAgent = async (agentId: string) => {
    try {
      const result = await getAgent(agentId);
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching agent:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!open) return;
    const fetchData = async () => {
      setLoading(true);
      if (agent?.agent_id) {
        const agentData = await fetchAgent(agent.agent_id);
        if (agentData) {
          const provider = agentData.agent_config.tasks.find(
            (task) => task.task_type === "conversation"
          )?.tools_config.input?.provider;
          await fetchPhoneNumbers(provider);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [open, agent?.agent_id]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient_phone_number: "",
      from_phone_number: "",
    },
  });

  const onSubmit = (data: FormSchema) => {
    try {
      startTransition(async () => {
        if (!agent?.agent_id) return;
        const payload: InitiateCall = {
          recipient_phone_number: data.recipient_phone_number,
          agent_id: agent?.agent_id,
          from_phone_number: data.from_phone_number,
        };
        const result = await me();
        const user = result.data!;
        const callResult = await initiateCall(payload, user._id, user.active_organization._id);
        handleToast({ result: callResult, successMessage: "Call has been initiated to the recipient" });
        handleToggle();
      });
    } catch (error) {
      console.error("Error initiating call:", error);
      toast({
        title: "Error",
        description: "Failed to initiate call",
        color: "destructive",
      });
    }
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
                        disabled={loading}
                        placeholder={
                          loading
                            ? "Fetching phone numbers..."
                            : "Select a phone number"
                        }
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
              <Button type="submit" disabled={isPending}>
                Place Call
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneCallModal;
