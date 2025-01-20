import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { faqsSchema, FaqsValues } from "@/app/modules/agents/validation";
import { useEffect } from "react";

interface FaqsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveFaq: (faq: FaqsValues) => void;
  initialData?: FaqsValues;
}

export default function FaqsModal({
  isOpen,
  onClose,
  onSaveFaq,
  initialData,
}: FaqsModalProps) {
  const form = useForm<FaqsValues>({
    resolver: zodResolver(faqsSchema),
    defaultValues: initialData || {
      route_name: "",
      response: "",
      score_threshold: 0.9,
      utterances: [{ utterance: "" }],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "utterances",
  });

  const onSubmit = (data: FaqsValues) => {
    onSaveFaq(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit FAQ" : "Add new FAQ"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Modify your FAQ block and automated response"
              : "Create a new block for FAQs & Guardrails"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Form fields remain the same */}
            <FormField
              control={form.control}
              name="route_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Block name for FAQs & Guardrails"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Put a name for this block</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="response"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Response</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Forced responses for the given threshold and messages"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Put a response for this block rule
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="score_threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Threshold for this rule</FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      max={1}
                      min={0.7}
                      step={0.05}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    A lower threshold increases the likelihood that sentences
                    similar to the utterances will trigger this response
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Utterances</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`utterances.${index}.utterance`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {fields.length < 20 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => append({ utterance: "" })}
                  className="mt-2"
                >
                  Add more (up to 20)
                </Button>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                {initialData ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
