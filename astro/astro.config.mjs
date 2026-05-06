import { defineConfig } from "astro/config";
import beautifier from "astro-html-beautifier";
import viteConfig, { allowedHosts } from "./vite.config.js";

export default defineConfig({
  compressHTML: false,
  integrations: [
    beautifier({
      indent_size: 2,
      indent_char: " ",
      wrap_line_length: 0,
      wrap_attributes: "auto",
      preserve_newlines: false,
      unformatted: ["astro-island"]
    })
  ],
  devToolbar: {
    enabled: false
  },
  server: {
    host: "0.0.0.0",
    allowedHosts
  },
  build: {
    format: "file",
    inlineStylesheets: "never"
  },
  trailingSlash: "never",
  vite: viteConfig
});
