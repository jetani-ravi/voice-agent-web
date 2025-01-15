import { ScreenContainer, ScreenContent } from "@/components/screen-container";
import React from "react";
import { Header } from "@/components/header/header";
import { AgentDetailDrawer } from "@/components/view/agents/modal/agent-details";
import { getAgent } from "@/app/modules/agents/action";

const breadcrumbs = [
  {
    label: "Agents",
    href: "/agents",
  },
  {
    label: "Agent Detail",
    href: "/agents/[agent_id]",
  },
];

const AgentDetail = async ({
  params,
}: {
  params: Promise<{ agent_id: string }>;
}) => {
  const agent_id = (await params).agent_id;
  const response = await getAgent(agent_id);
  const agent = response.data!;

  return (
    <ScreenContainer>
      <Header breadcrumbs={breadcrumbs} />
      <ScreenContent>
        <AgentDetailDrawer agent={agent} />
      </ScreenContent>
    </ScreenContainer>
  );
};

export default AgentDetail;
