import * as group from "./group";
import * as project from "./project";
import * as provider from "./provider";
import * as pulumi from "@pulumi/pulumi";
import * as user from "./user";
import type {
    GroupPulumiConfig,
    GroupsPulumiInfo
} from "./group";
import type {
    ProjectPulumiConfig,
    ProjectsPulumiInfo
} from "./project";
import type {
    ProvidersDict,
    ProvidersPulumiConfig
} from "./provider";
import type {
    UsersPulumiInfo
} from "./user";

/**
 * Function to deploy of every resources.
 *
 * @returns {ProvidersDict} Provider object with everything in it
 */
function deploy (): ProvidersDict {
    const config: pulumi.Config = new pulumi.Config();

    const providers = provider.initProvider(
        config.requireObject<ProvidersPulumiConfig>("gitProvider")
    );

    group.initGroup(
        providers,
        config.requireObject<GroupsPulumiInfo>("groups"),
        config.getObject<GroupPulumiConfig>("groupConfigs")
    );

    project.initProject(
        providers,
        config.requireObject<ProjectsPulumiInfo>("projects"),
        config.getObject<ProjectPulumiConfig>("projectConfigs")
    );

    user.initUser(
        providers,
        config.getObject<UsersPulumiInfo>("users")
    );

    return providers;
}

/**
 * Main function of the program
 *
 * @returns {ProvidersDict} Provider object with everything in it
 */
function main (): ProvidersDict {
    return deploy();
}

export const output = main();
