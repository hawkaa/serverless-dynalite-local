import test from "ava";
import { getCreateTableCommandInput } from "./util";

test("getTableNames should return an empty list if no resources", (t) => {
  t.deepEqual(getCreateTableCommandInput([]), []);
});

test("getTableNames should be able to extract a dynamo db table name", (t) => {
  t.deepEqual(
    getCreateTableCommandInput([
      {
        Resources: {
          MyTable: {
            Type: "AWS::DynamoDB::Table",
            Properties: {
              TableName: "my-table",
              AttributeDefinitions: [
                { AttributeName: "id", AttributeType: "S" },
              ],
              KeySchema: [
                {
                  AttributeName: "id",
                  KeyType: "HASH",
                },
              ],
            },
          },
        },
      },
    ]),
    [
      {
        TableName: "my-table",
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        KeySchema: [
          {
            AttributeName: "id",
            KeyType: "HASH",
          },
        ],
      },
    ]
  );
});

test("getTableNames should be able to extract a dynamo db table names with other resources and different stacks", (t) => {
  t.deepEqual(
    getCreateTableCommandInput([
      {
        Resources: {
          MyTable: {
            Type: "AWS::DynamoDB::Table",
            Properties: {
              TableName: "my-table",
              AttributeDefinitions: [
                { AttributeName: "id", AttributeType: "S" },
              ],
              KeySchema: [
                {
                  AttributeName: "id",
                  KeyType: "HASH",
                },
              ],
            },
          },
          MyIrrelevantS3Bucket: {
            Type: "AWS::S3::Bucket",
            Properties: {
              BucketName: "my-irrelevant-bucket",
            },
          },
        },
      },
      {
        Resources: {
          MyOtherTable: {
            Type: "AWS::DynamoDB::Table",
            Properties: {
              TableName: "my-other-table",
              AttributeDefinitions: [
                { AttributeName: "id", AttributeType: "S" },
              ],
              KeySchema: [
                {
                  AttributeName: "id",
                  KeyType: "HASH",
                },
              ],
            },
          },
        },
      },
    ]),
    [
      {
        TableName: "my-table",
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        KeySchema: [
          {
            AttributeName: "id",
            KeyType: "HASH",
          },
        ],
      },
      {
        TableName: "my-other-table",
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        KeySchema: [
          {
            AttributeName: "id",
            KeyType: "HASH",
          },
        ],
      },
    ]
  );
});
