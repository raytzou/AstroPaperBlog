import type { APIRoute } from "astro";
import { generateOgImageForSite } from "@/utils/generateOgImages";

export const GET: APIRoute = async () => {
  try {
    return new Response(await generateOgImageForSite(), {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("Failed to generate OG image:", error);
    // Return a 1x1 transparent PNG as fallback
    const transparentPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    return new Response(transparentPng, {
      headers: { "Content-Type": "image/png" },
    });
  }
};
