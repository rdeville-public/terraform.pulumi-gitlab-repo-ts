import type * as gitlab from "@pulumi/gitlab";
import type * as gitlabProject from "./gitlab";
import type * as pulumi from "@pulumi/pulumi";

// Interface
export interface ProjectData {
    args: gitlabProject.IGitlabProjectArgs;
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
    [key: string]: gitlabProject.GitlabProject;
}

export interface ProjectPulumiConfig {
    [key: string]: pulumi.Inputs | object;
}

export interface ProjectBadgesPulumiConfig {
    [key: string]: gitlab.ProjectBadgeArgs;
}

export interface ProjectHooksPulumiConfig {
    [key: string]: gitlab.ProjectHookArgs;
}

export interface ProjectVariablesPulumiConfig {
    [key: string]: gitlab.ProjectVariableArgs;
}

export interface ProjectAccessTokensPulumiConfig {
    [key: string]: gitlab.ProjectAccessTokenArgs;
}

// Enum
export enum ProjectType {
    default = "default",
    fork = "fork",
    mirror = "mirror"
}
