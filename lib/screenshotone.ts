import { env } from "./env";

async function readSafeResponseBody(response: Response): Promise<string> {
  try {
    const text = await response.text();
    return text.slice(0, 500);
  } catch {
    return "";
  }
}

export async function captureScreenshot(url: string): Promise<Buffer> {
  if (!env.SCREENSHOTONE_API_KEY) {
    throw new Error("SCREENSHOTONE_API_KEY is missing.");
  }
  const screenshotUrl = new URL("https://api.screenshotone.com/take");
  screenshotUrl.searchParams.set("access_key", env.SCREENSHOTONE_API_KEY);
  screenshotUrl.searchParams.set("url", url);
  screenshotUrl.searchParams.set("viewport_width", "1600");
  screenshotUrl.searchParams.set("viewport_height", "1000");
  screenshotUrl.searchParams.set("format", "png");
  screenshotUrl.searchParams.set("image_quality", "90");
  screenshotUrl.searchParams.set("block_ads", "true");
  screenshotUrl.searchParams.set("full_page", "false");

  const response = await fetch(screenshotUrl.toString());
  if (!response.ok) {
    const body = await readSafeResponseBody(response);
    throw new Error(
      `ScreenshotOne failed with status ${response.status}${body ? `: ${body}` : ""}`
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    const body = await readSafeResponseBody(response);
    throw new Error(
      `ScreenshotOne returned non-image response (${contentType || "unknown content type"})${body ? `: ${body}` : ""}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
