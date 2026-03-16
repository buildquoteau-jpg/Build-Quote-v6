import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function normaliseQty(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim();
  if (!raw) return null;

  const cleaned = raw.replace(/,/g, '');
  const num = Number(cleaned);

  return Number.isFinite(num) ? num : null;
}

export async function POST(req: Request) {
  try {
    const { draftId, items } = await req.json();

    if (!draftId || !Array.isArray(items)) {
      return NextResponse.json({ error: "Missing draftId or items" }, { status: 400 });
    }

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
      qty: normaliseQty(item.qty),
    }));

    const { error } = await supabase
      .from("rfq_draft_items")
      .insert(rows);

    if (error) {
      console.error("Save draft items error:", error);
      return NextResponse.json(
        {
          error: "We couldn’t save those parsed items. Please review the list and try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Save draft items error:", err);
    return NextResponse.json(
      {
        error: "We couldn’t save those parsed items. Please try a cleaner file or enter items manually.",
      },
      { status: 500 }
    );
  }
}
