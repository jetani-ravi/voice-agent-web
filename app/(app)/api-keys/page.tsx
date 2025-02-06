import { Header } from "@/components/header/header";
import { ScreenContainer, ScreenContent } from "@/components/screen-container";
import { createSearchParams, SearchParams } from "@/lib/searchParams";
import { CreateApiKeyButton } from "./create-button";
import { getApiKeys } from "@/app/modules/api-keys/action";
import DataTable from "@/components/view/api-keys/data-table";

const breadcrumbs = [
  {
    label: "API Keys",
    href: "/api-keys",
  },
];

const ApiKeysPage = async (props: { searchParams: Promise<SearchParams> }) => {
  const searchParams = await props.searchParams;
  const params: SearchParams = createSearchParams(searchParams);

  const response = await getApiKeys(params);
  const { api_keys, pagination } = response.data!;
  return (
    <ScreenContainer>
      <Header breadcrumbs={breadcrumbs} rightContent={<CreateApiKeyButton />} />
      <ScreenContent>
        <DataTable apiKeys={api_keys} pagination={pagination} />
      </ScreenContent>
    </ScreenContainer>
  );
};

export default ApiKeysPage;

export const dynamic = "force-dynamic";
