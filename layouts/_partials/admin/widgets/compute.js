{{/*
  Partial to generate a compute widget

  Read-only field whose value is derived from other fields of the entry.
  Sveltia CMS only: no other supported CMS ships an equivalent widget.

  - hint (string)
  - i18n (boolean or string)
  - label (string) required
  - name (string) required
  - required (boolean)
  - value (string) required — template, e.g. '{{fields.first_name}} {{fields.last_name}}' or '{{index}}' inside a list
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $hint := .hint | default false }}
{{- $i18n := .i18n | default true }}
{{- $label := .label | default "nolabel" }}
{{- $name := .name | default "noname" }}
{{- $required := .required | default false }}
{{- $value := .value | default "" }}

{{/* Sveltia CMS */}}
{{ if eq $cms "sveltiacms" }}

{
  label: '{{ $label }}',
  {{ with $hint }}
  hint: '{{ . }}',
  {{ end }}
  name: '{{ $name }}',
  widget: 'compute',
  {{/* safeHTML keeps `&` intact in value templates such as mailto query strings */}}
  value: '{{ $value | safeHTML }}',
  required: {{ $required }},
  i18n: {{ if or (eq $i18n true) (eq $i18n false) }}{{ $i18n }}{{ else }}'{{ $i18n }}'{{ end }}
}

{{/* CloudCannon, Decap, Netlify, Pages, Static, Tina CMS */}}
{{ else }}

{{/* NOT AVAILABLE */}}
{}

{{ end }}
