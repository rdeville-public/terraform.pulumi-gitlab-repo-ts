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

export interface IGitlabProjectArgs {
    projectConfig: ProjectArgs;
    badges?: ArgsDict;
    hooks?: ArgsDict;
}

export interface IGitlabProject {
    name: string;
    project: gitlab.Project;
    badges: IGitlabProjectBadges;
    hooks: IGitlabProjectHooks;
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

    /*
     * public accessTokens: gitlab.ProjectAccessToken[];
     * public badges: gitlab.ProjectBadge[];
     * public hooks: gitlab.ProjectHook[];
     * public mirror: gitlab.ProjectMirror[];
     * public variables: gitlab.ProjectVariable[];
     */

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

}
