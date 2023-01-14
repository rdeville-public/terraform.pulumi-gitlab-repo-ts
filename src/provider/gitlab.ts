import * as gitlab from "@pulumi/gitlab";
import * as pulumi from "@pulumi/pulumi";

export interface IGitlabProvider {
    name: string;
    provider: gitlab.Provider;
}

/**
 * [TODO:description]
 *
 * @implements {IGitlabProvider} IGitlabProvider
 */
export class GitlabProvider extends pulumi.ComponentResource
    implements IGitlabProvider {

    public name = "";

    public provider: gitlab.Provider;

    /**
     * [TODO:description]
     *
     * @param {string} name - [TODO:description]
     * @param {object} args - [TODO:description]
     * @param {object} opts - [TODO:description]
     */
    public constructor (
        name: string,
        args: gitlab.ProviderArgs,
        opts?: pulumi.CustomResourceOptions
    ) {
        super("git-repo:gitlab-provider", name, args, opts);
        this.name = name;
        this.provider = new gitlab.Provider(
            this.name,
            args,
            {
                ...opts,
                "parent": this
            }
        );
        this.registerOutputs(this.provider.urn);
    }

}
