{{/* 
  Partial to generate a select widget
  
  - label (string) required
  - hint (string)
  - name (string) required
  - options (array or object) required
  - multiple (boolean)
  - default (string)
  - required (boolean)
  - i18n (boolean or string)
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $label := .label | default "nolabel" }}
{{- $hint := .hint | default false }}
{{- $name := .name | default "noname" }}
{{- $options := .options | default false }}
{{- $multiple := .multiple | default false }}
{{- $default := .default | default "" }}
{{- $required := .required | default false }}
{{- $i18n := .i18n | default true }}
{{- $i18n = cond (eq (printf "%T" $i18n) "boolean") $i18n (print "'" $i18n "'") }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  name: '{{ $label }}',
  {{ with $hint }}
  comment: '{{ . }}',
  {{ end }}
  type: '{{ cond $multiple "multiselect" "select" }}',
  options: {
    {{ with $options }}
    values: [
    {{- range $k, $v := . }}
      {{- $name := $k -}}
      {{- if eq (printf "%T" $k) "int" }}
        {{- $name = $v -}}
      {{- end }}
      {{- $value := cond (eq (printf "%T" $v) "string") (print "'" . "'") . -}}
      { 
        name: '{{ i18n (print "admin.fields." $i18n ".options." (replace $name "-" "_")) | default (humanize $name) }}', 
        value: {{ $value }} 
      },
      {{- end }}
    ],
    value_key: 'value',
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
  type: 'select',
  options: {
    {{ with $multiple }}
    multiple: true,
    {{ end }}
    {{ with $options }}
    values: [
    {{- range $k, $v := . }}
      {{- $name := $k -}}
      {{- if eq (printf "%T" $k) "int" }}
        {{- $name = $v -}}
      {{- end }}
      {{- $value := cond (eq (printf "%T" $v) "string") (print "'" . "'") . -}}
      { 
        label: '{{ i18n (print "admin.fields." $i18n ".options." (replace $name "-" "_")) | default (humanize $name) }}', 
        value: {{ $value }} 
      },
      {{- end }}
    ]
    {{ end }}
  },
  {{ if ne $default "" }}
  default: '{{ $default }}',
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
  type: 'string',
  component: 'select',
  {{- with $options }}
  options: [
  {{- range $k, $v := . }}
    {{- $name := $k -}}
    {{- if eq (printf "%T" $k) "int" }}
      {{- $name = $v -}}
    {{- end }}
    {{- $value := cond (eq (printf "%T" $v) "string") (print "'" . "'") . -}}
    { 
      label: '{{ i18n (print "admin.fields." $i18n ".options." (replace $name "-" "_")) | default (humanize $name) }}', 
      value: {{ $value }} 
    },
  {{- end }}
  ],
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
  widget: 'select',
  {{ with $options }}
  options: [
  {{- range $k, $v := . }}
    {{- $name := $k -}}
    {{- if eq (printf "%T" $k) "int" }}
      {{- $name = $v -}}
    {{- end }}
    {{- $value := cond (eq (printf "%T" $v) "string") (print "'" . "'") . -}}
    { 
      label: '{{ i18n (print "admin.fields." $i18n ".options." (replace $name "-" "_")) | default (humanize $name) }}', 
      value: {{ $value }} 
    },
  {{ end }}
  ],
  {{ end }}
  {{ with $multiple }}
  multiple: true,
  {{ end }}
  {{ if ne $default "" }}
  default: '{{ $default }}',
  {{ end }}
  required: {{ $required }},
  i18n: {{ $i18n }}
}

{{ end }}
