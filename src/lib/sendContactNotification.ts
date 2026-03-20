import { Resend } from "resend";

type ContactPayload = {
  name: string;
  email: string;
  requirements: string;
};

/**
 * 表單已寫入 DB 後寄信通知（需設定環境變數）。
 * 寄信失敗不應阻斷 API 成功，由呼叫端記錄 log。
 *
 * .env.local 範例：
 * RESEND_API_KEY=re_xxxx
 * CONTACT_NOTIFY_EMAIL=you@example.com
 * RESEND_FROM_EMAIL=onboarding@resend.dev
 */
export async function sendContactNotificationEmail(
  payload: ContactPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey?.trim()) {
    return { ok: true };
  }

  const to = process.env.CONTACT_NOTIFY_EMAIL?.trim();
  if (!to) {
    console.warn(
      "RESEND_API_KEY is set but CONTACT_NOTIFY_EMAIL is missing; skipping email.",
    );
    return { ok: true };
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ?? "onboarding@resend.dev";

  const resend = new Resend(apiKey);
  const { name, email, requirements } = payload;

  const submittedAt = formatDateTaipei(new Date());
  const subject = `[CYC Studio] 新聯絡表單：${name}`;

  const textBody = buildTextBody({
    submittedAt,
    name,
    email,
    requirements,
  });

  const htmlBody = buildHtmlBody({
    submittedAt,
    name,
    email,
    requirements,
  });

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject,
    text: textBody,
    html: htmlBody,
  });

  if (error) {
    console.error("Resend error:", error);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

/** yyyy-MM-dd HH:mm（Asia/Taipei） */
function formatDateTaipei(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const pick = (t: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === t)?.value ?? "";
  return `${pick("year")}-${pick("month")}-${pick("day")} ${pick("hour")}:${pick("minute")}`;
}

function buildTextBody(record: {
  submittedAt: string;
  name: string;
  email: string;
  requirements: string;
}): string {
  return (
    "您好：\n\n" +
    "官網聯絡表單收到一筆新的諮詢，摘要如下。\n\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "提交時間　" +
    record.submittedAt +
    "（台北時間）\n" +
    "聯絡姓名　" +
    record.name +
    "\n" +
    "電子郵件　" +
    record.email +
    "\n\n" +
    "諮詢內容\n" +
    record.requirements +
    "\n" +
    "━━━━━━━━━━━━━━━━━━━━\n\n" +
    "請使用郵件「回覆」功能直接聯繫對方，回覆將寄至對方所留信箱。\n\n" +
    "──\n" +
    "本信由網站表單系統自動發送，請勿直接轉寄內含個資之內容至公開管道。\n"
  );
}

function htmlTableRow(label: string, valueHtml: string): string {
  const h = escapeHtml;
  return (
    "<tr>" +
    '<td style="padding:12px 14px;background:#f4f4f5;color:#3f3f46;font-size:13px;font-weight:600;width:120px;vertical-align:top;border-bottom:1px solid #e4e4e7;text-align:left;">' +
    h(label) +
    "</td>" +
    '<td style="padding:12px 14px;color:#18181b;font-size:14px;vertical-align:top;border-bottom:1px solid #e4e4e7;text-align:left;">' +
    valueHtml +
    "</td>" +
    "</tr>"
  );
}

function buildHtmlBody(record: {
  submittedAt: string;
  name: string;
  email: string;
  requirements: string;
}): string {
  const h = escapeHtml;
  const requirementsHtml =
    '<div style="white-space:pre-wrap;word-break:break-word;">' +
    h(record.requirements).replace(/\r\n|\n|\r/g, "<br>") +
    "</div>";

  return (
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;text-align:left;">' +
    '<tr><td align="left" style="text-align:left;">' +
    '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;font-size:14px;color:#18181b;line-height:1.65;max-width:600px;margin:0;text-align:left;">' +
    '<p style="margin:0 0 8px;font-size:15px;font-weight:600;text-align:left;">聯絡表單通知</p>' +
    '<p style="margin:0 0 20px;color:#52525b;font-size:14px;text-align:left;">官網收到一筆新的諮詢，以下為提交資料。</p>' +
    '<table role="presentation" align="left" width="100%" style="width:100%;max-width:600px;border-collapse:collapse;border:1px solid #e4e4e7;border-radius:8px;overflow:hidden;margin:0 0 24px;text-align:left;">' +
    htmlTableRow("提交時間", h(record.submittedAt) + "（台北時間）") +
    htmlTableRow("聯絡姓名", h(record.name)) +
    htmlTableRow("電子郵件", h(record.email)) +
    htmlTableRow("諮詢內容", requirementsHtml) +
    "</table>" +
    '<p style="margin:0;font-size:12px;color:#71717a;line-height:1.5;text-align:left;">請使用「回覆」與填表人聯繫。本信由系統自動發送。</p>' +
    "</div>" +
    "</td></tr></table>"
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
