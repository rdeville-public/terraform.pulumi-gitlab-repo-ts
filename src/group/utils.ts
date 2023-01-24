import * as group from "../group";
import * as log from "../log";
import * as pulumi from "@pulumi/pulumi";
import type {
    GroupArgs,
    GroupInfo,
    GroupPulumiConfig,
    GroupSupportedObject,
    GroupsDict,
    GroupsPulumiConfig,
    GroupsPulumiInfo
} from "./types";
import type {ProvidersDict} from "../provider";

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
    // eslint-disable-next-line
    parentGroup?: GroupSupportedObject
): GroupSupportedObject[] {
    const groups = [];
    for (const iProvider of groupInfo.provider) {
        if (iProvider in providers) {
            const provider = providers[iProvider];
            const data = {
                "args": {
                    ...computeGroupConfig(
                        provider.name,
                        provider.providerType,
                        groupsConfig
                    ),
                    "name": groupName,
                    "path": groupName
                },
                "opts": {
                    "parent": provider,
                    "provider": provider.provider
                }
            };
            groups.push(
                group.groupFactory(provider.providerType, groupName, data)
            );
        } else {
            log.warn("TODO: Implement 'fork' in createGroup() groups/utils.ts");
        }
    }
    return groups;
}

/**
 * Initialize the processing of each groups defined in the stack
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {GroupsPulumiInfo} groupsInfo - groups entry set in the stack
 * @param {GroupsPulumiConfig} groupsConfig - groupConfigs set in the stack
 * @returns {GroupsDict} Set of groups deployed
 */
export function initGroup (
    providers: ProvidersDict,
    groupsInfo: GroupsPulumiInfo,
    groupsConfig: GroupsPulumiConfig
): GroupsDict {
    const groups: GroupsDict = {};

    for (const iGroup in groupsInfo) {
        if (groupsInfo[iGroup].desc) {
            groups[iGroup] = processGroups(
                iGroup,
                groupsInfo[iGroup],
                groupsConfig,
                providers
            );
        }
    }
    return groups;
}
