import { Header } from "@/components/header/header";
import { ScreenContainer, ScreenContent } from "@/components/screen-container";
import { createSearchParams, SearchParams } from "@/lib/searchParams";

const breadcrumbs = [
  {
    label: "Voice Library",
    href: "/voice-library",
  },
];

const VoiceLibraryPage = async (props: { searchParams: Promise<SearchParams> }) => {
  const searchParams = await props.searchParams;
  const params: SearchParams = createSearchParams(searchParams);

  console.log(params);
  return (
    <ScreenContainer>
      <Header
        breadcrumbs={breadcrumbs}
      />
      <ScreenContent>
        <div>Voice Library</div>
      </ScreenContent>
    </ScreenContainer>
  );
};

export default VoiceLibraryPage;
