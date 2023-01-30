/* eslint max-lines: 0 */
import * as gitlab from "@pulumi/gitlab";
import * as pulumi from "@pulumi/pulumi";
import * as utils from "../utils";
import type {
    ArgsDict
} from "./types";
import type {
    ProtectedData
} from "../utils";

interface IGitlabProjectLabels {
    [key: string]: gitlab.Label;
}

interface IGitlabProjectBadges {
    [key: string]: gitlab.ProjectBadge;
}

interface IGitlabProjectHooks {
    [key: string]: gitlab.ProjectHook;
}

interface IGitlabProjectVariables {
    [key: string]: gitlab.ProjectVariable;
}

interface IGitlabProjectAccessToken {
    [key: string]: gitlab.ProjectAccessToken;
}

interface IGitlabProjectBranches {
    [key: string]: gitlab.Branch;
}

interface IGitlabProjectProtectBranches {
    [key: string]: gitlab.BranchProtection;
}

interface IGitlabProjectProtectTags {
    [key: string]: gitlab.TagProtection;
}

export interface IGitlabProjectArgs {
    projectConfig: gitlab.ProjectArgs;
    labels?: ArgsDict;
    badges?: ArgsDict;
    hooks?: ArgsDict;
    variables?: ArgsDict;
    accessTokens?: ArgsDict;
    branches?: ArgsDict;
    protectedBranches?: ArgsDict;
    protectedTags?: ArgsDict;
}

export interface IGitlabProject {
    name: string;
    project: gitlab.Project;
    labels: IGitlabProjectLabels;
    badges: IGitlabProjectBadges;
    hooks: IGitlabProjectHooks;
    variables: IGitlabProjectVariables;
    accessTokens: IGitlabProjectAccessToken;
    branches: IGitlabProjectBranches;
    protectedBranches: IGitlabProjectProtectBranches;
    protectedTags: IGitlabProjectProtectTags;
}


/**
 * Pulumi custom ComponentResource which deploy a gitlab projects and associated
 * resources such as badges, hooks, etc.
 *
 * @augments pulumi.ComponentResource
 * @implements {IGitlabProject} IGitlabProject
 */
