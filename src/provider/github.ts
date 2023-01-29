import * as github from "@pulumi/github";
import type * as group from "../group";
import type * as project from "../project";
import * as pulumi from "@pulumi/pulumi";

export interface IGithubProvider {
    name: string;
    provider: github.Provider;
    groups: group.GroupsDict;
    projects: project.ProjectsDict;
}


/**
 * Pulumi custom ComponentResource which deploy a github provider and its
 * associated API client.
 *
 * @augments pulumi.ComponentResource
 * @implements {IGithubProvider} IGithubProvider
 */
export class GithubProvider extends pulumi.ComponentResource
    implements IGithubProvider {

    public readonly providerType = "github";

    public name = "";

    public provider: github.Provider;

    public groups: group.GroupsDict = {};

    public projects: project.ProjectsDict = {};

    /**
     * Constructor of the ComponentResource GithubProvider
     *
     * @param {string} name - Name of the provider
     * @param {github.ProviderArgs} args - Github provider arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     *      options
     */
    public constructor (
        name: string,
        args: github.ProviderArgs,
        opts?: pulumi.CustomResourceOptions
    ) {
        super(`git-repo:github-provider:${name}`, name, args, opts);
        this.name = name;
        this.provider = new github.Provider(
            this.name,
            args,
            {
                ...opts,
                "parent": this
            }
        );
    }

}
