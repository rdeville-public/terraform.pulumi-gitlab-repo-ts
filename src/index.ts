import * as pulumi from "@pulumi/pulumi";
import * as gitProvider from "./providers"

// Get configuration
const config = new pulumi.Config();
const gitProviders = config.requireObject<gitProvider.IProviders>("gitProvider");

for (const i_gitProviderName in gitProviders) {
  const provider = gitProviders[i_gitProviderName]

  const currProvider = gitProvider.providerFactory(
    provider["type"],
    i_gitProviderName,
    provider);
  pulumi.log.error(currProvider.name)
}

