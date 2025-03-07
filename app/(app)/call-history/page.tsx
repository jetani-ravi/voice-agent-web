import { Header } from "@/components/header/header";
import { ScreenContainer, ScreenContent } from "@/components/screen-container";
import { createSearchParams, SearchParams } from "@/lib/searchParams";
import { getCallHistory } from "@/app/modules/call-history/action";
import DataTable from "@/components/view/call-history/data-table";

const breadcrumbs = [
  {
    label: "Call History",
    href: "/call-history",
  },
];

const CallHistoryPage = async (props: { searchParams: Promise<SearchParams> }) => {
  const searchParams = await props.searchParams;
  const limit = searchParams.limit ? searchParams.limit : 20;
  const params: SearchParams = createSearchParams({
    ...searchParams,
    limit,
  });

  const response = await getCallHistory(params);
  const { executions, pagination } = response.data!;

  return (
    <ScreenContainer>
      <Header
        breadcrumbs={breadcrumbs}
      />
      <ScreenContent>
        <DataTable executions={executions} pagination={pagination} />
      </ScreenContent>
    </ScreenContainer>
  );
};

export default CallHistoryPage;

export const dynamic = 'force-dynamic'
