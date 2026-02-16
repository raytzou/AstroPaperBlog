import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { getPath } from "@/utils/getPath";
import { generateOgImageForPost } from "@/utils/generateOgImages";
import { SITE } from "@/config";

export async function getStaticPaths() {
  if (!SITE.dynamicOgImage) {
    return [];
  }

  const changelogs = await getCollection("changelog").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return changelogs.map(changelog => ({
    params: { slug: getPath(changelog.id, changelog.filePath, false) },
    props: changelog,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  if (!SITE.dynamicOgImage) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  try {
    return new Response(
      await generateOgImageForPost(props as any),
      {
        headers: { "Content-Type": "image/png" },
      }
    );
  } catch (error) {
    console.error("Failed to generate OG image for changelog:", error);
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
