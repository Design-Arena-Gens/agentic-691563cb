"use server";

import { z } from "zod";
import { executeGmailToWhatsAppPipeline } from "@/lib/automation";

export type AutomationActionResult =
  | {
      success: true;
      data: Awaited<ReturnType<typeof executeGmailToWhatsAppPipeline>>;
    }
  | {
      success: false;
      error: string;
    };

const triggerSchema = z.object({
  limit: z.coerce.number().min(1).max(20).default(5),
  markAsRead: z.coerce.boolean().default(false),
  toOverride: z.string().optional(),
  templateOverride: z.string().optional()
});

export async function triggerAutomation(formData: FormData): Promise<AutomationActionResult> {
  const parsed = triggerSchema.safeParse({
    limit: formData.get("limit"),
    markAsRead: formData.get("markAsRead") === "on",
    toOverride: formData.get("toOverride") || undefined,
    templateOverride: formData.get("templateOverride") || undefined
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors.map((err) => err.message).join(", ")
    };
  }

  try {
    const report = await executeGmailToWhatsAppPipeline(parsed.data);
    return {
      success: true,
      data: report
    };
  } catch (error) {
    console.error("Automation failed", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
