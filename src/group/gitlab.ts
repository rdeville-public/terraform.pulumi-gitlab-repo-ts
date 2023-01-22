import * as gitlab from "@pulumi/gitlab";
import * as pulumi from "@pulumi/pulumi";
import type {
    GroupArgs
} from "./types";

export interface IGitlabGroup {
    name: string;
    group: gitlab.Group;
    /*
     * accessTokens: gitlab.GroupAccessToken[];
     * badges: gitlab.GroupBadge[];
     * hooks: gitlab.GroupHook[];
     * label: gitlab.GroupLabel[];
     * variables: gitlab.GroupVariable[];
     */
}

/**
 * [TODO:description]
 *
 * @augments pulumi.ComponentResource
 * @implements {IGitlabGroup} IGitlabGroup
 */
export class GitlabGroup extends pulumi.ComponentResource
    implements IGitlabGroup {

    public name: string;

    public group: gitlab.Group;

    /*
     * public accessTokens: gitlab.GroupAccessToken[] = [];
     * public badges: gitlab.GroupBadge[] = [];
     * public hooks: gitlab.GroupHook[] = [];
     * public label: gitlab.GroupLabel[] = [];
     * public variables: gitlab.GroupVariable[] = [];
     */

    /**
     * [TODO:description]
     *
     * @param {string} name - [TODO:description]
     * @param {object} args - [TODO:description]
     * @param {object} opts - [TODO:description]
     */
    public constructor (
        name: string,
        args: GroupArgs,
        opts?: object
    ) {
        super("git-repo:gitlab-group", name, args, opts);
        this.name = name;
        this.group = new gitlab.Group(
            name,
            args,
            {
                ...opts,
                "parent": this
            }
        );
    }

}
