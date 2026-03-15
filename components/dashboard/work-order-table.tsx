import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusChip } from "@/components/status-chip";
import { formatCurrency, formatDate } from "@/lib/utils";
import { type WorkOrderWithRelations } from "@/lib/types";

export function WorkOrderTable({
  title,
  items
}: {
  title: string;
  items: Array<WorkOrderWithRelations & { urgency_state?: string }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-muted-foreground">
            <tr>
              <th className="pb-3 font-medium">Work order</th>
              <th className="pb-3 font-medium">Site</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Assigned</th>
              <th className="pb-3 font-medium">Due</th>
              <th className="pb-3 font-medium">Cost</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border/70">
                <td className="py-4">
                  <Link href={`/work-orders/${item.id}`} className="font-medium hover:text-primary">
                    {item.title}
                  </Link>
                  <div className="text-xs text-muted-foreground">{item.category?.name}</div>
                </td>
                <td className="py-4 text-muted-foreground">{item.site?.name}</td>
                <td className="py-4">
                  <StatusChip status={item.status} />
                </td>
                <td className="py-4 text-muted-foreground">{item.assigned_user_name ?? "Unassigned"}</td>
                <td className="py-4 text-muted-foreground">{formatDate(item.due_at)}</td>
                <td className="py-4 text-muted-foreground">{formatCurrency(item.total_cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
