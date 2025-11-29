{{/* 
  Partial to generate a blocks widget
  
  - blocks (array) required
  - collapsed (boolean)
  - hint (string)
  - i18n (boolean or string)
  - label (string) required
  - label_singular (string)
  - max (number)
  - min (number)
  - name (string) required
  - required (boolean)
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $blocks := .blocks | default slice }}
{{- $collapsed := .collapsed | default true }}
{{- $hint := .hint | default false }}
{{- $i18n := .i18n | default true }}
{{- $label := .label | default "nolabel" }}
{{- $label_singular := .label_singular | default false }}
{{- $max := .max | default false }}
{{- $min := .min | default false }}
{{- $name := .name | default "noname" }}
{{- $required := .required | default false }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

blocks: {
  type: 'array',
  options: {
    structures: '_structures.blocks'
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
  {{ if or $min $max }}
  list: {
    {{ with $min }}
    min: {{ . }},
    {{ end }}
    {{ with $max }}
    max: {{ . }}
    {{ end }}
  },
  {{ else }}
  list: true,
  {{ end }}
  required: {{ $required }},
  type: 'block',
  blockKey: 'type',
  blocks: [
    {{ partial "admin/blocks/_range.html" $blocks }}
  ]
}

{{/* Tina CMS */}}
{{ else if eq $cms "tinacms" }}

{
  label: '{{ $label }}',
  {{- with $hint }}
  description: '{{ . }}',
  {{- end }}
  {{ partial "admin/func/GetTinaName.html" (dict "name" $name "nameOverride" .nameOverride) }},
  list: true,
  {{- if or $min $max }}
  ui: {
    {{- with $min }}
    min: {{ . }},
    {{- end }}
    {{- with $max }}
    max: {{ . }}
    {{- end }}
  },
  {{- end }}
  required: {{ $required }},
  type: 'object',
  templateKey: 'type',
  templates: [
    {{ partial "admin/blocks/_range.html" $blocks }}
  ]
}

{{/* Decap, Netlify, Static, Sveltia CMS */}}
{{ else }}

{
  label: '{{ $label }}',
  {{ with $label_singular }}
  label_singular: '{{ . }}',
  {{ end }}
  {{ with $hint }}
  hint: '{{ . }}',
  {{ end }}
  name: '{{ $name }}',
  widget: 'list',
  {{ with $min }}
  min: {{ . }},
  {{ end }}
  {{ with $max }}
  max: {{ . }},
  {{ end }}
  minimize_collapsed: true,
  required: {{ $required }},
  collapsed: {{ $collapsed }},
  i18n: {{ $i18n }},
  types: [
    {{ partial "admin/blocks/_range.html" $blocks }}
  ]
}

{{ end }}
