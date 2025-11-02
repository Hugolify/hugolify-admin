{{/* 
  Partial to generate a code widget
  
  - label (string) required
  - hint (string)
  - name (string) required
  - language (string)
  - default (boolean or string)
  - required (boolean)
  - i18n (boolean or string)
*/}}

{{ $cms := site.Params.admin.cms }}

{{ $label := .label | default "nolabel" }}
{{ $hint := .hint | default false }}
{{ $name := .name | default "noname" }}
{{ $language := .language | default false }}
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
  type: 'code',
  options: {
    {{ with $language }}
    syntax: '{{ . }}',
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
  type: 'code',
  {{ with $language }}
  options: {
    language: '{{ . }}'
  },
  {{ end }}
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
  widget: 'code',
  {{ with $language }}
  default_language: '{{ . }}',
  {{ end }}
  {{ if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  required: {{ $required }},
  i18n: {{ $i18n }}
}

{{ end }}
