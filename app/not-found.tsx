import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false }
};

export default function NotFound() {
  return (
    <PageHeader title="There's no page at this address.">
      <p>The link may be old, or the address may have a typo in it.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-solid">
          Go to the homepage
        </Link>
        <Link href="/projects" className="btn btn-line">
          See the work
        </Link>
      </div>
    </PageHeader>
  );
}
