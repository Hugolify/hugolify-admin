{{/* 
  Partial to generate a string widget
  
  - default (string)
  - hidden (boolean)
  - hint (string)
  - i18n (boolean or string)
  - label (string) required
  - name (string) required
  - nameOverride (string)
  - pattern (object)
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
{{- $pattern := .pattern | default false }}
{{- $required := .required | default false }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  label: '{{ $label }}',
  {{ with $hint }}
  comment: '{{ . }}',
  {{ end }}
  {{ with $hidden }}
  hidden: true,
  {{ end }}
  type: 'text',
  options: {
    {{ with $pattern }}
    pattern: '{{ .regex }}',
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
  {{ if eq $name "url" }}
  type: 'url',
  {{ else if eq $name "email" }}
  type: 'email',
  {{ else }}
  type: 'string',
  {{ end }}
  {{ if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  {{ with $hidden }}
  hidden: true,
  {{ end }}
  {{ with $pattern }}
  pattern: {
    regex: '{{ .regex }}',
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
  {{- if eq $name "title_page" }}
  isTitle: true,
  {{- end }}
  {{- if ne $default "" }}
  default: '{{ $default }}',
  {{- end }}
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
  {{ with $pattern }}
  pattern: [
    '{{ .regex }}',
    '{{ .message }}'
  ],
  {{ end }}
  i18n: {{ $i18n }}
}

{{ end }}
