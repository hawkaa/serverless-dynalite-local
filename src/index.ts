import {
  CreateTableCommand,
  CreateTableCommandInput,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import dynalite from "dynalite";
import { AddressInfo } from "net";
import { getCreateTableCommandInput } from "./util";

class ServerlessDynaliteLocal {
  // Own hooks
  hooks: { [hook: string]: () => Promise<void> };

  // Logging function, stolen from the serverless object
  log: (str: string, pluginName: string) => void;

  // Default port for dynalite
  port = 4567;
  path = "./dynalite";

  // Table definitions. Using the CreateTableCommandInput as type? Hack or not?
  tables: CreateTableCommandInput[];

  // Local state variables
  private server?: ReturnType<typeof dynalite>;

  constructor(serverless: any, options: any) {
    this.hooks = {
      "before:offline:start:init": this.startHandler.bind(this),
      "before:offline:start": this.startHandler.bind(this),
      "before:offline:start:end": this.endHandler.bind(this),
    };

    this.log = (str: string, pluginName: string) =>
      serverless.cli.log(str, pluginName);
    this.tables = getCreateTableCommandInput(serverless.service.resources);

    if (serverless.service.custom.dynalite?.port != null) {
      this.port = serverless.service.custom.dynalite.port;
    }
  }

  async startHandler() {
    const server = dynalite({ path: this.path });
    await new Promise<void>((resolve) =>
      server.listen(this.port, () => resolve())
    );
    this.server = server;
    const { port } = this.server.address() as AddressInfo;
    this.log(
      `Dynalite listening on http://localhost:${port}`,
      "serverless-dynalite-local"
    );

    const client = new DynamoDBClient({
      endpoint: "http://localhost:4567",
    });

    await Promise.all(
      this.tables.map(async (table) => {
        this.log(
          `Creating table ${table.TableName}`,
          "serverless-dynalite-local"
        );
        try {
          await client.send(new CreateTableCommand(table));
        } catch (e: any) {
          if (e && e.name === "ResourceInUseException") {
            console.log(`Table ${table.TableName} already exists.`);
          } else {
            throw e;
          }
        }
      })
    );
  }

  async endHandler() {
    if (this.server) {
      this.log("Shutting down dynalite server", "serverless-dynalite-local");
      await new Promise<void>((resolve, reject) => {
        this.server!.close((err) => (err ? reject(err) : resolve()));
      });
    }
  }
}
export = ServerlessDynaliteLocal;
