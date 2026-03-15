"use client";

import { useState } from "react";
import { technicianUpdateSchema } from "@/lib/validation";
import { getNextStatuses } from "@/lib/work-orders";
import { canClaimFromPool, canReviewAndClose, canSubmitCompletion } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Role, type WorkOrderWithRelations } from "@/lib/types";

export function WorkOrderActions({
  workOrder,
  userRole
}: {
  workOrder: WorkOrderWithRelations;
  userRole: Role;
}) {
  const validStatuses = getNextStatuses(workOrder.status);
  const [status, setStatus] = useState(workOrder.status);

  const showTechSection = userRole === "technician";
  const showManagerSection = canReviewAndClose(userRole);

  if (!showTechSection && !showManagerSection) return null;

  return (
    <div className="space-y-6">
      {showTechSection && (
        <section className="rounded-xl border border-border bg-card p-4 shadow-panel sm:p-6">
          <h2 className="text-lg font-semibold">Update work order</h2>
          <form className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(event) => {
                  const parsed = technicianUpdateSchema.shape.status.safeParse(event.target.value);
                  if (parsed.success) setStatus(parsed.data);
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value={workOrder.status}>{workOrder.status} (current)</option>
                {validStatuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Progress note</Label>
              <Textarea id="note" placeholder="What changed on site?" />
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="labor_hours">Labor hours</Label>
                <Input id="labor_hours" type="number" min="0" step="0.25" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourly_rate">Hourly rate</Label>
                <Input id="hourly_rate" type="number" min="0" step="0.01" />
              </div>
            </div>
            <div className="grid gap-4 grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <Label htmlFor="material_name">Material</Label>
                <Input id="material_name" placeholder="Replacement sensor" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material_quantity">Qty</Label>
                <Input id="material_quantity" type="number" min="0" step="1" className="w-20" />
              </div>
            </div>
            {canSubmitCompletion(workOrder.status, userRole) && (
              <div className="space-y-2">
                <Label htmlFor="completion_summary">Completion summary</Label>
                <Textarea id="completion_summary" placeholder="Describe the completed repair and any follow-up." />
              </div>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button type="button" className="w-full sm:w-auto">Save update</Button>
              {canClaimFromPool(userRole) && !workOrder.claimed_by_user_id && (
                <Button type="button" variant="secondary" className="w-full sm:w-auto">
                  Claim from pool
                </Button>
              )}
              {canSubmitCompletion(workOrder.status, userRole) && (
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  Submit for review
                </Button>
              )}
            </div>
          </form>
        </section>
      )}

      {showManagerSection && (
        <section className="rounded-xl border border-border bg-card p-4 shadow-panel sm:p-6">
          <h2 className="text-lg font-semibold">Manager review</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assigned_user_id">Assigned technician</Label>
              <Input id="assigned_user_id" value={workOrder.assigned_user_name ?? "Unassigned"} readOnly />
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="due_at">Due date</Label>
                <Input id="due_at" type="datetime-local" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduled_for">Scheduled for</Label>
                <Input id="scheduled_for" type="datetime-local" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="closure_details">Closure notes</Label>
              <Textarea id="closure_details" placeholder="Review outcome and close-out notes." />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {workOrder.status === "Manager Review" && (
                <Button type="button" className="w-full sm:w-auto">Approve and close</Button>
              )}
              {workOrder.status === "Closed" ? null : workOrder.status !== "Manager Review" ? null : (
                <Button type="button" variant="outline" className="w-full sm:w-auto">Reopen</Button>
              )}
              {workOrder.status !== "Manager Review" && workOrder.status !== "Closed" && (
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  Assign technician
                </Button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
