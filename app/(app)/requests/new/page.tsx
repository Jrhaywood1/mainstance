import { RequestForm } from "@/components/forms/request-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppContext } from "@/lib/app-context";

export default async function NewRequestPage() {
  const { categories, site } = await getAppContext();

  return (
    <div>
      <PageHeader
        eyebrow="New Request"
        title="Submit work request"
        description="Describe the issue and location. A work order will be created automatically for the maintenance team."
      />

      <Card>
        <CardHeader>
          <CardTitle>Request details</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestForm categories={categories} sites={[site]} />
        </CardContent>
      </Card>
    </div>
  );
}
