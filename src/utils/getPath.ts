import { BLOG_PATH, CHANGELOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";

/**
 * Get full path of a blog post or changelog
 * @param id - id of the post/changelog (aka slug)
 * @param filePath - the post/changelog full file location
 * @param includeBase - whether to include `/posts` or `/changelogs` in return value
 * @returns post/changelog path
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true
) {
  // Determine if this is a changelog or blog post
  const isChangelog = filePath?.includes(CHANGELOG_PATH);
  const contentPath = isChangelog ? CHANGELOG_PATH : BLOG_PATH;
  const basePath = isChangelog ? "/changelogs" : "/posts";

  const pathSegments = filePath
    ?.replace(contentPath, "")
    .split("/")
    .filter(path => path !== "") // remove empty string in the segments ["", "other-path"] <- empty string will be removed
    .filter(path => !path.startsWith("_")) // exclude directories start with underscore "_"
    .slice(0, -1) // remove the last segment_ file name_ since it's unnecessary
    .map(segment => slugifyStr(segment)); // slugify each segment path

  // Making sure `id` does not contain the directory
  const blogId = id.split("/");
  const slug = blogId.length > 0 ? blogId[blogId.length - 1] : id;

  // If not inside the sub-dir, simply return the file path
  if (!pathSegments || pathSegments.length < 1) {
    return includeBase ? `${basePath}/${slug}` : slug;
  }

  const fullPath = [...pathSegments, slug].join("/");
  return includeBase ? `${basePath}/${fullPath}` : fullPath;
}
