import type * as gitlab from "@pulumi/gitlab";
import type * as gitlabProvider from "./gitlab";
import type * as pulumi from "@pulumi/pulumi";
import type {
    ProtectedData
} from "../utils";

// Interface
export interface ProviderData {
    args: ProviderConfigArgs;
    opts: pulumi.CustomResourceOptions;
}

export interface ProviderConfigArgs {
    username: string;
    url?: URL;
    config: gitlab.ProviderArgs;
}

export interface ProviderConfig {
    baseUrl?: string;
    token: ProtectedData;
}

export interface ProviderPulumiConfig {
    username: string;
    config: ProviderConfig;
}

export interface ProvidersPulumiConfig {
    [key: string]: ProviderPulumiConfig;
}

export interface ProvidersDict {
    [key: string]: gitlabProvider.GitlabProvider;
}
