import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { contactStatusSchema } from "@/lib/validations/admin";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication required.",
      },
      {
        status: 401,
      },
    );
  }

  const { id } = await context.params;

  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid contact identifier.",
      },
      {
        status: 400,
      },
    );
  }

  const requestBody: unknown = await request.json();
  const result = contactStatusSchema.safeParse(requestBody);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid contact status.",
      },
      {
        status: 400,
      },
    );
  }

  const existingContact = await prisma.contact.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingContact) {
    return NextResponse.json(
      {
        success: false,
        message: "Contact enquiry was not found.",
      },
      {
        status: 404,
      },
    );
  }

  const contact = await prisma.contact.update({
    where: {
      id,
    },
    data: {
      status: result.data.status,
    },
    select: {
      id: true,
      status: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    success: true,
    contact,
  });
}
