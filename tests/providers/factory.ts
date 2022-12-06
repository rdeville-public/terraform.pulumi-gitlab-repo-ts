import test from 'ava';
import {ProviderError, providerFactory} from '../../src/providers/'
import {GithubProvider} from '../../src/providers/'
import {GitlabProvider} from '../../src/providers/'

const ENV: {[key: string]: string} = {
  "FAKETOKEN": "FAKEVALUE"
}

Object.entries(ENV).forEach(
  ([key, val]) => {
    process.env[key] = val
  }
);

const providerName = 'fakename.tld'

// Mocking pulumi config key fakename.tld
process.env['PULUMI_CONFIG'] = JSON.stringify({
  "project:fakename.tld": JSON.stringify({
    "env": "FAKETOKEN"
  })
})

test('Github provider type', t => {
  const gitType = 'github'
  const provider = providerFactory(gitType, providerName, {})
  t.is(typeof provider, typeof GithubProvider.prototype);
});


test('Gitlab provider type', t => {
  const gitType = 'gitlab'
  const provider = providerFactory(gitType, providerName, {})
  t.is(typeof provider, typeof GitlabProvider.prototype);
});


test('Wrong provider type error', t => {
  const gitType = 'wrongType'
  const errorMsg = `Git provider type not supported: "${gitType}"`
  const error = t.throws(() => {
    providerFactory(gitType, providerName, {})
  }, {instanceOf: ProviderError}, errorMsg)
  t.is(error?.message, errorMsg)
});
