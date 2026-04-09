"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = {
  error?: string;
};

export async function signup(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const displayName = (formData.get("displayName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!displayName) {
    return { error: "Please enter your name" };
  }

  if (!email) {
    return { error: "Please enter your email address" };
  }

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "An account with this email already exists" };
    }
    return { error: error.message };
  }

  redirect("/catalog");
}

export async function login(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email) {
    return { error: "Please enter your email address" };
  }

  if (!password) {
    return { error: "Please enter your password" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid email or password. Please try again." };
  }

  redirect("/catalog");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPassword(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();

  if (!email) {
    return { error: "Please enter your email address" };
  }

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? "" : ""}${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?type=recovery`,
  });

  // Always return success to prevent email enumeration
  return {};
}

export async function updatePassword(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const password = formData.get("password") as string;

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/catalog");
}
