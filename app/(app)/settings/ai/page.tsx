import { PageHeader } from "@/components/layout/page-header";
import { ToggleRow } from "@/components/settings/toggle-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppContext } from "@/lib/app-context";

export default async function SettingsAIPage() {
  const { aiSettings } = await getAppContext();

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="AI settings"
        description="Enable or disable AI helper features for your organization. These never modify data without confirmation."
      />
      <Card>
        <CardHeader>
          <CardTitle>Helper feature toggles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow title="AI helpers enabled" description="Master toggle for org-level AI features." enabled={aiSettings.enabled} />
          <ToggleRow title="Auto-categorize" description="Suggest category during intake. Never writes directly without user confirmation." enabled={aiSettings.auto_categorize} />
          <ToggleRow title="Summarize history" description="Generate work-order timeline summaries for managers." enabled={aiSettings.summarize_history} />
          <ToggleRow title="Weekly digest" description="Prepare weekly operational summary drafts." enabled={aiSettings.weekly_digest} />
        </CardContent>
      </Card>
    </div>
  );
}
