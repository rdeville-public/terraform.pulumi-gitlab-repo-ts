import type * as gitProvider from "../providers";
import * as githubProvider from "./github";
import * as gitlabProvider from "./gitlab";

export function providerFactory (
    type: string,
    name: string,
    data: Partial<gitProvider.IProvider>
): gitProvider.IProvider {

    if (type === "github") {

        return new githubProvider.GithubProvider(name, data);

    } else if (type === "gitlab") {

        return new gitlabProvider.GitlabProvider(name, data);

    }
    throw new Error(`Git provider type not supported: "${type}"`);

}
