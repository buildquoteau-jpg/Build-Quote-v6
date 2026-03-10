import { supabase } from "@/lib/supabase";

export async function getOrCreateDraft(): Promise<string> {

  if (typeof window !== "undefined") {
    const existing = localStorage.getItem("rfq_draft_id");
    if (existing) {
      return existing;
    }
  }

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
  }

  return draftId;
}
