declare module "dynalite" {
  import { Server } from "http";

  type DynaliteOptions = {
    path?: string;
  };
  export default function dynalite(opts?: DynaliteOptions): Server;
}
