import * as gitlabProvider from "./gitlab";
import type {
    ProviderData,
    ProviderSupportedObject
} from "./types";

/**
 * [TODO:description]
 *
 * @param {string} type - [TODO:description]
 * @param {string} name - [TODO:description]
 * @param {ProviderData} data - [TODO:description]
 * @throws {Error} - [TODO:description]
 * @returns {ProviderSupportedObject} [TODO:description]
 */
export function providerFactory (
    type: string,
    name: string,
    data: ProviderData
): ProviderSupportedObject {
    if (type === "gitlab") {
        return new gitlabProvider.GitlabProvider(name, data.args, data.opts);
    }
    throw new Error(`Git provider type not supported: "${type}"`);
}
