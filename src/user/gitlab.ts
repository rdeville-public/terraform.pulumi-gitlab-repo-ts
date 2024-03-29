import * as gitlab from "@pulumi/gitlab";
import * as pulumi from "@pulumi/pulumi";
import * as utils from "../utils";
import type {
    ArgsDict
} from "./types";

export interface IGitlabUser {
    name: string;
    userId: number;
    sshKeys: IGitlabUserSshKey;
    gpgKeys: IGitlabUserGpgKey;
    accessTokens: IGitlabUserAccessToken;
}

export interface IGitlabUserArgs {
    userName: string;
    userId: number;
    sshKeys?: ArgsDict;
    gpgKeys?: ArgsDict;
    accessTokens?: ArgsDict;
}

interface IGitlabUserSshKey {
    [key: string]: gitlab.UserSshKey;
}

interface IGitlabUserGpgKey {
    [key: string]: gitlab.UserGpgKey;
}

interface IGitlabUserAccessToken {
    [key: string]: gitlab.PersonalAccessToken;
}

/**
 * Pulumi custom ComponentResource which deploy a gitlab provider and its
 * associated API client.
 *
 * @augments pulumi.ComponentResource
 * @implements {IGitlabUser} IGitlabUser
 */
export class GitlabUser extends pulumi.ComponentResource
    implements IGitlabUser {

    public name = "";

    public userId: number;

    public sshKeys: IGitlabUserSshKey = {};

    public gpgKeys: IGitlabUserGpgKey = {};

    public accessTokens: IGitlabUserAccessToken = {};

    /**
     * Constructor of the ComponentResource GitlabUser
     *
     * @param {string} name - Name of the user
     * @param {IGitlabUserArgs} args - GitlabUser arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     *      options
     */
    public constructor (
        name: string,
        args: IGitlabUserArgs,
        opts?: pulumi.CustomResourceOptions
    ) {
        super(`gitlab-repo:user:${name}`, name, args, opts);
        this.name = name;
        this.userId = args.userId;
        this.addGpgKey(args, opts);
        this.addSshKey(args, opts);
        this.addAccessToken(args, opts);
    }

    /**
     * Add ssh key to gitlab user
     *
     * @param {IGitlabUserArgs} args - GitlabUser arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addSshKey (
        args: IGitlabUserArgs,
        opts?: pulumi.CustomResourceOptions
    ): void {
        for (const iSshKey in args.sshKeys) {
            if ("key" in args.sshKeys[iSshKey]) {
                const sshKeyName = `${utils.slugify(iSshKey)}`;
                this.sshKeys[iSshKey] = new gitlab.UserSshKey(
                    sshKeyName,
                    {
                        ...args.sshKeys[iSshKey],
                        "title": iSshKey,
                        "userId": this.userId
                    } as gitlab.UserSshKeyArgs,
                    {
                        ...opts,
                        "parent": this
                    }
                );
            }
        }
    }

    /**
     * Add Gpg Key to gitlab user
     *
     * @param {IGitlabUserArgs} args - GitlabUser arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addGpgKey (
        args: IGitlabUserArgs,
        opts?: pulumi.CustomResourceOptions
    ): void {
        for (const iGpgKey in args.gpgKeys) {
            if ("key" in args.gpgKeys[iGpgKey]) {
                const gpgKeyName = `${utils.slugify(iGpgKey)}`;
                this.gpgKeys[iGpgKey] = new gitlab.UserGpgKey(
                    gpgKeyName,
                    {
                        ...args.gpgKeys[iGpgKey],
                        "userId": this.userId
                    } as gitlab.UserGpgKeyArgs,
                    {
                        ...opts,
                        "parent": this
                    }
                );
            }
        }
    }

    /**
     * Add Access Token to gitlab user
     *
     * @param {IGitlabUserArgs} args - GitlabUser arguments
     * @param {pulumi.ComponentResourceOptions} [opts] - Pulumi resources
     */
    private addAccessToken (
        args: IGitlabUserArgs,
        opts?: pulumi.CustomResourceOptions
    ): void {
        for (const iAccessToken in args.accessTokens) {
            if ("scopes" in args.accessTokens[iAccessToken]) {
                const gpgKeyName =
                    `${utils.slugify(iAccessToken)}`;
                this.accessTokens[iAccessToken] =
                    new gitlab.PersonalAccessToken(
                        gpgKeyName,
                        {
                            ...args.accessTokens[iAccessToken],
                            "userId": this.userId
                        } as gitlab.PersonalAccessTokenArgs,
                        {
                            ...opts,
                            "parent": this
                        }
                    );
            }
        }
    }

}
