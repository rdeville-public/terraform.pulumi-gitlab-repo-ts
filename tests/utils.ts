import test from 'ava';
import * as utils from '../src/utils'

const ENV: {[key: string]: string} = {
  "FAKETOKEN": "FAKEVALUE"
}

Object.entries(ENV).forEach(
  ([key, val]) => {
    process.env[key] = val
  }
);

// utils.getValue testing
test('getValue multiple subkey error', t => {
  const fakeData = {
    'env': 'FAKETOKEN',
    'cmd': 'echo foo'
  }
  const fakeParent = "fakeParent"
  const errorMsg = `Pulumi config key '${fakeParent}' should only have one subkey`
  t.throws(() => {
    utils.getValue(fakeParent, fakeData)
  }, {instanceOf: Error}, errorMsg)
});

test('getValue wrong subkey error', t => {
  const fakeData = {
    'wrongKey': 'WRONGTOKEN'
  }
  const fakeParent = "fakeParent"
  const errorMsg = `Pulumi config key '${fakeParent}' should have a subkey valid amongs(cmd | env)`
  const error = t.throws(() => {
    utils.getValue(fakeParent, fakeData)
  }, {instanceOf: Error});
  t.is(error?.message, errorMsg)
});

test('getValue "cmd" working', t => {
  const fakeData = {
    'cmd': 'true'
  }
  const fakeParent = "fakeParent"
  const value = utils.getValue(fakeParent, fakeData)
  t.is(value, "");
});

test('getValue "cmd" error', t => {
  const fakeData = {
    'cmd': 'false'
  }
  const fakeParent = "fakeParent"
  const errorMsg = `Command ${fakeData["cmd"]} exited with following error: \n[object Object]`
  const error = t.throws(() => {
    utils.getValue(fakeParent, fakeData)
  }, {instanceOf: Error});
  t.is(error?.message, errorMsg)
});

test('getValue "env" working', t => {
  const fakeData = {
    'env': 'FAKETOKEN'
  }
  const fakeParent = "fakeParent"
  const value = utils.getValue(fakeParent, fakeData)
  t.is(value, "FAKEVALUE");
});

test('getValue "env" error', t => {
  const fakeData = {
    'env': 'WRONGTOKEN'
  }
  const fakeParent = "fakeParent"
  const errorMsg = `Environment variable '${fakeData["env"]}' does not exists`
  const error = t.throws(() => {
    utils.getValue(fakeParent, fakeData)
  }, {instanceOf: Error});
  t.is(error?.message, errorMsg)
});
