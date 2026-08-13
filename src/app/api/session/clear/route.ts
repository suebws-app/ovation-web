import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { appRoutes } from "@/lib/routes";

const SESSION_COOKIE_NAME = "ovation.session_token";

export const GET = async (request: Request) => {
  const cookieStore = await cookies();
  if (cookieStore.get(SESSION_COOKIE_NAME)) {
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
  return NextResponse.redirect(new URL(appRoutes.auth.signIn, request.url));
};
