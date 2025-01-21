import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { Agent } from "@/app/modules/agents/interface";
import { initiateCall } from "@/app/modules/phone-numbers/action";

interface Props {
  agent: Agent;
}

const TestLLMSection = ({ agent }: Props) => {
  const onTestAudio = async () => {
    console.log("test audio");
    const response = await initiateCall({
      recipient_phone_number: "+916356827895",
      agent_id: agent.agent_id!,
    });
    console.log(response);
  };

  const onTestLLM = () => {
    console.log("test llm");
  };

  return (
    <div className="flex-1 px-6 py-4 rounded-lg bg-card">
      <Tabs defaultValue="test" className="h-full">
        <div className="flex-1 flex flex-col items-center justify-center">
          <TabsList className="mb-8 w-full">
            <TabsTrigger className="flex-1" value="test">
              Test Audio
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="test-llm">
              Test LLM
            </TabsTrigger>
          </TabsList>
          <TabsContent value="test" className="flex flex-col items-center">
            <div className="text-center space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Test your agent</h3>
              </div>
              <Button variant="outline" className="w-32" onClick={onTestAudio}>
                Test
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="test-llm" className="flex flex-col items-center">
            <div className="text-center space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Test LLM</h3>
              </div>
              <Button variant="outline" className="w-32" onClick={onTestLLM}>
                Start Test
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TestLLMSection;
