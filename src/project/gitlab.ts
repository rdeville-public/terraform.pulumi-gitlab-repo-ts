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

interface IGitlabProjectDeployTokens {
    [key: string]: gitlab.DeployToken;
}

interface IGitlabProjectPipelineTriggers {
    [key: string]: gitlab.PipelineTrigger;
}

interface IGitlabProjectPipelineScheduleVariables {
    [key: string]: gitlab.PipelineScheduleVariable;
}

interface IGitlabProjectPipelineScheduled {
    pipeline?: gitlab.PipelineSchedule;
    variables?: IGitlabProjectPipelineScheduleVariables;
}

interface IGitlabProjectPipelinesSchedule {
    [key: string]: IGitlabProjectPipelineScheduled;
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
    deployTokens?: ArgsDict;
    pipelineTriggers?: ArgsDict;
    pipelinesSchedule?: ArgsDict;
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
    deployTokens: IGitlabProjectDeployTokens;
    pipelineTriggers: IGitlabProjectPipelineTriggers;
    pipelinesSchedule: IGitlabProjectPipelinesSchedule;
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

    public deployTokens: IGitlabProjectDeployTokens = {};

    public pipelineTriggers: IGitlabProjectPipelineTriggers = {};

    public pipelinesSchedule: IGitlabProjectPipelinesSchedule = {};

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
        this.addProjectResources(args, opts);
        this.registerOutputs();
    }

    /**
     * Process every possible project related resources.
     *
     * @param {IGitlabProjectArgs} args - GitlabProject arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addProjectResources (
        args: IGitlabProjectArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
        this.addLabels(args, opts);
        this.addBadges(args, opts);
        this.addHooks(args, opts);
        this.addVariables(args, opts);
        this.addAccessTokens(args, opts);
        this.addBranches(args, opts);
        this.addProtectedBranches(args, opts);
        this.addProtectedTags(args, opts);
        this.addDeployTokens(args, opts);
        this.addPipelineTriggers(args, opts);
        this.addPipelinesSchedule(args, opts);
    }

    /**
     * Add labels to the object and create parent relationship
     *
     * @param {IGitlabProjectArgs} args - This pulumi object arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addLabels (
        args: IGitlabProjectArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
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
                        ...opts,
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
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addBadges (
        args: IGitlabProjectArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
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
                        ...opts,
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
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addHooks (
        args: IGitlabProjectArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
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
                        ...opts,
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
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addVariables (
        args: IGitlabProjectArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
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
                        ...opts,
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
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addAccessTokens (
        args: IGitlabProjectArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
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
                        ...opts,
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
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addBranches (
        args: IGitlabProjectArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
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
                        ...opts,
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
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addProtectedBranches (
        args: IGitlabProjectArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
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
                        ...opts,
                        "parent": this.project
                    }
                );
        }
    }

    /**
     * Add protectedTags to the object and create parent relationship
     *
     * @param {IGitlabProjectArgs} args - This pulumi object arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addProtectedTags (
        args: IGitlabProjectArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
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
                            ...opts,
                            "parent": this.project
                        }
                    );
            }
        }
    }

    /**
     * Add deployTokens to the object and create parent relationship
     *
     * @param {IGitlabProjectArgs} args - This pulumi object arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addDeployTokens (
        args: IGitlabProjectArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
        for (const iDeployToken in args.deployTokens) {
            if ("scopes" in args.deployTokens[iDeployToken]) {
                const deployTokenName =
                    `${utils.slugify(iDeployToken)}-${utils.genId()}`;
                this.deployTokens[iDeployToken] =
                    new gitlab.DeployToken(
                        deployTokenName,
                        {
                            ...args.deployTokens[iDeployToken],
                            "project": this.project.id
                        } as gitlab.DeployTokenArgs,
                        {
                            ...opts,
                            "parent": this.project
                        }
                    );
            }
        }
    }

    /**
     * Add pipelineTrigger to the object and create parent relationship
     *
     * @param {IGitlabProjectArgs} args - This pulumi object arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addPipelineTriggers (
        args: IGitlabProjectArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
        for (const iPipelineTrigger in args.pipelineTriggers) {
            if ("description" in args.pipelineTriggers[iPipelineTrigger]) {
                const pipelineTriggerName =
                    `${utils.slugify(iPipelineTrigger)}-${utils.genId()}`;
                this.pipelineTriggers[iPipelineTrigger] =
                    new gitlab.PipelineTrigger(
                        pipelineTriggerName,
                        {
                            ...args.pipelineTriggers[iPipelineTrigger],
                            "project": this.project.id
                        } as gitlab.PipelineTriggerArgs,
                        {
                            ...opts,
                            "parent": this.project
                        }
                    );
            }
        }
    }

    /**
     * Add pipelineTrigger to the object and create parent relationship
     *
     * @param {IGitlabProjectArgs} args - This pulumi object arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addPipelinesSchedule (
        args: IGitlabProjectArgs,
        opts?: pulumi.ComponentResourceOptions
    ): void {
        for (const iPipelineSchedule in args.pipelinesSchedule) {
            if ("cron" in args.pipelinesSchedule[iPipelineSchedule]) {
                const pipelineScheduleName =
                    `${utils.slugify(iPipelineSchedule)}-${utils.genId()}`;
                this.pipelinesSchedule[iPipelineSchedule] = {};
                this.pipelinesSchedule[iPipelineSchedule].pipeline =
                    new gitlab.PipelineSchedule(
                        pipelineScheduleName,
                        {
                            ...args.pipelinesSchedule[iPipelineSchedule],
                            "project": this.project.id
                        } as gitlab.PipelineScheduleArgs,
                        {
                            ...opts,
                            "parent": this.project
                        }
                    );
                this.addPipelineScheduledVariable(
                    this.pipelinesSchedule[iPipelineSchedule],
                    args.pipelinesSchedule[iPipelineSchedule] as
                    IGitlabProjectPipelineScheduleVariables,
                    opts
                );
            }
        }
    }

    /**
     * Add variables to a scheduled pipeline
     *
     * @param {IGitlabProjectPipelineScheduled} pipeline - Previously build
     *      pipeline scheduled
     * @param {IGitlabProjectPipelineScheduleVariables} args - Pulumi args for
     *      pipeline scheduled variables
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addPipelineScheduledVariable (
        pipeline: IGitlabProjectPipelineScheduled,
        args: ArgsDict,
        opts?: pulumi.ComponentResourceOptions
    ): void {
        for (const iVar in args.variables) {
            if (pipeline.pipeline) {
                const pipelineScheduleVariableName =
                    `${utils.slugify(iVar)}-${utils.genId()}`;
                const pipelineId: pulumi.Input<number> = pipeline.pipeline.id.
                    apply(
                        (id) => Number(id)
                    );
                if (!pipeline.variables) {
                    pipeline.variables = {};
                }

                pipeline.variables[iVar] =
                    new gitlab.PipelineScheduleVariable(
                        pipelineScheduleVariableName,
                        {
                            "key": iVar,
                            "pipelineScheduleId": pipelineId,
                            "project": this.project.id,
                            // eslint-disable-next-line max-len
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                            "value": args.variables[iVar]
                        } as gitlab.PipelineScheduleVariableArgs,
                        {
                            ...opts,
                            "parent": pipeline.pipeline
                        }
                    );
            }
        }
    }

}
