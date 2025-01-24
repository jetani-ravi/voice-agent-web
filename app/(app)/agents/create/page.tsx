import { ScreenContent, ScreenContainer } from "@/components/screen-container";
import { getKnowledgeBases } from "@/app/modules/knowledgebase/action";
import { Header } from "@/components/header/header";
import React from "react";
import { AgentDetailDrawer } from "@/components/view/agents/modal/agent-details";
import { DEFAULT_AGENT } from "@/constants/agent";

const breadcrumbs = [
  {
    label: "Agents",
    href: "/agents",
  },
  {
    label: "Create Agent",
    href: "/agents/create",
  },
];


const CreateAgent = async () => {
  const knowledgeBase = await getKnowledgeBases({});
  const { knowledge_bases } = knowledgeBase.data!;

  return (
    <ScreenContainer>
      <Header breadcrumbs={breadcrumbs} />
      <ScreenContent>
        <AgentDetailDrawer
          agent={DEFAULT_AGENT}
          knowledgeBases={knowledge_bases}
          />
      </ScreenContent>
    </ScreenContainer>
  );
};

export default CreateAgent;

export const dynamic = "force-dynamic";