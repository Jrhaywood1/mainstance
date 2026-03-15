import { subDays, addDays, addHours } from "date-fns";
import {
  type AISettings,
  type Category,
  type Membership,
  type Organization,
  type OrgSettings,
  type RequestRecord,
  type Site,
  type WorkOrder,
  type WorkOrderComment,
  type WorkOrderStatusHistory
} from "@/lib/types";

const orgId = "11111111-1111-1111-1111-111111111111";
const siteId = "22222222-2222-2222-2222-222222222222";

export const demoOrganization: Organization = {
  id: orgId,
  name: "Northstar Distribution",
  slug: "northstar-distribution",
  created_at: subDays(new Date(), 60).toISOString()
};

export const demoSite: Site = {
  id: siteId,
  organization_id: orgId,
  name: "Seattle Fulfillment Center",
  address: "450 Harbor Industrial Way, Seattle, WA 98108",
  active: true,
  created_at: subDays(new Date(), 60).toISOString()
};

export const demoMemberships: Array<Membership & { full_name: string; email: string }> = [
  {
    id: "33333333-3333-3333-3333-333333333331",
    organization_id: orgId,
    user_id: "44444444-4444-4444-4444-444444444441",
    role: "requester",
    created_at: subDays(new Date(), 45).toISOString(),
    full_name: "Alicia Gomez",
    email: "requester@mainstance.demo"
  },
  {
    id: "33333333-3333-3333-3333-333333333332",
    organization_id: orgId,
    user_id: "44444444-4444-4444-4444-444444444442",
    role: "technician",
    created_at: subDays(new Date(), 45).toISOString(),
    full_name: "Marcus Reed",
    email: "tech@mainstance.demo"
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    organization_id: orgId,
    user_id: "44444444-4444-4444-4444-444444444443",
    role: "manager",
    created_at: subDays(new Date(), 45).toISOString(),
    full_name: "Dana Brooks",
    email: "manager@mainstance.demo"
  },
  {
    id: "33333333-3333-3333-3333-333333333334",
    organization_id: orgId,
    user_id: "44444444-4444-4444-4444-444444444444",
    role: "admin",
    created_at: subDays(new Date(), 45).toISOString(),
    full_name: "Priya Shah",
    email: "admin@mainstance.demo"
  }
];

export const demoCategories: Category[] = [
  "Electrical",
  "Plumbing",
  "Facilities",
  "IT",
  "General Maintenance"
].map((name, index) => ({
  id: `55555555-5555-5555-5555-55555555555${index + 1}`,
  organization_id: orgId,
  name,
  active: true,
  created_at: subDays(new Date(), 45).toISOString()
}));

const requestSeed = [
  ["Dock door sensor fault", "Dock 3 safety sensor is intermittently failing and stopping trailer loads.", "Electrical", "High", "A", "1", "Dock 3", "", "Triggers on close."],
  ["Break room sink leak", "Hot water line under the west break room sink is dripping onto the cabinet floor.", "Plumbing", "Medium", "B", "1", "Break Room West", "", "Leak worsens during peak use."],
  ["Wi-Fi dead zone in mezzanine", "Handheld scanners lose connection on the north mezzanine picking lanes.", "IT", "High", "C", "2", "Mezzanine", "North", "Affects morning wave."],
  ["Overhead light out in aisle 14", "Three fixtures are out in aisle 14 causing poor visibility for forklift traffic.", "Facilities", "Medium", "A", "1", "Aisle 14", "", "Night shift flagged it twice."],
  ["HVAC cooling issue", "Pack station area remains above setpoint after noon every day.", "Facilities", "Urgent", "A", "2", "Pack Station", "", "Temp hit 82F yesterday."],
  ["Forklift charger trip", "Charger 2 trips breaker after 5 minutes of charging.", "Electrical", "High", "D", "1", "Charging Bay", "", "Unit tagged out."],
  ["Paint peeling in receiving office", "Moisture damage showing on south wall paint near receiving office.", "General Maintenance", "Low", "B", "1", "Receiving Office", "", "Cosmetic but spreading."],
  ["Badge reader offline", "Rear employee entrance badge reader is offline since 6am.", "IT", "Urgent", "A", "1", "Rear Entrance", "", "Security is manually checking in staff."],
  ["Restroom exhaust noise", "Loud rattling from fan in first-floor men's restroom.", "Facilities", "Medium", "B", "1", "Men's Restroom", "", "Noise present all day."],
  ["Compressed air hose damage", "Visible split in hose at packing line 6 quick connect.", "General Maintenance", "High", "C", "1", "Packing Line 6", "", "Potential safety issue."],
  ["Low pressure at mop sink", "Custodial mop sink pressure is weak on second floor.", "Plumbing", "Low", "B", "2", "Janitor Closet", "", "No blockage found by staff."],
  ["Exterior security camera blur", "Camera 7 has persistent blur and glare at night.", "IT", "Medium", "Exterior", "1", "Lot South Pole 7", "", "Need clear footage for trucks."]
];

