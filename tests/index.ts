import * as index from "../src/index";
import test from "ava";

test("main() without option return true", (currTest) => {
    const value = index.main();

    currTest.is(value, true);
});
