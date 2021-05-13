import { CreateTableCommandInput } from "@aws-sdk/client-dynamodb";

type GenericResource = {
  Type: string;
  Properties: any;
};

type DynamoDBResource = {
  Type: "AWS::DynamoDB::Table";
  Properties: {
    TableName: string;
    /**
     * Should probably have typed these out
     */
    AttributeDefinitions: any;
    KeySchema: any;
  };
};

type Resource = DynamoDBResource | GenericResource;

function isDynamoDBResource(resource: Resource): resource is DynamoDBResource {
  return resource.Type === "AWS::DynamoDB::Table";
}

export function getCreateTableCommandInput(
  resources: { Resources: { [key: string]: Resource } }[]
): CreateTableCommandInput[] {
  const flattenedResources = resources.flatMap((r) =>
    Object.values(r.Resources)
  );
  return flattenedResources.filter(isDynamoDBResource).map((r) => r.Properties);
}
