{{/* 
  Partial to generate a map widget
  
  - label (string) required
  - hint (string)
  - name (string) required
  - default (string)
  - i18n (boolean or string)
*/}}

{{ $cms := site.Params.admin.cms }}

{{ $label := .label | default "nolabel" }}
{{ $hint := .hint | default false }}
{{ $name := .name | default "noname" }}
{{ $default := .default | default "" }}
{{ $i18n := .i18n | default true }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{/* TODO */}}

{{/* Pages CMS */}}
{{ else if eq $cms "pagescms" }}

{{/* TODO */}}

{{/* Decap, Netlify, Static, Sveltia CMS */}}
{{ else }}

{
  label: '{{ $label }}',
  {{ with $hint }}
  hint: '{{ . }}',
  {{ end }}
  name: '{{ $name }}',
  {{ if ne $default "" }}
  default: {{ $default }},
  {{ end }}
  widget: 'map',
  i18n: {{ $i18n }}
}

{{ end }}
