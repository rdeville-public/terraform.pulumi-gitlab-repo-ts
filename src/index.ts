import * as group from "./group";
import * as project from "./project";
import * as provider from "./provider";
import * as pulumi from "@pulumi/pulumi";
import * as user from "./user";
import type {
    GitlabProject,
    ProjectPulumiConfig,
    ProjectsDict,
    ProjectsPulumiInfo
} from "./project";
import type {
    GitlabProvider,
    ProvidersDict,
    ProvidersPulumiConfig
} from "./provider";
import type {
    GroupPulumiConfig,
    GroupsDict,
    GroupsPulumiInfo
} from "./group";
import type {
    UsersPulumiInfo
} from "./user";


/**
 * [TODO:description]
 *
 * @param {GitlabProvider} mirrorProvider - [TODO:description]
 * @param {GitlabProvider} mainProvider - [TODO:description]
 * @param {GitlabProject} mainProject - [TODO:description]
 * @param {GitlabProject} mirrorProject - [TODO:description]
 */
function appendMirrorProject (
    mirrorProvider: GitlabProvider,
    mainProvider: GitlabProvider,
    mainProject: GitlabProject,
    mirrorProject: GitlabProject
): void {
    const {host} = mirrorProvider.url;
    // const {token} = mirrorProject.accessTokens[mainProvider.name];
    const {username} = mirrorProvider;
    const path = mainProject.project.pathWithNamespace;
    const url = pulumi.all([host, username, path]).
        apply(
            // eslint-disable-next-line @typescript-eslint/no-shadow
            ([host, username, path]) =>
                // eslint-disable-next-line max-len,max-len
                // eslint-disable-next-line max-len,max-len,implicit-arrow-linebreak,@typescript-eslint/restrict-template-expressions,@typescript-eslint/no-base-to-string
                `https://${username}:${mirrorProject.accessTokens[mainProvider.name].token}@${host}/${path}`
        );

    mainProject.appendMirrors(
        mirrorProvider.name,
        {
            "enabled": true,
            "keepDivergentRefs": true,
            "onlyProtectedBranches": true,
            "project": mainProject.project.id,
            url
        }
    );
}

/**
 * [TODO:description]
 *
 * @param {GitlabProvider} mirrorProvider - [TODO:description]
 * @param {GitlabProvider} mainProvider - [TODO:description]
 * @param {ProjectsDict} mainProjects - [TODO:description]
 * @param {ProjectsDict} mirrorProjects - [TODO:description]
 */
function processMirroringProject (
    mirrorProvider: GitlabProvider,
    mainProvider: GitlabProvider,
    mainProjects: ProjectsDict,
    mirrorProjects: ProjectsDict
): void {
    for (const iProject in mirrorProjects) {
        appendMirrorProject(
            mirrorProvider,
            mainProvider,
            mainProjects[iProject],
            mirrorProjects[iProject]
        );
    }
}

/**
 * [TODO:description]
 *
 * @param {GitlabProvider} mirrorProvider - [TODO:description]
 * @param {GitlabProvider} mainProvider - [TODO:description]
 * @param {GroupsDict} mainGroups - [TODO:description]
 * @param {GroupsDict} mirrorGroups - [TODO:description]
 */
function processMirroringGroups (
    mirrorProvider: GitlabProvider,
    mainProvider: GitlabProvider,
    mainGroups: GroupsDict,
    mirrorGroups: GroupsDict
): void {
    for (const iGroup in mirrorGroups) {
        processMirroringProject(
            mirrorProvider,
            mainProvider,
            mainGroups[iGroup].projects,
            mainGroups[iGroup].projects
        );
        processMirroringGroups(
            mirrorProvider,
            mainProvider,
            mainGroups[iGroup].subgroup,
            mirrorGroups[iGroup].subgroup
        );
    }
}

/**
 * [TODO:description]
 *
 * @param {ProvidersDict} providers - [TODO:description]
 */
function processMirroringProviders (providers: ProvidersDict): void {
    const config: pulumi.Config = new pulumi.Config();
    const mainProvider = providers[config.require("gitlabMainProvider")];
    for (const iProvider in providers) {
        if (iProvider !== mainProvider.name) {
            const mirrorProvider = providers[iProvider];
            processMirroringProject(
                mirrorProvider,
                mainProvider,
                mainProvider.projects,
                mirrorProvider.projects
            );
            processMirroringGroups(
                mirrorProvider,
                mainProvider,
                mainProvider.groups,
                mirrorProvider.groups
            );
        }
    }
}
/**
 * Function to deploy of every resources.
 *
 * @returns {ProvidersDict} Provider object with everything in it
 */
function deploy (): ProvidersDict {
    const config: pulumi.Config = new pulumi.Config();

    const providers = provider.initProvider(
        config.requireObject<ProvidersPulumiConfig>("gitlabProviders")
    );

    group.initGroup(
        providers,
        config.getObject<GroupsPulumiInfo>("gitlabGroups"),
        config.getObject<GroupPulumiConfig>("gitlabGroupConfigs")
    );

    project.initProject(
        providers,
        config.getObject<ProjectsPulumiInfo>("gitlabProjects"),
        config.getObject<ProjectPulumiConfig>("gitlabProjectConfigs")
    );

    processMirroringProviders(providers);

    user.initUser(
        providers,
        config.getObject<UsersPulumiInfo>("gitlabUsers")
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
