"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const dynalite_1 = __importDefault(require("dynalite"));
const util_1 = require("./util");
class ServerlessDynaliteLocal {
    constructor(serverless, options) {
        // Hard coded port for dynalite
        this.port = 4567;
        this.path = "./dynalite";
        this.hooks = {
            "before:offline:start:init": this.startHandler.bind(this),
            "before:offline:start": this.startHandler.bind(this),
            "before:offline:start:end": this.endHandler.bind(this),
        };
        this.log = (str, pluginName) => serverless.cli.log(str, pluginName);
        this.tables = util_1.getCreateTableCommandInput(serverless.service.resources);
    }
    async startHandler() {
        const server = dynalite_1.default({ path: this.path });
        await new Promise((resolve, reject) => server.listen(this.port, (err) => err ? reject(err) : resolve()));
        this.server = server;
        this.log(`Dynalite listening on http://localhost:${this.port}`, "serverless-dynalite-local");
        const client = new client_dynamodb_1.DynamoDBClient({
            endpoint: "http://localhost:4567",
        });
        await Promise.all(this.tables.map(async (table) => {
            this.log(`Creating table ${table.TableName}`, "serverless-dynalite-local");
            try {
                await client.send(new client_dynamodb_1.CreateTableCommand(table));
            }
            catch (e) {
                if (e && e.name === "ResourceInUseException") {
                    console.log(`Table ${table.TableName} already exists.`);
                }
                else {
                    throw e;
                }
            }
        }));
    }
    async endHandler() {
        if (this.server) {
            this.log("Shutting down dynalite server", "serverless-dynalite-local");
            await new Promise((resolve, reject) => {
                this.server.close((err) => (err ? reject(err) : resolve()));
            });
        }
    }
}
module.exports = ServerlessDynaliteLocal;
//# sourceMappingURL=index.js.map