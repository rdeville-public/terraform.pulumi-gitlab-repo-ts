import {spawnSync} from "child_process"
import * as process from "process"

export function getValue(parent: string, data: {[key: string]: string}): string {
  if (Object.keys(data).length > 1) {
    throw new Error(
      `Pulumi config key '${parent}' should only have one subkey`
    )
  }
  const key = Object.keys(data)[0]
  switch (key) {
    case "cmd":
      const cmd = data[key].split(" ")[0]
      const args = data[key].split(" ").slice(1)
      const exec = spawnSync(cmd, args, {encoding: "utf8"})
      if (exec.status != 0) {
        throw new Error(
          `Command ${data[key]} exited with following error: \n${process.stderr}`
        )
      }
      return exec.stdout.replace("\n", "")
    case "env":
      const env = process.env[data[key]]
      if (!env) {
        throw new Error(
          `Environment variable '${data[key]}' does not exists`
        )
      }
      return env
  }
  throw new Error(
    `Pulumi config key '${parent}' should have a subkey valid amongs(cmd | env)`
  )
}
