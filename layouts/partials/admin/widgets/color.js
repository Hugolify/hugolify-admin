{{/* 
  Partial to generate a color widget
  
  - label (string) required
  - hint (string)
  - name (string) required
  - default (boolean or string)
  - required (boolean)
  - i18n (boolean or string)
*/}}

{{ $cms := site.Params.admin.cms }}

{{ $label := .label | default "nolabel" }}
{{ $hint := .hint | default false }}
{{ $name := .name | default "noname" }}
{{ $default := .default | default "" }}
{{ $required := .required | default false }}
{{ $i18n := .i18n | default true }}
{{ $hidden := .hidden | default false }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  name: '{{ $label }}',
  {{ with $hint }}
  comment: '{{ . }}',
  {{ end }}
  type: 'color',
  options: {
    format: hex,
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
  type: 'string', {{/* color widget not available */}}
  {{ if ne $default "" }}
  default: {{ $default }},
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
  widget: 'color',
  allowInput: true,
  enableAlpha: true,
  {{ if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  required: {{ $required }},
  i18n: {{ $i18n }}
}

{{ end }}
