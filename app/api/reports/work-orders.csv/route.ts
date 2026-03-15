import { NextResponse } from "next/server";
import { getAppContext } from "@/lib/app-context";
import { buildWorkOrdersCsv } from "@/lib/reporting";

export async function GET() {
  const { workOrders, categories } = await getAppContext();
  const csv = buildWorkOrdersCsv(workOrders, categories);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="mainstance-work-orders.csv"'
    }
  });
}
