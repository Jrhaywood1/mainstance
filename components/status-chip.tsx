import { Badge } from "@/components/ui/badge";
import { type WorkOrderStatus } from "@/lib/types";

const statusToVariant: Record<WorkOrderStatus, "default" | "success" | "warning" | "destructive" | "info"> = {
  New: "default",
  Claimed: "info",
  "In Progress": "info",
  Waiting: "warning",
  Scheduled: "info",
  Completed: "success",
  "Manager Review": "warning",
  Closed: "success",
  Reopened: "destructive"
};

export function StatusChip({ status }: { status: WorkOrderStatus }) {
  return <Badge variant={statusToVariant[status]}>{status}</Badge>;
}
