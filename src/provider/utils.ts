import * as log from "../log";
import * as provider from "../provider";
import * as utils from "../utils";
import type {
    ProviderConfig,
    ProviderData,
    ProviderSupportedObject,
    ProvidersDict,
    ProvidersPulumiConfig
} from "./types";
import {ProviderSupportedType} from "./types";


/**
 * Create pulumi git provider corresponding to gitProvider in the stack
 *
 * @param {string} providerName - Name of the provider
 * @param {ProviderConfig} currProvider - configuration of the provider
 * @returns {ProviderSupportedObject} Pulumi provider object
 */
function createProvider (
    providerName: string,
    currProvider: ProviderConfig
): ProviderSupportedObject {
    const token = utils.getValue(providerName, currProvider.token);
    const data: ProviderData = {
        "args": {
            "baseUrl": currProvider.baseUrl,
            token
        },
        "opts": {
            "aliases": [{"name": providerName}]
        }
    };
    return provider.providerFactory(
        currProvider.type,
        providerName,
        data
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
        if (providerConfig[iProvider].type in ProviderSupportedType) {
            providers[iProvider] = createProvider(
                iProvider,
                providerConfig[iProvider]
            );
        } else {
            log.warn(
                "Provider type is not supported at all: " +
                `${providerConfig[iProvider].type}`
            );
        }
    }
    return providers;
}
