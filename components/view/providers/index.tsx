"use client";

import type {
  ProvidersWithConnection,
  SystemProviders,
} from "@/app/modules/providers/interface";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PROVIDERS_LOGO_BASE_PATH } from "@/constants/common";
import { debounce } from "lodash";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { ConnectProviderDialog } from "./components/connect-modal";
import {
  connectUserProvider,
  disconnectUserProvider,
} from "@/app/modules/providers/action";
import { useToastHandler } from "@/hooks/use-toast-handler";
import { Button } from "@/components/ui/button";
import { PROVIDERS_STATUS } from "@/constants/providers";
import { ConnectProvidersValues } from "@/app/modules/providers/validation";
import { Link, PlugZap } from "lucide-react";
import DeletePopover from "@/components/delete-popover";
import { isApiError } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

interface Props {
  systemProviders: ProvidersWithConnection[];
}

const ProvidersList = ({ systemProviders }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams?.get("search") || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<SystemProviders | null>(null);
  const { handleToast } = useToastHandler();
  const { toast } = useToast();
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null
  );

  // Group providers by category
  const groupedProviders = systemProviders.reduce((acc, provider) => {
    if (!acc[provider.category]) {
      acc[provider.category] = [];
    }
    acc[provider.category].push(provider);
    return acc;
  }, {} as Record<string, ProvidersWithConnection[]>);

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

  const handleConnect = async (data: ConnectProvidersValues) => {
    setError(null);
    try {
      const result = await connectUserProvider(data);
      if (result.success) {
        setIsModalOpen(false);
        toast({
          title: "Connected",
          description: "You have successfully connected to the provider.",
        });
        return;
      }
      if (isApiError(result.error)) {
        setError({
          title: result.error.type,
          message: result.error.message,
        });
        return;
      }
    } catch (error) {
      console.error("Failed to connect provider:", error);
    }
  };

  const handleDisconnect = async (providerId: string) => {
    setDisconnecting(true);
    try {
      const result = await disconnectUserProvider(providerId);
      handleToast({ result });
    } catch (error) {
      console.error("Failed to disconnect provider:", error);
    } finally {
      setDisconnecting(false);
    }
  };

  const handleButtonClick = (provider: ProvidersWithConnection) => {
    setSelectedProvider(provider);
    setError(null);
    setIsModalOpen((prev) => !prev);
  };

  return (
    <>
      <div className="space-y-12">
        <div className="flex justify-between items-center">
          <Input
            placeholder="Search providers"
            value={searchTerm}
            className="w-fit"
            onChange={handleSearchChange}
          />
        </div>
        {Object.entries(groupedProviders).map(
          ([category, categoryProviders]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-6 capitalize">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProviders.map((provider) => (
                  <Card key={provider._id} className="flex flex-col">
                    <CardHeader className="flex-grow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          {provider?.icon_path ? (
                            <Image
                              src={
                                `${PROVIDERS_LOGO_BASE_PATH}/${provider.icon_path}` ||
                                "/assets/error.svg"
                              }
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
                        <CardTitle className="text-lg">
                          {provider.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex justify-end">
                      {provider.connection?.status ===
                      PROVIDERS_STATUS.ACTIVE ? (
                        <div className="flex items-center gap-2 -mb-2">
                          <Button variant="ghost" disabled>
                            <Link className="h-3 w-3" />
                            <span className="text-xs">Connected</span>
                          </Button>
                          <DeletePopover
                            onDelete={() => handleDisconnect(provider._id)}
                            align="center"
                            title="This action cannot be undone"
                            description={`Are you sure you want to disconnect ${provider.name}?`}
                            className="!text-destructive"
                            disabled={disconnecting}
                          />
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleButtonClick(provider)}
                        >
                          <PlugZap className="h-5 w-5" />
                          Connect
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )
        )}
      </div>
      {selectedProvider && (
        <ConnectProviderDialog
          provider={selectedProvider}
          onConnect={handleConnect}
          open={isModalOpen}
          setOpen={setIsModalOpen}
          error={error}
        />
      )}
    </>
  );
};

export default ProvidersList;
