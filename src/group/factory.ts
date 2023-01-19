import type {
    GroupData,
    GroupSupportedObject
} from "./types";
import {GitlabGroup} from "./gitlab";

/**
 * [TODO:description]
 *
 * @param {string} type - [TODO:description]
 * @param {string} name - [TODO:description]
 * @param {GroupData} data - [TODO:description]
 * @throws {Error} - [TODO:description]
 * @returns {GroupSupportedObject} [TODO:description]
 */
export function groupFactory (
    type: string,
    name: string,
    data: GroupData
): GroupSupportedObject {
    if (type === "gitlab") {
        return new GitlabGroup(name, data.args ?? {"path": name}, data.opts);
    }
    throw new Error(`Groups for provider type not supported: "${type}"`);
}
