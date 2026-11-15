import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

const DESCRIPTION = "Write-ups by Philip Allotey on things built and broken. Nothing published yet.";

export const metadata: Metadata = {
  title: "Writing",
  description: DESCRIPTION,
  openGraph: { title: "Writing", description: DESCRIPTION, url: "/blog" }
};

export default function BlogPage() {
  return (
    <PageHeader title="Nothing published yet.">
      <p>I&apos;m planning write-ups on things I&apos;ve built and things I&apos;ve broken. Until then, the work speaks.</p>
      <Link href="/projects" className="btn btn-solid mt-8">
        See the work
      </Link>
    </PageHeader>
  );
}
