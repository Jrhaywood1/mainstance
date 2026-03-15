import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAppContext } from "@/lib/app-context";

export async function getCurrentSessionUser() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    const { currentUser } = await getAppContext();
    return currentUser;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAuthenticatedUser() {
  const user = await getCurrentSessionUser();
  if (!user) redirect("/login");
  return user;
}
