import { auth, currentUser } from "@clerk/nextjs/server";
import { env } from "@/lib/env";

function parseOwnerEmails(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireOwnerAccess(): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: "Unauthorized", status: 401 };
  }

  const ownerEmails = parseOwnerEmails(env.ADMIN_OWNER_EMAILS);
  if (ownerEmails.length === 0) {
    return { ok: false, error: "ADMIN_OWNER_EMAILS is not configured.", status: 500 };
  }

  const user = await currentUser();
  const primaryEmail = user?.emailAddresses.find((item) => item.id === user.primaryEmailAddressId)?.emailAddress;
  if (!primaryEmail || !ownerEmails.includes(primaryEmail.toLowerCase())) {
    return { ok: false, error: "Forbidden", status: 403 };
  }

  return { ok: true };
}
