import { NextResponse } from "next/server";

export function middleware(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({
        message: "Unauthorized",
      }),
      { status: 403 }
    );
  }

  const token = authHeader.split(" ")[1];

  const parseJwt = (token) => {
    let base64Payload = token.split(".")[1];
    base64Payload = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    while (base64Payload.length % 4) {
      base64Payload += "=";
    }
    const payload = Buffer.from(base64Payload, "base64");
    return JSON.parse(payload.toString());
  };

  const payload = parseJwt(token);
  const uid = payload?.user_id;
  const email = payload?.email;

  if (
    uid !== process.env.FIREBASE_UID ||
    email !== process.env.FIREBASE_EMAIL
  ) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/add-record", "/api/delete-record"],
};
