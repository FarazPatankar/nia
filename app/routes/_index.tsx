import type { MetaFunction } from "react-router";

import { Link } from "react-router";
import { H1, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export const meta: MetaFunction = () => {
  return [
    { title: "Faraz Patankar" },
    { name: "description", content: "I build stuff!" },
  ];
};

const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <H1>Faraz Patankar</H1>
        <P>I build stuff.</P>
      </div>

      <Separator />
      <div className="flex items-center space-x-2 h-8">
        <Button variant="link" className="p-0" asChild>
          <Link to={`https://github.com/FarazPatankar`}>GitHub</Link>
        </Button>
        <Separator orientation="vertical" />
        <Button variant="link" className="p-0" asChild>
          <Link to={`https://x.com/farazpatankar`}>Twitter</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;
