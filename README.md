# serverless-dynalite-local

Serverless plugin to run DynamoDB locally with `dynalite`.

## Motivation

When developing services in the
[Serverless Application Framework](https://www.serverless.com/), it is common
to use the `serverless-offline` plugin for local development. This plugin will
enable you to run a local instance of DynamoDB,
[dynalite](https://github.com/mhart/dynalite) as well.

There are already some plugins out there that serves the same purpose, but they
have some challenges.

- [serverless-dynamodb-local](https://github.com/99x/serverless-dynamodb-local)
  has a hard dependency on JRE, and is created to download the DynamoDB \*.jar
  file before starting. While this might work on a local developer computer,
  it does not in a CI/CD environment. In addition, the serverless plugin does
  not support v2 and up.
- [serverless-dynalite](https://github.com/sdd/serverless-dynalite) comes with
  node-only dependencies, but has been unmaintained for a while and does not
  work on newer node runtimes.

We have, therefore, decided to create a new plugin which overcome the challenges
from the above two plugins. We also have taken inspiration from
[serverless-s3-local](https://github.com/ar90n/serverless-s3-local), which does
the same for AWS S3 with [s3rver](https://github.com/jamhall/s3rver).

## Usage

Install the plugin with `yarn add --dev serverless-dynalite-local`. Add
`serverless-dynalite-local` to your `serverless.yml` `plugins` key, BEFORE
`serverless-offline`.

By default the server will start up at `http://localhost:4567` and use
`dynalite/` as a data directory. Connect to the database like this:

```typescript
const client = new DynamoDBClient({
  endpoint: "http://localhost:4567",
});
```

The following options are supported in `custom.dynalite` in `serverless.yml`:

| Option | Description | Type | Default value |
| ------ | ----------- | ---- | ------------- |
| port   | The port that Dynalite will listen to | number | 4567 |

## Future plans

In it's current state, this plugin is very much untested in real use cases. The
top priority is to make sure this works in actual use cases.

Next up is to improve the documentation and also explain how the underlying
dynalite server can be used to run unit tests in Node.js projects.

In addition to this, we should make the plugin a little more configurable, and
add some CI/CD for running tests, lint checks, and deployment.

## I want to contribute to this library

Please see [CONTRIBUTING.md](CONTRIBUTING.md).
