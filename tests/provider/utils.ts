import * as provider from "../../src/provider";
import type {ProvidersPulumiConfig} from "../../src/provider/types";
import test from "ava";

const FAKE_BASEURL = "https://fake.gitlab.tld";
const FAKE_TOKEN = "fakeToken";
const FAKE_NAME = "fakeName";


test("Git provider initialization", (currTest) => {
    const data: ProvidersPulumiConfig = {
        "fakeName": {
            "baseUrl": FAKE_BASEURL,
            "token": FAKE_TOKEN,
            "type": "gitlab"
        }
    };
    const initProvider = provider.initProvider(data);
    currTest.is(initProvider[FAKE_NAME].name, FAKE_NAME);
});
