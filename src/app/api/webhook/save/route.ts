import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const webhookUrl = process.env.NEXT_PUBLIC_AI_REPORT_SAVE_WEBHOOK || process.env.NEXT_PUBLIC_AI_REPORT_WEBHOOK;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Save Webhook URL not configured" },
        { status: 500 }
      );
    }
    // Forward request to n8n
    const response = await axios.post(webhookUrl, body, {
       headers: {
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error proxying to n8n save webhook:", error.message);
    if (error.response) {
      console.error("n8n Response Data:", error.response.data);
      return NextResponse.json(
        { error: "n8n Error", details: error.response.data },
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { error: "Failed to save report", details: error.message },
      { status: 500 }
    );
  }
}
