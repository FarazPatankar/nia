import { ActionFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import {
  addMediaToEntry,
  getEntryMediaUrl,
} from "~/lib/pocketbase/.server/entries";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const slug = params.slug;
  invariant(slug, "No slug provided");

  const fileName = request.headers.get("x-file-name");
  invariant(fileName, "No file name provided");

  const blob = await request.blob();
  const media = new File([blob], fileName, { type: blob.type });

  const entry = await addMediaToEntry({ entrySlug: slug, media });

  const files = entry.media;
  if (files == null) {
    throw new Error("No files found in entry");
  }

  const latestFileName = files[files.length - 1];
  const fileUrl = getEntryMediaUrl({ entry, fileName: latestFileName });

  return { url: fileUrl };
};
