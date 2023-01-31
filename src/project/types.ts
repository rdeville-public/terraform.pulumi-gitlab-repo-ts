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
    labels?: ArgsDict;
    badges?: ArgsDict;
    hooks?: ArgsDict;
    variables?: ArgsDict;
    accessTokens?: ArgsDict;
    branches?: ArgsDict;
    protectedBranches?: ArgsDict;
    protectedTags?: ArgsDict;
    deployTokens?: ArgsDict;
    pipelineTriggers?: ArgsDict;
    pipelinesSchedule?: ArgsDict;
    mirrors?: ArgsDict;
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

// Enum
export enum ProjectType {
    default = "default",
    fork = "fork",
    mirror = "mirror"
}
