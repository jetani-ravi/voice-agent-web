import { Header } from "@/components/header/header";
import { ScreenContainer, ScreenContent } from "@/components/screen-container";
import { createSearchParams, SearchParams } from "@/lib/searchParams";

const breadcrumbs = [
  {
    label: "Providers",
    href: "/providers",
  },
];

const ProvidersPage = async (props: { searchParams: Promise<SearchParams> }) => {
  const searchParams = await props.searchParams;
  const params: SearchParams = createSearchParams(searchParams);

  console.log(params);
  return (
    <ScreenContainer>
      <Header
        breadcrumbs={breadcrumbs}
      />
      <ScreenContent>
        <div>Providers</div>
      </ScreenContent>
    </ScreenContainer>
  );
};

export default ProvidersPage;
