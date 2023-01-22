import {
    GitlabGroup
} from "../../src/group";
import type {
    GroupData
} from "../../src/group";
import {groupFactory} from "../../src/group";
import test from "ava";

const GROUPE_NAME = "fakeGroupName";
const DATA: GroupData = {
    "opts": {
        "aliases": [{"name": GROUPE_NAME}]
    }
};

test(
    "Group with unsupported provider",
    (currTest) => {
        const gitType = "wrongType";
        const errorMsg = `Groups for provider type not supported: "${gitType}"`;
        const error = currTest.throws(() => {
            groupFactory(gitType, GROUPE_NAME, DATA);
        }, {"instanceOf": Error}, errorMsg);

        currTest.is(error?.message, errorMsg);
    }
);

test(
    "Group with gitlab provider with path defined",
    (currTest) => {
        const gitType = "gitlab";
        const provider = groupFactory(gitType, GROUPE_NAME, DATA);

        currTest.is(typeof provider, typeof GitlabGroup.prototype);
    }
);
