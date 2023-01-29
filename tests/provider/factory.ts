import {
    GitlabProvider,
    providerFactory
} from "../../src/provider/";
import type {ProviderData} from "../../src/provider/types";
import test from "ava";

const FAKE_BASEURL = "https://fake.gitlab.tld";
const FAKE_NAME = "fakeName";
const FAKE_ALIAS = "fakeAlias";
const FAKE_TOKEN = "fakeToken";
const DATA: ProviderData = {
    "args": {
        "baseUrl": FAKE_BASEURL,
        "token": FAKE_TOKEN
    },
    "opts": {
        "aliases": [{"name": FAKE_ALIAS}]
    }
};

test(
    "Unsupported git provider",
    (currTest) => {
        const gitType = "wrongType";
        const errorMsg = `Git provider type not supported: "${gitType}"`;
        const error = currTest.throws(() => {
            providerFactory(gitType, FAKE_NAME, DATA);
        }, {"instanceOf": Error}, errorMsg);

        currTest.is(error?.message, errorMsg);
    }
);

test(
    "Gitlab git provider",
    (currTest) => {
        const gitType = "gitlab";
        const provider = providerFactory(gitType, FAKE_NAME, DATA);

        currTest.is(typeof provider, typeof GitlabProvider.prototype);
    }
);
