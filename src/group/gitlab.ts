import * as gitlab from "@pulumi/gitlab";
import type * as project from "../project";
import * as pulumi from "@pulumi/pulumi";
import * as utils from "../utils";
import type {
    GroupArgs,
    GroupLabelsPulumiConfig
} from "./types";

interface IGitlabGroupLabels {
    [key: string]: gitlab.GroupLabel;
}

export interface IGitlabGroupArgs {
    groupConfig: GroupArgs;
    labels?: GroupLabelsPulumiConfig;
}

export interface IGitlabSubGroup {
    [key: string]: GitlabGroup;
}

export interface IGitlabGroup {
    name: string;
    group: gitlab.Group;
    subgroup: IGitlabSubGroup;
    projects: project.ProjectsDict;
    labels: IGitlabGroupLabels;
    /*
     * accessTokens: gitlab.GroupAccessToken[];
     * badges: gitlab.GroupBadge[];
     * hooks: gitlab.GroupHook[];
     * variables: gitlab.GroupVariable[];
     */
}


/**
 * Pulumi custom ComponentResource which deploy a gitlab groups and associated
 * resources such as labels, hooks, etc.
 *
 * @augments pulumi.ComponentResource
 * @implements {IGitlabGroup} IGitlabGroup
 */
export class GitlabGroup extends pulumi.ComponentResource
    implements IGitlabGroup {

    public name: string;

    public group: gitlab.Group;

    public subgroup: IGitlabSubGroup = {};

    public projects: project.ProjectsDict = {};

    public labels: IGitlabGroupLabels = {};

    /*
     * public accessTokens: gitlab.GroupAccessToken[] = [];
     * public badges: gitlab.GroupBadge[] = [];
     * public hooks: gitlab.GroupHook[] = [];
     * public label: gitlab.GroupLabel[] = [];
     * public variables: gitlab.GroupVariable[] = [];
     */

    /**
     * Constructor of the ComponentResource GitlabGroup
     *
     * @param {string} name - Name of the group
     * @param {GroupArgs} args - Gitlab group arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     *      options
     */
    public constructor (
        name: string,
        args: IGitlabGroupArgs,
        opts?: pulumi.ComponentResourceOptions
    ) {
        super("git-repo:gitlab-group", name, args, opts);
        this.name = name;
        this.group = new gitlab.Group(
            name,
            args.groupConfig,
            {
                ...opts,
                "parent": this
            }
        );
        this.addLabels(args);
        this.registerOutputs();
    }

    /**
     * Add labels to the object and create parent relationship
     *
     * @param {IGitlabGroupArgs} args - [TODO:description]
     */
    private addLabels (args: IGitlabGroupArgs): void {
        for (const iLabel in args.labels) {
            if ("color" in args.labels[iLabel]) {
                const labelName = `${utils.slugify(iLabel)}-${utils.genId()}`;
                this.labels[iLabel] = new gitlab.GroupLabel(
                    labelName,
                    {
                        ...args.labels[iLabel],
                        "group": this.group.id
                    },
                    {
                        "parent": this.group
                    }
                );
            }
        }
    }

}
