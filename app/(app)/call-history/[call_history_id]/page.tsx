import { Header } from "@/components/header/header";
import { ScreenContainer, ScreenContent } from "@/components/screen-container";
import { getCallHistoryById } from "@/app/modules/call-history/action";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart2, Info, ChartScatter } from "lucide-react";
import { DetailsTab } from "@/components/view/call-history/modal/tabs/details-tab";
import { TranscriptTab } from "@/components/view/call-history/modal/tabs/transcript-tab";
import { CostTab } from "@/components/view/call-history/modal/tabs/cost-tab";
import { AnalysisTab } from "@/components/view/call-history/modal/tabs/analysis-tab";
import { RecordingVisualizer } from "@/components/view/call-history/modal/recording-visualizer";

interface CallHistoryDetailPageProps {
  params: Promise<{ call_history_id: string }>;
}

const CallHistoryDetailPage = async ({ params }: CallHistoryDetailPageProps) => {
  const { call_history_id } = await params;
  
  try {
    const response = await getCallHistoryById(call_history_id);
    const execution = response.data!;

    if (!execution) {
      return notFound();
    }

    const breadcrumbs = [
      {
        label: "Call History",
        href: "/call-history",
      },
      {
        label: "Call Details",
        href: `/call-history/${call_history_id}`,
      },
    ];

    const duration = execution.telephony_data?.duration === "0" 
      ? execution.transfer_call_data?.duration 
      : execution.telephony_data?.duration;

    return (
      <ScreenContainer>
        <Header
          breadcrumbs={breadcrumbs}
        />
        <ScreenContent>
          <div className="flex flex-col gap-6 mx-auto w-full">
            {/* Recording Visualizer */}
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <RecordingVisualizer 
                recordingUrl={execution.telephony_data?.recording_url || execution.transfer_call_data?.recording_url} 
                duration={duration}
              />
            </div>

            {/* Tabs */}
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid grid-cols-4 w-full mb-6">
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
            </div>
          </div>
        </ScreenContent>
      </ScreenContainer>
    );
  } catch (error) {
    console.error("Error fetching call history details:", error);
    return notFound();
  }
};

export default CallHistoryDetailPage;

export const dynamic = 'force-dynamic';
