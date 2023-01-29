/* eslint max-lines: 0 */
import * as group from "../../src/group";
import * as project from "../../src/project";
import * as provider from "../../src/provider";
import test from "ava";

// FAKE PROVIDER CONFIG
const PROVIDER_BASE_URL = "https://fake.gitlab.tld";
const PROVIDER_TOKEN = "fakeToken";
const PROVIDER_NAME = [
    "fakeGitlab1",
    "fakeGitlab2",
    "fakeGithub"
];
const [MAIN_PROVIDER] = PROVIDER_NAME;

const PROVIDER_DATA = {
    "baseUrl": PROVIDER_BASE_URL,
    "token": PROVIDER_TOKEN
};
const SUPPORTED_PROVIDER = {
    "type": "gitlab"
};
const UNSUPPORTED_PROVIDER = {
    "type": "unsupported"
};

const PROVIDER: provider.ProvidersPulumiConfig = {
    "fakeGitlab1": {
        ...PROVIDER_DATA,
        ...SUPPORTED_PROVIDER
    },
    "fakeGitlab2": {
        ...PROVIDER_DATA,
        ...SUPPORTED_PROVIDER
    },
    "fakeUnsupported": {
        ...PROVIDER_DATA,
        ...UNSUPPORTED_PROVIDER
    }
};

const PROJECT_DESC = "Fake Project Description";

const ENV: {[key: string]: string} = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "PULUMI_CONFIG": `{ "project:mainProvider": "${MAIN_PROVIDER}" }`
};

Object.entries(ENV).forEach(([key, val]) => {
    process.env[key] = val;
});

test("project with unsupported provider", (currTest) => {
    const fakeProjects: project.ProjectsPulumiInfo = {
        "fakeProjectName": {
            "desc": PROJECT_DESC,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[2]]
        }
    };

    const providers = provider.initProvider(PROVIDER);
    project.initProject(
        providers,
        fakeProjects
    );

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    currTest.deepEqual(typeof providers[PROVIDER_NAME[2]], "undefined");
});

test("project with supported provider without project args", (currTest) => {
    const fakeProjects: project.ProjectsPulumiInfo = {
        "fakeProjectName": {
            "desc": PROJECT_DESC,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const providers = provider.initProvider(PROVIDER);
    project.initProject(
        providers,
        fakeProjects
    );

    currTest.regex(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.name,
        /fakeprojectname-[A-Za-z0-9]{5}/u
    );
});

test(
    "project with supported provider with default project args", (currTest) => {
        const fakeProjects: project.ProjectsPulumiInfo = {
            "fakeProjectName": {
                "desc": PROJECT_DESC,
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                "providers": [PROVIDER_NAME[0]]
            }
        };

        const fakeProjectConfigs: project.ProjectPulumiConfig = {
            "default": {}
        };

        const providers = provider.initProvider(PROVIDER);
        project.initProject(
            providers,
            fakeProjects,
            fakeProjectConfigs
        );

        currTest.regex(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].
                projects.fakeProjectName.name,
            /fakeprojectname-[A-Za-z0-9]{5}/u
        );
    }
);

test("project with supported provider mirror projects args", (currTest) => {
    const fakeProjects: project.ProjectsPulumiInfo = {
        "fakeProjectName": {
            "desc": PROJECT_DESC,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0], PROVIDER_NAME[1]]
        }
    };

    const fakeProjectConfigs: project.ProjectPulumiConfig = {
        "default": {},
        "mirror": {}
    };

    const providers = provider.initProvider(PROVIDER);
    project.initProject(
        providers,
        fakeProjects,
        fakeProjectConfigs
    );

    currTest.regex(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.name,
        /fakeprojectname-[A-Za-z0-9]{5}/u
    );
    currTest.regex(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[1]].
            projects.fakeProjectName.name,
        /fakeprojectname-[A-Za-z0-9]{5}/u
    );
});

