import type * as gitlab from "@pulumi/gitlab";
import type * as gitlabProject from "./gitlab";
import type * as pulumi from "@pulumi/pulumi";

// Interface
export interface ProjectData {
    args?: gitlabProject.IGitlabProjectArgs | undefined;
    opts: pulumi.CustomResourceOptions;
}

export interface ProjectInfo {
    providers?: string[];
    desc?: string;
    logo?: string;
    badges?: ArgsDict;
    hooks?: ArgsDict;
    variables?: ArgsDict;
    accessTokens?: ArgsDict;
}

export interface ArgsDict {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface ProjectsPulumiInfo {
    [key: string]: ProjectInfo | ProjectsPulumiInfo;
}

export interface ProjectsDict {
    [key: string]: ProjectSupportedObject;
}

export interface ProjectPulumiConfig {
    [key: string]: pulumi.Inputs | object;
}

export interface ProjectsPulumiConfig {
    [key: string]: ProjectPulumiConfig;
}

export interface ProjectBadgesPulumiConfig {
    [key: string]: ProjectBadgesArgs;
}

export interface ProjectHooksPulumiConfig {
    [key: string]: ProjectHooksArgs;
}

export interface ProjectVariablesPulumiConfig {
    [key: string]: ProjectVariablesArgs;
}

export interface ProjectAccessTokensPulumiConfig {
    [key: string]: ProjectAccessTokensArgs;
}

// Type
// eslint warnings below won't be raised once other provider will be supported
export type ProjectSupportedObject = gitlabProject.GitlabProject;
export type ProjectArgs = gitlab.ProjectArgs;
export type ProjectBadgesArgs = gitlab.ProjectBadgeArgs;
export type ProjectHooksArgs = gitlab.ProjectHookArgs;
export type ProjectVariablesArgs = gitlab.ProjectVariableArgs;
export type ProjectAccessTokensArgs = gitlab.ProjectAccessTokenArgs;

// Enum
export enum ProjectType {
    default = "default",
    fork = "fork",
    mirror = "mirror"
}
