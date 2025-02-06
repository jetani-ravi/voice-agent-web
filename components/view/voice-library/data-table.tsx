"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Voice } from "@/app/modules/voice-library/interface";
import { Pagination } from "@/types/api";
import ControlledGrid from "@/components/ui/grid/controlled-grid";
import VoiceCard from "./grid";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { GENDERS, LANGUAGES, VOICE_PROVIDERS } from "@/constants/providers";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  addVoiceToOrganization,
  removeVoiceFromOrganization,
} from "@/app/modules/voice-library/action";
import { useToastHandler } from "@/hooks/use-toast-handler";

interface DataTableProps {
  voices: Voice[];
  pagination: Pagination;
}

const DataTable = ({ voices, pagination }: DataTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { handleToast } = useToastHandler();

  // State management
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    provider: searchParams.get("provider") || "",
    gender: searchParams.get("gender") || "",
    language: searchParams.get("language") || "",
  });

  // Audio management
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const hasActiveFilters = useMemo(() => {
    return (
      Object.values(filters).some((value) => value !== "") ||
      searchParams.has("search")
    );
  }, [filters, searchParams]);

  // Memoized search params update function
  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key);
        }
      });

      newSearchParams.set("page", "1");
      router.push(`${pathname}?${newSearchParams.toString()}`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  // Audio playback handler
  const handlePlayAudio = useCallback(
    (previewUrl: string | undefined, voiceId: string) => {
      if (!previewUrl) return;

      if (playingAudio === voiceId) {
        audioRef.current?.pause();
        setPlayingAudio(null);
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(previewUrl);
        audioRef.current.play();
        audioRef.current.onended = () => setPlayingAudio(null);
        setPlayingAudio(voiceId);
      }
    },
    [playingAudio]
  );

  // Filter change handlers
  const handleFilterChange = useCallback(
    (key: keyof typeof filters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      updateSearchParams({ [key]: value });
    },
    [updateSearchParams]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({ provider: "", gender: "", language: "" });
    const newSearchParams = new URLSearchParams();
    router.push(
      pathname +
        (newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""),
      { scroll: false }
    );
  }, [pathname, router]);

  // Add voice handler
  const handleAdd = async (voice: Voice) => {
    try {
      const result = await addVoiceToOrganization(voice._id);
      handleToast({ result });
    } catch (error) {
      console.error("Error adding voice: ", error);
    }
  };

  // Remove voice handler
  const handleRemove = async (voice: Voice) => {
    try {
      const result = await removeVoiceFromOrganization(voice._id);
      handleToast({ result });
    } catch (error) {
      console.error("Error removing voice: ", error);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const filterElements = (
    <div className="flex flex-wrap flex-grow gap-4">
      <SearchableSelect
        defaultValue={filters.language}
        options={LANGUAGES}
        dropdownClassName="w-full"
        placeholder="Select Language"
        onChange={(value) => handleFilterChange("language", value)}
      />
      <SearchableSelect
        defaultValue={filters.provider}
        options={VOICE_PROVIDERS}
        dropdownClassName="w-full"
        placeholder="Select Provider"
        onChange={(value) => handleFilterChange("provider", value)}
      />
      <SearchableSelect
        defaultValue={filters.gender}
        options={GENDERS}
        placeholder="Select Gender"
        onChange={(value) => handleFilterChange("gender", value)}
        dropdownClassName="w-full"
      />
      <Button
        variant="outline"
        onClick={clearFilters}
        className="hover:text-destructive"
        disabled={!hasActiveFilters}
      >
        <X className="h-6 w-6" />
        Clear
      </Button>
    </div>
  );

  const renderGridItem = (voice: Voice) => (
    <VoiceCard
      key={voice.voice_id}
      voice={voice}
      playingAudio={playingAudio}
      handlePlayAudio={handlePlayAudio}
      onAdd={handleAdd}
      onRemove={handleRemove}
    />
  );

  return (
    <ControlledGrid
      data={voices}
      total={pagination.count}
      filterElements={filterElements}
      alignFiltersToSearch="start"
      searchPlaceholder="Search voice, accent..."
      renderGridItem={renderGridItem}
      showTotal={true}
    />
  );
};

export default DataTable;
