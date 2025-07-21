import { Form, useRouteLoaderData } from "react-router";

import { loader } from "~/root";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";

export const NewEntryForm = () => {
  const data = useRouteLoaderData<typeof loader>("root");

  if (data == null) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          New
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Post</SheetTitle>
          <SheetDescription>Create a new post</SheetDescription>
        </SheetHeader>

        <Form
          method="POST"
          action="/p/new"
          className="my-6 grid gap-4"
          reloadDocument
        >
          <div className="grid gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="category">Category</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {data.categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="max-w-max" name="intent" value="new">
            Create
          </Button>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
