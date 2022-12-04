import * as gitlabProvider from "./gitlab"
import * as githubProvider from "./github"
import * as gitProvider from "../providers"

export function providerFactory(type: string, name: string, data: Partial<gitProvider.Provider>): gitProvider.IProvider {
  if (type === "github") {
    return new githubProvider.GithubProvider(name, data);
  } else if (type === "gitlab") {
    return new gitlabProvider.GitlabProvider(name, data);
  }
  throw new gitProvider.ProviderError(`Git provider type not supported: "${type}"`)
}
