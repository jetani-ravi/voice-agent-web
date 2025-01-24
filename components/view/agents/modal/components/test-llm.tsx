import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { Agent } from "@/app/modules/agents/interface";
import PhoneCallModal from "./sections/phone-call";
import { getPhoneNumbers } from "@/app/modules/phone-numbers/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { Option } from "@/components/ui/searchable-select";

interface Props {
  agent?: Agent;
}

const TestLLMSection = ({ agent }: Props) => {
  const [open, setOpen] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState<Option[]>([]);
  const { handleToast } = useToastHandler();
  const onTestAudio = async () => {
    if (!agent?.agent_id) return;
    setOpen(true);
  };

  const fetchPhoneNumbers = async () => {
    const result = await getPhoneNumbers();
    if (result.success) {
      setPhoneNumbers(
        result.data?.phone_numbers.map((phoneNumber) => ({
          value: phoneNumber.phoneNumber,
          label: phoneNumber.phoneNumber,
        })) || []
      );
      return;
    }
    handleToast({
      result,
    });
  };

  useEffect(() => {
    if (agent?.agent_id) {
      fetchPhoneNumbers();
    }
  }, [agent?.agent_id]);

  const onTestLLM = () => {};

  return (
    <>
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
                <Button
                  variant="outline"
                  className="w-32"
                  onClick={onTestAudio}
                  disabled={!agent?.agent_id}
                >
                  Test
                </Button>
              </div>
            </TabsContent>
            <TabsContent
              value="test-llm"
              className="flex flex-col items-center"
            >
              <div className="text-center space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Test LLM</h3>
                </div>
                <Button
                  variant="outline"
                  className="w-32"
                  onClick={onTestLLM}
                  disabled={!agent?.agent_id}
                >
                  Start Test
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <PhoneCallModal
        open={open}
        setOpen={setOpen}
        agent={agent!}
        phoneNumbers={phoneNumbers}
      />
    </>
  );
};

export default TestLLMSection;
