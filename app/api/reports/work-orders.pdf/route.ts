import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      message: "PDF export is intentionally stubbed for the first scaffold. Use the payload builder service to plug in a renderer next."
    },
    { status: 501 }
  );
}
