import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAppContext } from "@/lib/app-context";
import { buildWorkOrdersCsv } from "@/lib/reporting";

export default async function ReportsPage() {
  const { workOrders, categories } = await getAppContext();
  const csvPreview = buildWorkOrdersCsv(workOrders.slice(0, 3), categories);

  return (
    <div>
      <PageHeader
        eyebrow="Reporting"
        title="Reports and exports"
        description="Export work order data for analysis or compliance. PDF summary export coming soon."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>CSV export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download all work orders with status, assignment, cost, and location data.
            </p>
            <Link href="/api/reports/work-orders.csv">
              <Button>Download work orders CSV</Button>
            </Link>
            <pre className="overflow-x-auto rounded-lg border border-border/70 bg-background/60 p-4 text-xs text-muted-foreground">
              {csvPreview}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PDF export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Generate a formatted summary PDF for individual work orders or batch exports. Coming soon.
            </p>
            <Link href="/api/reports/work-orders.pdf">
              <Button variant="outline">Generate summary PDF</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
