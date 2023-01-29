import * as gitlab from "@pulumi/gitlab";
import * as pulumi from "@pulumi/pulumi";
import * as utils from "../utils";
import type {
    ArgsDict,
    ProjectArgs
} from "./types";
import type {
    ProtectedData
} from "../utils";

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

export interface IGitlabProjectArgs {
    projectConfig: ProjectArgs;
    badges?: ArgsDict;
    hooks?: ArgsDict;
    variables?: ArgsDict;
    accessTokens?: ArgsDict;
}

export interface IGitlabProject {
    name: string;
    project: gitlab.Project;
    badges: IGitlabProjectBadges;
    hooks: IGitlabProjectHooks;
    variables: IGitlabProjectVariables;
    accessTokens: IGitlabProjectAccessToken;
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

    public badges: IGitlabProjectBadges = {};

    public hooks: IGitlabProjectHooks = {};

    public variables: IGitlabProjectVariables = {};

    public accessTokens: IGitlabProjectAccessToken = {};

    /**
     * Constructor of the ComponentResource GitlabProject
     *
     * @param {string} name - Name of the project
     * @param {ProjectArgs} args - Gitlab project arguments
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
        this.addBadges(args);
        this.addHooks(args);
        this.addVariables(args);
        this.addAccessTokens(args);
        this.registerOutputs();
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

}
