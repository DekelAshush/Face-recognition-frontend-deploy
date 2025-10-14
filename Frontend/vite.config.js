import { defineConfig } from 'vite';

// Enable LightningCSS error recovery to strip old IE star-hack properties
// (e.g. `*zoom`) that break the minifier. This allows the build to succeed
// while keeping node_modules CSS intact.
export default defineConfig({
  css: {
    // include both spellings in case of version differences
    lightningcss: {
      errorRecovery: true
    },
    lightningCss: {
      errorRecovery: true
    }
  }
});

