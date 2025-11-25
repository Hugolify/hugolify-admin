{{/* 
  Partial to generate a map widget
  
  - default (string)
  - hint (string)
  - i18n (boolean or string)
  - label (string) required
  - name (string) required
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $default := .default | default "" }}
{{- $hint := .hint | default false }}
{{- $i18n := .i18n | default true }}
{{- $label := .label | default "nolabel" }}
{{- $name := .name | default "noname" }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{/* TODO */}}

{{/* Pages CMS */}}
{{ else if eq $cms "pagescms" }}

{{/* TODO */}}
{}

{{/* Tina CMS */}}
{{ else if eq $cms "tinacms" }}

{{/* TODO */}}
{}

{{/* Decap, Netlify, Static, Sveltia CMS */}}
{{ else }}

{
  label: '{{ $label }}',
  {{ with $hint }}
  hint: '{{ . }}',
  {{ end }}
  name: '{{ $name }}',
  {{ if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  widget: 'map',
  i18n: {{ $i18n }}
}

{{ end }}
