"use client";

import type {
  SystemProviders,
} from "@/app/modules/providers/interface";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PROVIDERS_LOGO_BASE_PATH } from "@/constants/common";
import { debounce } from "lodash";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  systemProviders: SystemProviders[];
}

const ProvidersList = ({ systemProviders }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams?.get("search") || ""
  );

  // Group providers by category
  const groupedProviders = systemProviders.reduce((acc, provider) => {
    if (!acc[provider.category]) {
      acc[provider.category] = [];
    }
    acc[provider.category].push(provider);
    return acc;
  }, {} as Record<string, SystemProviders[]>);

  const debouncedUpdateSearchParams = useCallback(
    debounce((newSearchParams: URLSearchParams) => {
      router.push(`${pathname}?${newSearchParams.toString()}`);
    }, 300),
    [router, pathname]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString());
    newSearchParams.set("search", e.target.value);
    newSearchParams.set("page", "1");
    setSearchTerm(e.target.value);
    debouncedUpdateSearchParams(newSearchParams);
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <Input placeholder="Search providers" value={searchTerm} className="w-fit" onChange={handleSearchChange} />
      </div>
      {Object.entries(groupedProviders).map(([category, categoryProviders]) => (
        <div key={category}>
          <h2 className="text-2xl font-bold mb-6 capitalize">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProviders.map((provider) => (
              <Card key={provider._id} className="flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {provider?.iconPath ? (
                        <Image
                          src={`${PROVIDERS_LOGO_BASE_PATH}/${provider.iconPath}`}
                          alt={`${provider.name} icon`}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      ) : (
                        <div className="text-2xl font-bold text-muted-foreground">
                          {provider.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                  </div>
                </CardHeader>
                {/* <CardContent></CardContent> */}
                <CardFooter className="flex justify-end">
                  <Button
                    className=""
                    onClick={() => console.log(`Connect to ${provider.name}`)}
                  >
                    Connect
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProvidersList;
