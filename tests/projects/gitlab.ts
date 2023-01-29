import * as gitlab from "../../src/project/gitlab";
import type * as pulumi from "@pulumi/pulumi";
import test from "ava";

const FAKE_NAME = "fakeName";
const FAKE_ALIAS = "fakeAlias";

test("Create basic project", (currTest) => {
    const args: gitlab.IGitlabProjectArgs = {
        "projectConfig": {
            "path": FAKE_NAME
        }
    };
    const opts: pulumi.CustomResourceOptions = {
        "aliases": [{"name": FAKE_ALIAS}]
    };
    const gitlabProject = new gitlab.GitlabProject(
        FAKE_NAME,
        args,
        opts
    );

    currTest.is(gitlabProject.name, FAKE_NAME);
});
