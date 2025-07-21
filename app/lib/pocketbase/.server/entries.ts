import { RecordListOptions } from "pocketbase";
import slugify from "@sindresorhus/slugify";

import { getPocketBaseClient } from "..";
import { Collections, EntriesRecord, EntriesResponse } from "../db-types";
import { envs } from "../../env";

export const getEntries = async (category: string | null) => {
  const pb = getPocketBaseClient();

  const options: RecordListOptions = {
    sort: "-created",
  };

  if (category != null) {
    options.filter = `category="${category}"`;
  }

  const entries = await pb
    .collection(Collections.Entries)
    .getFullList<EntriesResponse>(undefined, options);

  return entries;
};

export const getEntry = async (slug: string) => {
  const pb = getPocketBaseClient();
  const entry = await pb
    .collection(Collections.Entries)
    .getFirstListItem<EntriesResponse>(`slug="${slug}"`);

  return entry;
};

export const updateEntry = async ({
  id,
  args,
}: {
  id: string;
  args: Partial<EntriesRecord>;
}) => {
  const pb = getPocketBaseClient();
  await pb.admins.authWithPassword(
    envs.PB_TYPEGEN_EMAIL,
    envs.PB_TYPEGEN_PASSWORD,
  );

  const entry = await pb.collection(Collections.Entries).update(id, args);

  return entry;
};

export const createEntry = async (
  args: Pick<EntriesRecord, "title" | "category" | "meta">,
) => {
  const pb = getPocketBaseClient();
  await pb.admins.authWithPassword(
    envs.PB_TYPEGEN_EMAIL,
    envs.PB_TYPEGEN_PASSWORD,
  );

  const slug = slugify(args.title);

  const entry = await pb.collection(Collections.Entries).create({
    ...args,
    slug,
    content: "<p>Edit to start writing</p>",
  });

  return entry;
};

export const addMediaToEntry = async ({
  entrySlug,
  media,
}: {
  entrySlug: string;
  media: File;
}) => {
  const entry = await getEntry(entrySlug);

  const pb = getPocketBaseClient();
  await pb.admins.authWithPassword(
    envs.PB_TYPEGEN_EMAIL,
    envs.PB_TYPEGEN_PASSWORD,
  );

  return await pb
    .collection(Collections.Entries)
    .update<EntriesRecord>(entry.id, {
      media,
    });
};

export const getEntryMediaUrl = ({
  entry,
  fileName,
}: {
  entry: EntriesRecord;
  fileName: string;
}) => {
  const pb = getPocketBaseClient();

  return pb.files.getUrl(entry, fileName);
};
