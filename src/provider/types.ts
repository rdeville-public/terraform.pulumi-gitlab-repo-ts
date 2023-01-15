import type * as gitlab from "@pulumi/gitlab";
import type * as gitlabProvider from "./gitlab";
import type * as pulumi from "@pulumi/pulumi";

// Interface
export interface ProviderData {
    args: gitlab.ProviderArgs;
    opts: pulumi.CustomResourceOptions;
}

export interface ProviderConfig {
    baseUrl: string;
    type: string;
    token: string | {[key: string]: string};
}

export interface ProvidersPulumiConfig {
    [key: string]: ProviderConfig;
}

export interface ProvidersDict {
    [key: string]: ProviderSupportedObject;
}

// Type
// eslint warning below will not be raised once other provider will be supported
export type ProviderSupportedObject = gitlabProvider.GitlabProvider;

// Enum
export enum ProviderSupportedType {
    gitlab = "gitlab"
}
