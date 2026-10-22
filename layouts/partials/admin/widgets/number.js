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
{{/* 0 is a bound like any other, which `default` would drop */}}
{{- $max := cond (isset . "max") .max false }}
{{- $min := cond (isset . "min") .min false }}
{{- $name := .name | default "noname" }}
{{- $nameOverride := .nameOverride | default false }}
{{- $range := .range | default false }}
{{- $required := .required | default false }}
{{- $step := .step | default false }}
{{- $value_type := .value_type | default "int" }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

'{{ $name }}': {
  label: '{{ $label }}',
  {{ with $hint }}
  comment: '{{ . }}',
  {{ end }}
  type: '{{ cond $range "range" "number" }}',
  options: {
    {{ if ne $min false }}
    min: {{ $min }},
    {{ end }}
    {{ if ne $max false }}
    max: {{ $max }},
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
    {{ if ne $min false }}
    min: {{ $min }},
    {{ end }}
    {{ if ne $max false }}
    max: {{ $max }},
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
    {{ if ne $min false }}
    min: {{ $min }},
    {{ end }}
    {{ if ne $max false }}
    max: {{ $max }},
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
  {{ if ne $min false }}
  min: {{ $min }},
  {{ end }}
  {{ if ne $max false }}
  max: {{ $max }},
  {{ end }}
  {{ with $step }}
  step: {{ . }},
  {{ end }}
  {{ with $value_type }}
  value_type: '{{ . }}',
  {{ end }}
  i18n: {{ if or (eq $i18n true) (eq $i18n false) }}{{ $i18n }}{{ else }}'{{ $i18n }}'{{ end }}
}

{{ end }}
