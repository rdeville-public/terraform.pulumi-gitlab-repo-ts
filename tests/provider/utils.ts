import * as utils from "../../src/provider/utils";
import type {ProvidersPulumiConfig} from "../../src/provider/types";
import test from "ava";

const FAKE_BASEURL = "https://fake.gitlab.tld";
const FAKE_TOKEN = "fakeToken";
const FAKE_NAME = "fakeName";


test("not supported git provider initialization", (currTest) => {
    const data: ProvidersPulumiConfig = {
        "fakeName": {
            "baseUrl": FAKE_BASEURL,
            "token": FAKE_TOKEN,
            "type": "github"
        }
    };
    const initProvider = utils.initProvider(data);
    currTest.deepEqual(initProvider, {});
});

test("supported git provider initialization", (currTest) => {
    const data: ProvidersPulumiConfig = {
        "fakeName": {
            "baseUrl": FAKE_BASEURL,
            "token": FAKE_TOKEN,
            "type": "gitlab"
        }
    };
    const initProvider = utils.initProvider(data);
    currTest.is(initProvider[FAKE_NAME].name, FAKE_NAME);
});
