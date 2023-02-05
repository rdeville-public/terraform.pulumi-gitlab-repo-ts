import * as gitlab from "../../src/provider/gitlab";
import type {ProviderData} from "../../src/provider/types";
import test from "ava";

const FAKE_BASEURL = "https://fake.gitlab.tld";
const FAKE_TOKEN = "fakeToken";
const FAKE_NAME = "fakeName";
const FAKE_ALIAS = "fakeAlias";

test("gitlabProvider with default baseUrl", (currTest) => {
    const data: ProviderData = {
        "args": {
            "config": {
                "token": FAKE_TOKEN
            },
            "username": "fakeUserName"
        },
        "opts": {
            "aliases": [{"name": FAKE_ALIAS}]
        }
    };
    const gitlabProvider = new gitlab.GitlabProvider(
        FAKE_NAME,
        data.args,
        data.opts
    );

    currTest.is(gitlabProvider.name, "fakename");
});

test("gitlabProvider with fake baseUrl", (currTest) => {
    const data: ProviderData = {
        "args": {
            "config": {
                "baseUrl": FAKE_BASEURL,
                "token": FAKE_TOKEN
            },
            "username": "fakeUserName"
        },
        "opts": {
            "aliases": [{"name": FAKE_ALIAS}]
        }
    };
    const gitlabProvider = new gitlab.GitlabProvider(
        FAKE_NAME,
        data.args,
        data.opts
    );

    currTest.is(gitlabProvider.name, "fakename");
});
