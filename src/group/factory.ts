import type {
    GroupData,
    GroupSupportedObject
} from "./types";
import {GitlabGroup} from "./gitlab";


/**
 * Factory design pattern to build multiple type of groups depending on the
 * provider type.
 *
 * @param {string} type - Type of the provider
 * @param {string} name - Name of the group
 * @param {GroupData} data - Groups arguments and pulumi resource options
 * @throws {Error} - If provider is not supported, throw an error
 * @returns {GroupSupportedObject} A group object depending on the provider
 */
export function groupFactory (
    type: string,
    name: string,
    data: GroupData
): GroupSupportedObject {
    if (type === "gitlab") {
        const defaultArgs = {
            "groupConfig": {
                name,
                "path": name
            }
        };
        return new GitlabGroup(name, data.args ?? defaultArgs, data.opts);
    }
    throw new Error(`Groups for provider type not supported: "${type}"`);
}
