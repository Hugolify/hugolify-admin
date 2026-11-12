{{- $collections := partialCached "admin/collections/index.yml" . | partial "admin/func/CurlyApostrophes.html" -}}

{{- $sliceCompatibity := slice 
  (dict "folder:" "path:") 
  -}}
{{- range $sliceCompatibity }}
  {{- $regex := .regex | default false -}}
  {{- range $key, $value := . }}
    {{- if $regex -}}
    {{- $collections = replaceRE $key $value $collections -}}
    {{- else -}}
    {{- $collections = replace $collections $key $value -}}
    {{- end -}}
  {{- end -}}
{{- end -}}
{{- $collections = replace $collections "collections: [" "collections: withAllowedActions([" 1 | strings.TrimSpace | printf "%s)" -}}

import { defineConfig } from "tinacms";

// A collection gets `allowedActions` at its root, as its `ui` key already holds
// the filename: move it into `ui`
const withAllowedActions = (collections) =>
  collections.map(({ allowedActions, ...collection }) =>
    allowedActions
      ? { ...collection, ui: { ...collection.ui, allowedActions } }
      : collection
  );

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
      mediaRoot: "{{ site.Params.admin.media.media_folder | default `/assets/images/uploads` }}",
      publicFolder: "public",
    },
  },
  schema: {
    {{ $collections }}
  }
});