import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Scope to pure-logic unit tests. DOM/component tests under
    // src/components/__tests__ need @testing-library + jsdom, which aren't set
    // up yet; add them and widen this include when that harness lands.
    include: ['src/lib/**/*.test.ts'],
    environment: 'node',
  },
});
