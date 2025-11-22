{{/* 
  Partial to generate a boolean widget
  
  - label (string) required
  - hint (string)
  - name (string) required
  - default (boolean or string)
  - required (boolean)
  - i18n (boolean or string)
  - hidden (boolean)
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $label := .label | default "nolabel" }}
{{- $hint := .hint | default false }}
{{- $name := .name | default "noname" }}
{{- $nameOverride := .nameOverride | default false }}
{{- $default := .default | default "" }}
{{- $required := .required | default false }}
{{- $i18n := .i18n | default true }}
{{- $hidden := .hidden | default false }}

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
  {{ with $hidden }}
  hidden: true,
  {{ end }}
  type: 'switch',
  options: {
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
  type: 'boolean',
  {{ if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  {{ with $hidden }}
  hidden: true,
  {{ end }}
  required: {{ $required }}
}

{{/* Tina CMS */}}
{{ else if eq $cms "tinacms" }}

{
  label: '{{ $label }}',
  {{- with $hint }}
  description: '{{ . }}',
  {{- end }}
  {{ partial "admin/func/GetTinaName.html" (dict "name" $name "nameOverride" .nameOverride) }},
  type: 'boolean',
  {{- if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  {{- with $hidden }}
  ui: {
    component: 'hidden'
  },
  {{- end }}
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
  widget: '{{ cond $hidden "hidden" "boolean" }}',
  {{ if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  required: {{ $required }},
  i18n: {{ $i18n }}
}

{{ end }}
