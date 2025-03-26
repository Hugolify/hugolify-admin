{{- $collections := partialCached "admin/collections/index.yml" . -}}
{{- $sliceCompatibity := slice 
  (dict "regex" true "path: '[^']*'," "") 
  (dict "folder:" "path:") 
  (dict "widget: 'color'" "widget: 'string'") 
  (dict "widget: 'relation'" "widget: 'reference'") 
  (dict "widget: 'markdown'" "widget: 'rich-text'") 
  (dict "widget: 'text'" "widget: 'string'") 
  (dict "widget: 'hidden'" "widget: 'string', ui: { hidden: true }") 
  (dict "widget: 'select'" "widget: 'string', list: true, ui: { component: 'select' }") 
  (dict "name: 'pdf'" "widget: 'pdf', media: { accept: 'application/pdf' }") 
  (dict "name: 'mp4'" "widget: 'mp4', media: { accept: 'video/mp4' }") 
  (dict "name: 'webm'" "widget: 'webm', media: { accept: 'video/webm' }") 
  (dict "widget: 'file'" "widget: 'image'") 
  (dict "types:" "templates:") 
  (dict "widget: 'list'" "widget: 'object', list: true") 
  (dict "widget:" "type:") 
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
      mediaRoot: "assets/images/uploads",
      publicFolder: "public",
    },
  },
  schema: {
    {{ $collections }}
  }
});