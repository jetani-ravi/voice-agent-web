"use client";

import { Button } from "@/components/ui/button";
import APIKeyForm from "@/components/view/api-keys/components/api-key-form";
import { useState } from "react";

export function CreateApiKeyButton() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <Button onClick={handleClick}>Create API Key</Button>
      <APIKeyForm open={open} setOpen={setOpen} />
    </>
  );
}
