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
 * [TODO:description]
 *
 * @param {string} providerName - [TODO:description]
 * @param {ProviderConfig} currProvider - [TODO:description]
 * @returns {ProviderSupportedObject} [TODO:description]
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
 * [TODO:description]
 *
 * @param {ProvidersPulumiConfig} providerConfig - [TODO:description]
 * @returns {ProvidersDict} [TODO:description]
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
