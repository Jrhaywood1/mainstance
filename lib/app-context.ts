import {
  demoAISettings,
  demoCategories,
  demoComments,
  demoMemberships,
  demoOrganization,
  demoOrgSettings,
  demoRequests,
  demoSite,
  demoStatusHistory,
  demoWorkOrders
} from "@/lib/demo-data";
import { deriveUpcomingState } from "@/lib/work-orders";
import { canViewAllWorkOrders } from "@/lib/permissions";

export async function getAppContext() {
  const currentUser = demoMemberships[2];

  const allWorkOrders = demoWorkOrders.map((workOrder) => ({
    ...workOrder,
    site: demoSite,
    category: demoCategories.find((category) => category.id === workOrder.category_id),
    assigned_user_name: demoMemberships.find((user) => user.user_id === workOrder.assigned_user_id)?.full_name ?? null,
    claimed_by_name: demoMemberships.find((user) => user.user_id === workOrder.claimed_by_user_id)?.full_name ?? null,
    requester_name: demoMemberships[0].full_name,
    urgency_state: deriveUpcomingState(workOrder)
  }));

  const isRequester = currentUser.role === "requester";

  const requests = isRequester
    ? demoRequests.filter((r) => r.requester_user_id === currentUser.user_id)
    : demoRequests;

  const workOrders = canViewAllWorkOrders(currentUser.role)
    ? allWorkOrders
    : currentUser.role === "technician"
      ? allWorkOrders.filter(
          (wo) =>
            wo.claimed_by_user_id === currentUser.user_id ||
            wo.assigned_user_id === currentUser.user_id ||
            wo.status === "New"
        )
      : allWorkOrders.filter((wo) => {
          const linkedRequest = demoRequests.find((r) => r.id === wo.request_id);
          return linkedRequest?.requester_user_id === currentUser.user_id;
        });

  return {
    organization: demoOrganization,
    currentUser,
    site: demoSite,
    memberships: demoMemberships,
    categories: demoCategories,
    requests,
    workOrders,
    statusHistory: demoStatusHistory,
    comments: demoComments,
    aiSettings: demoAISettings,
    orgSettings: demoOrgSettings
  };
}
