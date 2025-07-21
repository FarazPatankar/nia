import { Link, useLocation } from "react-router";

import { CategoriesResponse } from "~/lib/pocketbase/db-types";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { NewEntryForm } from "~/components/NewEntryForm";

interface Props {
  isAuthenticated: boolean;
  categories: CategoriesResponse[];
}
export const Nav = ({ isAuthenticated, categories }: Props) => {
  const { pathname } = useLocation();

  return (
    <NavigationMenu>
      <div className="w-full flex justify-between items-center">
        <NavigationMenuList className="space-x-4">
          <NavigationMenuItem>
            <NavigationMenuLink active={pathname === "/"} asChild>
              <Link to="/">home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {categories.map(category => (
            <NavigationMenuItem key={category.id}>
              <NavigationMenuLink
                active={pathname.includes(category.slug)}
                asChild
              >
                <Link to={"/c/" + category.slug}>{category.title}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <NavigationMenuLink active={pathname === "/now"} asChild>
              <Link to="/now">now</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>

        {isAuthenticated && <NewEntryForm />}
      </div>
    </NavigationMenu>
  );
};
