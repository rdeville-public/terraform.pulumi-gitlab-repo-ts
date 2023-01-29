import type * as gitlab from "@pulumi/gitlab";
import type * as gitlabProvider from "./gitlab";
import type * as pulumi from "@pulumi/pulumi";
import type {
    ProtectedData
} from "../utils";

// Interface
export interface ProviderData {
    args: gitlab.ProviderArgs;
    opts: pulumi.CustomResourceOptions;
}

export interface ProviderConfig {
    baseUrl: string;
    type: string;
    token: ProtectedData;
}

export interface ProvidersPulumiConfig {
    [key: string]: ProviderConfig;
}

export interface ProvidersDict {
    [key: string]: gitlabProvider.GitlabProvider;
}
