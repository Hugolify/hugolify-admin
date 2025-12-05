{{/* 
  Partial to generate a text widget
  
  - default (string)
  - i18n (boolean or string)
  - hint (string)
  - label (string) required
  - name (string) required
  - nameOverride (string)
  - pattern (object)
  - required (boolean)
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $default := .default | default "" }}
{{- $i18n := .i18n | default true }}
{{- $hint := .hint | default false }}
{{- $label := .label | default "nolabel" }}
{{- $name := .name | default "noname" }}
{{- $nameOverride := .nameOverride | default false }}
{{- $pattern := .pattern | default false }}
{{- $required := .required | default false }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  label: '{{ $label }}',
  {{ with $hint }}
  comment: '{{ . }}',
  {{ end }}
  type: 'textarea',
  options: {
    {{ with $pattern }}
    pattern: "{{ replace .regex "\\" "\\\\" }}",
    pattern_message: '{{ .message }}',
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
  type: 'text',
  {{ if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  {{ with $pattern }}
  pattern: {
    regex: "{{ replace .regex "\\" "\\\\" }}",
    message: '{{ .message }}'
  },
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
  ui: {
    component: "textarea"
  },
  {{- if ne $default "" }}
  default: {{ $default }},
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
  widget: 'text',
  {{ if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  required: {{ $required }},
  {{ with $pattern }}
  pattern: [
    '{{ replace .regex "\\" "\\\\" }}',
    '{{ .message }}'
  ],
  {{ end }}
  i18n: {{ $i18n }}
}

{{ end }}
