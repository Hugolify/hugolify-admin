{{/* 
  Partial to generate a markdown widget
  
  - default (string)
  - hidden (boolean)
  - hint (string)
  - i18n (boolean or string)
  - label (string) required
  - minimal (boolean)
  - name (string) required
  - nameOverride (string)
  - pattern (object)
  - required (boolean)
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $buttons := .buttons | default false }}
{{- $default := .default | default "" }}
{{- $hidden := .hidden | default false }}
{{- $hint := .hint | default false }}
{{- $i18n := .i18n | default true }}
{{- $label := .label | default "nolabel" }}
{{- $minimal := .minimal | default false }}
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
  type: 'markdown',
  options: {
    {{ with $pattern }}
    pattern: "{{ .regex }}",
    pattern_message: "{{ .message }}",
    {{ end }}
    {{ with $minimal }}
      allow_resize: false,
      initial_height: 100,
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
  type: 'rich-text',
  {{ if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  options: {
    media: false
  },
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
  type: 'rich-text',
  {{- if eq $name "body" }}
  isBody: true,
  {{- end }}
  {{- if ne $default "" }}
  default: {{ $default }},
  {{- end }}
  options: {
    media: false
  },
  {{- with $pattern }}
  pattern: {
    regex: '{{ .regex }}',
    message: '{{ .message }}'
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
  widget: 'markdown',
  {{ if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  {{ with $buttons }}
  buttons: {{ $buttons }},
  {{ end }}
  {{ with $minimal }}
  minimal: true,
  {{ end }}
  modes: ['rich_text'],
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
