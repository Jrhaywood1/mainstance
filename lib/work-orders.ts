import { addDays, isAfter, isBefore } from "date-fns";
import { type LaborEntry, type MaterialEntry, type WorkOrder, type WorkOrderStatus } from "@/lib/types";

export const allowedTransitions: Record<WorkOrderStatus, WorkOrderStatus[]> = {
  New: ["Claimed", "Scheduled", "Waiting"],
  Claimed: ["In Progress", "Waiting", "Scheduled"],
  "In Progress": ["Waiting", "Completed", "Scheduled"],
  Waiting: ["In Progress", "Scheduled", "Completed"],
  Scheduled: ["Claimed", "In Progress", "Waiting"],
  Completed: ["Manager Review"],
  "Manager Review": ["Closed", "Reopened"],
  Closed: [],
  Reopened: ["Claimed", "In Progress", "Waiting", "Scheduled"]
};

export function canTransitionStatus(from: WorkOrderStatus, to: WorkOrderStatus) {
  return allowedTransitions[from].includes(to);
}

export function getNextStatuses(from: WorkOrderStatus): WorkOrderStatus[] {
  return allowedTransitions[from];
}

export function computeLaborCost(entries: LaborEntry[]) {
  return entries.reduce((sum, entry) => sum + entry.total_cost, 0);
}

export function computeMaterialCost(entries: MaterialEntry[]) {
  return entries.reduce((sum, entry) => sum + entry.total_cost, 0);
}

export function computeTotalCost(laborEntries: LaborEntry[], materialEntries: MaterialEntry[]) {
  return computeLaborCost(laborEntries) + computeMaterialCost(materialEntries);
}

export function deriveUpcomingState(workOrder: WorkOrder) {
  const now = new Date();
  const dueAt = workOrder.due_at ? new Date(workOrder.due_at) : null;

  if (!dueAt || workOrder.status === "Closed") {
    return "none" as const;
  }

  if (isBefore(dueAt, now)) {
    return "overdue" as const;
  }

  if (isBefore(dueAt, addDays(now, 2))) {
    return "risk" as const;
  }

  if (isAfter(dueAt, now)) {
    return "upcoming" as const;
  }

  return "none" as const;
}

export function applyStatusSideEffects(
  current: WorkOrder,
  nextStatus: WorkOrderStatus
): Partial<WorkOrder> {
  const now = new Date().toISOString();

  switch (nextStatus) {
    case "Completed":
      return {
        status: nextStatus,
        completed_at: now,
        updated_at: now
      };
    case "Closed":
      return {
        status: nextStatus,
        closed_at: now,
        updated_at: now
      };
    case "Reopened":
      return {
        status: nextStatus,
        closed_at: null,
        updated_at: now
      };
    default:
      return {
        status: nextStatus,
        updated_at: now
      };
  }
}
