{{/* 
  Partial to generate a string widget
  
  - label (string) required
  - hint (string)
  - name (string) required
  - default (string)
  - required (boolean)
  - pattern (object)
  - i18n (boolean or string)
*/}}

{{ $cms := site.Params.admin.cms }}

{{ $label := .label | default "nolabel" }}
{{ $hint := .hint | default false }}
{{ $name := .name | default "noname" }}
{{ $default := .default | default "" }}
{{ $required := .required | default false }}
{{ $pattern := .pattern | default false }}
{{ $i18n := .i18n | default true }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  name: '{{ $label }}',
  {{ with $hint }}
  comment: '{{ . }}',
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
  {{ with $pattern }}
  pattern: {
    regex: '{{ .regex }}',
    message: '{{ .message }}'
  },
  {{ end }}
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
  widget: 'string',
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
