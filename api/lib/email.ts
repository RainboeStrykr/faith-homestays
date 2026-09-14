import { env } from "./env";

export interface BookingEmailData {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  guests: string;
  message?: string | null;
}

export async function sendBookingNotification(data: BookingEmailData): Promise<void> {
  if (!env.resendApiKey || !env.notifyEmail) {
    console.warn("[email] RESEND_API_KEY or NOTIFY_EMAIL not set — skipping notification.");
    return;
  }

  const messageRow = data.message
    ? `<tr><td style="padding:8px 0;color:#666;width:140px;vertical-align:top">Message</td><td style="padding:8px 0;font-weight:500">${data.message}</td></tr>`
    : "";

  const html = `
    <div style="font-family:Helvetica Neue,sans-serif;max-width:560px;margin:0 auto;color:#111">
      <div style="border-bottom:2px solid #000;padding-bottom:16px;margin-bottom:24px">
        <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#666;margin:0 0 6px">Faith The Retreat</p>
        <h1 style="font-size:24px;font-weight:400;margin:0">New Booking Request</h1>
      </div>

      <p style="font-size:13px;color:#444;margin:0 0 24px">
        A new reservation request has been submitted. Log in to the
        <a href="https://faithhomestay.com/admin" style="color:#000;font-weight:600">admin portal</a>
        to confirm or cancel it.
      </p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e5e5e5">
        <tbody>
          <tr style="background:#f9f9f9">
            <td style="padding:12px 16px;color:#666;width:140px">Reference</td>
            <td style="padding:12px 16px;font-weight:600;font-family:monospace">#RES-${data.id}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px;color:#666">Room</td>
            <td style="padding:12px 16px;font-weight:500">${data.roomType}</td>
          </tr>
          <tr style="background:#f9f9f9">
            <td style="padding:12px 16px;color:#666">Guest</td>
            <td style="padding:12px 16px;font-weight:500">${data.fullName}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px;color:#666">Email</td>
            <td style="padding:12px 16px"><a href="mailto:${data.email}" style="color:#000">${data.email}</a></td>
          </tr>
          <tr style="background:#f9f9f9">
            <td style="padding:12px 16px;color:#666">Phone</td>
            <td style="padding:12px 16px"><a href="tel:${data.phone}" style="color:#000">${data.phone}</a></td>
          </tr>
          <tr>
            <td style="padding:12px 16px;color:#666">Check-In</td>
            <td style="padding:12px 16px;font-weight:500">${data.checkInDate}</td>
          </tr>
          <tr style="background:#f9f9f9">
            <td style="padding:12px 16px;color:#666">Check-Out</td>
            <td style="padding:12px 16px;font-weight:500">${data.checkOutDate}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px;color:#666">Guests</td>
            <td style="padding:12px 16px">${data.guests}</td>
          </tr>
          ${messageRow}
        </tbody>
      </table>

      <p style="font-size:11px;color:#999;margin-top:32px;border-top:1px solid #e5e5e5;padding-top:16px">
        Faith The Retreat &bull; Siliguri, West Bengal &bull; faithhomestay.com
      </p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Faith Bookings <bookings@faithhomestay.com>",
      to: [env.notifyEmail],
      subject: `New Booking Request — ${data.roomType} (#RES-${data.id})`,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[email] Resend API error ${res.status}:`, body);
  } else {
    console.log(`[email] Booking notification sent for #RES-${data.id}`);
  }
}
