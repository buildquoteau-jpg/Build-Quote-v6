import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { draft_id, items } = body;

    if (!draft_id || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const rows = items.map((item: any) => ({
      draft_id: draft_id,
      component_id: item.component_id ?? null,
      manufacturer: item.manufacturer ?? null,
      system: item.system ?? null,
      sku: item.sku ?? null,
      name: item.name ?? null,
      description: item.description ?? null,
      uom: item.uom ?? null,
      qty: item.qty ?? null
    }));

    const { error } = await supabase
      .from("rfq_draft_items")
      .insert(rows);

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      inserted: rows.length
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
