/* eslint max-lines: 0 */
import * as provider from "../../src/provider";
import * as user from "../../src/user";
import test from "ava";

// FAKE PROVIDER CONFIG
const PROVIDER_BASE_URL = "https://fake.gitlab.tld";
const PROVIDER_TOKEN = "fakeToken";
const PROVIDER_NAME = ["fakeGitlab"];
const [MAIN_PROVIDER] = PROVIDER_NAME;

const PROVIDER_DATA = {
    "baseUrl": PROVIDER_BASE_URL,
    "token": PROVIDER_TOKEN
};
const SUPPORTED_PROVIDER = {
    "type": "gitlab"
};
const PROVIDER: provider.ProvidersPulumiConfig = {
    "fakeGitlab": {
        ...PROVIDER_DATA,
        ...SUPPORTED_PROVIDER
    }
};

const ENV: {[key: string]: string} = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "PULUMI_CONFIG": `{ "project:mainProvider": "${MAIN_PROVIDER}" }`
};

Object.entries(ENV).forEach(([key, val]) => {
    process.env[key] = val;
});

test("user with supported provider without user args", (currTest) => {
    const fakeUsers: user.UsersPulumiInfo = {
        "fakeUserName": {
            "providers": {
                "fakeGitlab": 0
            }
        }
    };

    const providers = provider.initProvider(PROVIDER);
    user.initUser(
        providers,
        fakeUsers
    );

    currTest.regex(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].users.fakeUserName.name,
        /fakeusername-[A-Za-z0-9]{5}/u
    );
});

test("user with supported provider with sshKey", (currTest) => {
    const fakeUsers: user.UsersPulumiInfo = {
        "fakeUserName": {
            "providers": {
                "fakeGitlab": 0
            },
            "sshKeys": {
                "sshKeyName": {
                    "key": "fakeSshKeyContent"
                }
            }
        }
    };

    const providers = provider.initProvider(PROVIDER);
    user.initUser(
        providers,
        fakeUsers
    );

    currTest.regex(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].users.fakeUserName.name,
        /fakeusername-[A-Za-z0-9]{5}/u
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            users.fakeUserName.
            sshKeys.sshKeyName.urn
    );
});

test("user with supported provider with gpgKey", (currTest) => {
    const fakeUsers: user.UsersPulumiInfo = {
        "fakeUserName": {
            "gpgKeys": {
                "gpgKeyName": {
                    "key": "fakeGpgKeyContent"
                }
            },
            "providers": {
                "fakeGitlab": 0
            }
        }
    };

    const providers = provider.initProvider(PROVIDER);
    user.initUser(
        providers,
        fakeUsers
    );

    currTest.regex(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].users.fakeUserName.name,
        /fakeusername-[A-Za-z0-9]{5}/u
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            users.fakeUserName.
            gpgKeys.gpgKeyName.urn
    );
});


test("user with supported provider with accessToken", (currTest) => {
    const fakeUsers: user.UsersPulumiInfo = {
        "fakeUserName": {
            "accessTokens": {
                "accessTokenName": {
                    "scopes": ["read_repository"]
                }
            },
            "providers": {
                "fakeGitlab": 0
            }
        }
    };

    const providers = provider.initProvider(PROVIDER);
    user.initUser(
        providers,
        fakeUsers
    );

    currTest.regex(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].users.fakeUserName.name,
        /fakeusername-[A-Za-z0-9]{5}/u
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            users.fakeUserName.
            accessTokens.accessTokenName.urn
    );
});
