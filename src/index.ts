/*
 * TMP
 * import * as pulumi from "@pulumi/pulumi";
 * import type * as gitProvider from "./providers";
 *
 * // Get configuration
 * const config = new pulumi.Config(),
 * gitProviders = config.requireObject<gitProvider.IProviders>("gitProvider");
 *
 * for (const i_gitProviderName in gitProviders) {
 *
 *     const provider = gitProviders[i_gitProviderName],
 *
 *         currProvider = gitProvider.providerFactory(
 *             provider.type,
 *             i_gitProviderName,
 *             provider
 *         );
 *     pulumi.log.error(currProvider.name);
 *
 * }
 */
