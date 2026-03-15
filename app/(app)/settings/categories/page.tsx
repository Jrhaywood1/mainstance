import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppContext } from "@/lib/app-context";

export default async function SettingsCategoriesPage() {
  const { categories } = await getAppContext();

  return (
    <div>
      <PageHeader eyebrow="Settings" title="Categories" description="Work request categories used for intake, routing, and reporting." />
      <Card>
        <CardHeader>
          <CardTitle>Active categories</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id} className="rounded-lg border border-border/70 bg-background/60 p-4">
              <div className="font-medium">{category.name}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
