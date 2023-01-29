import * as gitlab from "@pulumi/gitlab";
import * as pulumi from "@pulumi/pulumi";
import * as utils from "../utils";
import type {
    ArgsDict,
    ProjectArgs
} from "./types";

interface IGitlabProjectBadges {
    [key: string]: gitlab.ProjectBadge;
}

export interface IGitlabProjectArgs {
    projectConfig: ProjectArgs;
    badges?: ArgsDict;
}

export interface IGitlabProject {
    name: string;
    project: gitlab.Project;
    badges: IGitlabProjectBadges;
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


}
