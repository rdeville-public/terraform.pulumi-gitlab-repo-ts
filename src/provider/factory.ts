import type {
    ProviderData,
    ProviderSupportedObject
} from "./types";
import {GithubProvider} from "./github";
import {GitlabProvider} from "./gitlab";

/**
 * Factory design pattern to build multiple type of provider depending on the
 * provider type
 *
 * @param {string} type - Type of the provider
 * @param {string} name - Name of the provider
 * @param {ProviderData} data - Provider arguments and pulumi resource options
 * @throws {Error} - If provider is not supported, throw an error
 * @returns {ProviderSupportedObject} A provider object depending on the
 *  provider
 */
export function providerFactory (
    type: string,
    name: string,
    data: ProviderData
): ProviderSupportedObject {
    if (type === "gitlab") {
        return new GitlabProvider(name, data.args, data.opts);
    } else if (type === "github") {
        return new GithubProvider(name, data.args, data.opts);
    }
    throw new Error(`Git provider type not supported: "${type}"`);
}
