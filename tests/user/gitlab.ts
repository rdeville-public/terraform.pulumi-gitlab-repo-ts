import type * as gitlab from "../../src/user";
import * as provider from "../../src/provider";
import * as user from "../../src/user";
import test from "ava";

// FAKE PROVIDER CONFIG
const PROVIDER_BASE_URL = "https://fake.gitlab.tld";
const PROVIDER_TOKEN = "fakeToken";
const PROVIDER_NAME = {
    "fakeGitlab": 0
};
const [MAIN_PROVIDER] = "fakeGitlab";

const PROVIDER_DATA = {
    "baseUrl": PROVIDER_BASE_URL,
    "token": PROVIDER_TOKEN
};
const SUPPORTED_PROVIDER = {
    "type": "gitlab"
};

const PROVIDER: provider.ProvidersPulumiConfig = {
    "fakeGitlab": {
        ...PROVIDER_DATA,
        ...SUPPORTED_PROVIDER
    }
};

const ENV: {[key: string]: string} = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "PULUMI_CONFIG": `{ "project:mainProvider": "${MAIN_PROVIDER}" }`
};

Object.entries(ENV).forEach(([key, val]) => {
    process.env[key] = val;
});


test("user with supported provider without user args", (currTest) => {
    const fakeUsers: gitlab.UsersPulumiConfig = {
        "fakeUserName": {
            "providers": PROVIDER_NAME
        }
    };

    const providers = provider.initProvider(PROVIDER);
    user.initUser(
        providers,
        fakeUsers
    );

    currTest.regex(
        providers.fakeGitlab.users.fakeUserName.name,
        /fakeusername-[A-Za-z0-9]{5}/u
    );
});
