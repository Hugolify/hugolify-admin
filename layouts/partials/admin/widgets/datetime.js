{{/* 
  Partial to generate a datetime widget
  
  - label (string) required
  - hint (string)
  - name (string) required
  - default (date or string)
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

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  name: '{{ $label }}',
  {{ with $hint }}
  comment: '{{ . }}',
  {{ end }}
  {{ if ne $default "" }}
    {{ if eq $default "now" }}
      {{ $default = `'NOW'` }}
    {{ end }}
  instance_value: {{ $default }},
  {{ end }}
  type: 'datetime',
  options: {
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
  type: 'date',
  options: {
    format: "yyyy-MM-dd'T'HH:mm:ssX",
    time: true
  },
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
  widget: 'datetime',
  {{ if ne $default "" }}
    {{ warnf $default }}
    {{ if eq $default "now" }}
      {{ $default = `"{{now}}"` }}
    {{ end }}
  default: {{ $default }},
  {{ end }}
  required: {{ $required }},
  i18n: {{ $i18n }}
}

{{ end }}
