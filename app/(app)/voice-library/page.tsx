import { getVoiceLibrary } from "@/app/modules/voice-library/action";
import { Header } from "@/components/header/header";
import { ScreenContainer, ScreenContent } from "@/components/screen-container";
import DataTable from "@/components/view/voice-library/data-table";
import { createSearchParams, SearchParams } from "@/lib/searchParams";

const breadcrumbs = [
  {
    label: "Voice Library",
    href: "/voice-library",
  },
];

const VoiceLibraryPage = async (props: {
  searchParams: Promise<SearchParams>;
}) => {
  const searchParams = await props.searchParams;
  const limit = searchParams.limit ? searchParams.limit : 20;
  const params: SearchParams = createSearchParams({
    ...searchParams,
    limit,
  });

  const voiceLibrary = await getVoiceLibrary(params);
  const { voices, pagination } = voiceLibrary.data!;
  return (
    <ScreenContainer>
      <Header breadcrumbs={breadcrumbs} />
      <ScreenContent>
        <DataTable voices={voices} pagination={pagination} />
      </ScreenContent>
    </ScreenContainer>
  );
};

export default VoiceLibraryPage;
