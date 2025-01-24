"use client";

import { syncPhoneNumbers } from "@/app/modules/phone-numbers/action";
import { Button } from "@/components/ui/button";
import PhoneNumberForm from "@/components/view/phone-numbers/components/phone-number-form";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";

export function CreatePhoneNumberButton() {
  const [open, setOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await syncPhoneNumbers();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant={"outline"} onClick={handleSync} disabled={isSyncing}>
          <RefreshCcw className={`${isSyncing ? "animate-spin" : ""} size-4`} />
          Sync
        </Button>
        <Button onClick={handleClick}>Buy Phone Number</Button>
      </div>
      <PhoneNumberForm open={open} setOpen={setOpen} />
    </>
  );
}
