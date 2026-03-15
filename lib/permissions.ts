import { type Role, type WorkOrderStatus } from "@/lib/types";

export function canViewAllWorkOrders(role: Role) {
  return role === "manager" || role === "admin";
}

export function canViewWorkOrderPool(role: Role) {
  return role === "technician" || role === "manager" || role === "admin";
}

export function canClaimFromPool(role: Role) {
  return role === "technician";
}

export function canReviewAndClose(role: Role) {
  return role === "manager" || role === "admin";
}

export function canSubmitCompletion(status: WorkOrderStatus, role: Role) {
  return role === "technician" && ["In Progress", "Waiting", "Scheduled", "Reopened"].includes(status);
}

export function canAccessSettings(role: Role) {
  return role === "admin";
}

export function canAccessReports(role: Role) {
  return role === "manager" || role === "admin";
}

export function canAssignTechnician(role: Role) {
  return role === "manager" || role === "admin";
}
