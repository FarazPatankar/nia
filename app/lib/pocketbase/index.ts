import PocketBase from "pocketbase";

import { envs } from "../env";

let pb: PocketBase | null = null;

export const getPocketBaseClient = () => {
  if (pb == null) {
    pb = new PocketBase(envs.PB_TYPEGEN_URL);
  }

  return pb;
};
