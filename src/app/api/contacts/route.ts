import { NextResponse } from "next/server";

import { sendContactAlert } from "@/lib/email/contact-alert";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations/contact";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const requestBody: unknown = await request.json();

    const result = contactSchema.safeParse(requestBody);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the submitted information.",
          errors: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Save the contact before attempting the email.
     *
     * The database record is the permanent source of truth.
     * An external email failure must not cause the enquiry to be lost.
     */
    const contact = await prisma.contact.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || null,
        subject: result.data.subject || null,
        message: result.data.message,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    const emailResult = await sendContactAlert({
      id: contact.id,
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      subject: result.data.subject || null,
      message: result.data.message,
      createdAt: contact.createdAt,
    });

    if (!emailResult.success) {
      /*
       * Log the failure for the developer, but do not return an error to
       * the visitor because their enquiry was saved successfully.
       */
      console.error("Contact saved, but email alert failed:", {
        contactId: contact.id,
        error: emailResult.error,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you. Your enquiry has been received successfully.",
        contact: {
          id: contact.id,
          status: contact.status,
          createdAt: contact.createdAt,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Contact submission failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Your enquiry could not be saved. Please try again shortly.",
      },
      {
        status: 500,
      },
    );
  }
}
