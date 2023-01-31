import type * as gitlab from "@pulumi/gitlab";
import * as pulumi from "@pulumi/pulumi";
import type {
    ArgsDict,
    GroupData,
    GroupInfo,
    GroupPulumiConfig,
    GroupsPulumiInfo
} from "./types";
import type {
    GitlabProvider,
    ProvidersDict
} from "../provider";
import {
    GitlabGroup
} from "./index";
import {
    slugify
} from "../utils";

/**
 * Compute group configuration depending on the type of group
 *
 * @param {string} providerName - Name of the gitProvider
 * @param {GroupPulumiConfig} groupConfig - Group configuration from the stack
 * @param {string} [groupType] - Type of the group (default: "default")
 * @returns {gitlab.GroupArgs} Set of group args corresponding to group
 *      configuration
 */
function computeGroupConfig (
    providerName: string,
    groupConfig?: GroupPulumiConfig,
    groupType = "default"
): gitlab.GroupArgs {
    if (groupConfig) {
        const config: pulumi.Config = new pulumi.Config();

        if (
            typeof groupConfig !== "undefined" &&
            "default" in groupConfig
        ) {
            if (providerName === slugify(config.require("mainProvider"))) {
                return groupConfig.default as gitlab.GroupArgs;
            }
            return {
                ...groupConfig.default,
                ...groupConfig[groupType]
            } as gitlab.GroupArgs;
        }
    }

    return {} as gitlab.GroupArgs;
}

/**
 * Compute data, i.e. args and opts for the group
 *
 * @param {GitlabProvider} provider - Provider object
 * @param {GroupInfo} groupInfo - Info of the group
 * @param {string} groupName - Name of the group
 * @param {GroupPulumiConfig} [groupsConfig] - Possible group configurations
 * @param {GitlabGroup} [parentGroup] - Pulumi group object depending
 *      on provider
 * @returns {GroupData} Object with args and data for Pulumi Group object
 */
function computeGroupData (
    provider: GitlabProvider,
    // Will be used later when other type of group resources will be supported
    groupInfo: GroupInfo,
    groupName: string,
    groupsConfig?: GroupPulumiConfig,
    parentGroup?: GitlabGroup
): GroupData {
    let data: gitlab.GroupArgs = {
        "path": slugify(groupName)
    };

    if (parentGroup) {
        const parentId: pulumi.Input<number> = parentGroup.group.id.apply(
            (id) => Number(id)
        );
        data = {
            ...data,
            parentId
        } as gitlab.GroupArgs;
    }
    return {
        "args": {
            "accessTokens": groupInfo.accessTokens ?? {} as ArgsDict,
            "badges": groupInfo.badges ?? {},
            "groupConfig": {
                ...computeGroupConfig(
                    provider.name,
                    groupsConfig
                ),
                ...data,
                "name": groupName
            } as gitlab.GroupArgs,
            "hooks": groupInfo.hooks ?? {} as ArgsDict,
            "labels": groupInfo.labels ?? {} as ArgsDict,
            "providerUrl": provider.url,
            "variables": groupInfo.variables ?? {} as ArgsDict
        },
        "opts": {
            "parent": parentGroup?.group ?? provider.provider,
            "provider": provider.provider
        }
    };
}

/**
 * Create provider supported group
 *
 * @param {GitlabProvider} provider - Provider object
 * @param {string} groupName - Name of the group
 * @param {GroupInfo} groupInfo - Info of the group
 * @param {GroupPulumiConfig} [groupsConfig] - Possible group configurations
 * @param {GitlabGroup} [parentGroup] - Pulumi parent group
 * @returns {GitlabGroup} Pulumi group object depending on provider
 */
function createGroup (
    provider: GitlabProvider,
    groupName: string,
    groupInfo: GroupInfo,
    groupsConfig?: GroupPulumiConfig,
    parentGroup?: GitlabGroup
): GitlabGroup {
    const data = computeGroupData(
        provider, groupInfo, groupName, groupsConfig, parentGroup
    );
    const currGroup = new GitlabGroup(
        `${slugify(groupName)}`,
        data.args,
        data.opts
    );

    if (parentGroup) {
        parentGroup.subgroup[groupName] = currGroup;
    } else {
        provider.groups[groupName] = currGroup;
    }
    return currGroup;
}

/**
 * Process to the deployment of git group for defined providers
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {string} groupName - Name of the group
 * @param {GroupInfo} groupInfo - Information of the group (such as desc,
 *      etc.)
 * @param {GroupPulumiConfig} [groupsConfig] - groupConfigs set in the
 * @param {GitlabGroup} [parentGroup] - Group object that define parent
 *      resources
 * @param {string} [parentProvider] - Name of the provider of the parents
 *      resources
 */
function processGroups (
    providers: ProvidersDict,
    groupName: string,
    groupInfo: GroupInfo,
    groupsConfig?: GroupPulumiConfig,
    parentGroup?: GitlabGroup,
    parentProvider?: string
): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (parentGroup && parentProvider) {
        const currGroup = createGroup(
            providers[parentProvider],
            groupName,
            groupInfo,
            groupsConfig,
            parentGroup
        );
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        initGroup(
            providers,
            groupInfo.groups,
            groupsConfig,
            currGroup,
            parentProvider
        );
    } else if (groupInfo.providers) {
        for (const iProvider in providers) {
            if (groupInfo.providers.includes(iProvider)) {
                const currGroup = createGroup(
                    providers[iProvider],
                    groupName,
                    groupInfo,
                    groupsConfig,
                    providers[iProvider].groups[groupName]
                );
                // eslint-disable-next-line max-len
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                initGroup(
                    providers,
                    groupInfo.groups,
                    groupsConfig,
                    currGroup,
                    iProvider
                );
            }
        }
    }
}

/**
 * Initialize the processing of each groups defined in the stack
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {GroupsPulumiInfo} [groupsInfo] - groups entries set in the stack
 * @param {GroupPulumiConfig} [groupsConfig] - groupsConfig set in the stack
 * @param {GitlabGroup} [parentGroup] - Group parent of the group
 * @param {string} [parentProvider] - Name of the provider of the parents
 *      resources
 */
export function initGroup (
    providers: ProvidersDict,
    groupsInfo?: GroupsPulumiInfo,
    groupsConfig?: GroupPulumiConfig,
    parentGroup?: GitlabGroup,
    parentProvider?: string
): void {
    for (const iGroup in groupsInfo) {
        if (groupsInfo[iGroup].desc) {
            processGroups(
                providers,
                iGroup,
                groupsInfo[iGroup],
                groupsConfig,
                parentGroup,
                parentProvider
            );
        }
    }
}
