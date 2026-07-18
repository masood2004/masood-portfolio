import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signOut({
    scope: "local",
  });

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Logout failed.",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    success: true,
  });
}
