import { getAgents, GetAgentsParams } from "@/app/modules/agents/action";
import { Header } from "@/components/header/header";
import { ScreenContainer, ScreenContent } from "@/components/screen-container";
import DataTable from "@/components/view/agents/data-table";
import { createSearchParams, SearchParams } from "@/lib/searchParams";

const breadcrumbs = [
  {
    label: "Agents",
    href: "/agents",
  },
];

const AgentsPage = async (props: { searchParams: SearchParams }) => {
  const searchParams = await props.searchParams;
  const params: GetAgentsParams = createSearchParams(searchParams);

  const response = await getAgents(params);
  const { agents, pagination } = response.data!;

  return (
    <ScreenContainer>
      <Header breadcrumbs={breadcrumbs} />
      <ScreenContent>
        <DataTable agents={agents} pagination={pagination} />
      </ScreenContent>
    </ScreenContainer>
  );
};

export default AgentsPage;
