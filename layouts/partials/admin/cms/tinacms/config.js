import { defineConfig } from "tinacms";

export default defineConfig({
  branch: {{ site.Params.admin.branch | default "main" }},
  build: {
    outputFolder: 'admin',
    publicFolder: 'static'
  },
  schema: {
    {{ partialCached "admin/collections/index.yml" . }}
  }
});