import React from "react";
import { CostBreakdown } from "@/lib/cost-calculator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DollarSign, InfoIcon } from "lucide-react";

interface CostDisplayProps {
  costBreakdown: CostBreakdown;
  selectedModels: {
    llm: { provider: string; model: string };
    transcriber: { provider: string; model: string };
    synthesizer: { provider: string; model: string };
  };
  className?: string;
}

interface CostBarSegmentProps {
  percentage: number;
  color: string;
  title: string;
  provider?: string;
  model?: string;
  cost: number;
}

const CostDisplay: React.FC<CostDisplayProps> = ({
  costBreakdown,
  selectedModels,
  className
}) => {
  const formatCost = (cost: number, precision: number = 6) => {
    return `$${cost.toFixed(precision)}`;
  };

  // Calculate percentages for the cost bar
  const total = costBreakdown.total;
  const llmPercentage = total > 0 ? (costBreakdown.llm / total) * 100 : 0;
  const transcriberPercentage =
    total > 0 ? (costBreakdown.transcriber / total) * 100 : 0;
  const synthesizerPercentage =
    total > 0 ? (costBreakdown.synthesizer / total) * 100 : 0;
  const platformPercentage =
    total > 0 ? (costBreakdown.platform / total) * 100 : 0;

  const segments: CostBarSegmentProps[] = [
    {
      percentage: platformPercentage,
      color: "purple",
      title: "Platform: Voice agent fixed cost",
      cost: costBreakdown.platform,
    },
    {
      percentage: transcriberPercentage,
      color: "blue",
      title: "STT",
      provider: selectedModels.transcriber.provider,
      model: selectedModels.transcriber.model,
      cost: costBreakdown.transcriber,
    },
    {
      percentage: llmPercentage,
      color: "green",
      title: "LLM",
      provider: selectedModels.llm.provider,
      model: selectedModels.llm.model,
      cost: costBreakdown.llm,
    },
    {
      percentage: synthesizerPercentage,
      color: "yellow",
      title: "TTS",
      provider: selectedModels.synthesizer.provider,
      model: selectedModels.synthesizer.model,
      cost: costBreakdown.synthesizer,
    },
  ];

  // Map color names to actual CSS classes to avoid the dynamic class name issue
  const colorMap: Record<string, string> = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className || ''}`}>
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Cost</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1 text-xs w-64">
                <p>
                  These calculations are estimates. They may not reflect the
                  actual cost of the assistant. Prices are per minute.
                </p>
                <br />
                <p>LLM: {formatCost(costBreakdown.llm)}</p>
                <p>Transcriber: {formatCost(costBreakdown.transcriber)}</p>
                <p>Synthesizer: {formatCost(costBreakdown.synthesizer)}</p>
                <p>Platform: {formatCost(costBreakdown.platform)}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="ml-auto text-sm font-medium text-green-500">
          ~{formatCost(costBreakdown.total, 2)} /min
        </div>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
        <TooltipProvider>
          {segments.map(
            (segment, index) =>
              segment.percentage > 0 && (
                <div
                  key={index}
                  className={`relative group cursor-pointer ${
                    colorMap[segment.color]
                  } transition-all`}
                  style={{
                    width: `${segment.percentage}%`,
                    height: "100%",
                    transform: "translateZ(0)", // Force GPU acceleration
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />
                  <Tooltip>
                    <TooltipTrigger className="absolute inset-0" />
                    <TooltipContent side="bottom" className="text-xs">
                      <div className="font-semibold">{segment.title}</div>
                      {segment.provider && (
                        <div>Provider: {segment.provider || "None"}</div>
                      )}
                      {segment.model && (
                        <div>Model: {segment.model || "None"}</div>
                      )}
                      <div>Cost: {formatCost(segment.cost, 4)}/min</div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )
          )}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CostDisplay;
