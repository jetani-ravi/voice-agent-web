import { AppSidebar } from "@/components/navbar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { me } from "../modules/user/action";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const response = await me();

  const user = response.data!;
  return (
    <main className="flex min-h-screen flex-grow">
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </main>
  );
}
