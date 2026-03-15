import { type Category, type WorkOrderWithRelations } from "@/lib/types";

function escapeCsv(value: string | number | null | undefined) {
  const normalized = value == null ? "" : String(value);
  return `"${normalized.replaceAll('"', '""')}"`;
}

export function buildWorkOrdersCsv(workOrders: WorkOrderWithRelations[], categories: Category[]) {
  const headers = [
    "id",
    "title",
    "status",
    "priority",
    "category",
    "site",
    "assigned_to",
    "claimed_by",
    "due_at",
    "scheduled_for",
    "labor_cost_total",
    "material_cost_total",
    "total_cost"
  ];

  const rows = workOrders.map((workOrder) => [
    workOrder.id,
    workOrder.title,
    workOrder.status,
    workOrder.priority,
    workOrder.category?.name ?? categories.find((item) => item.id === workOrder.category_id)?.name ?? "",
    workOrder.site?.name ?? "",
    workOrder.assigned_user_name ?? "",
    workOrder.claimed_by_name ?? "",
    workOrder.due_at ?? "",
    workOrder.scheduled_for ?? "",
    workOrder.labor_cost_total,
    workOrder.material_cost_total,
    workOrder.total_cost
  ]);

  return [headers, ...rows].map((row) => row.map((cell) => escapeCsv(cell)).join(",")).join("\n");
}

