import { Header } from "@/components/header/header";
import { ScreenContainer, ScreenContent } from "@/components/screen-container";
import { createSearchParams, SearchParams } from "@/lib/searchParams";

const breadcrumbs = [
  {
    label: "API Keys",
    href: "/api-keys",
  },
];

const ApiKeysPage = async (props: { searchParams: Promise<SearchParams> }) => {
  const searchParams = await props.searchParams;
  const params: SearchParams = createSearchParams(searchParams);

  console.log(params);
  return (
    <ScreenContainer>
      <Header
        breadcrumbs={breadcrumbs}
      />
      <ScreenContent>
        <div>API Keys</div>
      </ScreenContent>
    </ScreenContainer>
  );
};

export default ApiKeysPage;

export const dynamic = 'force-dynamic'
