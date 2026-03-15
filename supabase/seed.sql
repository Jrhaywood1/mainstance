insert into public.organizations (id, name, slug, created_at)
values ('11111111-1111-1111-1111-111111111111', 'Northstar Distribution', 'northstar-distribution', now() - interval '60 days');

insert into public.sites (id, organization_id, name, address, active, created_at)
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Seattle Fulfillment Center',
  '450 Harbor Industrial Way, Seattle, WA 98108',
  true,
  now() - interval '60 days'
);

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('44444444-4444-4444-4444-444444444441', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'requester@mainstance.demo', crypt('demo-password', gen_salt('bf')), now(), now(), now()),
  ('44444444-4444-4444-4444-444444444442', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tech@mainstance.demo', crypt('demo-password', gen_salt('bf')), now(), now(), now()),
  ('44444444-4444-4444-4444-444444444443', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'manager@mainstance.demo', crypt('demo-password', gen_salt('bf')), now(), now(), now()),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@mainstance.demo', crypt('demo-password', gen_salt('bf')), now(), now(), now());

insert into public.memberships (id, organization_id, user_id, role, created_at)
values
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', 'requester', now() - interval '45 days'),
  ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444442', 'technician', now() - interval '45 days'),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444443', 'manager', now() - interval '45 days'),
  ('33333333-3333-3333-3333-333333333334', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'admin', now() - interval '45 days');

insert into public.categories (id, organization_id, name, active, created_at)
values
  ('55555555-5555-5555-5555-555555555551', '11111111-1111-1111-1111-111111111111', 'Electrical', true, now() - interval '45 days'),
  ('55555555-5555-5555-5555-555555555552', '11111111-1111-1111-1111-111111111111', 'Plumbing', true, now() - interval '45 days'),
  ('55555555-5555-5555-5555-555555555553', '11111111-1111-1111-1111-111111111111', 'Facilities', true, now() - interval '45 days'),
  ('55555555-5555-5555-5555-555555555554', '11111111-1111-1111-1111-111111111111', 'IT', true, now() - interval '45 days'),
  ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'General Maintenance', true, now() - interval '45 days');

