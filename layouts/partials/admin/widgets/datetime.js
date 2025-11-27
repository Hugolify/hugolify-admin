{{/* 
  Partial to generate a datetime widget
  
  - default (date or string)
  - hidden (boolean)
  - hint (string)
  - i18n (boolean or string)
  - label (string) required
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
{{- $name := .name | default "noname" }}
{{- $nameOverride := .nameOverride | default false }}
{{- $required := .required | default false }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  label: '{{ $label }}',
  {{ with $hint }}
  comment: '{{ . }}',
  {{ end }}
  {{ if ne $default "" }}
    {{ if eq $default "now" }}
      {{ $default = `'NOW'` }}
    {{ end }}
  instance_value: {{ $default }},
  {{ end }}
  type: 'datetime',
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
  type: 'date',
  options: {
    format: "yyyy-MM-dd'T'HH:mm:ssX",
    time: true
  },
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
  type: 'datetime',
  ui: {
    dateFormat: "YYYY-MM-DD'T'HH:mm:ssZ"
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
  widget: 'datetime',
  {{ if ne $default "" }}
    {{ if eq $default "now" }}
      {{ $default = `"{{now}}"` }}
    {{ end }}
  default: {{ $default }},
  {{ end }}
  required: {{ $required }},
  i18n: {{ $i18n }}
}

{{ end }}
