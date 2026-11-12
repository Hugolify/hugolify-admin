{{/* 
  Partial to generate a datetime widget
  
  - default (date or string)
  - format (string) Day.js tokens, storage format for Decap/Sveltia
  - hidden (boolean)
  - hint (string)
  - i18n (boolean or string)
  - label (string) required
  - name (string) required
  - nameOverride (string)
  - required (boolean)
  - time (boolean) false for a day without a time of day: a date picker
    only, stored as YYYY-MM-DD unless format says otherwise
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $default := .default | default "" }}
{{/* false is a value here, which `default` would drop */}}
{{- $time := cond (isset . "time") .time true }}
{{- $format := .format | default (cond $time "YYYY-MM-DD[T]HH:mm:ss" "YYYY-MM-DD") }}
{{- $hidden := .hidden | default false }}
{{- $hint := .hint | default false }}
{{- $i18n := .i18n | default true }}
{{- $label := .label | default "nolabel" }}
{{- $name := .name | default "noname" }}
{{- $nameOverride := .nameOverride | default false }}
{{- $required := .required | default false }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

'{{ $name }}': {
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
  type: '{{ cond $time "datetime" "date" }}',
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
    format: "{{ cond $time "yyyy-MM-dd'T'HH:mm:ssX" "yyyy-MM-dd" }}",
    time: {{ $time }}
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
  format: '{{ $format }}',
  {{ if not $time }}
  time_format: false,
  {{ end }}
  {{ if ne $default "" }}
    {{ if eq $default "now" }}
      {{ $default = `"{{now}}"` }}
    {{ end }}
  default: {{ $default }},
  {{ end }}
  required: {{ $required }},
  i18n: {{ if or (eq $i18n true) (eq $i18n false) }}{{ $i18n }}{{ else }}'{{ $i18n }}'{{ end }}
}

{{ end }}