export class GitlabProject extends pulumi.ComponentResource
    implements IGitlabProject {

    public name: string;

    public project: gitlab.Project;

    public labels: IGitlabProjectLabels = {};

    public badges: IGitlabProjectBadges = {};

    public hooks: IGitlabProjectHooks = {};

    public variables: IGitlabProjectVariables = {};

    public accessTokens: IGitlabProjectAccessToken = {};

    public branches: IGitlabProjectBranches = {};

    public protectedBranches: IGitlabProjectProtectBranches = {};

    public protectedTags: IGitlabProjectProtectTags = {};

    /**
     * Constructor of the ComponentResource GitlabProject
     *
     * @param {string} name - Name of the project
     * @param {gitlab.ProjectArgs} args - Gitlab project arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     *      options
     */
    public constructor (
        name: string,
        args: IGitlabProjectArgs,
        opts?: pulumi.ComponentResourceOptions
    ) {
        super("git-repo:gitlab-project", name, args, opts);
        this.name = name;
        this.project = new gitlab.Project(
            name,
            args.projectConfig,
            {
                ...opts,
                "parent": this
            }
        );
        this.addProjectResources(args);
        this.registerOutputs();
    }

    /**
     * Process every possible project related resources.
     *
     * @param {IGitlabProjectArgs} args - [TODO:description]
     */
    private addProjectResources (args: IGitlabProjectArgs): void {
        this.addLabels(args);
        this.addBadges(args);
        this.addHooks(args);
        this.addVariables(args);
        this.addAccessTokens(args);
        this.addBranches(args);
        this.addProtectedBranches(args);
        this.addProtectedTags(args);
    }

    /**
     * Add labels to the object and create parent relationship
     *
     * @param {IGitlabProjectArgs} args - This pulumi object arguments
     */
    private addLabels (args: IGitlabProjectArgs): void {
        for (const iLabel in args.labels) {
            if ("color" in args.labels[iLabel]) {
                const labelName = `${utils.slugify(iLabel)}-${utils.genId()}`;
                this.labels[iLabel] = new gitlab.Label(
                    labelName,
                    {
                        ...args.labels[iLabel],
                        "project": this.project.id
                    } as gitlab.LabelArgs,
                    {
                        "parent": this.project
                    }
                );
            }
        }
    }

    /**
     * Add badges to the object and create parent relationship
     *
     * @param {IGitlabProjectArgs} args - This pulumi object arguments
     */
    private addBadges (args: IGitlabProjectArgs): void {
        for (const iBadge in args.badges) {
            if ("linkUrl" in args.badges[iBadge]) {
                const badgeName = `${utils.slugify(iBadge)}-${utils.genId()}`;
                this.badges[iBadge] = new gitlab.ProjectBadge(
                    badgeName,
                    {
                        ...args.badges[iBadge],
                        "project": this.project.id
                    } as gitlab.ProjectBadgeArgs,
                    {
                        "parent": this.project
                    }
                );
            }
        }
    }

    /**
     * Add hooks to the object and create parent relationship
     *
     * @param {IGitlabProjectArgs} args - This pulumi object arguments
     */
    private addHooks (args: IGitlabProjectArgs): void {
        for (const iHook in args.hooks) {
            if ("url" in args.hooks[iHook]) {
                const hookName = `${utils.slugify(iHook)}-${utils.genId()}`;
                this.hooks[iHook] = new gitlab.ProjectHook(
                    hookName,
                    {
                        ...args.hooks[iHook],
                        "project": this.project.id,
                        "token": utils.getValue(
                            // eslint-disable-next-line max-len
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            "token", args.hooks[iHook].token as ProtectedData
                        )
                    } as gitlab.ProjectHookArgs,
                    {
                        "parent": this.project
                    }
                );
            }
        }
    }

    /**
     * Add variables to the object and create parent relationship
     *
     * @param {IGitlabProjectArgs} args - This pulumi object arguments
     */
    private addVariables (args: IGitlabProjectArgs): void {
        for (const iVariable in args.variables) {
            if ("value" in args.variables[iVariable]) {
                const variableName =
                    `${utils.slugify(iVariable)}-${utils.genId()}`;
                this.variables[iVariable] = new gitlab.ProjectVariable(
                    variableName,
                    {
                        ...args.variables[iVariable],
                        "key": iVariable,
                        "project": this.project.id,
                        "value": utils.getValue(
                            "value",
                            // eslint-disable-next-line max-len
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            args.variables[iVariable].value as ProtectedData
                        )
                    } as gitlab.ProjectVariableArgs,
                    {
                        "parent": this.project
                    }
                );
            }
        }
    }

    /**
     * Add accessTokens to the object and create parent relationship
     *
     * @param {IGitlabProjectArgs} args - This pulumi object arguments
     */
    private addAccessTokens (args: IGitlabProjectArgs): void {
        for (const iAccessToken in args.accessTokens) {
            if ("scopes" in args.accessTokens[iAccessToken]) {
                const accessTokenName =
                    `${utils.slugify(iAccessToken)}-${utils.genId()}`;
                this.accessTokens[iAccessToken] = new gitlab.ProjectAccessToken(
                    accessTokenName,
                    {
                        ...args.accessTokens[iAccessToken],
                        "project": this.project.id
                    } as gitlab.ProjectAccessTokenArgs,
                    {
                        "parent": this.project
                    }
                );
            }
        }
    }

    /**
     * Add branches to the object and create parent relationship
     *
     * @param {IGitlabProjectArgs} args - This pulumi object arguments
     */
    private addBranches (args: IGitlabProjectArgs): void {
        for (const iBranch in args.branches) {
            if ("ref" in args.branches[iBranch]) {
                const branchName =
                    `${utils.slugify(iBranch)}-${utils.genId()}`;
                this.branches[iBranch] = new gitlab.Branch(
                    branchName,
                    {
                        ...args.branches[iBranch],
                        "project": this.project.id
                    } as gitlab.BranchArgs,
                    {
                        "parent": this.project
                    }
                );
            }
        }
    }

    /**
     * Add protectedBranches to the object and create parent relationship
     *
     * @param {IGitlabProjectArgs} args - This pulumi object arguments
     */
    private addProtectedBranches (args: IGitlabProjectArgs): void {
        for (const iProtectedBranch in args.protectedBranches) {
            const protectedBranchName =
                `${utils.slugify(iProtectedBranch)}-${utils.genId()}`;
            this.protectedBranches[iProtectedBranch] =
                new gitlab.BranchProtection(
                    protectedBranchName,
                    {
                        ...args.protectedBranches[iProtectedBranch],
                        "branch": protectedBranchName,
                        "project": this.project.id
                    } as gitlab.BranchProtectionArgs,
                    {
                        "parent": this.project
                    }
                );
        }
    }

    /**
     * Add protectedTags to the object and create parent relationship
     *
     * @param {IGitlabProjectArgs} args - This pulumi object arguments
     */
    private addProtectedTags (args: IGitlabProjectArgs): void {
        for (const iProtectedTag in args.protectedTags) {
            if ("createAccessLevel" in args.protectedTags[iProtectedTag]) {
                const protectedTagName =
                    `${utils.slugify(iProtectedTag)}-${utils.genId()}`;
                this.protectedTags[iProtectedTag] =
                    new gitlab.TagProtection(
                        protectedTagName,
                        {
                            ...args.protectedTags[iProtectedTag],
                            "project": this.project.id,
                            "tag": protectedTagName
                        } as gitlab.TagProtectionArgs,
                        {
                            "parent": this.project
                        }
                    );
            }
        }
    }

}
