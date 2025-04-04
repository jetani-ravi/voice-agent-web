import { Agent } from "@/app/modules/agents/interface";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AudioLines,
  Brain,
  ChartBar,
  Mic,
  Parentheses,
  Phone,
} from "lucide-react";
import React from "react";
import LLMSection from "./sections/llm";
import { KnowledgeBase } from "@/app/modules/knowledgebase/interface";
import TranscriberSection from "./sections/transcriber";
import VoiceSection from "./sections/voice";
import CallSection from "./sections/call";
import FunctionsSection from "./sections/functions";
import PostCallAnalytics from "./sections/analytics";
import { ActiveOrganizationDetails } from "@/app/modules/organizations/interface";
import { SystemProviders } from "@/app/modules/providers/interface";

interface Props {
  agent: Agent;
  knowledgeBases: KnowledgeBase[];
  organization: ActiveOrganizationDetails;
  systemProviders: SystemProviders[];
  onModelChange?: (type: 'llm' | 'transcriber' | 'synthesizer', model: { provider: string, model: string }) => void;
  className?: string;
}

const ConfigurationSection = ({
  agent,
  knowledgeBases,
  organization,
  systemProviders,
  onModelChange,
  className
}: Props) => {
  return (
    <div className={`px-6 py-4 bg-card rounded-lg ${className || ''}`}>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="llm">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>LLM</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <LLMSection 
              agent={agent} 
              knowledgeBases={knowledgeBases} 
              systemProviders={systemProviders} 
              onModelChange={(provider, model) => onModelChange?.('llm', { provider, model })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="transcriber">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <span>Transcriber</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <TranscriberSection 
              agent={agent} 
              systemProviders={systemProviders}
              onModelChange={(provider, model) => onModelChange?.('transcriber', { provider, model })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="voice">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <AudioLines className="h-4 w-4" />
              <span>Voice</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <VoiceSection 
              agent={agent} 
              organization={organization}
              onModelChange={(provider, model) => onModelChange?.('synthesizer', { provider, model })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="call">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Call</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <CallSection agent={agent} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="functions">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Parentheses className="h-4 w-4" />
              <span>Functions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <FunctionsSection agent={agent} />
          </AccordionContent>
        </AccordionItem>

        {agent.agent_id && (
          <AccordionItem value="post-call">
            <AccordionTrigger
              className="text-sm font-medium"
              disabled={!agent.agent_id}
            >
              <div className="flex items-center gap-2">
                <ChartBar className="h-4 w-4" />
                <span>Post-Call Analysis</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <PostCallAnalytics agent={agent} />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default ConfigurationSection;
