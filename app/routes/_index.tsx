import type { MetaFunction } from "react-router";

import { Link } from "react-router";
import { H1, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export const meta: MetaFunction = () => {
  return [
    { title: "Nia" },
    { name: "description", content: "I paint stuff!" },
  ];
};

const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <H1>Nia</H1>
        <P>I paint stuff.</P>
      </div>

      <Separator />
    </div>
  );
};

export default Home;
