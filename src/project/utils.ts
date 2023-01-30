import type * as gitlab from "@pulumi/gitlab";
import * as pulumi from "@pulumi/pulumi";
import type {
    ArgsDict,
    ProjectData,
    ProjectInfo,
    ProjectPulumiConfig,
    ProjectsPulumiInfo
} from "./types";
import type {
    GitlabProvider,
    ProvidersDict
} from "../provider";
import {
    genId,
    slugify
} from "../utils";
import type {
    GitlabGroup
} from "../group";
import {
    GitlabProject
} from "./index";

/**
 * Compute project configuration depending on the type of project
 *
 * @param {string} providerName - Name of the gitProvider
 * @param {ProjectPulumiConfig} projectsConfig - Project configuration from the
 *      stack
 * @param {string} [projectType] - Type of the project (default: "default")
 * @returns {gitlab.ProjectArgs} Set of project args corresponding to project
 *      configuration
 */
function computeProjectConfig (
    providerName: string,
    projectsConfig?: ProjectPulumiConfig,
    projectType = "default"
): gitlab.ProjectArgs {
    if (projectsConfig) {
        const config: pulumi.Config = new pulumi.Config();

        const providerProjectConfigs: ProjectPulumiConfig =
            projectsConfig;

        if (
            typeof providerProjectConfigs !== "undefined" &&
            "default" in providerProjectConfigs
        ) {
            if (providerName === config.require("mainProvider")) {
                return providerProjectConfigs.default as gitlab.ProjectArgs;
            }
            return {
                ...providerProjectConfigs.default,
                ...providerProjectConfigs[projectType]
            } as gitlab.ProjectArgs;
        }
    }
    return {} as gitlab.ProjectArgs;
}

/**
 * Compute data, i.e. args and opts for the project
 *
 * @param {GitlabProvider} provider - Provider object
 * @param {ProjectInfo} projectInfo - Information of the project (such as desc,
 *      etc.)
 * @param {string} projectName - Name of the project
 * @param {ProjectPulumiConfig} [projectsConfig] - projectConfigs set in the
 * @param {GitlabGroup} [parentGroup] - Group object that define parent
 *      resources
 * @returns {ProjectData} Object with args and data for Pulumi Group object
 */
function computeProjectData (
    provider: GitlabProvider,
    // Will be used later when other type of group resources will be supported
    projectInfo: ProjectInfo,
    projectName: string,
    projectsConfig?: ProjectPulumiConfig,
    parentGroup?: GitlabGroup
): ProjectData {
    let data: gitlab.ProjectArgs = {
        "path": slugify(projectName)
    };

    if (parentGroup) {
        const parentId: pulumi.Input<number> = parentGroup.group.id.apply(
            (id) => Number(id)
        );

        data = {
            ...data,
            "namespaceId": parentId
        } as gitlab.ProjectArgs;
    }
    return {
        "args": {
            "accessTokens": projectInfo.accessTokens ?? {} as ArgsDict,
            "badges": projectInfo.badges ?? {} as ArgsDict,
            "branches": projectInfo.branches ?? {} as ArgsDict,
            "hooks": projectInfo.hooks ?? {} as ArgsDict,
            "labels": projectInfo.labels ?? {} as ArgsDict,
            "projectConfig": {
                ...computeProjectConfig(
                    provider.name,
                    projectsConfig
                ),
                ...data,
                "name": projectName
            } as gitlab.ProjectArgs,
            "protectedBranches":
                projectInfo.protectedBranches ?? {} as ArgsDict,
            "variables": projectInfo.variables ?? {} as ArgsDict
        },
        "opts": {
            "parent": parentGroup?.group ?? provider,
            "provider": provider.provider
        }
    };
}

/**
 * Create provider supported project
 *
 * @param {GitlabProvider} provider - Provider object
 * @param {string} projectName - Name of the project
 * @param {ProjectInfo} projectInfo - Information of the project (such as desc,
 *      etc.)
 * @param {ProjectPulumiConfig} [projectsConfig] - projectConfigs set in the
 * @param {GitlabGroup} [parentGroup] - Group object that define parent
 *      resources
 */
function createProject (
    provider: GitlabProvider,
    projectName: string,
    projectInfo: ProjectInfo,
    projectsConfig?: ProjectPulumiConfig,
    parentGroup?: GitlabGroup
): void {
    const data = computeProjectData(
        provider,
        projectInfo,
        projectName,
        projectsConfig,
        parentGroup
    );

    const projectNameSlug = slugify(`${projectName}-${genId()}`);
    const currProject = new GitlabProject(
        projectNameSlug,
        data.args,
        data.opts
    );

    if (parentGroup) {
        parentGroup.projects[projectName] = currProject;
    } else {
        provider.projects[projectName] = currProject;
    }
}

/**
 * Process to the deployment of git project for defined providers
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {string} projectName - Name of the project
 * @param {ProjectInfo} projectInfo - Information of the project (such as desc,
 *      etc.)
 * @param {ProjectPulumiConfig} [projectsConfig] - projectConfigs set in the
 * @param {GitlabGroup} [parentGroup] - Group object that define parent
 *      resources
 * @param {string} [parentProvider] - Name of the provider of the parents
 *      resources
 */
function processProjects (
    providers: ProvidersDict,
    projectName: string,
    projectInfo: ProjectInfo,
    projectsConfig?: ProjectPulumiConfig,
    parentGroup?: GitlabGroup,
    parentProvider?: string
): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (parentGroup && parentProvider) {
        createProject(
            providers[parentProvider],
            projectName,
            projectInfo,
            projectsConfig,
            parentGroup
        );
    } else {
        for (const iProvider in providers) {
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (projectInfo.providers?.includes(iProvider)) {
                createProject(
                    providers[iProvider],
                    projectName,
                    projectInfo,
                    projectsConfig,
                    parentGroup
                );
            }
        }
    }
}


/**
 * Initialize the processing of each projects defined in the stack
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {ProjectsPulumiInfo} projectsInfo - projects entry set in the stack
 * @param {ProjectPulumiConfig} [projectsConfig] - projectConfigs set in the
 *      stack
 * @param {GitlabGroup} parentGroup - Group parent of a project
 * @param {string} [parentProvider] - Name of the provider of the parents
 *      resources
 */
export function initProject (
    providers: ProvidersDict,
    projectsInfo: ProjectsPulumiInfo,
    projectsConfig?: ProjectPulumiConfig,
    parentGroup?: GitlabGroup,
    parentProvider?: string
): void {
    for (const iProject in projectsInfo) {
        if ("desc" in projectsInfo[iProject]) {
            processProjects(
                providers,
                iProject,
                projectsInfo[iProject] as ProjectInfo,
                projectsConfig,
                parentGroup,
                parentProvider
            );
        } else if (parentGroup) {
            initProject(
                providers,
                projectsInfo[iProject] as ProjectsPulumiInfo,
                projectsConfig,
                parentGroup.subgroup[iProject],
                parentProvider
            );
        } else {
            for (const iProvider in providers) {
                if (iProvider in providers) {
                    initProject(
                        providers,
                        projectsInfo[iProject] as ProjectsPulumiInfo,
                        projectsConfig,
                        providers[iProvider].groups[iProject],
                        iProvider
                    );
                }
            }
        }
    }
}
