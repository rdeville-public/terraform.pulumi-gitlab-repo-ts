import * as gitlab from "../../src/project/gitlab";
import type * as pulumi from "@pulumi/pulumi";
import {
    GitlabProvider
} from "../../src/provider/";
import type {
    ProviderData
} from "../../src/provider/";
import test from "ava";

const FAKE_BASEURL = "https://fake.gitlab.tld";
const FAKE_TOKEN = "fakeToken";
const FAKE_NAME = "fakeName";
const FAKE_ALIAS = "fakeAlias";


test("Create basic project", (currTest) => {
    const data: ProviderData = {
        "args": {
            "config": {
                "baseUrl": FAKE_BASEURL,
                "token": FAKE_TOKEN
            },
            "url": new URL(FAKE_BASEURL),
            "username": "fakeUserName"
        },
        "opts": {
            "aliases": [{"name": FAKE_ALIAS}]
        }
    };
    const gitlabProvider = new GitlabProvider(
        FAKE_NAME,
        data.args,
        data.opts
    );

    const args: gitlab.IGitlabProjectArgs = {
        "projectConfig": {
            "path": FAKE_NAME
        },
        "provider": gitlabProvider
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
