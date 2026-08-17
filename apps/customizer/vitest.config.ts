import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    alias: [{ find: '@src', replacement: path.resolve(__dirname, 'src') }],
  },
});
