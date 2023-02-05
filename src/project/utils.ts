/* eslint max-lines: 0 */
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
    GitlabGroup
} from "../group";
import {
    GitlabProject
} from "./index";
import type {
    IGitlabProjectArgs
} from "./gitlab";
import type {
    ProvidersDict
} from "../provider";
import {
    slugify
} from "../utils";

interface IProviderStruct {
    name: string;
    providers: ProvidersDict;
}


interface IProjectStruct {
    info: ProjectInfo;
    name: string;
}

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
 * [TODO:description]
 *
 * @param {string} providerName - [TODO:description]
 * @param {IGitlabProjectArgs} data - [TODO:description]
 */
function computeProjectMirror (
    providerName: string,
    data: IGitlabProjectArgs
): void {
    const config: pulumi.Config = new pulumi.Config();
    if (providerName !== config.require("mainProvider")) {
        // AccessToken should be initialized earlier
        if (data.accessTokens) {
            data.accessTokens[config.require("mainProvider")] = {
                "scopes": ["write_repository"]
            };
        }
    }
}

/**
 *
 * @param {string} providerName - Name of the provider to use
 * @param {ProjectInfo} projectInfo - Information of the project (such as desc,
 *      etc.)
 * @param {string} projectName - Name of the project
 */

/**
 * Compute GitlabProject arguments
 *
 * @param {IProviderStruct} provider - Provider information object with name
 *      and providers pulumi resource dictionary
 * @param {IProjectStruct} project - Project information object with name
 *      and project info from the stack
 * @param {gitlab.ProjectArgs} data - Set of already partially computed
 *      GitlabProject data (args and opts)
 * @param {ProjectPulumiConfig} [projectsConfig] - projectConfigs set in the
 * @param {string[]} [parent] - List of parent resource name
 * @returns {IGitlabProjectArgs} Set of compute GitlabProjectArgs
 */
function computeProjectArgs (
    provider: IProviderStruct,
    project: IProjectStruct,
    data: gitlab.ProjectArgs,
    projectsConfig?: ProjectPulumiConfig,
    parent?: string[]
): IGitlabProjectArgs {
    const projectData: IGitlabProjectArgs = {
        "accessTokens": project.info.accessTokens ?? {} as ArgsDict,
        "badges": project.info.badges ?? {} as ArgsDict,
        "branches": project.info.branches ?? {} as ArgsDict,
        "deployTokens": project.info.deployTokens ?? {} as ArgsDict,
        "hooks": project.info.hooks ?? {} as ArgsDict,
        "labels": project.info.labels ?? {} as ArgsDict,
        "mirrors": project.info.mirrors ?? {} as ArgsDict,
        "parent": parent ?? [],
        "pipelineTriggers":
            project.info.pipelineTriggers ?? {} as ArgsDict,
        "pipelinesSchedule":
            project.info.pipelinesSchedule ?? {} as ArgsDict,
        "projectConfig": {
            ...computeProjectConfig(
                provider.name,
                projectsConfig
            ),
            ...data,
            "name": project.name
        } as gitlab.ProjectArgs,
        "protectedBranches":
            project.info.protectedBranches ?? {} as ArgsDict,
        "protectedTags":
            project.info.protectedTags ?? {} as ArgsDict,
        "provider": provider.providers[provider.name],
        "providers": provider.providers,
        "variables": project.info.variables ?? {} as ArgsDict
    };
    computeProjectMirror(provider.name, projectData);
    return projectData;
}

/**
 * Compute data, i.e. args and opts for the project
 *
 * @param {IProviderStruct} provider - Provider information object with name
 *      and providers pulumi resource dictionary
 * @param {IProjectStruct} project - Project information object with name
 *      and project info from the stack
 * @param {GitlabGroup} [parentGroup] - Group object that define parent
 *      resources
 * @param {ProjectPulumiConfig} [projectsConfig] - projectConfigs set in the
 * @param {string[]} [parent] - List of parent resource name
 * @returns {IGitlabProjectArgs} Set of compute GitlabProjectArgs
 */
