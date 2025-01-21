import { ScreenContainer, ScreenContent } from "@/components/screen-container";
import React from "react";
import { Header } from "@/components/header/header";
import { AgentDetailDrawer } from "@/components/view/agents/modal/agent-details";
import { getAgent } from "@/app/modules/agents/action";
import { getKnowledgeBases } from "@/app/modules/knowledgebase/action";
import NotFound from "@/components/not-found";

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
  if (!response.success) {
    return (
      <NotFound
        resourceName="agent"
        returnLink="/agents"
        returnLinkText="Return to Agents"
      />
    );
  }
  const knowledgeBase = await getKnowledgeBases({});
  const agent = response.data!;
  const { knowledge_bases } = knowledgeBase.data!;
  return (
    <ScreenContainer>
      <Header breadcrumbs={breadcrumbs} />
      <ScreenContent>
        <AgentDetailDrawer agent={agent} knowledgeBases={knowledge_bases} />
      </ScreenContent>
    </ScreenContainer>
  );
};

export default AgentDetail;
