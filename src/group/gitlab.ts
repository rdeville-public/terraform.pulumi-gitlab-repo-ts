import * as gitlab from "@pulumi/gitlab";
import type * as project from "../project";
import * as pulumi from "@pulumi/pulumi";
import * as utils from "../utils";
import type {
    GroupArgs,
    GroupBadgesPulumiConfig,
    GroupLabelsPulumiConfig
} from "./types";

interface IGitlabGroupLabels {
    [key: string]: gitlab.GroupLabel;
}

interface IGitlabGroupBadges {
    [key: string]: gitlab.GroupBadge;
}


export interface IGitlabGroupArgs {
    groupConfig: GroupArgs;
    labels?: GroupLabelsPulumiConfig;
    badges?: GroupBadgesPulumiConfig;
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
    badges: IGitlabGroupBadges;
    /*
     * accessTokens: gitlab.GroupAccessToken[];
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

    public badges: IGitlabGroupBadges = {};

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
     * @param {IGitlabGroupArgs} args - This pulumi object arguments
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
        this.addBadges(args);
        this.registerOutputs();
    }

    /**
     * Add labels to the object and create parent relationship
     *
     * @param {IGitlabGroupArgs} args - This pulumi object arguments
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


    /**
     * Add badges to the object and create parent relationship
     *
     * @param {IGitlabGroupArgs} args - This pulumi object arguments
     */
    private addBadges (args: IGitlabGroupArgs): void {
        for (const iBadge in args.badges) {
            if ("linkUrl" in args.badges[iBadge]) {
                const badgeName = `${utils.slugify(iBadge)}-${utils.genId()}`;
                this.badges[iBadge] = new gitlab.GroupBadge(
                    badgeName,
                    {
                        ...args.badges[iBadge],
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
