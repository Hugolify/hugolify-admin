{{/* 
  Partial to generate a number widget
  
  - label (string) required
  - hint (string)
  - name (string) required
  - default (string)
  - required (boolean)
  - min (number)
  - max (number)
  - step (number)
  - i18n (boolean or string)
*/}}

{{ $cms := site.Params.admin.cms }}

{{ $label := .label | default "nolabel" }}
{{ $hint := .hint | default false }}
{{ $name := .name | default "noname" }}
{{ $default := .default | default "" }}
{{ $required := .required | default false }}
{{ $max := .max | default false }}
{{ $min := .min | default false }}
{{ $step := .step | default false }}
{{ $range := .range | default false }}
{{ $i18n := .i18n | default true }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  name: '{{ $label }}',
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
  i18n: {{ $i18n }}
}

{{ end }}
