import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusChip } from "@/components/status-chip";
import { WorkOrderActions } from "@/components/work-orders/work-order-actions";
import { getAppContext } from "@/lib/app-context";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function WorkOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { workOrders, comments, statusHistory, currentUser, memberships } = await getAppContext();
  const workOrder = workOrders.find((item) => item.id === id);

  if (!workOrder) notFound();

  const resolveUserName = (userId: string) =>
    memberships.find((m) => m.user_id === userId)?.full_name ?? "Unknown";

  return (
    <div>
      <PageHeader
        eyebrow="Work Order Detail"
        title={workOrder.title}
        description={workOrder.description}
        badge={workOrder.site?.name}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Details</CardTitle>
              <StatusChip status={workOrder.status} />
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Priority</div>
                <div className="mt-2">{workOrder.priority}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Assigned</div>
                <div className="mt-2">{workOrder.assigned_user_name ?? "Unassigned"}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Due</div>
                <div className="mt-2">{formatDateTime(workOrder.due_at)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Scheduled</div>
                <div className="mt-2">{formatDateTime(workOrder.scheduled_for)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Location</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {[
                    workOrder.building && `Bldg ${workOrder.building}`,
                    workOrder.floor && `Fl ${workOrder.floor}`,
                    workOrder.room
                  ]
                    .filter(Boolean)
                    .join(", ") || "-"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total cost</div>
                <div className="mt-2">{formatCurrency(workOrder.total_cost)}</div>
              </div>
              {workOrder.completion_summary && (
                <div className="col-span-2 rounded-lg border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
                  {workOrder.completion_summary}
                </div>
              )}
            </CardContent>
          </Card>

          <WorkOrderActions workOrder={workOrder} userRole={currentUser.role} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status history</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statusHistory
                .filter((entry) => entry.work_order_id === workOrder.id)
                .map((entry) => (
                  <div key={entry.id} className="rounded-lg border border-border/70 bg-background/60 p-4">
                    <div className="font-medium">
                      {entry.from_status ?? "Created"} {" \u2192 "} {entry.to_status}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {resolveUserName(entry.changed_by_user_id)} &middot; {formatDateTime(entry.changed_at)}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments
                .filter((comment) => comment.work_order_id === workOrder.id)
                .map((comment) => (
                  <div key={comment.id} className="rounded-lg border border-border/70 bg-background/60 p-4">
                    <div className="text-sm">{comment.body}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {resolveUserName(comment.user_id)} &middot; {formatDateTime(comment.created_at)}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
