{{/* 
  Partial to generate a list widget
  
  - label (string) required
  - label_singular (string)
  - hint (string)
  - name (string) required
  - fields (array) required
  - required (boolean)
  - min (number)
  - max (number)
  - collapsed (boolean)
  - i18n (boolean or string)
*/}}

{{ $cms := site.Params.admin.cms }}

{{ $label := .label | default "nolabel" }}
{{ $label_singular := .label_singular | default false }}
{{ $hint := .hint | default false }}
{{ $name := .name | default "noname" }}
{{ $fields := .fields | default slice }}
{{ $max := .max | default false }}
{{ $min := .min | default false }}
{{ $required := .required | default false }}
{{ $collapsed := .collapsed | default true }}
{{ $i18n := .i18n | default true }}

{{/* CloudCannon */}}
{{ if eq $cms "cloudcannon" }}

{{ $name }}: {
  name: '{{ $label }}',
  {{ with $label_singular }}
  singular_name: '{{ . }}',
  {{ end }}
  {{ with $hint }}
  comment: '{{ . }}',
  {{ end }}
  type: 'array',
  options: {
    _inputs: {
      {{ range $fields }}
        {{ $file := print "admin/fields/" . ".yml" }}
        {{ if templates.Exists ( printf "partials/%s" $file ) }}
          {{ partialCached $file . }},
        {{ end }}
      {{ end }}
    },
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
