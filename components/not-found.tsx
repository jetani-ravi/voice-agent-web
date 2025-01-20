import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

interface NotFoundProps {
  resourceName: string;
  returnLink: string;
  returnLinkText: string;
}

export default function NotFound({
  resourceName,
  returnLink,
  returnLinkText,
}: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="mb-8 text-primary">
        <FileQuestion size={120} />
      </div>
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-xl mb-8">
        Sorry, the {resourceName} you&apos;re looking for doesn&apos;t exist.
      </p>
      <div className="max-w-md mb-8">
        <p className="text-muted-foreground">
          The {resourceName} might have been moved, deleted, or never existed.
          Please check the URL or try searching for the {resourceName}.
        </p>
      </div>
      <Button asChild>
        <Link href={returnLink}>{returnLinkText}</Link>
      </Button>
    </div>
  );
}
