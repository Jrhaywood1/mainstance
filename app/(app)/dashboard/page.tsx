import { MetricCard } from "@/components/dashboard/metric-card";
import { WorkOrderTable } from "@/components/dashboard/work-order-table";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppContext } from "@/lib/app-context";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const { workOrders, currentUser } = await getAppContext();

  const openJobs = workOrders.filter((item) => item.status !== "Closed");
  const overdueJobs = workOrders.filter((item) => item.urgency_state === "overdue");
  const atRiskJobs = workOrders.filter((item) => item.urgency_state === "risk");
  const pendingReview = workOrders.filter((item) => item.status === "Manager Review");
  const unassigned = workOrders.filter((item) => item.status === "New" && !item.assigned_user_id);
  const scheduledJobs = workOrders.filter((item) => item.status === "Scheduled");
  const closedJobs = workOrders.filter((item) => item.status === "Closed");
  const averageCompletionHours =
    closedJobs.reduce((sum, item) => {
      if (!item.completed_at) return sum;
      return sum + (new Date(item.completed_at).getTime() - new Date(item.created_at).getTime()) / 36e5;
    }, 0) / Math.max(closedJobs.length, 1);

  const isManager = currentUser.role === "manager" || currentUser.role === "admin";

  return (
    <div>
      <PageHeader
        eyebrow="Operations Overview"
        title="Dashboard"
        description="Active work, due-date risk, and operational cost at a glance."
      />

      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Open jobs" value={String(openJobs.length)} helper="Active work orders." />
        <MetricCard title="Overdue" value={String(overdueJobs.length)} helper="Past due date." />
        {isManager ? (
          <>
            <MetricCard title="Pending review" value={String(pendingReview.length)} helper="Awaiting manager approval." />
            <MetricCard title="Unassigned" value={String(unassigned.length)} helper="New, not yet claimed or assigned." />
          </>
        ) : (
          <>
            <MetricCard title="At risk" value={String(atRiskJobs.length)} helper="Due in the next 48 hours." />
            <MetricCard
              title="Total cost"
              value={formatCurrency(workOrders.reduce((sum, item) => sum + item.total_cost, 0))}
              helper="Labor and materials combined."
            />
          </>
        )}
      </div>

      {isManager && (
        <div className="mt-4 grid gap-4 grid-cols-2 xl:grid-cols-4">
          <MetricCard title="At risk" value={String(atRiskJobs.length)} helper="Due in the next 48 hours." />
          <MetricCard title="Scheduled" value={String(scheduledJobs.length)} helper="Scheduled for future work." />
          <MetricCard
            title="Avg close time"
            value={`${averageCompletionHours.toFixed(1)} hrs`}
            helper="Average time from creation to completion."
          />
          <MetricCard
            title="Total cost"
            value={formatCurrency(workOrders.reduce((sum, item) => sum + item.total_cost, 0))}
            helper="Labor and materials combined."
          />
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {isManager && pendingReview.length > 0 ? (
          <WorkOrderTable title="Pending manager review" items={pendingReview} />
        ) : (
          <WorkOrderTable title="Active work orders" items={openJobs.slice(0, 8)} />
        )}

        <div className="space-y-6">
          {isManager && overdueJobs.length > 0 && (
            <WorkOrderTable title="Overdue" items={overdueJobs} />
          )}
          {isManager && unassigned.length > 0 && (
            <WorkOrderTable title="Unassigned" items={unassigned} />
          )}
          {!isManager && (
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Scheduled</span>
                  <span className="font-medium text-foreground">{scheduledJobs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Closed</span>
                  <span className="font-medium text-foreground">{closedJobs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Avg close time</span>
                  <span className="font-medium text-foreground">{averageCompletionHours.toFixed(1)} hrs</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
