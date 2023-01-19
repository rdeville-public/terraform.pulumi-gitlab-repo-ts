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
 * [TODO:description]
 *
 * @param {string} providerName - [TODO:description]
 * @param {string} providerType - [TODO:description]
 * @param {GroupsPulumiConfig} groupsConfig - [TODO:description]
 * @param {[TODO:type]} [groupType] - [TODO:description]
 * @returns {GroupArgs} [TODO:description]
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
 * @param {string} groupName - [TODO:description]
 * @param {GroupInfo} groupInfo - [TODO:description]
 * @param {ProvidersDict} providers - [TODO:description]
 * @param {GroupSupportedObject} [parentGroup] - [TODO:description]
 * @returns {GroupSupportedObject[]} [TODO:description]
 */
// eslint-disable-next-line max-params
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
 * [TODO:description]
 *
 * @param {ProvidersDict} providers - [TODO:description]
 * @returns {GroupsDict} [TODO:description]
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
