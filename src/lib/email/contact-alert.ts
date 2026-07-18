import { Resend } from "resend";

type ContactAlertInput = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  createdAt: Date;
};

type ContactAlertResult =
  | {
      success: true;
      emailId?: string;
    }
  | {
      success: false;
      error: string;
    };

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeSubject(subject: string | null): string {
  if (!subject) {
    return "No subject";
  }

  return subject.replace(/[\r\n]+/g, " ").trim() || "No subject";
}

export async function sendContactAlert(
  input: ContactAlertInput,
): Promise<ContactAlertResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const recipientEmail = process.env.CONTACT_ALERT_TO_EMAIL;

  if (!apiKey || !fromEmail || !recipientEmail) {
    return {
      success: false,
      error: "Resend environment variables are incomplete.",
    };
  }

  const resend = new Resend(apiKey);

  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safePhone = escapeHtml(input.phone || "Not provided");
  const safeSubject = escapeHtml(normalizeSubject(input.subject));
  const safeMessage = escapeHtml(input.message).replaceAll("\n", "<br />");

  const emailSubject = normalizeSubject(input.subject).slice(0, 80);

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      subject: `New portfolio enquiry: ${emailSubject}`,
      text: [
        "A new portfolio enquiry has been received.",
        "",
        `Contact ID: ${input.id}`,
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Phone: ${input.phone || "Not provided"}`,
        `Subject: ${normalizeSubject(input.subject)}`,
        `Submitted: ${input.createdAt.toISOString()}`,
        "",
        "Message:",
        input.message,
      ].join("\n"),
      html: `
        <div
          style="
            max-width: 640px;
            margin: 0 auto;
            padding: 24px;
            font-family: Arial, Helvetica, sans-serif;
            color: #171717;
          "
        >
          <h1 style="font-size: 24px; margin-bottom: 8px;">
            New portfolio enquiry
          </h1>

          <p style="color: #525252; margin-bottom: 24px;">
            A visitor submitted a new enquiry through masoodhussain.dev.
          </p>

          <table
            style="
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
            "
          >
            <tbody>
              <tr>
                <td style="padding: 10px; border: 1px solid #d4d4d4;">
                  <strong>Contact ID</strong>
                </td>
                <td style="padding: 10px; border: 1px solid #d4d4d4;">
                  ${escapeHtml(input.id)}
                </td>
              </tr>

              <tr>
                <td style="padding: 10px; border: 1px solid #d4d4d4;">
                  <strong>Name</strong>
                </td>
                <td style="padding: 10px; border: 1px solid #d4d4d4;">
                  ${safeName}
                </td>
              </tr>

              <tr>
                <td style="padding: 10px; border: 1px solid #d4d4d4;">
                  <strong>Email</strong>
                </td>
                <td style="padding: 10px; border: 1px solid #d4d4d4;">
                  ${safeEmail}
                </td>
              </tr>

              <tr>
                <td style="padding: 10px; border: 1px solid #d4d4d4;">
                  <strong>Phone</strong>
                </td>
                <td style="padding: 10px; border: 1px solid #d4d4d4;">
                  ${safePhone}
                </td>
              </tr>

              <tr>
                <td style="padding: 10px; border: 1px solid #d4d4d4;">
                  <strong>Subject</strong>
                </td>
                <td style="padding: 10px; border: 1px solid #d4d4d4;">
                  ${safeSubject}
                </td>
              </tr>

              <tr>
                <td style="padding: 10px; border: 1px solid #d4d4d4;">
                  <strong>Submitted</strong>
                </td>
                <td style="padding: 10px; border: 1px solid #d4d4d4;">
                  ${escapeHtml(input.createdAt.toISOString())}
                </td>
              </tr>
            </tbody>
          </table>

          <div
            style="
              padding: 18px;
              border: 1px solid #d4d4d4;
              background: #fafafa;
              line-height: 1.7;
            "
          >
            <strong>Message</strong>

            <p style="margin-bottom: 0;">
              ${safeMessage}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Resend rejected the email request.",
      };
    }

    return {
      success: true,
      emailId: data?.id,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected email error occurred.",
    };
  }
}
