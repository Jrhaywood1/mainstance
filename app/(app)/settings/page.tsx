import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const settingsLinks = [
  { href: "/settings/sites", label: "Sites", description: "Manage locations, addresses, and active state." },
  { href: "/settings/categories", label: "Categories", description: "Configure work request categories by org." },
  { href: "/settings/team", label: "Team", description: "Manage memberships and org roles." },
  { href: "/settings/ai", label: "AI", description: "Toggle helper features without affecting system-of-record logic." }
];

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Settings"
        description="Manage your organization's sites, categories, team members, and AI features."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {settingsLinks.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full transition-colors hover:border-primary/50">
              <CardHeader>
                <CardTitle>{item.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{item.description}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
