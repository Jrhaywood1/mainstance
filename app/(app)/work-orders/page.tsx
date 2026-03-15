import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusChip } from "@/components/status-chip";
import { Button } from "@/components/ui/button";
import { getAppContext } from "@/lib/app-context";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function WorkOrdersPage() {
  const { workOrders } = await getAppContext();

  return (
    <div>
      <PageHeader
        eyebrow="Execution"
        title="Work orders"
        description="All work orders across the organization. Claim from the pool, assign technicians, and track progress."
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All work orders</CardTitle>
          <Link href="/api/reports/work-orders.csv">
            <Button variant="outline">Export CSV</Button>
          </Link>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="pb-3 font-medium">Work order</th>
                <th className="pb-3 font-medium">Priority</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Assigned</th>
                <th className="pb-3 font-medium">Due</th>
                <th className="pb-3 font-medium">Cost</th>
                <th className="pb-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {workOrders.map((workOrder) => (
                <tr key={workOrder.id} className="border-t border-border/70">
                  <td className="py-4">
                    <div className="font-medium">{workOrder.title}</div>
                    <div className="text-xs text-muted-foreground">{workOrder.site?.name}</div>
                  </td>
                  <td className="py-4 text-muted-foreground">{workOrder.priority}</td>
                  <td className="py-4">
                    <StatusChip status={workOrder.status} />
                  </td>
                  <td className="py-4 text-muted-foreground">{workOrder.assigned_user_name ?? "Unassigned"}</td>
                  <td className="py-4 text-muted-foreground">{formatDate(workOrder.due_at)}</td>
                  <td className="py-4 text-muted-foreground">{formatCurrency(workOrder.total_cost)}</td>
                  <td className="py-4">
                    <Link href={`/work-orders/${workOrder.id}`}>
                      <Button variant="ghost" size="sm">
                        Open
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
