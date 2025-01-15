import { ScreenContainer, ScreenContent } from "@/components/screen-container";
import React from "react";
import { Header } from "@/components/header/header";
import { AgentDetailDrawer } from "@/components/view/agents/modal/agent-details";

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
  return (
    <ScreenContainer>
      <Header breadcrumbs={breadcrumbs} />
      <ScreenContent>
        <div>AgentDetail {agent_id}</div>
        <AgentDetailDrawer agentId={agent_id} />
      </ScreenContent>
    </ScreenContainer>
  );
};

export default AgentDetail;
