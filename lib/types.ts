import { requestPriorities, roles, workOrderStatuses } from "@/lib/constants";

export type Role = (typeof roles)[number];
export type WorkOrderStatus = (typeof workOrderStatuses)[number];
export type RequestPriority = (typeof requestPriorities)[number];

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Site {
  id: string;
  organization_id: string;
  name: string;
  address: string;
  active: boolean;
  created_at: string;
}

export interface Membership {
  id: string;
  organization_id: string;
  user_id: string;
  role: Role;
  created_at: string;
}

export interface Category {
  id: string;
  organization_id: string;
  name: string;
  active: boolean;
  created_at: string;
}

export interface RequestRecord {
  id: string;
  organization_id: string;
  requester_user_id: string;
  site_id: string;
  title: string;
  description: string;
  category_id: string;
  priority: RequestPriority;
  building: string | null;
  floor: string | null;
  room: string | null;
  hallway: string | null;
  location_notes: string | null;
  created_at: string;
}

export interface WorkOrder {
  id: string;
  organization_id: string;
  request_id: string;
  site_id: string;
  assigned_user_id: string | null;
  claimed_by_user_id: string | null;
  title: string;
  description: string;
  category_id: string;
  priority: RequestPriority;
  status: WorkOrderStatus;
  due_at: string | null;
  scheduled_for: string | null;
  completed_at: string | null;
  closed_at: string | null;
  building: string | null;
  floor: string | null;
  room: string | null;
  hallway: string | null;
  location_notes: string | null;
  labor_cost_total: number;
  material_cost_total: number;
  total_cost: number;
  completion_summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkOrderStatusHistory {
  id: string;
  work_order_id: string;
  from_status: WorkOrderStatus | null;
  to_status: WorkOrderStatus;
  changed_by_user_id: string;
  changed_at: string;
}

export interface LaborEntry {
  id: string;
  work_order_id: string;
  user_id: string;
  hours: number;
  hourly_rate: number | null;
  total_cost: number;
  notes: string | null;
  created_at: string;
}

export interface MaterialEntry {
  id: string;
  work_order_id: string;
  name: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  notes: string | null;
  created_at: string;
}

export interface WorkOrderComment {
  id: string;
  work_order_id: string;
  user_id: string;
  body: string;
  created_at: string;
}

export interface Attachment {
  id: string;
  organization_id: string;
  work_order_id: string | null;
  request_id: string | null;
  uploaded_by_user_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  created_at: string;
}

export interface AISettings {
  id: string;
  organization_id: string;
  enabled: boolean;
  auto_categorize: boolean;
  summarize_history: boolean;
  weekly_digest: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrgSettings {
  id: string;
  organization_id: string;
  allow_magic_link: boolean;
  allow_email_password: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkOrderWithRelations extends WorkOrder {
  site?: Site;
  category?: Category;
  assigned_user_name?: string | null;
  claimed_by_name?: string | null;
  requester_name?: string | null;
}
