import type {
    GitlabProvider,
    ProvidersDict
} from "../provider";
import type {
    UserData,
    UserInfo,
    UsersPulumiInfo
} from "./index";
import {
    genId,
    slugify
} from "../utils";
import type {
    ArgsDict
} from "./types";
import {
    GitlabUser
} from "./index";

/**
 * Compute user configuration
 *
 * @param {GitlabProvider} provider - Provider object
 * @param {string} providerName - Name of the provider
 * @param {string} userName - Name of the user
 * @param {UserInfo} userInfo - Info of the user
 * @returns {UserData} Object with args and data for Pulumi User Object
 */
function computeUserData (
    provider: GitlabProvider,
    providerName: string,
    userName: string,
    userInfo: UserInfo
): UserData {
    return {
        "args": {
            "gpgKeys": userInfo.gpgKeys ?? {} as ArgsDict,
            "sshKeys": userInfo.sshKeys ?? {} as ArgsDict,
            "userId": userInfo.providers[providerName] as number,
            userName
        },
        "opts": {
            "parent": provider.provider,
            "provider": provider.provider
        }
    };
}

/**
 * Manage user with it possible sub-resource
 *
 * @param {GitlabProvider} provider - Provider object
 * @param {string} providerName - Name of the provider
 * @param {string} userName - Name of the user
 * @param {UserInfo} userInfo - Info of the user
 */
function manageUser (
    provider: GitlabProvider,
    providerName: string,
    userName: string,
    userInfo: UserInfo
): void {
    const data = computeUserData(
        provider,
        providerName,
        userName,
        userInfo
    );
    const userNameSlug = slugify(`${userName}-${genId()}`);
    provider.users[userName] = new GitlabUser(
        userNameSlug,
        data.args,
        data.opts
    );
}

/**
 * Process all user from the configuration
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {string} userName - Name of the user
 * @param {UserInfo} userInfo - Info of the user
 */
function processUsers (
    providers: ProvidersDict,
    userName: string,
    userInfo: UserInfo
): void {
    for (const iProvider in providers) {
        if (iProvider in userInfo.providers) {
            manageUser(
                providers[iProvider],
                iProvider,
                userName,
                userInfo
            );
        }
    }
}

/**
 * Initialize the processing of each users defined in the stack
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {UsersPulumiInfo} [usersInfo] - Users information
 */
export function initUser (
    providers: ProvidersDict,
    usersInfo?: UsersPulumiInfo
): void {
    for (const iUser in usersInfo) {
        processUsers(
            providers,
            iUser,
            usersInfo[iUser]
        );
    }
}
