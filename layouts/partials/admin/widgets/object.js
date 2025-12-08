{{/* 
  Partial to generate a object widget
  
  - collapsed (boolean)
  - fields (array) required
  - hidden (boolean)
  - hint (string)
  - i18n (boolean or string)
  - label (string) required
  - label_singular (string)
  - name (string) required
  - nameOverride (string)
  - required (boolean)
  - summary (string)
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $collapsed := .collapsed | default true }}
{{- $fields := .fields | default slice -}}
{{- $hidden := .hidden | default false }}
{{- $hint := .hint | default false }}
{{- $i18n := .i18n | default true }}
{{- $label := .label | default "nolabel" }}
{{- $label_singular := .label_singular | default false }}
{{- $name := .name | default "noname" }}
{{- $nameOverride := .nameOverride | default false }}
{{- $required := .required | default false }}
{{- $summary := .summary | default false }}

{{/* Icon */}}
{{- $library := printf "site.Params.admin.%s.icon" $cms }}
{{- $widget_icon := index (index site.Params.admin.fields .).icon $library | default false }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ cond $nameOverride $nameOverride $name }}: {
  label: '{{ $label }}',
  {{ with $label_singular }}
  singular_name: '{{ . }}',
  {{ end }}
  {{ with $hint }}
  comment: '{{ . }}',
  {{ end }}
  type: 'object',
  fields: [
    {{ range $fields }}
      {{- if reflect.IsMap . }}
        {{/* If it's a map, output it as JSON object without quotes */}}
        {{ . | jsonify }},
      {{- else }}
        {{/* If it's a string, output it with quotes */}}
        '{{ . }}',
      {{- end }}
    {{ end }}
  ],
  options: {
    structures: '_structures.{{ $name }}',
    required: {{ $required }},
    subtype: 'object'
  },
  preview: {
    {{ with $widget_icon }}
    icon: '{{ . }}',
    {{ end }}
    {{ with $summary }}
    text: '{{ . }}',
    {{ end }}
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
  widget: 'object',
  required: {{ $required }},
  collapsed: {{ $collapsed }},
  i18n: {{ $i18n }},
  {{ with $summary }}
  summary: '{{ . }}',
  {{ end }}
  {{ partial "admin/fields/_fields.yml" $fields }}
}

{{ end }}
