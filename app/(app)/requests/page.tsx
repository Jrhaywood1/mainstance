import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusChip } from "@/components/status-chip";
import { Button } from "@/components/ui/button";
import { getAppContext } from "@/lib/app-context";
import { formatDateTime } from "@/lib/utils";

export default async function RequestsPage() {
  const { requests, workOrders, categories } = await getAppContext();

  return (
    <div>
      <PageHeader
        eyebrow="Request Intake"
        title="Requests"
        description="Your submitted work requests. Each request automatically creates a work order for the maintenance team."
      />

      <div className="mb-6">
        <Link href="/requests/new">
          <Button>New request</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent requests</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Priority</th>
                <th className="pb-3 font-medium">Work order</th>
                <th className="pb-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const workOrder = workOrders.find((item) => item.request_id === request.id);

                return (
                  <tr key={request.id} className="border-t border-border/70">
                    <td className="py-4 font-medium">{request.title}</td>
                    <td className="py-4 text-muted-foreground">
                      {categories.find((item) => item.id === request.category_id)?.name}
                    </td>
                    <td className="py-4 text-muted-foreground">{request.priority}</td>
                    <td className="py-4">{workOrder ? <StatusChip status={workOrder.status} /> : "-"}</td>
                    <td className="py-4 text-muted-foreground">{formatDateTime(request.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
