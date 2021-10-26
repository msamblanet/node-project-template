// Placeholder generated by @msamblanet/node-project-template

// NOTE: The following logic is only needed if you will be mocking modules
// See: https://github.com/facebook/jest/issues/10025#issuecomment-716789840
// If you are not mocking modules, you can replace it all with standard imports

/* eslint-disable node/no-unsupported-features/es-syntax */
// Import types here
// ENSURE YOU USE import type otherwise you could impact mocks
// import type { RootConfig, RootConfigOverride } from '../src/index.js';

// Load and initiate mocks before other modules
// const { jest } = await import('@jest/globals');
// const { MockFs } = await import('./MockFs.js');
// const mockFs = new MockFs(jest);

// To ensure mocks are honored, you must await import the remaining modules
// const { default: fs } = await import('node:fs');
// const { Obfuscator } = await import('@msamblanet/node-obfuscator');
const TestModule = await import('../src/index.js');

describe('Placeholder', () => {
  test('Placeholder', () => {
    expect(TestModule).toBeDefined();
  });
});

// All ESM modules are required to have some default export...
const defaultExport = {};
export default defaultExport;
