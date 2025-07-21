import { SerializeFrom } from "react-router";
import { Link } from "react-router";

import { EntriesResponse } from "~/lib/pocketbase/db-types";

import { Button } from "./ui/button";
import { Muted } from "./ui/typography";
import { dateStringToDate } from "~/lib/utils";

export const EntryList = ({
  entries,
}: {
  entries: SerializeFrom<EntriesResponse>[];
}) => {
  return (
    <div className="flex flex-col items-start space-y-2">
      {entries.map(entry => (
        <div
          key={entry.id}
          className="w-full flex items-center justify-between space-x-2"
        >
          <Button
            variant="link"
            className="p-0 h-auto text-base whitespace-normal break-words"
            asChild
          >
            <Link to={`/p/${entry.slug}`}>{entry.title}</Link>
          </Button>
          <Muted className="shrink-0">{dateStringToDate(entry.created)}</Muted>
        </div>
      ))}
    </div>
  );
};
