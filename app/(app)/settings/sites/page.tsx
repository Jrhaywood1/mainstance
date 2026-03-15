import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppContext } from "@/lib/app-context";

export default async function SettingsSitesPage() {
  const { site } = await getAppContext();

  return (
    <div>
      <PageHeader eyebrow="Settings" title="Sites" description="Physical locations where work requests and orders are tracked." />
      <Card>
        <CardHeader>
          <CardTitle>Configured sites</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="font-medium text-foreground">{site.name}</div>
          <div className="mt-2">{site.address}</div>
        </CardContent>
      </Card>
    </div>
  );
}
