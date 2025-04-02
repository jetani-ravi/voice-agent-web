import { ScreenContent, ScreenContainer } from "@/components/screen-container";
import { getKnowledgeBases } from "@/app/modules/knowledgebase/action";
import { Header } from "@/components/header/header";
import React from "react";
import { AgentDetailDrawer } from "@/components/view/agents/modal/agent-details";
import { DEFAULT_AGENT } from "@/constants/agent";
import { getActiveOrganization } from "@/app/modules/organizations/action";
import { KnowledgeBase } from "@/app/modules/knowledgebase/interface";
import { ActiveOrganizationDetails } from "@/app/modules/organizations/interface";
import { getProvidersWithConnection } from "@/app/modules/providers/action";
import { ProvidersWithConnection } from "@/app/modules/providers/interface";

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
  const [knowledgeBaseResult, activeOrganizationResult, systemProvidersResult] =
    await Promise.allSettled([getKnowledgeBases({}),  getActiveOrganization(), getProvidersWithConnection()]);
  let knowledge_bases: KnowledgeBase[] = [];
  if (
    knowledgeBaseResult.status === "fulfilled" &&
    knowledgeBaseResult.value.success
  ) {
    knowledge_bases = knowledgeBaseResult.value.data!.knowledge_bases;
  } else {
    console.error(
      "Failed to fetch knowledge bases:",
      knowledgeBaseResult.status === "rejected"
        ? knowledgeBaseResult.reason
        : knowledgeBaseResult.value
    );
  }

  // Handle active organization fetch result
  let organization: ActiveOrganizationDetails | null = null;
  if (
    activeOrganizationResult.status === "fulfilled" &&
    activeOrganizationResult.value.success
  ) {
    organization = activeOrganizationResult.value.data!;
  } else {
    console.error(
      "Failed to fetch active organization:",
      activeOrganizationResult.status === "rejected"
        ? activeOrganizationResult.reason
        : activeOrganizationResult.value
    );
  }

  // Handle system providers fetch result
  let systemProviders: ProvidersWithConnection[] = [];
  if (
    systemProvidersResult.status === "fulfilled" &&
    systemProvidersResult.value.success
  ) {
    systemProviders = systemProvidersResult.value.data!.providers;
  } else {
    console.error(
      "Failed to fetch system providers:",
      systemProvidersResult.status === "rejected"
        ? systemProvidersResult.reason
        : systemProvidersResult.value
    );
  }

  return (
    <ScreenContainer>
      <Header breadcrumbs={breadcrumbs} />
      <ScreenContent>
        <AgentDetailDrawer
          agent={DEFAULT_AGENT}
          knowledgeBases={knowledge_bases}
          organization={organization!}
          systemProviders={systemProviders}
        />
      </ScreenContent>
    </ScreenContainer>
  );
};

export default CreateAgent;

export const dynamic = "force-dynamic";
