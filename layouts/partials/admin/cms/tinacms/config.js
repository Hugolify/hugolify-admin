{{- $collections := partialCached "admin/collections/index.yml" . -}}

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
      mediaRoot: "{{ site.Params.admin.media.media_folder | default `/assets/images/uploads` }}",
      publicFolder: "public",
    },
  },
  schema: {
    {{ $collections }}
  }
});