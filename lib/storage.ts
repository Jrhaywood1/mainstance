export function buildAttachmentPath({
  organizationId,
  scope,
  entityId,
  fileName
}: {
  organizationId: string;
  scope: "requests" | "work-orders";
  entityId: string;
  fileName: string;
}) {
  return `${organizationId}/${scope}/${entityId}/${fileName}`;
}

export const supportedAttachmentMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;
