import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhoneCallModal from "./sections/phone-call";
import { Option } from "@/components/ui/searchable-select";
import { getPhoneNumbers } from "@/app/modules/phone-numbers/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { Agent } from "@/app/modules/agents/interface";
import LLMChat from "./sections/llm-chat";

interface Props {
  agent?: Agent;
}

const TestLLMSection = ({ agent }: Props) => {
  const [open, setOpen] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState<Option[]>([]);
  const { handleToast } = useToastHandler();
  const [showChat, setShowChat] = useState(false);

  const fetchPhoneNumbers = async () => {
    const result = await getPhoneNumbers();
    if (result.success) {
      setPhoneNumbers(
        result.data?.phone_numbers.map((phoneNumber) => ({
          value: phoneNumber.phone_number,
          label: phoneNumber.phone_number,
        })) || []
      );
      return;
    }
    handleToast({ result });
  };

  useEffect(() => {
    if (agent?.agent_id) {
      fetchPhoneNumbers();
    }
  }, [agent?.agent_id]);

  const onTestAudio = async () => {
    if (!agent?.agent_id) return;
    setOpen(true);
  };

  return (
    <div className="flex-1 px-6 py-4 rounded-lg bg-card">
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
              <Button
                onClick={onTestAudio}
                disabled={!agent?.agent_id}
              >
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
        phoneNumbers={phoneNumbers}
      />
    </div>
  );
};

export default TestLLMSection;
