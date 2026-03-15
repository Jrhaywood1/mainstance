import { AppShell } from "@/components/layout/app-shell";
import { requireAuthenticatedUser } from "@/lib/auth";
import { getAppContext } from "@/lib/app-context";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireAuthenticatedUser();
  const { currentUser } = await getAppContext();

  return <AppShell user={currentUser}>{children}</AppShell>;
}
