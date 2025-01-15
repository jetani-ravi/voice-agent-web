import { getAgents } from "@/app/modules/agents/action";
import { Header } from "@/components/header/header";

const breadcrumbs = [
  {
    label: "Agents",
    href: "/agents",
  },
];

const AgentsPage = async () => {
  const agents = await getAgents();
  console.log(agents);

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />
      <div>Agents Page</div>
    </>
  );
};

export default AgentsPage;
