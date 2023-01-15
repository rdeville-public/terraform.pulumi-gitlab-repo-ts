import * as log from "../src/log";
import test from "ava";

const FAKE_MESSAGE = "Fake log message";

test("log debug in 'test' environment ", (currTest) => {
    const logMsg = log.debug(FAKE_MESSAGE);

    currTest.is(logMsg, "");
});

test("log info in 'test' environment ", (currTest) => {
    const logMsg = log.info(FAKE_MESSAGE);

    currTest.is(logMsg, "");
});

test("log warn in 'test' environment ", (currTest) => {
    const logMsg = log.warn(FAKE_MESSAGE);

    currTest.is(logMsg, "");
});

test("log error in 'test' environment ", (currTest) => {
    const logMsg = log.error(FAKE_MESSAGE);

    currTest.is(logMsg, "");
});
