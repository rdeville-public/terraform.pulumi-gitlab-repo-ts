import type {
    ProjectData,
    ProjectSupportedObject
} from "./types";
import {GitlabProject} from "./gitlab";


/**
 * Factory design pattern to build multiple type of projects depending on the
 * provider type.
 *
 * @param {string} type - Type of the provider
 * @param {string} name - Name of the project
 * @param {ProjectData} data - projects arguments and pulumi resource options
 * @throws {Error} - If provider is not supported, throw an error
 * @returns {ProjectSupportedObject} A project object depending on the provider
 */
export function projectFactory (
    type: string,
    name: string,
    data: ProjectData
): ProjectSupportedObject {
    if (type === "gitlab") {
        const defaultArgs = {
            "projectConfig": {
                name,
                "path": name
            }
        };
        return new GitlabProject(name, data.args ?? defaultArgs, data.opts);
    }
    throw new Error(`Projects for provider type not supported: "${type}"`);
}
