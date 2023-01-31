import * as provider from "../../src/provider";
import type {ProvidersPulumiConfig} from "../../src/provider/types";
import test from "ava";

const FAKE_NAME = "fakeName";

test("Git provider initialization with gitlab.com", (currTest) => {
    const data: ProvidersPulumiConfig = {
        "fakeName": {
            "config": {
                "token": "fakeToken"
            },
            "username": "fakeUserName"
        }
    };
    const initProvider = provider.initProvider(data);
    currTest.is(initProvider[FAKE_NAME].name, "fakename");
});


test("Git provider initialization with self hosted gitlab", (currTest) => {
    const data: ProvidersPulumiConfig = {
        "fakeName": {
            "config": {
                "baseUrl": "https://fake.gitlab.tld",
                "token": "fakeToken"
            },
            "username": "fakeUserName"
        }
    };
    const initProvider = provider.initProvider(data);
    currTest.is(initProvider[FAKE_NAME].name, "fakename");
});
