{{/* 
  Partial to generate a markdown widget
  
  - label (string) required
  - hint (string)
  - name (string) required
  - default (string)
  - minimal (boolean)
  - required (boolean)
  - pattern (object)
  - i18n (boolean or string)
*/}}

{{ $cms := site.Params.admin.cms }}

{{ $label := .label | default "nolabel" }}
{{ $hint := .hint | default false }}
{{ $name := .name | default "noname" }}
{{ $default := .default | default "" }}
{{ $buttons := .buttons | default false }}
{{ $minimal := .minimal | default false }}
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
