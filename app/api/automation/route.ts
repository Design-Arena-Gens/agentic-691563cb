import { NextResponse } from "next/server";
import { executeGmailToWhatsAppPipeline } from "@/lib/automation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const limit = typeof body.limit === "number" ? body.limit : undefined;
  const markAsRead =
    typeof body.markAsRead === "boolean" ? body.markAsRead : body.markAsRead === "true";
  const templateOverride =
    typeof body.templateOverride === "string" ? body.templateOverride : undefined;
  const toOverride = typeof body.to === "string" ? body.to : undefined;

  try {
    const result = await executeGmailToWhatsAppPipeline({
      limit,
      markAsRead,
      templateOverride,
      toOverride
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await executeGmailToWhatsAppPipeline();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: message
      },
      { status: 500 }
    );
  }
}
