{{- $collections := partialCached "admin/collections/index.yml" . -}}
{{- $sliceCompatibity := slice 
  (dict "folder:" "path:") 
  (dict "widget: 'relation'" "widget: 'reference'") 
  (dict "widget: 'markdown'" "widget: 'rich-text'") 
  (dict "widget: 'text'" "widget: 'string'") 
  (dict "widget: 'hidden'" "widget: 'string', hidden: true") 
  (dict "widget: 'select'" "widget: 'string', list: true") 
  (dict "widget: 'list'" "widget: 'object', list: true") 
  (dict "widget:" "type:") 
  -}}
{{- range $sliceCompatibity }}
  {{- range $key, $value := . }}
    {{- $collections = replace $collections $key $value -}}
  {{- end -}}
{{- end -}}

import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "{{ site.Params.admin.branch | default "main" }}",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "/assets/images/uploads",
      publicFolder: "public",
    },
  },
  schema: {
    {{ $collections }}
  }
});