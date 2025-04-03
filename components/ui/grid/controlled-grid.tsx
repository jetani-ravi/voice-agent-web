import React, { useCallback, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { debounce } from "lodash";

interface ControlledGridProps<TData> {
  data: TData[];
  total: number;
  filterElements?: React.ReactNode;
  canSearch?: boolean;
  onRowClick?: (row: TData) => void;
  renderGridItem: (item: TData) => React.ReactNode;
  alignFiltersToSearch?: "start" | "end";
  searchPlaceholder?: string;
  showTotal?: boolean;
}

const ControlledGrid = <TData,>({
  data,
  total,
  filterElements,
  canSearch = true,
  onRowClick,
  renderGridItem,
  alignFiltersToSearch,
  searchPlaceholder = "Search...",
  showTotal = false,
}: ControlledGridProps<TData>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams?.get("search") || ""
  );
  const [allItems, setAllItems] = useState<TData[]>(data);

  const currentPage = Number(searchParams?.get("page") || "1");

  useEffect(() => {
    if (currentPage === 1) {
      setAllItems(data);
    } else {
      setAllItems((prevItems) => {
        const newItems = data.filter(
          (item) =>
            !prevItems.some(
              (prevItem) => JSON.stringify(prevItem) === JSON.stringify(item)
            )
        );
        return [...prevItems, ...newItems];
      });
    }
  }, [data, currentPage]);

  const debouncedUpdateSearchParams = useCallback(
    debounce((newSearchParams: URLSearchParams) => {
      router.push(`${pathname}?${newSearchParams.toString()}`, {
        scroll: false,
      });
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString());
    newSearchParams.set("search", e.target.value);
    newSearchParams.set("page", "1");
    setSearchTerm(e.target.value);
    debouncedUpdateSearchParams(newSearchParams);
  };

  const handleLoadMore = () => {
    const newSearchParams = new URLSearchParams(searchParams?.toString());
    const nextPage = currentPage + 1;
    newSearchParams.set("page", nextPage.toString());
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-4">
      {canSearch && (
        <div
          className={`flex flex-wrap grow gap-4 ${
            alignFiltersToSearch === "end" && "justify-between"
          } items-center`}
        >
          <div className="flex gap-2 items-center">
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="max-w-sm"
            />
          </div>
          {alignFiltersToSearch && <div className="flex">{filterElements}</div>}
        </div>
      )}

      {!alignFiltersToSearch && filterElements && (
        <div className="flex justify-end">{filterElements}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allItems.map((item, index) => (
          <Card
            key={index}
            className={onRowClick ? "cursor-pointer" : ""}
            onClick={() => onRowClick?.(item)}
          >
            <CardContent className="p-4">{renderGridItem(item)}</CardContent>
          </Card>
        ))}
      </div>

      {allItems.length < total && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="w-full max-w-sm"
          >
            Load More {showTotal && `(${allItems.length} of ${total})`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ControlledGrid;
