import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export interface BreadcrumbItem {
  href?: string;
  label: string;
  active?: boolean;
}

interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

export function Header({ breadcrumbs }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        {breadcrumbs?.length ? (
          <>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  if (isLast) {
                    return (
                      <BreadcrumbItem key={crumb.label + index}>
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      </BreadcrumbItem>
                    );
                  }

                  return (
                    <>
                      <BreadcrumbItem
                        key={crumb.label + index}
                        className="hidden md:flex"
                      >
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator key={`${crumb.label}-separator-${index}`} />
                    </>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </>
        ) : null}
      </div>
    </header>
  );
}
