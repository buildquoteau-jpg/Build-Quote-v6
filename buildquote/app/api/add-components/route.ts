import { NextResponse } from "next/server";

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

    // TEMP: log incoming data so we can verify flow
    console.log("RFQ draft import:", draft_id, items.length);

    return NextResponse.json({
      success: true,
      received: items.length,
    });

  } catch (err) {
    console.error("Import error", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
