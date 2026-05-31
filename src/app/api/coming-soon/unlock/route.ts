import { createHmac, timingSafeEqual } from "crypto";

function hmacHex(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

export async function POST(req: Request) {
  if (process.env.COMING_SOON_ENABLED !== "true") {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const password = process.env.COMING_SOON_PASSWORD;
  const secret = process.env.AUTH_COOKIE_SECRET;
  if (!password || !secret) {
    return Response.json({ error: "Server misconfigured" }, { status: 500 });
  }

  let submitted: string;
  try {
    const body = (await req.json()) as { password?: unknown };
    submitted = typeof body.password === "string" ? body.password : "";
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const expectedToken = hmacHex(password, secret);
  const submittedToken = hmacHex(submitted, secret);

  if (!safeEqual(submittedToken, expectedToken)) {
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }

  const isProduction = process.env.NODE_ENV === "production";
  const maxAge = 7 * 24 * 60 * 60;
  const cookie = `preview_access=${expectedToken}; HttpOnly; Path=/; Max-Age=${maxAge}${isProduction ? "; Secure; SameSite=Lax" : ""}`;

  return Response.json({ ok: true }, { headers: { "Set-Cookie": cookie } });
}
