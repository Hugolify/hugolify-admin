{{/* 
  Partial to generate a select widget
  
  - default (string)
  - hidden (boolean)
  - hint (string)
  - i18n (boolean or string)
  - label (string) required
  - multiple (boolean)
  - name (string) required
  - nameOverride (string)
  - options (array or object) required
  - required (boolean)
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $default := .default | default "" }}
{{- $hidden := .hidden | default false }}
{{- $hint := .hint | default false }}
{{- $i18n := .i18n | default true }}
{{- $i18n = cond (eq (printf "%T" $i18n) "boolean") $i18n (print "'" $i18n "'") }}
{{- $label := .label | default "nolabel" }}
{{- $multiple := .multiple | default false }}
{{- $name := .name | default "noname" }}
{{- $nameOverride := .nameOverride | default false }}
{{- $options := .options | default false }}
{{- $required := .required | default false }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  label: '{{ $label }}',
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
