import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhoneCallModal from "./sections/phone-call";
import { Agent } from "@/app/modules/agents/interface";
import LLMChat from "./sections/llm-chat";

interface Props {
  agent?: Agent;
  className?: string;
}

const TestLLMSection = ({ agent, className }: Props) => {
  const [open, setOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const onTestAudio = async () => {
    if (!agent?.agent_id) return;
    setOpen(true);
  };

  return (
    <div className={`px-6 py-4 rounded-lg bg-card overflow-hidden ${className || ''}`}>
      <Tabs defaultValue="test" className="h-full">
        <div className="flex-1 flex flex-col items-center justify-center">
          <TabsList className="w-full flex justify-center items-center">
            <TabsTrigger className="flex-1" value="test">
              Test Audio
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="test-llm">
              Test LLM
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="test"
            className="flex flex-col items-center justify-center w-full "
          >
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium">Test your agent</h3>
              <Button onClick={onTestAudio} disabled={!agent?.agent_id}>
                Make a Call
              </Button>
            </div>
          </TabsContent>

          <TabsContent
            value="test-llm"
            className="flex flex-col w-full h-[80vh]"
          >
            {!showChat ? (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">Test LLM</h3>
                <Button
                  onClick={() => setShowChat(true)}
                  disabled={!agent?.agent_id}
                >
                  Start Conversation
                </Button>
              </div>
            ) : (
              <LLMChat agent={agent!} onStop={() => setShowChat(false)} />
            )}
          </TabsContent>
        </div>
      </Tabs>

      <PhoneCallModal
        open={open}
        setOpen={setOpen}
        agent={agent!}
      />
    </div>
  );
};

export default TestLLMSection;
