import * as github from "../../src/provider/github";
import type {ProviderData} from "../../src/provider/types";
import test from "ava";

const FAKE_BASEURL = "https://fake.github.tld";
const FAKE_TOKEN = "fakeToken";
const FAKE_NAME = "fakeName";
const FAKE_ALIAS = "fakeAlias";

test("githubProvider", (currTest) => {
    const data: ProviderData = {
        "args": {
            "baseUrl": FAKE_BASEURL,
            "token": FAKE_TOKEN
        },
        "opts": {
            "aliases": [{"name": FAKE_ALIAS}]
        }
    };
    const githubProvider = new github.GithubProvider(
        FAKE_NAME,
        data.args,
        data.opts
    );

    currTest.is(githubProvider.name, FAKE_NAME);
});
