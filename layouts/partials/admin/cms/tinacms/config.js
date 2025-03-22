import { defineConfig } from "tinacms";

export default defineConfig({
  branch: {{ site.Params.admin.branch | default "main" }},
  build: {
    outputFolder: 'admin',
    publicFolder: 'public'
  },
  media: {
    tina: {
      mediaRoot: "assets/images/uploads",
      publicFolder: "public",
    },
  },
  schema: {
    {{ partialCached "admin/collections/index.yml" . }}
  }
});