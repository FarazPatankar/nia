# farazpatankar.com

This repository contains the code that runs my personal website.

## How it works

- The site has a built-in CMS. Every blog post can be edited in place once you're logged in (only I can log in).
- Meta images are generated on the fly using the emoji, title and description of the blog post.
- New posts can also be created directly within the site using the `New` button (also only available once you're logged in).

## Tech

- [Remix/React Router](https://remix.run/) with SSR frontend
- [Pocketbase](https://pocketbase.io/) to store the blog posts
  - [Self-hosted on Railway](https://railway.com/deploy/XfUmjI)
- [Novel](https://novel.sh/) for the editor

## Forking?

I haven't tried this but if you wanted to fork this and use it for your own site, it should be straightforward but there is some manual work there. Off the top of my head:

- Deploy Pocketbase using the template above
  - You'd also need to manually create the relevant tables for `categories` and `entries`. The schema can be found in this [file](https://github.com/FarazPatankar/fp/blob/main/app/lib/pocketbase/db-types.ts).
- Populate the environment variables specified [here](https://github.com/FarazPatankar/fp/blob/main/app/lib/env.ts).
- `pnpm i` and `pnpm dev`?
