import test from 'ava';
import {ProviderError, providerFactory} from "../"
import {GithubProvider} from "../"
import {GitlabProvider} from "../"

const providerName = "fakename.tld"
test('Provider factory with github', t => {
  const gitType = "github"
  const provider = providerFactory(gitType, providerName, {})
  t.is(typeof provider, typeof GithubProvider.prototype);
});


test('Provider factory with gitlab', t => {
  const gitType = "gitlab"
  const provider = providerFactory(gitType, providerName, {})
  t.is(typeof provider, typeof GitlabProvider.prototype);
});


test('Provider factory throw error with wrong provider', t => {
  const gitType = "wrongType"
  const errorMsg = `Git provider type not supported : "${gitType}"`
  t.throws(() => {
    providerFactory(gitType, providerName, {})
  }, {instanceOf: ProviderError}, errorMsg)
});
