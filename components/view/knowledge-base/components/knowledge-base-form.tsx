import {
  createKnowledgeBase,
  updateKnowledgeBase,
} from "@/app/modules/knowledgebase/action";
import { KnowledgeBase } from "@/app/modules/knowledgebase/interface";
import {
  knowledgeBaseSchema,
  KnowledgeBaseValues,
} from "@/app/modules/knowledgebase/validation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileIcon, Trash2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  knowledgeBase?: KnowledgeBase | null;
}

const KnowledgeBaseForm = ({ open, setOpen, knowledgeBase }: Props) => {
  const { handleToast } = useToastHandler();
  const [fileName, setFileName] = useState<string | null>(
    knowledgeBase?.file_name || null
  );
  const form = useForm<KnowledgeBaseValues>({
    resolver: zodResolver(
      knowledgeBase
        ? knowledgeBaseSchema.omit({ file: true })
        : knowledgeBaseSchema
    ),
    defaultValues: {
      name: knowledgeBase?.name || "",
      description: knowledgeBase?.description || "",
      file: undefined,
    },
  });

  useEffect(() => {
    if (knowledgeBase) {
      form.reset({
        name: knowledgeBase.name,
        description: knowledgeBase.description,
        file: undefined,
      });
      setFileName(knowledgeBase.file_name);
    } else {
      setFileName(null);
      form.reset();
    }
  }, [knowledgeBase]);

  const onSubmit = async (values: KnowledgeBaseValues) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      if (values.file && !knowledgeBase) {
        formData.append("file", values.file as File);
      }

      const result = knowledgeBase
        ? await updateKnowledgeBase(knowledgeBase._id!, values)
        : await createKnowledgeBase(formData);
      handleToast({ result });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const onRemoveFile = () => {
    setFileName(null);
    form.reset({
      ...form.getValues(),
      file: undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {knowledgeBase ? "Edit" : "Create"} Knowledge Base
          </DialogTitle>
          <DialogDescription>
            {knowledgeBase ? "Edit" : "Create"} a new knowledge base
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter description"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!knowledgeBase && (
              <FormField
                control={form.control}
                name="file"
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    {fileName ? (
                      <div className="flex items-center justify-between gap-2 border border-dashed p-2 rounded-md">
                        <div className="flex items-center gap-2">
                          <FileIcon className="w-4 h-4" />
                          <p className="text-sm text-muted-foreground">
                            {fileName}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={onRemoveFile}
                        >
                          <Trash2Icon className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <FormDescription>
                          Currently supports .pdf only.
                        </FormDescription>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setFileName(file.name);
                                onChange(file);
                              }
                            }}
                            {...field}
                          />
                        </FormControl>
                      </>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default KnowledgeBaseForm;
