import * as project from "../project";
import * as pulumi from "@pulumi/pulumi";
import type {
    ArgsDict,
    ProjectArgs,
    ProjectData,
    ProjectInfo,
    ProjectPulumiConfig,
    ProjectsPulumiConfig,
    ProjectsPulumiInfo
} from "./types";
import type {
    ProviderSupportedObject,
    ProvidersDict
} from "../provider";
import {
    genId,
    slugify
} from "../utils";

import type {
    GroupSupportedObject
} from "../group";

/**
 * Compute project configuration depending on the type of project
 *
 * @param {string} providerName - Name of the gitProvider
 * @param {string} providerType - Type of the gitProvider
 * @param {ProjectsPulumiConfig} projectsConfig - Project configuration from the
 *      stack
 * @param {string} [projectType] - Type of the project (default: "default")
 * @returns {ProjectArgs} Set of project args corresponding to project
 *      configuration
 */
function computeProjectConfig (
    providerName: string,
    providerType: string,
    projectsConfig?: ProjectsPulumiConfig,
    projectType = "default"
): ProjectArgs {
    if (projectsConfig) {
        const config: pulumi.Config = new pulumi.Config();

        const providerProjectConfigs: ProjectPulumiConfig =
            projectsConfig[providerType];

        if (
            typeof providerProjectConfigs !== "undefined" &&
            "default" in providerProjectConfigs
        ) {
            if (providerName === config.require("mainProvider")) {
                return providerProjectConfigs.default as ProjectArgs;
            }
            return {
                ...providerProjectConfigs.default,
                ...providerProjectConfigs[projectType]
            } as ProjectArgs;
        }
    }
    return {} as ProjectArgs;
}

/**
 * Compute data, i.e. args and opts for the project
 *
 * @param {ProviderSupportedObject} provider - Provider object
 * @param {ProjectInfo} projectInfo - Information of the project (such as desc,
 *      etc.)
 * @param {string} projectName - Name of the project
 * @param {ProjectsPulumiConfig} [projectsConfig] - projectConfigs set in the
 * @param {GroupSupportedObject} [parentGroup] - Group object that define parent
 *      resources
 * @returns {ProjectData} Object with args and data for Pulumi Group object
 */
function computeProjectData (
    provider: ProviderSupportedObject,
    // Will be used later when other type of group resources will be supported
    projectInfo: ProjectInfo,
    projectName: string,
    projectsConfig?: ProjectsPulumiConfig,
    parentGroup?: GroupSupportedObject
): ProjectData {
    let data: ProjectArgs = {
        "path": slugify(projectName)
    };

    if (parentGroup) {
        const parentId: pulumi.Input<number> = parentGroup.group.id.apply(
            (id) => Number(id)
        );

        data = {
            ...data,
            "namespaceId": parentId
        } as ProjectArgs;
    }
    return {
        "args": {
            "accessTokens": projectInfo.accessTokens ?? {} as ArgsDict,
            "badges": projectInfo.badges ?? {} as ArgsDict,
            "hooks": projectInfo.hooks ?? {} as ArgsDict,
            "projectConfig": {
                ...computeProjectConfig(
                    provider.name,
                    provider.providerType,
                    projectsConfig
                ),
                ...data,
                "name": projectName
            } as ProjectArgs,
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
 * @param {ProviderSupportedObject} provider - Provider object
 * @param {string} projectName - Name of the project
 * @param {ProjectInfo} projectInfo - Information of the project (such as desc,
 *      etc.)
 * @param {ProjectsPulumiConfig} [projectsConfig] - projectConfigs set in the
 * @param {GroupSupportedObject} [parentGroup] - Group object that define parent
 *      resources
 */
function createProject (
    provider: ProviderSupportedObject,
    projectName: string,
    projectInfo: ProjectInfo,
    projectsConfig?: ProjectsPulumiConfig,
    parentGroup?: GroupSupportedObject
): void {
    const data = computeProjectData(
        provider,
        projectInfo,
        projectName,
        projectsConfig,
        parentGroup
    );

    const projectNameSlug = slugify(`${projectName}-${genId()}`);
    const currProject = project.projectFactory(
        provider.providerType, projectNameSlug, data
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
 * @param {ProjectsPulumiConfig} [projectsConfig] - projectConfigs set in the
 * @param {GroupSupportedObject} [parentGroup] - Group object that define parent
 *      resources
 * @param {string} [parentProvider] - Name of the provider of the parents
 *      resources
 */
function processProjects (
    providers: ProvidersDict,
    projectName: string,
    projectInfo: ProjectInfo,
    projectsConfig?: ProjectsPulumiConfig,
    parentGroup?: GroupSupportedObject,
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
 * @param {ProjectsPulumiConfig} [projectsConfig] - projectConfigs set in the
 *      stack
 * @param {GroupSupportedObject} parentGroup - Group parent of a project
 * @param {string} [parentProvider] - Name of the provider of the parents
 *      resources
 */
export function initProject (
    providers: ProvidersDict,
    projectsInfo: ProjectsPulumiInfo,
    projectsConfig?: ProjectsPulumiConfig,
    parentGroup?: GroupSupportedObject,
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
