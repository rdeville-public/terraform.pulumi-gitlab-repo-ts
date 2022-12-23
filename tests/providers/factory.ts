import {GithubProvider} from "../../src/providers/";
import {GitlabProvider} from "../../src/providers/";
import {providerFactory} from "../../src/providers/";
import test from "ava";

const ENV: {[key: string]: string} = {
    "fakeToken": "FAKEVALUE"
};
const providerName = "fakename.tld";

Object.entries(ENV).forEach(([
    key,
    val
]) => {
    process.env[key] = val;
});

// Mocking pulumi config key fakename.tld
process.env.PULUMI_CONFIG = JSON.stringify({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "project:fakename.tld": JSON.stringify({
        "env": "fakeToken"
    })
});

test(
    "Github provider type",
    (currTest) => {
        const gitType = "github";
        const provider = providerFactory(gitType, providerName, {});

        currTest.is(typeof provider, typeof GithubProvider.prototype);
    }
);


test(
    "Gitlab provider type",
    (currTest) => {
        const gitType = "gitlab";
        const provider = providerFactory(gitType, providerName, {});

        currTest.is(typeof provider, typeof GitlabProvider.prototype);
    }
);


test(
    "Wrong provider type error",
    (currTest) => {
        const gitType = "wrongType";
        const errorMsg = `Git provider type not supported: "${gitType}"`;
        const error = currTest.throws(() => {
            providerFactory(gitType, providerName, {});
        }, {"instanceOf": Error}, errorMsg);

        currTest.is(error?.message, errorMsg);
    }
);
