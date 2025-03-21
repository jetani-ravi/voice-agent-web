"use client";

import { ExecutionModel } from "@/app/modules/call-history/interface";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart2, Info, X, Copy, Expand, ChartScatter } from "lucide-react";
import { DetailsTab } from "./tabs/details-tab";
import { TranscriptTab } from "./tabs/transcript-tab";
import { CostTab } from "./tabs/cost-tab";
import { RecordingVisualizer } from "./recording-visualizer";
import { AnalysisTab } from "./tabs/analysis-tab";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
interface ExecutionDetailsProps {
  execution: ExecutionModel | null;
  open: boolean;
  onClose: () => void;
}

export function ExecutionDetails({
  execution,
  open,
  onClose,
}: ExecutionDetailsProps) {
  const { toast } = useToast();
  const router = useRouter();
  if (!execution) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(execution._id);
    toast({
      title: "Copied to clipboard",
    });
  };

  const handleExpand = () => {
    router.push(`/call-history/${execution._id}`);
  };

  const duration = execution.telephony_data?.duration === "0" ? execution.transfer_call_data?.duration : execution.telephony_data?.duration;

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/40" />
        <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-[800px] max-w-full rounded-lg">
          <DrawerHeader className="flex justify-between items-center">
            <div>
              <DrawerTitle>Call Log Details</DrawerTitle>
              <DrawerDescription className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">ID: {execution._id}</span>
                <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy Execution ID">
                  <Copy className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleExpand} title="Expand Execution">
                  <Expand className="h-3 w-3" />
                </Button>
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          
          <ScrollArea className="flex-1 overflow-y-auto">
            {/* Recording Visualizer */}
            <RecordingVisualizer 
              recordingUrl={execution.telephony_data?.recording_url || execution.transfer_call_data?.recording_url} 
              duration={duration}
            />

            {/* Tabs */}
            <Tabs defaultValue="details" className="w-full px-4 my-4">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>Details</span>
                </TabsTrigger>
                <TabsTrigger value="transcript" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Transcript</span>
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  <span>Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="cost" className="flex items-center gap-2">
                  <ChartScatter className="h-4 w-4" />
                  <span>Call Cost</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <DetailsTab execution={execution} />
              </TabsContent>
              
              <TabsContent value="transcript">
                <TranscriptTab execution={execution} />
              </TabsContent>
              
              <TabsContent value="analysis">
                <AnalysisTab execution={execution} />
              </TabsContent>
              
              <TabsContent value="cost">
                <CostTab execution={execution} />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
