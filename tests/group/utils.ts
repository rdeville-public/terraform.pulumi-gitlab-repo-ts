/* eslint max-lines: 0 */
import * as group from "../../src/group";
import * as provider from "../../src/provider";
import test from "ava";

// FAKE PROVIDER CONFIG
const PROVIDER_CONFIG = {
    "config": {
        "baseUrl": "https://fake.gitlab.tld",
        "token": "fakeToken"
    },
    "username": "fakeUserName"
};

const PROVIDER_NAME = [
    "fakeGitlab1",
    "fakeGitlab2"
];
const [MAIN_PROVIDER] = PROVIDER_NAME;

const PROVIDER: provider.ProvidersPulumiConfig = {
    "fakeGitlab1": PROVIDER_CONFIG,
    "fakeGitlab2": PROVIDER_CONFIG
};

const GROUP_DESC = "Fake Group Description";

const ENV: {[key: string]: string} = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "PULUMI_CONFIG": `{ "project:mainProvider": "${MAIN_PROVIDER}" }`
};

Object.entries(ENV).forEach(([key, val]) => {
    process.env[key] = val;
});

test("group with supported provider without group args", (currTest) => {
    const fakeGroups: group.GroupsPulumiInfo = {
        "fakeGroupName": {
            "desc": GROUP_DESC,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const providers = provider.initProvider(PROVIDER);
    group.initGroup(
        providers,
        fakeGroups
    );

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].groups.fakeGroupName.name,
        "fakegroupname"
    );
});

test("group with supported provider with default group args", (currTest) => {
    const fakeGroups: group.GroupsPulumiInfo = {
        "fakeGroupName": {
            "desc": GROUP_DESC,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const fakeGroupConfigs: group.GroupPulumiConfig = {
        "default": {}
    };

    const providers = provider.initProvider(PROVIDER);
    group.initGroup(
        providers,
        fakeGroups,
        fakeGroupConfigs
    );

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].groups.fakeGroupName.name,
        "fakegroupname"
    );
});

test("group with supported provider mirror groups args", (currTest) => {
    const fakeGroups: group.GroupsPulumiInfo = {
        "fakeGroupName": {
            "desc": GROUP_DESC,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0], PROVIDER_NAME[1]]
        }
    };

    const fakeGroupConfigs: group.GroupPulumiConfig = {
        "default": {},
        "mirror": {}
    };

    const providers = provider.initProvider(PROVIDER);
    group.initGroup(
        providers,
        fakeGroups,
        fakeGroupConfigs
    );

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].groups.fakeGroupName.name,
        "fakegroupname"
    );
    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[1]].groups.fakeGroupName.name,
        "fakegroupname"
    );
});


test("group with supported provider with subgroup", (currTest) => {
    const fakeGroups: group.GroupsPulumiInfo = {
        "fakeGroupName": {
            "desc": GROUP_DESC,
            "groups": {
                "fakeGroupName": {
                    "desc": GROUP_DESC,
                    "providers": []
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const fakeGroupConfigs: group.GroupPulumiConfig = {
        "default": {},
        "mirror": {}
    };

    const providers = provider.initProvider(PROVIDER);
    group.initGroup(
        providers,
        fakeGroups,
        fakeGroupConfigs
    );

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].groups.fakeGroupName.name,
        "fakegroupname"
    );
    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            groups.fakeGroupName.
            subgroup.fakeGroupName.name,
        "fakegroupname"
    );
});

test("group with supported provider with labels", (currTest) => {
    const fakeGroups: group.GroupsPulumiInfo = {
        "fakeGroupName": {
            "desc": GROUP_DESC,
            "labels": {
                "fakeLabelName": {
                    "color": "#000000",
                    // Left empty as it should be handled by utils
                    "group": ""
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const providers = provider.initProvider(PROVIDER);
    group.initGroup(
        providers,
        fakeGroups
    );

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].groups.fakeGroupName.name,
        "fakegroupname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            groups.fakeGroupName.
            labels.fakeLabelName.name
    );
});


test("group with supported provider with badges", (currTest) => {
    const fakeGroups: group.GroupsPulumiInfo = {
        "fakeGroupName": {
            "badges": {
                "fakeBadgeName": {
                    // Left empty as it should be handled by utils
                    "group": "",
                    "imageUrl": "https://fakeLinkUrl.tld/image.png",
                    "linkUrl": "https://fakeLinkUrl.tld"
                }
            },
            "desc": GROUP_DESC,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const providers = provider.initProvider(PROVIDER);
    group.initGroup(
        providers,
        fakeGroups
    );

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].groups.fakeGroupName.name,
        "fakegroupname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            groups.fakeGroupName.
            badges.fakeBadgeName.urn
    );
});


test("group with supported provider with hooks", (currTest) => {
    const fakeGroups: group.GroupsPulumiInfo = {
        "fakeGroupName": {
            "desc": GROUP_DESC,
            "hooks": {
                "fakeHookName": {
                    "group": "",
                    "url": "https://fakeLinkUrl.tld/image.png"
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const providers = provider.initProvider(PROVIDER);
    group.initGroup(
        providers,
        fakeGroups
    );

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].groups.fakeGroupName.name,
        "fakegroupname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            groups.fakeGroupName.
            hooks.fakeHookName.urn
    );
});

test("group with supported provider with variables", (currTest) => {
    const fakeGroups: group.GroupsPulumiInfo = {
        "fakeGroupName": {
            "desc": GROUP_DESC,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]],
            "variables": {
                "fakeVariableName": {
                    "value": "fakeValue"
                }
            }
        }
    };

    const providers = provider.initProvider(PROVIDER);
    group.initGroup(
        providers,
        fakeGroups
    );

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].groups.fakeGroupName.name,
        "fakegroupname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            groups.fakeGroupName.
            variables.fakeVariableName.urn
    );
});

test("group with supported provider with accessTokens", (currTest) => {
    const fakeGroups: group.GroupsPulumiInfo = {
        "fakeGroupName": {
            "accessTokens": {
                "fakeAccessTokenName": {
                    "scopes": ["read_repository"]
                }
            },
            "desc": GROUP_DESC,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const providers = provider.initProvider(PROVIDER);
    group.initGroup(
        providers,
        fakeGroups
    );

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].groups.fakeGroupName.name,
        "fakegroupname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            groups.fakeGroupName.
            accessTokens.fakeAccessTokenName.urn
    );
});
