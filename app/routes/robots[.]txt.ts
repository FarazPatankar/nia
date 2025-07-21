import { generateRobotsTxt } from "@nasa-gcn/remix-seo";
import { type LoaderFunctionArgs } from "react-router";
import { getDomainUrl } from "~/lib/utils";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const siteUrl = getDomainUrl(request);

  return generateRobotsTxt([
    { type: "sitemap", value: `${siteUrl}/sitemap.xml` },
    { type: "disallow", value: "/admin" },
  ]);
};
