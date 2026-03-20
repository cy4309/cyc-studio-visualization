import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendContactNotificationEmail } from "@/lib/sendContactNotification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, requirements } = body;

    if (!name?.trim() || !email?.trim() || !requirements?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and requirements are required" },
        { status: 400 },
      );
    }

    const trimmed = {
      name: name.trim(),
      email: email.trim(),
      requirements: requirements.trim(),
    };

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 },
      );
    }
    const { error } = await supabase.from("contact_requests").insert(trimmed);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit request" },
        { status: 500 },
      );
    }

    // 先落庫再通知：避免 Resend 故障／限流時使用者以為失敗、實際卻沒存到資料
    const mailResult = await sendContactNotificationEmail(trimmed);
    if (!mailResult.ok) {
      console.error(
        "Contact saved but notification email failed:",
        mailResult.error,
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
