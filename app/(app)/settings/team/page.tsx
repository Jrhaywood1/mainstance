import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppContext } from "@/lib/app-context";

export default async function SettingsTeamPage() {
  const { memberships } = await getAppContext();

  return (
    <div>
      <PageHeader eyebrow="Settings" title="Team" description="Manage team members and their roles within the organization." />
      <Card>
        <CardHeader>
          <CardTitle>Org members</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((membership) => (
                <tr key={membership.id} className="border-t border-border/70">
                  <td className="py-4 font-medium">{membership.full_name}</td>
                  <td className="py-4 text-muted-foreground">{membership.email}</td>
                  <td className="py-4 text-muted-foreground">{membership.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
