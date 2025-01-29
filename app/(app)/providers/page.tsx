import { getProvidersWithConnection } from "@/app/modules/providers/action";
import { Header } from "@/components/header/header";
import { ScreenContainer, ScreenContent } from "@/components/screen-container";
import ProvidersList from "@/components/view/providers";
import { SearchParams } from "@/lib/searchParams";

const breadcrumbs = [
  {
    label: "Providers",
    href: "/providers",
  },
];

const ProvidersPage = async (props: {
  searchParams: Promise<SearchParams>;
}) => {
  const searchParams = await props.searchParams;
  const response = await getProvidersWithConnection(searchParams);
  const { providers } = response.data!;
  return (
    <ScreenContainer>
      <Header breadcrumbs={breadcrumbs} />
      <ScreenContent>
        <ProvidersList systemProviders={providers} />
      </ScreenContent>
    </ScreenContainer>
  );
};

export default ProvidersPage;
