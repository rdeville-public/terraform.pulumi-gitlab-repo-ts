/* eslint max-lines: 0 */
import * as group from "../../src/group";
import * as project from "../../src/project";
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


const PROJECT_DESC = "Fake Project Description";

const ENV: {[key: string]: string} = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "PULUMI_CONFIG": `{ "project:gitlabMainProvider": "${MAIN_PROVIDER}" }`
};

Object.entries(ENV).forEach(([key, val]) => {
    process.env[key] = val;
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

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.name,
        "fakeprojectname"
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

        currTest.is(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].
                projects.fakeProjectName.name,
            "fakeprojectname"
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

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.name,
        "fakeprojectname"
    );
    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[1]].
            projects.fakeProjectName.name,
        "fakeprojectname"
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

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            groups.fakeGroupName.
            projects.fakeProjectName.name,
        "fakeprojectname"
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

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            groups.fakeGroupName.
            subgroup.fakeGroupName.
            projects.fakeProjectName.name,
        "fakeprojectname"
    );
});

test("project with supported provider with labels", (currTest) => {
    const fakeProjects: project.ProjectsPulumiInfo = {
        "fakeProjectName": {
            "desc": PROJECT_DESC,
            "labels": {
                "fakeLabelName": {
                    // Left empty as it should be handled by utils
                    "color": "#00FF00"
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

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.name,
        "fakeprojectname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.
            labels.fakeLabelName.urn
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

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.name,
        "fakeprojectname"
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

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].projects.fakeProjectName.name,
        "fakeprojectname"
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

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].projects.fakeProjectName.name,
        "fakeprojectname"
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

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].projects.fakeProjectName.name,
        "fakeprojectname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.
            accessTokens.fakeAccessTokenName.urn
    );
});


test("project with supported provider with branches", (currTest) => {
    const fakeProjects: project.ProjectsPulumiInfo = {
        "fakeProjectName": {
            "branches": {
                "fakeBranchName": {
                    "ref": "main"
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

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].projects.fakeProjectName.name,
        "fakeprojectname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.
            branches.fakeBranchName.urn
    );
});

test("project with supported provider with protectedBranches", (currTest) => {
    const fakeProjects: project.ProjectsPulumiInfo = {
        "fakeProjectName": {
            "desc": PROJECT_DESC,
            "protectedBranches": {
                "fakeBranchName": {}
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

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].projects.fakeProjectName.name,
        "fakeprojectname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.
            protectedBranches.fakeBranchName.urn
    );
});

test("project with supported provider with protectedTags", (currTest) => {
    const fakeProjects: project.ProjectsPulumiInfo = {
        "fakeProjectName": {
            "desc": PROJECT_DESC,
            "protectedTags": {
                "fakeTagName": {
                    "createAccessLevel": "maintainer"
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

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].projects.fakeProjectName.name,
        "fakeprojectname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.
            protectedTags.fakeTagName.urn
    );
});

test("project with supported provider with deployTokens", (currTest) => {
    const fakeProjects: project.ProjectsPulumiInfo = {
        "fakeProjectName": {
            "deployTokens": {
                "fakeDeployTokenName": {
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

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].projects.fakeProjectName.name,
        "fakeprojectname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.
            deployTokens.fakeDeployTokenName.urn
    );
});


test("project with supported provider with pipelineTriggers", (currTest) => {
    const fakeProjects: project.ProjectsPulumiInfo = {
        "fakeProjectName": {
            "desc": PROJECT_DESC,
            "pipelineTriggers": {
                "fakePipelineTriggerName": {
                    "description": "Fake pipeline trigger description"
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

    currTest.is(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].projects.fakeProjectName.name,
        "fakeprojectname"
    );
    currTest.snapshot(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        providers[PROVIDER_NAME[0]].
            projects.fakeProjectName.
            pipelineTriggers.fakePipelineTriggerName.urn
    );
});

test(
    "project with supported provider with scheduled pipelines and variables",
    (currTest) => {
        const fakeProjects: project.ProjectsPulumiInfo = {
            "fakeProjectName": {
                "desc": PROJECT_DESC,
                "pipelinesSchedule": {
                    "fakePipelineSchedule": {
                        "cron": "0 12 */7 * *",
                        "description": "Fake pipeline scheduled description",
                        "ref": "main",
                        "variables": {
                            "fakeVariableKey": "fakeVariableValue"
                        }
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

        currTest.is(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].projects.fakeProjectName.name,
            "fakeprojectname"
        );
        currTest.snapshot(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].
                projects.fakeProjectName.
                pipelinesSchedule.fakePipelineSchedule.pipeline?.urn
        );
        currTest.snapshot(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].
                projects.fakeProjectName.
                pipelinesSchedule.fakePipelineSchedule.
                variables?.fakeVariableKey.urn
        );
    }
);


test(
    "project with supported provider with mirrors",
    (currTest) => {
        const fakeProjects: project.ProjectsPulumiInfo = {
            "fakeProjectName": {
                "desc": PROJECT_DESC,
                "mirrors": {
                    "test": {
                        "url": "https://username@password:mirror.domain.tld"
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

        currTest.is(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].projects.fakeProjectName.name,
            "fakeprojectname"
        );
        currTest.snapshot(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].
                projects.fakeProjectName.
                mirrors.test.urn
        );
    }
);


test(
    "project with supported provider with mirrors added with addMirrors method",
    (currTest) => {
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

        providers[MAIN_PROVIDER].projects.fakeProjectName.appendMirrors(
            "fakeMirror",
            {
                "enabled": true,
                "keepDivergentRefs": true,
                "onlyProtectedBranches": true,
                "project":
                    // eslint-disable-next-line max-len
                    providers[MAIN_PROVIDER].projects.fakeProjectName.project.id,
                "url": "http://username@password:mirror.domain.tld"
            }
        );

        currTest.is(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].projects.fakeProjectName.name,
            "fakeprojectname"
        );
        currTest.snapshot(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            providers[PROVIDER_NAME[0]].
                projects.fakeProjectName.
                mirrors.fakeMirror.urn
        );
    }
);
