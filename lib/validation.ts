import { z } from "zod";
import { requestPriorities, roles, workOrderStatuses } from "@/lib/constants";

export const requestPrioritySchema = z.enum(requestPriorities);
export const workOrderStatusSchema = z.enum(workOrderStatuses);
export const roleSchema = z.enum(roles);

export const requestFormSchema = z.object({
  title: z.string().min(3).max(160),
  description: z.string().min(10).max(4000),
  category_id: z.string().uuid(),
  priority: requestPrioritySchema,
  site_id: z.string().uuid(),
  building: z.string().max(120).optional().or(z.literal("")),
  floor: z.string().max(120).optional().or(z.literal("")),
  room: z.string().max(120).optional().or(z.literal("")),
  hallway: z.string().max(120).optional().or(z.literal("")),
  location_notes: z.string().max(500).optional().or(z.literal(""))
});

export const claimWorkOrderSchema = z.object({
  work_order_id: z.string().uuid()
});

export const managerAssignmentSchema = z.object({
  assigned_user_id: z.string().uuid().nullable(),
  due_at: z.string().datetime().nullable().optional(),
  scheduled_for: z.string().datetime().nullable().optional(),
  status: workOrderStatusSchema.optional()
});

export const technicianUpdateSchema = z.object({
  status: workOrderStatusSchema,
  note: z.string().max(1000).optional(),
  completion_summary: z.string().max(2000).optional(),
  labor_hours: z.number().min(0).max(24).optional(),
  hourly_rate: z.number().min(0).max(10000).nullable().optional(),
  material_name: z.string().max(120).optional(),
  material_quantity: z.number().min(0).max(10000).optional(),
  material_unit_cost: z.number().min(0).max(100000).optional(),
  material_notes: z.string().max(1000).optional()
});

export const commentSchema = z.object({
  body: z.string().min(1).max(1000)
});

export const aiSettingsSchema = z.object({
  enabled: z.boolean(),
  auto_categorize: z.boolean(),
  summarize_history: z.boolean(),
  weekly_digest: z.boolean()
});

export const orgSettingsSchema = z.object({
  allow_magic_link: z.boolean(),
  allow_email_password: z.boolean()
});
