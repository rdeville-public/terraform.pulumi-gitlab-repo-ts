import * as gitlab from "../../src/provider/gitlab";
import type * as provider from "../../src/provider";
import test from "ava";

const FAKE_BASEURL = "https://fake.gitlab.tld";
const FAKE_TOKEN = "fakeToken";
const FAKE_NAME = "fakeName";
const FAKE_ALIAS = "fakeAlias";

test("gitlabProvider", (currTest) => {
    const data: provider.ProviderData = {
        "args": {
            "baseUrl": FAKE_BASEURL,
            "token": FAKE_TOKEN
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

    currTest.is(gitlabProvider.name, FAKE_NAME);
});
