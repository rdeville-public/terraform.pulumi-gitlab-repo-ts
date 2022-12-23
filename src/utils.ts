import * as process from "process";
import {spawnSync} from "child_process";

function getCmdValue (data: {[key: string]: string}): string {
    const zero = 0;
    const one = 1;
    const cmd = data.cmd.split(" ")[zero];
    const args = data.cmd.split(" ").slice(one);
    const exec = spawnSync(cmd, args, {"encoding": "utf8"});

    if (exec.status !== zero) {
        // eslint-disable-next-line max-len
        throw new Error(`Command ${data.cmd} exited with following error: \n${exec.stderr}`);
    }
    return exec.stdout.replace("\n", "");
}

function getEnvValue (data: {[key: string]: string}): string {
    const env = process.env[data.env];
    if (env === "" || typeof env === "undefined") {
        throw new Error(`Environment variable '${data.env}' does not exists`);
    } else {
        return env;
    }
}

export function getValue (
    parent: string,
    data: {[key: string]: string}
): string {
    const minSize = 1;

    if (Object.keys(data).length > minSize) {
        // eslint-disable-next-line max-len
        throw new Error(`Pulumi config key '${parent}' should only have one subkey`);
    }
    if (data.cmd) {
        return getCmdValue(data);
    } else if (data.env) {
        return getEnvValue(data);
    }

    // eslint-disable-next-line max-len
    throw new Error(`Pulumi config key '${parent}' should have a subkey valid among (cmd | env)`);
}
