import { NextResponse } from "next/server";

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

    return NextResponse.json(
      {
        success: true,
        message: "Your enquiry has been saved successfully.",
        contact,
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
