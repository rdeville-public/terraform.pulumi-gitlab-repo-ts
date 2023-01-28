import * as gitlab from "@pulumi/gitlab";
import * as pulumi from "@pulumi/pulumi";
import type {
    ProjectArgs
} from "./types";

export interface IGitlabProjectArgs {
    projectConfig: ProjectArgs;
}

export interface IGitlabProject {
    name: string;
    project: gitlab.Project;
    /*
     * accessTokens: gitlab.ProjectAccessToken[];
     * badges: gitlab.ProjectBadge[];
     * hooks: gitlab.ProjectHook[];
     * mirror: gitlab.ProjectMirror[];
     * variables: gitlab.ProjectVariable[];
     */
}


/**
 * Pulumi custom ComponentResource which deploy a gitlab projects and associated
 * resources such as labels, hooks, etc.
 *
 * @augments pulumi.ComponentResource
 * @implements {IGitlabProject} IGitlabProject
 */
export class GitlabProject extends pulumi.ComponentResource
    implements IGitlabProject {

    public name: string;

    public project: gitlab.Project;

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
        this.registerOutputs();
    }

}
