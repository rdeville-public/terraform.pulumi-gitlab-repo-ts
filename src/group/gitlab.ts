import * as gitlab from "@pulumi/gitlab";
import type * as project from "../project";
import * as pulumi from "@pulumi/pulumi";
import * as utils from "../utils";
import type {
    ArgsDict
} from "./types";
import type {
    ProtectedData
} from "../utils";

interface IGitlabGroupLabels {
    [key: string]: gitlab.GroupLabel;
}

interface IGitlabGroupBadges {
    [key: string]: gitlab.GroupBadge;
}

interface IGitlabGroupHooks {
    [key: string]: gitlab.GroupHook;
}

interface IGitlabGroupVariable {
    [key: string]: gitlab.GroupVariable;
}

interface IGitlabGroupAccessToken {
    [key: string]: gitlab.GroupAccessToken;
}

export interface IGitlabGroupArgs {
    providerUrl: URL;
    groupConfig: gitlab.GroupArgs;
    labels?: ArgsDict;
    badges?: ArgsDict;
    hooks?: ArgsDict;
    variables?: ArgsDict;
    accessTokens?: ArgsDict;
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
    hooks: IGitlabGroupHooks;
    variables: IGitlabGroupVariable;
    accessTokens: IGitlabGroupAccessToken;
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

    public hooks: IGitlabGroupHooks = {};

    public variables: IGitlabGroupVariable = {};

    public accessTokens: IGitlabGroupAccessToken = {};

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
        super(`gitlab-repo:group:${name}`, name, args, opts);
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
        this.addHooks(args);
        this.addVariables(args);
        this.addAccessTokens(args);
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
                const labelName = `${utils.slugify(iLabel)}`;
                this.labels[iLabel] = new gitlab.GroupLabel(
                    labelName,
                    {
                        ...args.labels[iLabel],
                        "group": this.group.id
                    } as gitlab.GroupLabelArgs,
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
                const badgeName = `${utils.slugify(iBadge)}`;
                this.badges[iBadge] = new gitlab.GroupBadge(
                    badgeName,
                    {
                        ...args.badges[iBadge],
                        "group": this.group.id
                    } as gitlab.GroupBadgeArgs,
                    {
                        "parent": this.group
                    }
                );
            }
        }
    }

    /**
     * Add hooks to the object and create parent relationship
     *
     * @param {IGitlabGroupArgs} args - This pulumi object arguments
     */
    private addHooks (args: IGitlabGroupArgs): void {
        for (const iHook in args.hooks) {
            if ("url" in args.hooks[iHook]) {
                const hookName = `${utils.slugify(iHook)}`;
                this.hooks[iHook] = new gitlab.GroupHook(
                    hookName,
                    {
                        ...args.hooks[iHook],
                        "group": this.group.id,
                        "token": utils.getValue(
                            // eslint-disable-next-line max-len
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            "token", args.hooks[iHook].token as ProtectedData
                        )
                    } as gitlab.GroupHookArgs,
                    {
                        "parent": this.group
                    }
                );
            }
        }
    }

    /**
     * Add variables to the object and create parent relationship
     *
     * @param {IGitlabGroupArgs} args - This pulumi object arguments
     */
    private addVariables (args: IGitlabGroupArgs): void {
        for (const iVariable in args.variables) {
            if ("value" in args.variables[iVariable]) {
                const variableName =
                    `${utils.slugify(iVariable)}`;
                this.variables[iVariable] = new gitlab.GroupVariable(
                    variableName,
                    {
                        ...args.variables[iVariable],
                        "group": this.group.id,
                        "key": iVariable,
                        "value": utils.getValue(
                            "value",
                            // eslint-disable-next-line max-len
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            args.variables[iVariable].value as ProtectedData
                        )
                    } as gitlab.GroupVariableArgs,
                    {
                        "parent": this.group
                    }
                );
            }
        }
    }


    /**
     * Add accessTokens to the object and create parent relationship
     *
     * @param {IGitlabGroupArgs} args - This pulumi object arguments
     */
    private addAccessTokens (args: IGitlabGroupArgs): void {
        for (const iAccessToken in args.accessTokens) {
            if ("scopes" in args.accessTokens[iAccessToken]) {
                const accessTokenName =
                    `${utils.slugify(iAccessToken)}`;
                this.accessTokens[iAccessToken] = new gitlab.GroupAccessToken(
                    accessTokenName,
                    {
                        ...args.accessTokens[iAccessToken],
                        "group": this.group.id
                    } as gitlab.GroupAccessTokenArgs,
                    {
                        "parent": this.group
                    }
                );
            }
        }
    }

}
