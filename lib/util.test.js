"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const util_1 = require("./util");
ava_1.default("getTableNames should return an empty list if no resources", (t) => {
    t.deepEqual(util_1.getCreateTableCommandInput([]), []);
});
ava_1.default("getTableNames should be able to extract a dynamo db table name", (t) => {
    t.deepEqual(util_1.getCreateTableCommandInput([
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
    ]), [
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
    ]);
});
ava_1.default("getTableNames should be able to extract a dynamo db table names with other resources and different stacks", (t) => {
    t.deepEqual(util_1.getCreateTableCommandInput([
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
    ]), [
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
    ]);
});
//# sourceMappingURL=util.test.js.map