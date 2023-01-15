import * as provider from "./provider/index";
import * as pulumi from "@pulumi/pulumi";
import type {
    ProvidersDict,
    ProvidersPulumiConfig
} from "./provider/types";

/**
 * [TODO:description]
 *
 * @returns {provider.GitlabProvider[]} [TODO:description]
 */
export function deploy (): ProvidersDict {
    const config: pulumi.Config = new pulumi.Config();
    const providers = provider.initProvider(
        config.requireObject<ProvidersPulumiConfig>("gitProvider")
    );
    return providers;
}

/**
 * [TODO:description]
 *
 * @returns {boolean} [TODO:description]
 */
export function main (): boolean {
    deploy();
    return true;
}

main();
