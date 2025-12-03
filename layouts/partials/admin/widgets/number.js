{{/* 
  Partial to generate a number widget
  
  - default (string)
  - hint (string)
  - i18n (boolean or string)
  - label (string) required
  - max (number)
  - min (number)
  - name (string) required
  - nameOverride (string)
  - range (boolean)
  - required (boolean)
  - step (number)
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $default := .default | default "" }}
{{- $hidden := .hidden | default false }}
{{- $hint := .hint | default false }}
{{- $i18n := .i18n | default true }}
{{- $label := .label | default "nolabel" }}
{{- $max := .max | default false }}
{{- $min := .min | default false }}
{{- $name := .name | default "noname" }}
{{- $nameOverride := .nameOverride | default false }}
{{- $range := .range | default false }}
{{- $required := .required | default false }}
{{- $step := .step | default false }}
{{- $value_type := .value_type | default "float" }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  label: '{{ $label }}',
  {{ with $hint }}
  comment: '{{ . }}',
  {{ end }}
  type: '{{ cond $range "range" "number" }}',
  options: {
    {{ with $min }}
    min: {{ . }},
    {{ end }}
    {{ with $max }}
    max: {{ . }},
    {{ end }}
    {{ with $step }}
    step: {{ . }},
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
  type: 'number',
  {{ if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  options: {
    {{ with $min }}
    min: {{ . }},
    {{ end }}
    {{ with $max }}
    max: {{ . }},
    {{ end }}
    {{ with $step }}
    step: {{ . }}
    {{ end }}
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
  type: 'number',
  ui: {
    {{ with $min }}
    min: {{ . }},
    {{ end }}
    {{ with $max }}
    max: {{ . }},
    {{ end }}
    {{ with $step }}
    step: {{ . }}
    {{ end }}
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
  widget: 'number',
  {{ if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  required: {{ $required }},
  {{ with $min }}
  min: {{ . }},
  {{ end }}
  {{ with $max }}
  max: {{ . }},
  {{ end }}
  {{ with $step }}
  step: {{ . }},
  {{ end }}
  {{ with $value_type }}
  value_type: '{{ . }}',
  {{ end }}
  i18n: {{ $i18n }}
}

{{ end }}