export const demoRequests: RequestRecord[] = requestSeed.map((item, index) => {
  const category = demoCategories.find((entry) => entry.name === item[2])!;
  return {
    id: `66666666-6666-6666-6666-66666666666${index + 1}`,
    organization_id: orgId,
    requester_user_id: demoMemberships[0].user_id,
    site_id: siteId,
    title: item[0],
    description: item[1],
    category_id: category.id,
    priority: item[3] as RequestRecord["priority"],
    building: item[4],
    floor: item[5],
    room: item[6],
    hallway: item[7] || null,
    location_notes: item[8],
    created_at: subDays(new Date(), 14 - index).toISOString()
  };
});

const statuses: WorkOrder["status"][] = [
  "New",
  "Claimed",
  "In Progress",
  "Waiting",
  "Scheduled",
  "Completed",
  "Manager Review",
  "Closed",
  "Reopened",
  "New",
  "In Progress",
  "Scheduled"
];

export const demoWorkOrders = demoRequests.map((request, index): WorkOrder => {
  const status = statuses[index];
  const createdAt = subDays(new Date(), 14 - index).toISOString();
  const dueAt = addDays(new Date(createdAt), index % 2 === 0 ? 3 : 6).toISOString();
  const completedAt = ["Completed", "Manager Review", "Closed"].includes(status)
    ? addDays(new Date(createdAt), 2).toISOString()
    : null;
  const closedAt = status === "Closed" ? addDays(new Date(createdAt), 3).toISOString() : null;

  const labor = (index + 1) * 42;
  const material = (index % 4) * 18.5;

  return {
    id: `77777777-7777-7777-7777-77777777777${index + 1}`,
    organization_id: orgId,
    request_id: request.id,
    site_id: siteId,
    assigned_user_id: status === "New" ? null : demoMemberships[1].user_id,
    claimed_by_user_id: ["Claimed", "In Progress", "Waiting", "Completed", "Manager Review", "Reopened"].includes(status)
      ? demoMemberships[1].user_id
      : null,
    title: request.title,
    description: request.description,
    category_id: request.category_id,
    priority: request.priority,
    status,
    due_at: dueAt,
    scheduled_for: ["Scheduled", "In Progress"].includes(status) ? addHours(new Date(), index + 2).toISOString() : null,
    completed_at: completedAt,
    closed_at: closedAt,
    building: request.building,
    floor: request.floor,
    room: request.room,
    hallway: request.hallway,
    location_notes: request.location_notes,
    labor_cost_total: labor,
    material_cost_total: material,
    total_cost: labor + material,
    completion_summary: completedAt ? "Issue diagnosed, repair completed, and area returned to service." : null,
    created_at: createdAt,
    updated_at: addDays(new Date(createdAt), 1).toISOString()
  };
});

export const demoStatusHistory: WorkOrderStatusHistory[] = demoWorkOrders.flatMap((workOrder, index) => [
  {
    id: `88888888-8888-8888-8888-8888888888${index}1`,
    work_order_id: workOrder.id,
    from_status: null,
    to_status: "New",
    changed_by_user_id: demoMemberships[0].user_id,
    changed_at: workOrder.created_at
  },
  {
    id: `88888888-8888-8888-8888-8888888888${index}2`,
    work_order_id: workOrder.id,
    from_status: "New",
    to_status: workOrder.status,
    changed_by_user_id: demoMemberships[2].user_id,
    changed_at: workOrder.updated_at
  }
]);

export const demoComments: WorkOrderComment[] = demoWorkOrders.slice(0, 5).map((workOrder, index) => ({
  id: `99999999-9999-9999-9999-99999999999${index + 1}`,
  work_order_id: workOrder.id,
  user_id: demoMemberships[index % 2 === 0 ? 2 : 1].user_id,
  body: index % 2 === 0 ? "Reviewed priority and moved into active queue." : "Initial site walkthrough complete; waiting on parts confirmation.",
  created_at: addDays(new Date(workOrder.created_at), 1).toISOString()
}));

export const demoAISettings: AISettings = {
  id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  organization_id: orgId,
  enabled: true,
  auto_categorize: true,
  summarize_history: true,
  weekly_digest: false,
  created_at: subDays(new Date(), 30).toISOString(),
  updated_at: subDays(new Date(), 1).toISOString()
};

export const demoOrgSettings: OrgSettings = {
  id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  organization_id: orgId,
  allow_magic_link: true,
  allow_email_password: true,
  created_at: subDays(new Date(), 30).toISOString(),
  updated_at: subDays(new Date(), 1).toISOString()
};
