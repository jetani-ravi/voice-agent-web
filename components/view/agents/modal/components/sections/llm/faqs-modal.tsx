"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { PlusCircle, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaqsValues, faqsSchema } from "@/app/modules/agents/validation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function FaqsModal() {
  const form = useForm<FaqsValues>({
    resolver: zodResolver(faqsSchema),
    defaultValues: {
      name: "",
      response: "",
      threshold: 0.9,
      utterances: [""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "utterances",
  });

  const onSubmit = (data: FaqsValues) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          <PlusCircle className="h-4 w-4 mr-2" /> Add a new block for FAQs and
          Guardrails
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add new block</DialogTitle>
          <DialogDescription>
            This will add a new blocks for FAQs & Guardrails
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
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
              name="threshold"
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
                    similar to the utterances will trigger this response, but it
                    also raises the risk of unintended sentences matching this
                    response
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
                    name={`utterances.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && ( // Only show delete button if more than one utterance
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
                  onClick={() => append("")}
                  className="mt-2"
                >
                  Add more (up to 20)
                </Button>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
