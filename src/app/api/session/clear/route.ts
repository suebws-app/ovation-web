import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { appRoutes } from "@/lib/routes";

const AUTH_COOKIE_NAMES = [
  "ovation.session_token",
  "ovation.session_data",
  "ovation.csrf_token",
];

export const GET = async (request: Request) => {
  const cookieStore = await cookies();
  for (const name of AUTH_COOKIE_NAMES) {
    if (cookieStore.get(name)) {
      cookieStore.delete(name);
    }
  }
  return NextResponse.redirect(new URL(appRoutes.auth.signIn, request.url));
};
