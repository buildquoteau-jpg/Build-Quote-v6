import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { draftId, items } = await req.json();

    if (!draftId || !Array.isArray(items)) {
      return NextResponse.json({ error: "Missing draftId or items" }, { status: 400 });
    }

    // If empty items array, just clear the draft
    if (items.length === 0) {
      await supabase.from("rfq_draft_items").delete().eq("draft_id", draftId);
      return NextResponse.json({ success: true });
    }

    const rows = items.map((item: any) => ({
      draft_id: draftId,
      name: item.name || '',
      sku: item.sku || '',
      description: item.desc || '',
      uom: item.uom || '',
      qty: item.qty || '',
    }));

    const { error } = await supabase
      .from("rfq_draft_items")
      .insert(rows);

    if (error) {
      console.error("Save draft items error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Save draft items error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
