"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function signInWithPassword(_formData: FormData) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    redirect("/dashboard");
  }

  redirect("/dashboard");
}

export async function sendMagicLink(_formData: FormData) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    redirect("/dashboard");
  }

  redirect("/dashboard");
}
