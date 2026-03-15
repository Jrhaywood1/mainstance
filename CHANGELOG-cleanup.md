# Product Cleanup Pass — 2026-03-15

## What changed

### Naming & Copy
- Standardized "Unassigned" everywhere (was inconsistent "Shared pool" vs "Unassigned")
- Replaced all developer-facing descriptions with product-facing copy across every page (dashboard, requests, work orders, reports, settings, new request form)
- Removed demo adapter notice from dashboard operational rollup
- Removed Supabase scaffolding notice from request form

### Role-Based Access
- **Nav filtering**: Sidebar now shows only role-appropriate links. Requesters see Dashboard + Requests. Technicians add Work Orders. Managers add Reports. Admins add Settings.
- **`lib/permissions.ts`**: Added `canViewWorkOrderPool`, `canAccessSettings`, `canAccessReports`, `canAssignTechnician`
- **`lib/app-context.ts`**: Requester sees only their own requests and linked work orders. Technician sees their claimed/assigned work orders plus unassigned pool. Manager/admin sees everything.

### Status Transitions
- **`lib/work-orders.ts`**: Exported `allowedTransitions` and added `getNextStatuses()` helper
- **`WorkOrderActions`**: Status dropdown now only shows valid next statuses from the current state (was showing all 9 statuses regardless). Current status shown as "(current)" label.
- "Submit for review" button now only shows when `canSubmitCompletion()` returns true
- "Approve and close" / "Reopen" buttons only show when work order is in "Manager Review"

### Dashboard (Manager Info Hierarchy)
- Top row for managers now shows: Open jobs, Overdue, Pending review, Unassigned (was: Open, Overdue, At risk, Total cost)
- Second row for managers adds: At risk, Scheduled, Avg close time, Total cost
- Main table shows "Pending manager review" when items exist (was always "Recent active work")
- Side panel shows Overdue and Unassigned tables for managers (was static rollup)
- Non-manager roles get a simpler dashboard layout

### Work Order Detail
- `WorkOrderActions` is now role-gated: technician section only for technicians, manager section only for managers/admins. Requesters see no action panel.
- Status history now shows who made each change (resolves user name from memberships)
- Comments now show author name
- Location display cleaned up: `Bldg A, Fl 1, Room 103` (was `Building A, floor 1, room Dock 3`)
- Completion summary only shown when present (was always showing "No completion summary yet.")
- Used arrow character (→) instead of ASCII (->)  in status history

### Mobile UX (Technician)
- `WorkOrderActions`: Changed from side-by-side `lg:grid-cols-2` to stacked single-column layout
- Buttons are full-width on mobile (`w-full sm:w-auto`)
- Form padding reduced on mobile (`p-4 sm:p-6`)
- Material input layout tightened: name + qty on one row instead of 3-column grid
- Detail page grid uses `grid-cols-2` without sm: prefix for tighter mobile layout

### Dead Code Removed
- Removed `buildWorkOrderPdfSummaryPayload()` from `lib/reporting.ts` (PDF route returns 501, function was unused)
- Removed unused imports (`canAccessReports`, `canAccessSettings`, `canViewWorkOrderPool` from app-shell after switching to inline roles)
- Removed `workOrderStatuses` import from `WorkOrderActions` (replaced with `getNextStatuses`)

### Architecture
- `lib/constants.ts`: Added `openStatuses` set for reuse
- `lib/work-orders.ts`: `allowedTransitions` now exported for use in UI components

## Still needs work

- **Server actions**: Forms still submit to no-ops. Need Supabase mutation wiring for request creation, work order updates, claim, assignment, status changes, and comments.
- **AI settings persistence**: Toggle state is local-only. Needs server action to persist to `ai_settings` table.
- **Settings CRUD**: Sites, categories, and team pages are read-only. Need add/edit/deactivate flows.
- **PDF export**: Route still returns 501. Need renderer implementation.
- **File attachments**: Upload UI not built. `storage.ts` path helpers and schema are ready.
- **Auth**: Login actions are no-op placeholders. Need Supabase Auth wiring.
- **Requester dashboard**: Currently shows same dashboard as others but with less data. Could show a simpler "My requests" view with status tracking.
- **Real-time**: No live updates. Could add Supabase Realtime subscriptions for work order status changes.
- **Pagination/filtering**: All list pages load full dataset. Need server-side pagination for production scale.
