import { Header } from "@/components/header/header";
import { ScreenContainer, ScreenContent } from "@/components/screen-container";
import DataTable from "@/components/view/knowledge-base/data-table";
import { createSearchParams, SearchParams } from "@/lib/searchParams";
import { getKnowledgeBases } from "@/app/modules/knowledgebase/action";
import { CreateKnowledgeBaseButton } from "./create-button";

const breadcrumbs = [
  {
    label: "Knowledge Base",
    href: "/knowledge-base",
  },
];

const KnowledgeBasePage = async (props: { searchParams: Promise<SearchParams> }) => {
  const searchParams = await props.searchParams;
  const params: SearchParams = createSearchParams(searchParams);

  const response = await getKnowledgeBases(params);
  const { knowledge_bases, pagination } = response.data!;

  return (
    <ScreenContainer>
      <Header
        breadcrumbs={breadcrumbs}
        rightContent={<CreateKnowledgeBaseButton />}
      />
      <ScreenContent>
        <DataTable knowledgeBases={knowledge_bases} pagination={pagination} />
      </ScreenContent>
    </ScreenContainer>
  );
};

export default KnowledgeBasePage;

export const dynamic = 'force-dynamic'
