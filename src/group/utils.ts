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
    genId,
    slugify
} from "../utils";
import {
    GitlabGroup
} from "./index";

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
            if (providerName === config.require("mainProvider")) {
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
            "variables": groupInfo.variables ?? {} as ArgsDict
        },
        "opts": {
            "parent": parentGroup?.group ?? provider,
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
    const groupNameSlug = slugify(`${groupName}-${genId()}`);
    const currGroup = new GitlabGroup(
        groupNameSlug,
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
 * Process to the deployment of git groups for defined providers
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {string} groupName - Name of the group
 * @param {GroupInfo} groupInfo - Information of the group (such as desc, etc.)
 * @param {GroupPulumiConfig} groupsConfig - groupConfigs set in the stack
 * @param {GitlabGroup} [parentGroup] - Group object to define subgroup
 */
function processGroups (
    providers: ProvidersDict,
    groupName: string,
    groupInfo: GroupInfo,
    groupsConfig?: GroupPulumiConfig,
    parentGroup?: GitlabGroup
): void {
    if (parentGroup) {
        for (const iProvider in providers) {
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (groupInfo.providers?.includes(iProvider)) {
                createGroup(
                    providers[iProvider],
                    groupName,
                    groupInfo,
                    groupsConfig,
                    parentGroup
                );
            }
        }
    } else {
        for (const iProvider in providers) {
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (groupInfo.providers?.includes(iProvider)) {
                createGroup(
                    providers[iProvider],
                    groupName,
                    groupInfo,
                    groupsConfig
                );
                if (groupInfo.groups) {
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    initGroup(
                        providers,
                        groupInfo.groups,
                        groupsConfig,
                        providers[iProvider].groups[groupName],
                        groupInfo.providers
                    );
                }
            }
        }
    }
}

/**
 * Initialize the processing of each groups defined in the stack
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {GroupsPulumiInfo | undefined} groupsInfo - groups entry set in the
 *      stack
 * @param {GroupPulumiConfig} groupsConfig - groupConfigs set in the stack
 * @param {GitlabGroup} parentGroup - Group parent if group is a
 *      subgroup
 * @param {string[]} [parentProviders] - List of provider used for parent Group
 */
export function initGroup (
    providers: ProvidersDict,
    groupsInfo?: GroupsPulumiInfo,
    groupsConfig?: GroupPulumiConfig,
    parentGroup?: GitlabGroup,
    parentProviders?: string[]
): void {
    for (const iGroup in groupsInfo) {
        if (groupsInfo[iGroup].desc) {
            processGroups(
                providers,
                iGroup,
                {
                    ...groupsInfo[iGroup],
                    "providers": parentProviders ?? groupsInfo[iGroup].providers
                },
                groupsConfig,
                parentGroup
            );
        }
    }
}
