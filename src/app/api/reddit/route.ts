import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Error fetching from Reddit: ${res.statusText}` },
        { status: res.status },
      );
    }
    const data = await res.text();
    return new NextResponse(data, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "text/html",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
