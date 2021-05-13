"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreateTableCommandInput = void 0;
function isDynamoDBResource(resource) {
    return resource.Type === "AWS::DynamoDB::Table";
}
function getCreateTableCommandInput(resources) {
    const flattenedResources = resources.flatMap((r) => Object.values(r.Resources));
    return flattenedResources.filter(isDynamoDBResource).map((r) => r.Properties);
}
exports.getCreateTableCommandInput = getCreateTableCommandInput;
//# sourceMappingURL=util.js.map