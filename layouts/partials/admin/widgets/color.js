{{/* 
  Partial to generate a color widget
  
  - default (boolean or string)
  - hidden (boolean)
  - hint (string)
  - i18n (boolean or string)
  - label (string) required
  - name (string) required
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
{{- $required := .required | default false }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  {{ with $nameOverride }}
  key: '{{ . }}',
  {{ end }}
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

{{/* Tina CMS */}}
{{ else if eq $cms "tinacms" }}

{
  label: '{{ $label }}',
  {{ with $hint }}
  description: '{{ . }}',
  {{ end }}
  {{ partial "admin/func/GetTinaName.html" (dict "name" $name "nameOverride" .nameOverride) }},
  type: 'string',
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
