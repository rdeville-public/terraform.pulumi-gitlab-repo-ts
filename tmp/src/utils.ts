import * as process from "process";
import {spawnSync} from "child_process";

function getCmdValue (fullCmd: string): string {
    const zero = 0;
    const one = 1;
    const cmd = fullCmd.split(" ")[zero];
    const args = fullCmd.split(" ").slice(one);
    const exec = spawnSync(cmd, args, {"encoding": "utf8"});

    if (exec.status !== zero) {
        // eslint-disable-next-line max-len
        throw new Error(`Command ${fullCmd} exited with following error: \n${exec.stderr}`);
    }
    return exec.stdout.replace("\n", "");
}

function getEnvValue (envVarName: string): string {
    const env = process.env[envVarName];
    if (env === "" || typeof env === "undefined") {
        throw new Error(`Environment variable '${envVarName}' does not exists`);
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
        return getCmdValue(data.cmd);
    } else if (data.env) {
        return getEnvValue(data.env);
    }

    // eslint-disable-next-line max-len
    throw new Error(`Pulumi config key '${parent}' should have a subkey valid among (cmd | env)`);
}
