import { LoaderFunctionArgs } from "react-router";
import emojiRegex from "emoji-regex";
import invariant from "tiny-invariant";
import { getCategoryById } from "~/lib/pocketbase/.server/categories";

import { getEntry } from "~/lib/pocketbase/.server/entries";

const regex = emojiRegex();

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const slug = params.slug;
  invariant(slug, "No slug provided");

  const entry = await getEntry(slug);
  const category = await getCategoryById(entry.category);

  let emoji: string | undefined = undefined;
  const matches = entry.title.match(regex);
  if (matches != null) {
    emoji = matches[0];
  }

  const url = new URL(request.url);

  const ogUrl = new URL("/api/image", url.origin);
  ogUrl.searchParams.set(
    "title",
    emoji == null ? entry.title : entry.title.replace(emoji, ""),
  );
  ogUrl.searchParams.set("description", entry.meta?.description ?? "");
  ogUrl.searchParams.set("emoji", emoji ?? "✨");
  ogUrl.searchParams.set("category", category.title);

  return fetch(ogUrl);
};