function computeProjectData (
    provider: IProviderStruct,
    project: IProjectStruct,
    parentGroup?: GitlabGroup,
    projectsConfig?: ProjectPulumiConfig,
    parent?: string[]
): ProjectData {
    let data: gitlab.ProjectArgs = {
        "path": slugify(project.name)
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
        "args": computeProjectArgs(
            provider,
            project,
            data,
            projectsConfig,
            parent
        ),
        "opts": {
            "parent": parentGroup?.group ?? provider.providers[provider.name],
            "provider": provider.providers[provider.name].provider
        }
    };
}

/**
 *
 * Create provider supported project
 *
 * @param {IProviderStruct} provider - Provider information object with name
 *      and providers pulumi resource dictionary
 * @param {IProjectStruct} project - Project information object with name
 *      and project info from the stack
 * @param {ProjectPulumiConfig} [projectsConfig] - projectConfigs set in the
 * @param {GitlabGroup} [parentGroup] - Group object that define parent
 *      resources
 * @param {string[]} [parent] - List of parent resource name
 */
function createProject (
    provider: IProviderStruct,
    project: IProjectStruct,
    projectsConfig?: ProjectPulumiConfig,
    parentGroup?: GitlabGroup,
    parent?: string[]
): void {
    const data = computeProjectData(
        provider,
        project,
        parentGroup,
        projectsConfig,
        parent
    );

    const projectNameSlug = slugify(`${project.name}`);
    const currProject = new GitlabProject(
        projectNameSlug,
        data.args,
        data.opts
    );

    if (parentGroup) {
        parentGroup.projects[project.name] = currProject;
    } else {
        provider.providers[provider.name].projects[project.name] = currProject;
    }
}

/**
 *
 * Process to the deployment of git project for defined providers
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {IProjectStruct} project - Project information object with name
 *      and project info from the stack
 * @param {ProjectPulumiConfig} [projectsConfig] - projectConfigs set in the
 * @param {GitlabGroup} [parentGroup] - Group object that define parent
 *      resources
 * @param {string} [parentProvider] - Name of the provider of the parents
 *      resources
 * @param {string[]} [parent] - List of parent resource name
 */
function processProjects (
    providers: ProvidersDict,
    project: IProjectStruct,
    projectsConfig?: ProjectPulumiConfig,
    parentGroup?: GitlabGroup,
    parentProvider?: string,
    parent?: string[]
): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (parentGroup && parentProvider) {
        createProject(
            {
                "name": parentProvider,
                providers
            },
            project,
            projectsConfig,
            parentGroup,
            parent
        );
    } else {
        for (const iProvider in providers) {
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (project.info.providers?.includes(iProvider)) {
                createProject(
                    {
                        "name": iProvider,
                        providers
                    },
                    project,
                    projectsConfig,
                    parentGroup,
                    parent
                );
            }
        }
    }
}

/**
 * Initialize the processing of each projects defined in the stack
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {ProjectsPulumiInfo} [projectsInfo] - projects entry set in the stack
 * @param {ProjectPulumiConfig} [projectsConfig] - projectConfigs set in the
 *      stack
 * @param {GitlabGroup} parentGroup - Group parent of a project
 * @param {string} [parentProvider] - Name of the provider of the parents
 *      resources
 */
export function initProject (
    providers: ProvidersDict,
    projectsInfo?: ProjectsPulumiInfo,
    projectsConfig?: ProjectPulumiConfig,
    parentGroup?: GitlabGroup,
    parentProvider?: string
): void {
    for (const iProject in projectsInfo) {
        if ("desc" in projectsInfo[iProject]) {
            processProjects(
                providers,
                {
                    "info": projectsInfo[iProject] as ProjectInfo,
                    "name": iProject
                },
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
