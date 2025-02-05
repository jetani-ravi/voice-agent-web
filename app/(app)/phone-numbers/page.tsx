import { Header } from "@/components/header/header";
import { ScreenContainer, ScreenContent } from "@/components/screen-container";
import { createSearchParams, SearchParams } from "@/lib/searchParams";
import { getPhoneNumbers } from "@/app/modules/phone-numbers/action";
import { CreatePhoneNumberButton } from "./create-button";
import DataTable from "@/components/view/phone-numbers/data-table";

const breadcrumbs = [
  {
    label: "Phone Numbers",
    href: "/phone-numbers",
  },
];

const PhoneNumbersPage = async (props: { searchParams: Promise<SearchParams> }) => {
  const searchParams = await props.searchParams;
  const params: SearchParams = createSearchParams(searchParams);

  const phoneNumbers = await getPhoneNumbers(params);
  const { phone_numbers, pagination } = phoneNumbers.data!;

  return (
    <ScreenContainer>
      <Header
        breadcrumbs={breadcrumbs}
        rightContent={<CreatePhoneNumberButton />}
      />
      <ScreenContent>
        <DataTable phoneNumbers={phone_numbers} pagination={pagination} />
      </ScreenContent>
    </ScreenContainer>
  );
};

export default PhoneNumbersPage;

export const dynamic = 'force-dynamic'
