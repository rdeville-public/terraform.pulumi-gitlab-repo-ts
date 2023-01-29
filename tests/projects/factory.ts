import {
    GitlabProject
} from "../../src/project";
import type {
    ProjectData
} from "../../src/project";
import {projectFactory} from "../../src/project";
import test from "ava";

const PROJECT_NAME = "fakeProjectName";
const DATA: ProjectData = {
    "opts": {
        "aliases": [{"name": PROJECT_NAME}]
    }
};

test(
    "Project with unsupported provider",
    (currTest) => {
        const gitType = "wrongType";
        const errorMsg =
            `Projects for provider type not supported: "${gitType}"`;
        const error = currTest.throws(() => {
            projectFactory(gitType, PROJECT_NAME, DATA);
        }, {"instanceOf": Error}, errorMsg);

        currTest.is(error?.message, errorMsg);
    }
);

test(
    "Project with gitlab provider with path defined",
    (currTest) => {
        const gitType = "gitlab";
        const provider = projectFactory(gitType, PROJECT_NAME, DATA);

        currTest.is(typeof provider, typeof GitlabProject.prototype);
    }
);
