import * as group from "./group";
import * as provider from "./provider";
import * as pulumi from "@pulumi/pulumi";
import type {
    GroupsDict,
    GroupsPulumiConfig,
    GroupsPulumiInfo
} from "./group";
import type {
    ProvidersDict,
    ProvidersPulumiConfig
} from "./provider/types";

interface Output {
    groups: GroupsDict;
    providers: ProvidersDict;
}

/**
 * [TODO:description]
 *
 * @returns {provider.GitlabProvider[]} [TODO:description]
 */
function deploy (): Output {
    const config: pulumi.Config = new pulumi.Config();

    const providers = provider.initProvider(
        config.requireObject<ProvidersPulumiConfig>("gitProvider")
    );

    const groups = group.initGroup(
        providers,
        config.requireObject<GroupsPulumiInfo>("groups"),
        config.requireObject<GroupsPulumiConfig>("groupConfigs")
    );

    return {
        groups,
        providers
    };
}

/**
 * [TODO:description]
 *
 * @returns {boolean} [TODO:description]
 */
function main (): object {
    return deploy();
}

export const output = main();
