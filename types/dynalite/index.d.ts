declare module "dynalite" {
  type DynaliteServer = {
    listen: (port: number, callback: (err?: string) => void) => void;
    close: (callback: (err?: string) => void) => void;
  };

  type DynaliteOptions = {
    path: string;
  };
  export default function dynalite(opts?: DynaliteOptions): DynaliteServer;
}
