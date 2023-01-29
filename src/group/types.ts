import type * as gitlab from "@pulumi/gitlab";
import type * as gitlabGroup from "./gitlab";
import type * as pulumi from "@pulumi/pulumi";

// Interface
export interface GroupData {
    args: gitlabGroup.IGitlabGroupArgs;
    opts: pulumi.CustomResourceOptions;
}

export interface GroupInfo {
    desc: string;
    providers?: string[];
    logo?: string;
    groups?: GroupsPulumiInfo;
    labels?: ArgsDict;
    badges?: ArgsDict;
    hooks?: ArgsDict;
    variables?: ArgsDict;
    accessTokens?: ArgsDict;
}

export interface ArgsDict {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface GroupsPulumiInfo {
    [key: string]: GroupInfo;
}

export interface GroupsDict {
    [key: string]: gitlabGroup.GitlabGroup;
}

export interface GroupPulumiConfig {
    [key: string]: pulumi.Inputs | object;
}

export interface GroupLabelsPulumiConfig {
    [key: string]: gitlab.GroupLabelArgs;
}

export interface GroupBadgesPulumiConfig {
    [key: string]: gitlab.GroupBadgeArgs;
}

export interface GroupHooksPulumiConfig {
    [key: string]: gitlab.GroupHookArgs;
}

export interface GroupVariablesPulumiConfig {
    [key: string]: gitlab.GroupVariableArgs;
}

export interface GroupAccessTokensPulumiConfig {
    [key: string]: gitlab.GroupAccessTokenArgs;
}

// Enum
export enum GroupType {
    default = "default",
    fork = "fork",
    mirror = "mirror"
}
