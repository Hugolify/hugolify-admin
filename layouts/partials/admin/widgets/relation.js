{{/* 
  Partial to generate a relation widget
  
  - collection (string)
  - display_fields (array)
  - filters (array)
  - hidden (boolean)
  - hint (string)
  - i18n (boolean or string)
  - label (string) required
  - label_singular (string)
  - name (string) required
  - nameOverride (string)
  - multiple (boolean)
  - required (boolean)
  - search_fields (array)
  - value_field (array) required
*/}}

{{- $cms := site.Params.admin.cms }}

{{- $collection := .collection | default false }}
{{- $display_fields := .display_fields | default false }}
{{- $filters := .filters | default false }}
{{- $hidden := .hidden | default false }}
{{- $hint := .hint | default false }}
{{- $i18n := .i18n | default true }}
{{- $label := .label | default "nolabel" }}
{{- $label_singular := .label_singular | default false }}
{{- $multiple := .multiple | default true }}
{{- $name := .name | default "noname" }}
{{- $nameOverride := .nameOverride | default false }}
{{- $required := .required | default false }}
{{- $search_fields := .search_fields | default false }}
{{- $value_field := .value_field | default false }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  label: '{{ $label }}',
  type: '{{ cond $multiple "multiselect" "select" }}',
  options: {
    {{ with $value_field }}
    {{ $value_key := replace (substr $value_field 2 -2) `slug` `filename_without_ext` }}
    value_key: [{{ $value_key }}],
    {{ end }}
    values: 'collections.{{ $collection }}'
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
  type: 'reference',
  options: {
    collection: {{ $collection }},
    {{ with $display_fields }}
      {{ $labels := slice }}
      {{ range . }}
        {{ $labels = $labels | append (replace (printf `{%s}` .) `"` ``) }}
      {{ end }}
    label: "{{ delimit $labels `,` }}",
    {{ end }}
    image: "{image.src}",
    {{ with $multiple }}
    multiple: true,
    {{ end }}
    {{ with $search_fields }}
    search: {{ delimit . "," }},
    {{ end }}
    value: '{{ substr $value_field 1 -1 }}'
  },
  required: {{ $required }}
}

{{/* Tina CMS */}}
{{ else if eq $cms "tinacms" }}

{
  label: '{{ $label }}',
  {{- with $hint }}
  description: '{{ . }}',
  {{- end }}
  name: 'items_{{ $name }}',
  nameOverride: '{{ $name }}',
  {{/* List support https://github.com/tinacms/tinacms/issues/4641 */}}
  {{- if $multiple }}
  type: 'object',
  list: true,
  ui: {
    itemProps: (item) => {
      return { label: item?.item }
    }
  },
  fields: [
    {
      name: 'item',
      label: '{{ $label_singular | default "Item" }}',
      type: 'reference',
      collections: ['{{ $collection }}'],
      required: {{ $required }}
    }
  ],
  {{- else }}
  type: 'reference',
  collections: ['{{ $collection }}'],
  required: {{ $required }}
  {{- end }}
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
  widget: 'relation',
  collection: '{{ $collection }}',
  {{- with $display_fields }}
  display_fields: {{ . }},
  {{- end }}
  {{- with $search_fields }}
  search_fields: {{ . }},
  {{- end }}
  {{- with $value_field }}
  value_field: '{{ . }}',
  {{- end }}
  {{- with $filters }}
  filters: {{ . }},
  {{- end }}
  {{ with $multiple }}
  multiple: true,
  {{ end }}
  required: {{ $required }},
  i18n: {{ $i18n }}
}

{{ end }}
