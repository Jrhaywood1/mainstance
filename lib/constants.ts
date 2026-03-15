export const roles = ["requester", "technician", "manager", "admin"] as const;

export const workOrderStatuses = [
  "New",
  "Claimed",
  "In Progress",
  "Waiting",
  "Scheduled",
  "Completed",
  "Manager Review",
  "Closed",
  "Reopened"
] as const;

export const requestPriorities = ["Low", "Medium", "High", "Urgent"] as const;

export const managerVisibleStatuses = new Set(workOrderStatuses);

export const technicianActiveStatuses = new Set([
  "Claimed",
  "In Progress",
  "Waiting",
  "Scheduled",
  "Completed",
  "Reopened"
]);

export const openStatuses = new Set([
  "New",
  "Claimed",
  "In Progress",
  "Waiting",
  "Scheduled",
  "Completed",
  "Manager Review",
  "Reopened"
]);
