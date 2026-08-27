import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { signatureSchema } from "@/lib/validations";

const messagesByStatus: Record<string, number> = {
  CPF_ALREADY_EXISTS: 409,
  INVALID_CPF: 400,
  INVALID_NAME: 400,
  DUPLICATE_REQUEST: 409,
  UNAUTHORIZED: 502,
  INTERNAL_ERROR: 502,
};

function getIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  const ip = getIp(request);
  const limited = rateLimit(ip, { limit: 8, windowMs: 60_000 });

  if (!limited.allowed) {
    return NextResponse.json(
      { success: false, code: "RATE_LIMITED" },
      { status: 429 },
    );
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const apiSecret = process.env.API_SECRET;

  if (!scriptUrl || !apiSecret) {
    return NextResponse.json(
      { success: false, code: "CONFIGURATION_ERROR" },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = signatureSchema.safeParse(body);

  if (!parsed.success) {
    const cpfError = parsed.error.issues.some((issue) => issue.path[0] === "cpf");
    return NextResponse.json(
      { success: false, code: cpfError ? "INVALID_CPF" : "INVALID_NAME" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        ...parsed.data,
        secret: apiSecret,
      }),
      cache: "no-store",
    });

    const result = (await response.json().catch(() => null)) as
      | { success: true }
      | { success: false; code?: string }
      | null;

    if (response.ok && result?.success) {
      return NextResponse.json({ success: true });
    }

    const code = result && "code" in result ? result.code : "INTERNAL_ERROR";
    return NextResponse.json(
      { success: false, code },
      { status: messagesByStatus[code ?? "INTERNAL_ERROR"] ?? 502 },
    );
  } catch {
    return NextResponse.json(
      { success: false, code: "INTERNAL_ERROR" },
      { status: 502 },
    );
  }
}
