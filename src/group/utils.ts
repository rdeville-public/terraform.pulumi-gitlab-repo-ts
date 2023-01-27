import * as group from "../group";
import * as log from "../log";
import * as pulumi from "@pulumi/pulumi";
import type {
    GitlabProvider,
    ProviderSupportedObject,
    ProvidersDict
} from "../provider";
import type {
    GroupArgs,
    GroupData,
    GroupInfo,
    GroupOutput,
    GroupPulumiConfig,
    GroupSupportedObject,
    GroupsDict,
    GroupsOutput,
    GroupsPulumiConfig,
    GroupsPulumiInfo
} from "./types";

/**
 * Compute group configuration depending on the type of group
 *
 * @param {string} providerName - Name of the gitProvider
 * @param {string} providerType - Type of the gitProvider
 * @param {GroupsPulumiConfig} groupsConfig - Group configuration from the stack
 * @param {string} [groupType] - Type of the group (default: "default")
 * @returns {GroupArgs} Set of group args corresponding to group configuration
 */
function computeGroupConfig (
    providerName: string,
    providerType: string,
    groupsConfig: GroupsPulumiConfig,
    groupType = "default"
): GroupArgs {
    const config: pulumi.Config = new pulumi.Config();

    const providerGroupConfigs: GroupPulumiConfig = groupsConfig[providerType];

    if (
        typeof providerGroupConfigs !== "undefined" &&
        "default" in providerGroupConfigs
    ) {
        if (providerName === config.require("mainProvider")) {
            return providerGroupConfigs.default as GroupArgs;
        }
        return {
            ...providerGroupConfigs.default,
            ...providerGroupConfigs[groupType]
        } as GroupArgs;
    }
    return {} as GroupArgs;
}

/**
 * [TODO:description]
 *
 * @param {GitlabProvider} provider - [TODO:description]
 * @param {GroupsPulumiConfig} groupsConfig - [TODO:description]
 * @param {GroupInfo} groupInfo - [TODO:description]
 * @param {string} groupName - [TODO:description]
 * @param {GroupSupportedObject} [parentGroup] - [TODO:description]
 * @returns {GroupData} [TODO:description]
 */
function computeGroupData (
    provider: GitlabProvider,
    groupsConfig: GroupsPulumiConfig,
    groupInfo: GroupInfo,
    groupName: string,
    parentGroup?: GroupSupportedObject
): GroupData {
    let data: GroupArgs = {
        "path": groupName.
            replace(/ /ugi, "-").
            replace(/---/ugi, "-").
            toLowerCase()
    };

    if (parentGroup) {
        const parentId: pulumi.Input<number> = parentGroup.group.id.apply(
            (id) => Number(id)
        );
        data = {
            ...data,
            parentId
        } as GroupArgs;
    }
    return {
        "args": {
            "groupConfig": {
                ...computeGroupConfig(
                    provider.name,
                    provider.providerType,
                    groupsConfig
                ),
                ...data,
                "name": groupName
            } as GroupArgs,
            provider
        },
        "opts": {
            "parent": parentGroup ?? provider,
            "provider": provider.provider
        }
    };
}

/**
 * [TODO:description]
 *
 * @param {ProviderSupportedObject} provider - [TODO:description]
 * @param {string} groupName - [TODO:description]
 * @param {GroupInfo} groupInfo - [TODO:description]
 * @param {GroupsPulumiConfig} groupsConfig - [TODO:description]
 * @param {ProvidersDict} providers - [TODO:description]
 * @param {GroupSupportedObject} [parentGroup] - [TODO:description]
 * @returns {GroupOutput} [TODO:description]
 */
function createGroup (
    provider: ProviderSupportedObject,
    groupName: string,
    groupInfo: GroupInfo,
    groupsConfig: GroupsPulumiConfig,
    providers: ProvidersDict,
    parentGroup?: GroupSupportedObject
): GroupOutput {
    const data = computeGroupData(
        provider, groupsConfig, groupInfo, groupName, parentGroup
    );
    const currGroup = group.groupFactory(
        provider.providerType, groupName, data
    );

    return {
        "group": currGroup,
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        "subgroup": initGroup(
            providers, groupsConfig, groupInfo.groups, currGroup
        )
    };
}

/**
 * Process to the deployment of git groups for defined providers
 *
 * @param {string} groupName - Name of the group
 * @param {GroupInfo} groupInfo - Information of the group (such as desc, etc.)
 * @param {GroupsPulumiConfig} groupsConfig - groupConfigs set in the stack
 * @param {ProvidersDict} providers - Set of providers
 * @param {GroupSupportedObject} [parentGroup] - Group object to define subgroup
 * @returns {GroupSupportedObject[]} List of groups deployed
 */
function processGroups (
    groupName: string,
    groupInfo: GroupInfo,
    groupsConfig: GroupsPulumiConfig,
    providers: ProvidersDict,
    parentGroup?: GroupSupportedObject
): GroupsOutput {
    const groups: GroupsOutput = {};
    if (parentGroup?.provider) {
        groups[parentGroup.provider.name] = createGroup(
            parentGroup.provider,
            groupName,
            groupInfo,
            groupsConfig,
            providers,
            parentGroup
        );
    } else {
        for (const iProvider of groupInfo.provider) {
            if (iProvider in providers) {
                groups[iProvider] = createGroup(
                    providers[iProvider],
                    groupName,
                    groupInfo,
                    groupsConfig,
                    providers
                );
            } else {
                log.warn(
                    "TODO: Implement 'fork' in createGroup() groups/utils.ts"
                );
            }
        }
    }
    return groups;
}

/**
 * Initialize the processing of each groups defined in the stack
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {GroupsPulumiConfig} groupsConfig - groupConfigs set in the stack
 * @param {GroupsPulumiInfo} groupsInfo - groups entry set in the stack
 * @param {GroupSupportedObject} parentGroup - Group parent if group is a
 *      subgroup
 * @returns {GroupsDict} Set of groups deployed
 */
export function initGroup (
    providers: ProvidersDict,
    groupsConfig: GroupsPulumiConfig,
    groupsInfo?: GroupsPulumiInfo,
    parentGroup?: GroupSupportedObject
): GroupsDict {
    const groups: GroupsDict = {};

    for (const iGroup in groupsInfo) {
        if (groupsInfo[iGroup].desc) {
            groups[iGroup] = processGroups(
                iGroup,
                groupsInfo[iGroup],
                groupsConfig,
                providers,
                parentGroup
            );
        }
    }
    return groups;
}