test("default project in simple group", (currTest) => {
    const fakeGroups: group.GroupsPulumiInfo = {
        "fakeGroupName": {
            "desc": PROJECT_DESC,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const fakeProjects: project.ProjectsPulumiInfo = {
        "fakeGroupName": {
            "fakeProjectName": {
                "desc": PROJECT_DESC
            }
        }
    };


    const providers = provider.initProvider(PROVIDER);
    group.initGroup(providers, fakeGroups);
    project.initProject(providers, fakeProjects);

    currTest.regex(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            groups.fakeGroupName.
            projects.fakeProjectName.name,
        /fakeprojectname-[A-Za-z0-9]{5}/u
    );
});

test("default project in nested group", (currTest) => {
    const fakeGroups: group.GroupsPulumiInfo = {
        "fakeGroupName": {
            "desc": PROJECT_DESC,
            "groups": {
                "fakeGroupName": {
                    "desc": PROJECT_DESC,
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    "providers": [PROVIDER_NAME[0]]
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const fakeProjects: project.ProjectsPulumiInfo = {
        "fakeGroupName": {
            "fakeGroupName": {
                "fakeProjectName": {
                    "desc": PROJECT_DESC
                }
            }
        }
    };


    const providers = provider.initProvider(PROVIDER);
    group.initGroup(providers, fakeGroups);
    project.initProject(providers, fakeProjects);

    currTest.regex(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            groups.fakeGroupName.
            subgroup.fakeGroupName.
            projects.fakeProjectName.name,
        /fakeprojectname-[A-Za-z0-9]{5}/u
    );
});

test("project with supported provider with badges", (currTest) => {
    const fakeProjects: project.ProjectsPulumiInfo = {
        "fakeProjectName": {
            "badges": {
                "fakeBadgeName": {
                    // Left empty as it should be handled by utils
                    "imageUrl": "https://fakeLinkUrl.tld/image.png",
                    "linkUrl": "https://fakeLinkUrl.tld",
                    "project": ""
                }
            },
            "desc": PROJECT_DESC,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const providers = provider.initProvider(PROVIDER);
    project.initProject(
        providers,
        fakeProjects
    );

    currTest.regex(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.name,
        /fakeprojectname-[A-Za-z0-9]{5}/u
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.
            badges.fakeBadgeName.urn
    );
});

test("project with supported provider with hooks", (currTest) => {
    const fakeProjects: project.ProjectsPulumiInfo = {
        "fakeProjectName": {
            "desc": PROJECT_DESC,
            "hooks": {
                "fakeHookName": {
                    "project": "",
                    "url": "https://fakeLinkUrl.tld/image.png"
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const providers = provider.initProvider(PROVIDER);
    project.initProject(
        providers,
        fakeProjects
    );

    currTest.regex(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].projects.fakeProjectName.name,
        /fakeprojectname-[A-Za-z0-9]{5}/u
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.
            hooks.fakeHookName.urn
    );
});

test("project with supported provider with variables", (currTest) => {
    const fakeProjects: project.ProjectsPulumiInfo = {
        "fakeProjectName": {
            "desc": PROJECT_DESC,
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
    project.initProject(
        providers,
        fakeProjects
    );

    currTest.regex(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].projects.fakeProjectName.name,
        /fakeprojectname-[A-Za-z0-9]{5}/u
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.
            variables.fakeVariableName.urn
    );
});

test("project with supported provider with accessTokens", (currTest) => {
    const fakeProjects: project.ProjectsPulumiInfo = {
        "fakeProjectName": {
            "accessTokens": {
                "fakeAccessTokenName": {
                    "scopes": ["read_repository"]
                }
            },
            "desc": PROJECT_DESC,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            "providers": [PROVIDER_NAME[0]]
        }
    };

    const providers = provider.initProvider(PROVIDER);
    project.initProject(
        providers,
        fakeProjects
    );

    currTest.regex(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].projects.fakeProjectName.name,
        /fakeprojectname-[A-Za-z0-9]{5}/u
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.
            accessTokens.fakeAccessTokenName.urn
    );
});
