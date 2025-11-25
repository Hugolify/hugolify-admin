{{/* 
  Partial to generate a code widget
  
  - default (boolean or string)
  - hidden (boolean)
  - hint (string)
  - i18n (boolean or string)
  - label (string) required
  - language (string)
  - name (string) required
  - nameOverride (string)
  - required (boolean)
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $default := .default | default "" }}
{{- $hidden := .hidden | default false }}
{{- $hint := .hint | default false }}
{{- $i18n := .i18n | default true }}
{{- $label := .label | default "nolabel" }}
{{- $language := .language | default false }}
{{- $name := .name | default "noname" }}
{{- $nameOverride := .nameOverride | default false }}
{{- $required := .required | default false }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  {{ with $nameOverride }}
  key: '{{ . }}',
  {{ end }}
  name: '{{ $label }}',
  {{ with $hint }}
  comment: '{{ . }}',
  {{ end }}
  type: 'code',
  options: {
    {{ with $language }}
    syntax: '{{ . }}',
    {{ end }}
    required: {{ $required }}
  }
}

{{/* Pages CMS */}}
{{ else if eq $cms "pagescms" }}

{
  label: '{{ $label }}',
  {{ with $hint }}
  description: '{{ . }}',
  {{ end }}
  name: '{{ $name }}',
  type: 'code',
  {{ with $language }}
  options: {
    language: '{{ . }}'
  },
  {{ end }}
  {{ if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  required: {{ $required }}
}

{{/* Tina CMS */}}
{{ else if eq $cms "tinacms" }}

{
  label: '{{ $label }}',
  {{ with $hint }}
  description: '{{ . }}',
  {{ end }}
  {{ partial "admin/func/GetTinaName.html" (dict "name" $name "nameOverride" .nameOverride) }},
  type: 'string',
  ui: {
    component: 'textarea'
  },
  required: {{ $required }}
}

{{/* Decap, Netlify, Static, Sveltia CMS */}}
{{ else }}

{
  label: '{{ $label }}',
  {{ with $hint }}
  hint: '{{ . }}',
  {{ end }}
  name: '{{ $name }}',
  widget: 'code',
  {{ with $language }}
  default_language: '{{ . }}',
  {{ end }}
  {{ if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  required: {{ $required }},
  i18n: {{ $i18n }}
}

{{ end }}
