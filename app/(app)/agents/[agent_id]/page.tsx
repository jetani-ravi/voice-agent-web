import { ScreenContainer, ScreenContent } from "@/components/screen-container";
import { Header } from "@/components/header/header";
import { AgentDetailDrawer } from "@/components/view/agents/modal/agent-details";
import { getAgent } from "@/app/modules/agents/action";
import { getKnowledgeBases } from "@/app/modules/knowledgebase/action";
import NotFound from "@/components/not-found";
import { getActiveOrganization } from "@/app/modules/organizations/action";
import { KnowledgeBase } from "@/app/modules/knowledgebase/interface";
import { ActiveOrganizationDetails } from "@/app/modules/organizations/interface";
import { getSystemProviders } from "@/app/modules/providers/action";
import { SystemProviders } from "@/app/modules/providers/interface";

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

  // Fetch data in parallel using Promise.allSettled
  const [agentResult, knowledgeBaseResult, activeOrganizationResult, systemProvidersResult] =
    await Promise.allSettled([
      getAgent(agent_id),
      getKnowledgeBases({}),
      getActiveOrganization(),
      getSystemProviders(),
    ]);

  // Handle agent fetch result
  if (
    agentResult.status === "rejected" ||
    (agentResult.status === "fulfilled" && !agentResult.value.success)
  ) {
    return (
      <NotFound
        resourceName="agent"
        returnLink="/agents"
        returnLinkText="Return to Agents"
      />
    );
  }

  const agent = agentResult.value.data!;

  // Handle knowledge base fetch result
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
  let systemProviders: SystemProviders[] = [];
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
          agent={agent}
          knowledgeBases={knowledge_bases}
          organization={organization!}
          systemProviders={systemProviders}
        />
      </ScreenContent>
    </ScreenContainer>
  );
};

export default AgentDetail;

export const dynamic = 'force-dynamic'
