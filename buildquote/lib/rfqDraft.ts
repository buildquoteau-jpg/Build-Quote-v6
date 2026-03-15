import { supabase } from "@/lib/supabase";

export function getDraftIdFromBrowser(): string | null {
  if (typeof window === "undefined") return null;

  const fromUrl = new URLSearchParams(window.location.search).get("draft");
  if (fromUrl) {
    localStorage.setItem("rfq_draft_id", fromUrl);
    return fromUrl;
  }

  const fromStorage = localStorage.getItem("rfq_draft_id");
  return fromStorage || null;
}

export async function getOrCreateDraft(): Promise<string> {
  const existing = getDraftIdFromBrowser();
  if (existing) return existing;

  const { data, error } = await supabase
    .from("rfq_drafts")
    .insert({})
    .select()
    .single();

  if (error) {
    console.error("Draft creation failed", error);
    throw new Error("Draft creation failed");
  }

  const draftId = data.id;

  if (typeof window !== "undefined") {
    localStorage.setItem("rfq_draft_id", draftId);

    const url = new URL(window.location.href);
    url.searchParams.set("draft", draftId);
    window.history.replaceState({}, "", url.toString());
  }

  return draftId;
}
