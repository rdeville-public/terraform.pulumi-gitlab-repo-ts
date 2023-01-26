import * as gitlab from "../../src/group/gitlab";
import type * as pulumi from "@pulumi/pulumi";
import test from "ava";

const FAKE_NAME = "fakeName";
const FAKE_ALIAS = "fakeAlias";

test("Create basic group", (currTest) => {
    const args: gitlab.IGitlabGroupArgs = {
        "groupConfig": {
            "path": FAKE_NAME
        }
    };
    const opts: pulumi.CustomResourceOptions = {
        "aliases": [{"name": FAKE_ALIAS}]
    };
    const gitlabProvider = new gitlab.GitlabGroup(
        FAKE_NAME,
        args,
        opts
    );

    currTest.is(gitlabProvider.name, FAKE_NAME);
});
