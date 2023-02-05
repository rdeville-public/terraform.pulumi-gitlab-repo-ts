import * as utils from "../utils";
import type {
    ProviderData,
    ProviderPulumiConfig,
    ProvidersDict,
    ProvidersPulumiConfig
} from "./index";
import {GitlabProvider} from "./index";

/**
 * Create pulumi git provider corresponding to gitProvider in the stack
 *
 * @param {string} providerName - Name of the provider
 * @param {ProviderPulumiConfig} currProvider - Configuration of the provider
 * @returns {GitlabProvider} Pulumi provider object
 */
function createProvider (
    providerName: string,
    currProvider: ProviderPulumiConfig
): GitlabProvider {
    const token = utils.getValue(providerName, currProvider.config.token);
    const data: ProviderData = {
        "args": {
            "config": {
                "baseUrl": currProvider.config.baseUrl,
                token
            },
            "url": new URL(
                currProvider.config.baseUrl ??
                    "https://gitlab.com/api/v4"
            ),
            "username": currProvider.username
        },
        "opts": {
            "aliases": [{"name": providerName}]
        }
    };
    return new GitlabProvider(
        providerName,
        data.args,
        data.opts
    );
}

/**
 * Initialize the deployment of Providers
 *
 * @param {ProvidersPulumiConfig} providerConfig - Configuration of the
 *      providers
 * @returns {ProvidersDict} Set of Providers objects
 */
export function initProvider (
    providerConfig: ProvidersPulumiConfig
): ProvidersDict {
    const providers: ProvidersDict = {};

    for (const iProvider in providerConfig) {
        providers[iProvider] = createProvider(
            iProvider,
            providerConfig[iProvider]
        );
    }
    return providers;
}
