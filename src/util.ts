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

type AWSResourceList = { Resources: { [key: string]: Resource } }

export function getCreateTableCommandInput(
  resources: AWSResourceList[] | AWSResourceList
): CreateTableCommandInput[] {
  const resourcesList = Array.isArray(resources) ? resources : [resources];
  const flattenedResources = resourcesList.flatMap((r) =>
    Object.values(r.Resources)
  );
  return flattenedResources.filter(isDynamoDBResource).map((r) => r.Properties);
}