insert into public.requests (id, organization_id, requester_user_id, site_id, title, description, category_id, priority, building, floor, room, hallway, location_notes, created_at)
values
  ('66666666-6666-6666-6666-666666666661', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', 'Dock door sensor fault', 'Dock 3 safety sensor is intermittently failing and stopping trailer loads.', '55555555-5555-5555-5555-555555555551', 'High', 'A', '1', 'Dock 3', null, 'Triggers on close.', now() - interval '14 days'),
  ('66666666-6666-6666-6666-666666666662', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', 'Break room sink leak', 'Hot water line under the west break room sink is dripping onto the cabinet floor.', '55555555-5555-5555-5555-555555555552', 'Medium', 'B', '1', 'Break Room West', null, 'Leak worsens during peak use.', now() - interval '13 days'),
  ('66666666-6666-6666-6666-666666666663', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', 'Wi-Fi dead zone in mezzanine', 'Handheld scanners lose connection on the north mezzanine picking lanes.', '55555555-5555-5555-5555-555555555554', 'High', 'C', '2', 'Mezzanine', 'North', 'Affects morning wave.', now() - interval '12 days'),
  ('66666666-6666-6666-6666-666666666664', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', 'Overhead light out in aisle 14', 'Three fixtures are out in aisle 14 causing poor visibility for forklift traffic.', '55555555-5555-5555-5555-555555555553', 'Medium', 'A', '1', 'Aisle 14', null, 'Night shift flagged it twice.', now() - interval '11 days'),
  ('66666666-6666-6666-6666-666666666665', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', 'HVAC cooling issue', 'Pack station area remains above setpoint after noon every day.', '55555555-5555-5555-5555-555555555553', 'Urgent', 'A', '2', 'Pack Station', null, 'Temp hit 82F yesterday.', now() - interval '10 days'),
  ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', 'Forklift charger trip', 'Charger 2 trips breaker after 5 minutes of charging.', '55555555-5555-5555-5555-555555555551', 'High', 'D', '1', 'Charging Bay', null, 'Unit tagged out.', now() - interval '9 days'),
  ('66666666-6666-6666-6666-666666666667', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', 'Paint peeling in receiving office', 'Moisture damage showing on south wall paint near receiving office.', '55555555-5555-5555-5555-555555555555', 'Low', 'B', '1', 'Receiving Office', null, 'Cosmetic but spreading.', now() - interval '8 days'),
  ('66666666-6666-6666-6666-666666666668', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', 'Badge reader offline', 'Rear employee entrance badge reader is offline since 6am.', '55555555-5555-5555-5555-555555555554', 'Urgent', 'A', '1', 'Rear Entrance', null, 'Security is manually checking in staff.', now() - interval '7 days'),
  ('66666666-6666-6666-6666-666666666669', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', 'Restroom exhaust noise', 'Loud rattling from fan in first-floor men''s restroom.', '55555555-5555-5555-5555-555555555553', 'Medium', 'B', '1', 'Men''s Restroom', null, 'Noise present all day.', now() - interval '6 days'),
  ('66666666-6666-6666-6666-666666666670', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', 'Compressed air hose damage', 'Visible split in hose at packing line 6 quick connect.', '55555555-5555-5555-5555-555555555555', 'High', 'C', '1', 'Packing Line 6', null, 'Potential safety issue.', now() - interval '5 days'),
  ('66666666-6666-6666-6666-666666666671', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', 'Low pressure at mop sink', 'Custodial mop sink pressure is weak on second floor.', '55555555-5555-5555-5555-555555555552', 'Low', 'B', '2', 'Janitor Closet', null, 'No blockage found by staff.', now() - interval '4 days'),
  ('66666666-6666-6666-6666-666666666672', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', 'Exterior security camera blur', 'Camera 7 has persistent blur and glare at night.', '55555555-5555-5555-5555-555555555554', 'Medium', 'Exterior', '1', 'Lot South Pole 7', null, 'Need clear footage for trucks.', now() - interval '3 days');

update public.work_orders
set
  assigned_user_id = '44444444-4444-4444-4444-444444444442',
  claimed_by_user_id = '44444444-4444-4444-4444-444444444442',
  status = 'Claimed',
  due_at = now() + interval '1 day'
where request_id = '66666666-6666-6666-6666-666666666662';

update public.work_orders set assigned_user_id = '44444444-4444-4444-4444-444444444442', claimed_by_user_id = '44444444-4444-4444-4444-444444444442', status = 'In Progress', due_at = now() - interval '2 hours' where request_id = '66666666-6666-6666-6666-666666666663';
update public.work_orders set assigned_user_id = '44444444-4444-4444-4444-444444444442', claimed_by_user_id = '44444444-4444-4444-4444-444444444442', status = 'Waiting', due_at = now() + interval '18 hours' where request_id = '66666666-6666-6666-6666-666666666664';
update public.work_orders set assigned_user_id = '44444444-4444-4444-4444-444444444442', status = 'Scheduled', scheduled_for = now() + interval '20 hours', due_at = now() + interval '2 days' where request_id = '66666666-6666-6666-6666-666666666665';
update public.work_orders set assigned_user_id = '44444444-4444-4444-4444-444444444442', claimed_by_user_id = '44444444-4444-4444-4444-444444444442', status = 'Completed', completed_at = now() - interval '2 days', due_at = now() - interval '3 days', completion_summary = 'Breaker issue resolved and charger returned to service.' where request_id = '66666666-6666-6666-6666-666666666666';
update public.work_orders set assigned_user_id = '44444444-4444-4444-4444-444444444442', claimed_by_user_id = '44444444-4444-4444-4444-444444444442', status = 'Manager Review', completed_at = now() - interval '1 day', due_at = now() - interval '2 days', completion_summary = 'Wall prepped and sealed pending manager close-out.' where request_id = '66666666-6666-6666-6666-666666666667';
update public.work_orders set assigned_user_id = '44444444-4444-4444-4444-444444444442', claimed_by_user_id = '44444444-4444-4444-4444-444444444442', status = 'Closed', completed_at = now() - interval '4 days', closed_at = now() - interval '3 days', due_at = now() - interval '4 days', completion_summary = 'Reader rebooted, firmware updated, and badge scans verified.' where request_id = '66666666-6666-6666-6666-666666666668';
update public.work_orders set assigned_user_id = '44444444-4444-4444-4444-444444444442', status = 'Reopened', due_at = now() + interval '8 hours', completion_summary = 'Fan noise returned after initial tightening.' where request_id = '66666666-6666-6666-6666-666666666669';
update public.work_orders set status = 'New', due_at = now() + interval '5 days' where request_id = '66666666-6666-6666-6666-666666666670';
update public.work_orders set assigned_user_id = '44444444-4444-4444-4444-444444444442', claimed_by_user_id = '44444444-4444-4444-4444-444444444442', status = 'In Progress', due_at = now() + interval '10 hours' where request_id = '66666666-6666-6666-6666-666666666671';
update public.work_orders set assigned_user_id = '44444444-4444-4444-4444-444444444442', status = 'Scheduled', scheduled_for = now() + interval '28 hours', due_at = now() + interval '3 days' where request_id = '66666666-6666-6666-6666-666666666672';

insert into public.labor_entries (work_order_id, user_id, hours, hourly_rate, total_cost, notes)
select id, '44444444-4444-4444-4444-444444444442', 1.5, 42, 63, 'Diagnostic walkthrough'
from public.work_orders
limit 12;

insert into public.material_entries (work_order_id, name, quantity, unit_cost, total_cost, notes)
select id, 'General replacement part', 1, 18.5, 18.5, 'Demo seeded material'
from public.work_orders
offset 4 limit 6;

insert into public.work_order_comments (work_order_id, user_id, body)
select id, '44444444-4444-4444-4444-444444444443', 'Reviewed priority and moved into active queue.'
from public.work_orders
limit 4;

insert into public.ai_settings (id, organization_id, enabled, auto_categorize, summarize_history, weekly_digest)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', true, true, true, false);

insert into public.org_settings (id, organization_id, allow_magic_link, allow_email_password)
values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', true, true);
