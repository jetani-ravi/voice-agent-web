"use client";

import { Button } from "@/components/ui/button";
import KnowledgeBaseForm from "@/components/view/knowledge-base/components/knowledge-base-form";
import { useState } from "react";

export function CreateKnowledgeBaseButton() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <Button onClick={handleClick}>Create Knowledge Base</Button>
      <KnowledgeBaseForm open={open} setOpen={setOpen} />
    </>
  );
}
