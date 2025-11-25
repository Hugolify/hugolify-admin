{{/* 
  Partial to generate a list widget
  
  - collapsed (boolean)
  - fields (array) required
  - hidden (boolean)
  - hint (string)
  - i18n (boolean or string)
  - label (string) required
  - label_singular (string)
  - max (number)
  - min (number)
  - multiple (boolean)
  - name (string) required
  - nameOverride (string)
  - required (boolean)
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $collapsed := .collapsed | default true }}
{{- $fields := .fields | default slice }}
{{- $hidden := .hidden | default false }}
{{- $hint := .hint | default false }}
{{- $i18n := .i18n | default true }}
{{- $label := .label | default "nolabel" }}
{{- $label_singular := .label_singular | default false }}
{{- $name := .name | default "noname" }}
{{- $nameOverride := .nameOverride | default false }}
{{- $max := .max | default false }}
{{- $min := .min | default false }}
{{- $multiple := .multiple | default true }}
{{- $required := .required | default false }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  {{ with $nameOverride }}
  key: '{{ . }}',
  {{ end }}
  name: '{{ $label }}',
  {{ with $label_singular }}
  singular_name: '{{ . }}',
  {{ end }}
  {{ with $hint }}
  comment: '{{ . }}',
  {{ end }}
  type: 'array',
  fields: [
    {{ range $fields }}
      {{ $file := print "admin/fields/" . ".yml" }}
      {{ if templates.Exists ( printf "partials/%s" $file ) }}
        '{{ . }}',
      {{ end }}
    {{ end }}
  ],
  real_fields: [
    {{ range $fields }}
      {{ with . }}
        '{{ . }}',
      {{ end }}
    {{ end }}
  ],
  options: {
    structures: '_structures.{{ $name }}',
    {{ with $min }}
    min_items: {{ . }},
    {{ end }}
    {{ with $max }}
    max_items: {{ . }},
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
  type: 'object',
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
  {{ partial "admin/fields/_fields.yml" $fields }}
}

{{/* Tina CMS */}}
{{ else if eq $cms "tinacms" }}

{
  label: '{{ $label }}',
  {{- with $hint }}
  description: '{{ . }}',
  {{- end }}
  {{ partial "admin/func/GetTinaName.html" (dict "name" $name "nameOverride" .nameOverride) }},
  type: 'object',
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
  {{ partial "admin/fields/_fields.yml" $fields }}
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
  {{ partial "admin/fields/_fields.yml" $fields }}
}

{{ end }}
