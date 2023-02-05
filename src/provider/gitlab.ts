import * as gitlab from "@pulumi/gitlab";
import type * as group from "../group";
import type * as project from "../project";
import * as pulumi from "@pulumi/pulumi";
import type * as user from "../user";
import * as utils from "../utils";
import type {
    ProviderConfigArgs
} from "./types";

export interface IGitlabProvider {
    name: string;
    url: URL;
    username: string;
    provider: gitlab.Provider;
    groups: group.GroupsDict;
    projects: project.ProjectsDict;
    users: user.UsersDict;
}

/**
 * Pulumi custom ComponentResource which deploy a gitlab provider and its
 * associated API client.
 *
 * @augments pulumi.ComponentResource
 * @implements {IGitlabProvider} IGitlabProvider
 */
export class GitlabProvider extends pulumi.ComponentResource
    implements IGitlabProvider {

    public name = "";

    public username = "";

    public url: URL;

    public provider: gitlab.Provider;

    public groups: group.GroupsDict = {};

    public projects: project.ProjectsDict = {};

    public users: user.UsersDict = {};

    /**
     * Constructor of the ComponentResource GitlabProvider
     *
     * @param {string} name - Name of the provider
     * @param {gitlab.ProviderArgs} args - Gitlab provider arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     *      options
     */
    public constructor (
        name: string,
        args: ProviderConfigArgs,
        opts?: pulumi.CustomResourceOptions
    ) {
        super(`gitlab-repo:provider:${name}`, name, args, opts);
        this.name = `${utils.slugify(name)}`;
        this.url = args.url ?? new URL("https://gitlab.com");
        this.username = args.username;
        this.provider = new gitlab.Provider(
            name,
            args.config,
            {
                ...opts,
                "parent": this
            }
        );
    }

}
